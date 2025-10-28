import React, { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import * as Y from 'yjs';
import { Awareness, applyAwarenessUpdate, encodeAwarenessUpdate } from 'y-protocols/awareness';
import { toast } from 'sonner';
import { type Language } from '@/const/language.const'; // Adjust path
import { useSelect } from '@/hooks/useSelect'
import { useUserRefreshTokenMutation } from '@/apis/auth-user/auth/user'
import { useAdminRefreshTokenMutation } from '@/apis/auth-user/auth/admin'

// Define the shape of the context state
interface CollaborationContextProps {
  doc: Y.Doc | null;
  awareness: Awareness | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  metadata: { language: Language; ownerId: string } | null; // Shared session metadata
  socket: Socket | null; // WebSocket instance
  currentUser : { id : string, name : string, color : string } | null
}

// Create the context with default values
const CollaborationContext = createContext<CollaborationContextProps>({
  doc: null,
  awareness: null,
  connectionStatus: 'disconnected',
  metadata: null,
  socket: null,
  currentUser : null
});

interface CollaborationProviderProps {
  children: ReactNode; 
  inviteToken: string;
  currentUser: { id: string; name: string; color: string };
}
const SOCKET_URL = import.meta.env.VITE_COLLAB_SERVICE_URL || 'http://localhost:5001';

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({
  children,
  inviteToken,
  currentUser,
}) => {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [awareness, setAwareness] = useState<Awareness | null>(null);
  const [metadata, setMetadata] = useState<{ language: Language; ownerId: string } | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected'); // Start as disconnected
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const { user } = useSelect()
  const stableCurrentUser = useMemo(() => ({
        id: currentUser.id,
        name: currentUser.name,
        color: currentUser.color || '#30bced',
    }), [currentUser.id, currentUser.name, currentUser.color]);
  const [refreshTokenApi] = user.details?.role === 'ADMIN' ? useAdminRefreshTokenMutation() : useUserRefreshTokenMutation()

  // Inject CSS custom properties and names for y-monaco cursors dynamically
  useEffect(() => {
    if (!awareness) return;

    const updateCursorStyles = () => {
      const states = awareness.getStates();
      const styleElement = document.getElementById('collab-cursor-styles') || document.createElement('style');
      styleElement.id = 'collab-cursor-styles';

      let cssContent = '';
      states.forEach((state: any, clientId: number) => {
        const color: string | undefined = state.user?.color;
        const name: string | undefined = state.user?.name;
        if (color) {
          // Apply per-client CSS vars for y-monaco decorations
          cssContent += `
            .yRemoteCursor[data-yjs-client-id="${clientId}"] { --yRemoteCursorColor: ${color}; }
            .yRemoteCursorTag[data-yjs-client-id="${clientId}"] { --yRemoteCursorBg: #111827; }
            .yRemoteSelection[data-yjs-client-id="${clientId}"] { --yRemoteSelectionColor: ${color}33; /* 0x33 alpha */ }
            .yRemoteSelectionHead[data-yjs-client-id="${clientId}"] { --yRemoteSelectionBorder: ${color}; }
          `;

          // Apply colors for custom Monaco decorations used in CollabMonacoEditor
          cssContent += `
            .codex-remote-cursor.client-${clientId},
            .codex-remote-cursor-indicator.client-${clientId},
            .codex-remote-cursor-label.client-${clientId} { color: ${color}; }
            .codex-remote-selection.client-${clientId} { background-color: ${color}33; }
          `;
        }
        try {
          const tag = document.querySelector(`.yRemoteCursorTag[data-yjs-client-id="${clientId}"]`);
          if (tag && name) {
            tag.textContent = name;
          }
        } catch {}
      });

      styleElement.textContent = cssContent;
      if (!document.head.contains(styleElement)) {
        document.head.appendChild(styleElement);
      }
    };

    const awarenessListener = () => updateCursorStyles();
    awareness.on('change', awarenessListener);
    updateCursorStyles(); // Initial update

    return () => {
      awareness.off('change', awarenessListener);
      const styleElement = document.getElementById('collab-cursor-styles');
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, [awareness]);

  // Main effect for handling connection, Yjs setup, and listeners
  useEffect(() => {
    // --- Initial Validations ---
    if (!inviteToken) {
      console.error("CollaborationProvider: inviteToken is missing.");
      setConnectionStatus('error');
      toast.error("Collaboration token is missing.");
      return;
    }
    if (!stableCurrentUser.id) {
       console.error("CollaborationProvider: currentUser ID is missing.");
       setConnectionStatus('error');
       toast.error("User information is missing for collaboration.");
       return;
    }

    // --- Prevent Re-Initialization ---
    if (socketInstance || doc) {
        console.log("CollaborationProvider: Skipping re-initialization.");
        return;
    }

    // --- Setup ---
    console.log(`CollaborationProvider: Initializing connection for user ${stableCurrentUser.id}...`);
    setConnectionStatus('connecting');

    const newDoc = new Y.Doc();
    const newAwareness = new Awareness(newDoc);

    // Set local user's presence state (name, color, ID) *before* connecting
    newAwareness.setLocalStateField('user', {
      id: stableCurrentUser.id,
      name: stableCurrentUser.name,
      color: stableCurrentUser.color,
    });

    // Update React state with the new Yjs instances
    setDoc(newDoc);
    setAwareness(newAwareness);

// // --- AWARENESS LOGGER ---
// const awarenessChangeListener = (changes: any, origin: any) => {
//     console.log('Awareness Changed:', {
//         origin: origin,
//         // Log the *full state object* for each client
//         states: Array.from(newAwareness.getStates().entries()).map(([clientId, state]) => ({ clientId, state })),
//         added: changes.added,
//         updated: changes.updated,
//         removed: changes.removed,
//     });
// };
    // newAwareness.on('change', awarenessChangeListener); // Log ALL awareness changes
    // --- END AWARENESS LOGGER ---

    const socket: Socket = io(SOCKET_URL, {
      auth: { token: inviteToken },
      withCredentials: true,
      reconnectionAttempts: 3,  
      timeout: 10000,
      transports: ['websocket']
    });
    setSocketInstance(socket); // Store the socket instance in state

    // --- Socket Event Handlers ---
    const handleConnect = () => {
      console.log('Socket connected successfully. ID:', socket.id);
      setConnectionStatus('connected');
      toast.success('Collaboration connected!');
    };
    const handleDisconnect = (reason: Socket.DisconnectReason) => {
      console.log('Socket disconnected:', reason);
      setConnectionStatus('disconnected');
       if (reason === 'io server disconnect') { // Server explicitly disconnected client
        toast.error('Disconnected by server (session may have ended or token revoked).');
      } else if (reason === 'io client disconnect') { // Client called socket.disconnect()
         toast.info('You disconnected from the session.');
      } else { // Transport error, reconnection attempts failed, etc.
        toast.error('Connection lost. Please check your network.');
      }
    };
    const handleConnectError = async (err: Error) => {
      if(err.message === '409'){
          console.log('Refreshing token....');
          try {
            await refreshTokenApi(null).unwrap();
            if (typeof socket.auth === 'object') {
              socket.auth.token = inviteToken;
            } else {
              socket.auth = { token: inviteToken };
            }
            socket.connect();
          } catch (error) {
            console.error("Token refresh failed:", error);
            toast.error('Authentication failed');
          }
      }
      console.error('Socket connection error:', err.message, err);
      setConnectionStatus('error');
      let friendlyMessage = `Connection failed: ${err.message}`;
      // Check for specific error messages from the server's auth middleware
      if (err.message.includes("Invalid or expired token") || (err as any).data?.message?.includes("token")) {
          friendlyMessage = "Connection failed: Invalid or expired invite token.";
          socket.disconnect(); // Don't keep retrying with a bad token
      } else if (err.message === 'timeout') {
          friendlyMessage = 'Connection timed out. The server might be unavailable.';
      }
      toast.error(friendlyMessage);
      // Clean up partially initialized state if connection fails early
      setDoc(null);
      setAwareness(null);
      setSocketInstance(null);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    // --- Yjs Synchronization Event Handlers (Server -> Client) ---
    const handleInitialState = (initialState: { docUpdate: Uint8Array; awarenessUpdate: Uint8Array }) => {
      console.log('Received initial state from server.');
      if (newDoc) Y.applyUpdate(newDoc, new Uint8Array(initialState.docUpdate), 'server');
      if (newAwareness) applyAwarenessUpdate(newAwareness, new Uint8Array(initialState.awarenessUpdate), 'server');
    };
    const handleDocUpdate = (update: Uint8Array) => {
      if (newDoc) Y.applyUpdate(newDoc, new Uint8Array(update), 'server');
    };
    const handleAwarenessUpdate = (update: Uint8Array) => {
      if (newAwareness) applyAwarenessUpdate(newAwareness, new Uint8Array(update), 'server');
    };
    const handleMetadataChanged = (newMetadata: { language: Language; ownerId: string }) => {
       console.log('Received session metadata update:', newMetadata);
       setMetadata(newMetadata);
    };
    const handleCloseSession = () => {
      console.log('Close session event occured');
      socket.close();
    }
    const handleServerError = (error: { message: string; code?: number }) => {
       console.error('Received server error event:', error);
       toast.error(`Server error: ${error.message}`);
    };

    socket.on('initial-state', handleInitialState);
    socket.on('doc-update', handleDocUpdate);
    socket.on('awareness-update', handleAwarenessUpdate);
    socket.on('metadata-changed', handleMetadataChanged);
    socket.on('close-session',handleCloseSession);
    socket.on('error', handleServerError);

    // --- Yjs Synchronization Event Handlers (Client -> Server) ---

    // Listen for local changes to the Y.Doc
  const docUpdateHandler = (update: Uint8Array, origin: any) => {
    if (origin !== 'server' && socket.connected) {
      socket.emit('doc-update', update);
    }
  };

    if (newDoc) newDoc.on('update', docUpdateHandler); 

    const awarenessUpdateHandler = (changes: any, origin: any) => {
      // Get IDs of clients whose states were added, updated, or removed
    const updatedClients = [
            ...changes.added,
            ...changes.updated,
            ...changes.removed
          ];
      // If the change originated locally, there were changes, and we're connected
      if (origin === 'local' && updatedClients.length > 0 && socket.connected) {
        // Encode the relevant awareness changes into binary data
        const update = encodeAwarenessUpdate(newAwareness, updatedClients);
        socket.emit('awareness-update', update);
      }
    };
    if (newAwareness) newAwareness.on('change', awarenessUpdateHandler); 

    // --- Awareness heartbeat to prevent timeouts ---
    const HEARTBEAT_MS = 15000;
    const heartbeat = setInterval(() => {
      try {
        if (socket.connected && newAwareness) {
          const update = encodeAwarenessUpdate(newAwareness, [newAwareness.clientID]);
          socket.emit('awareness-update', update);
        }
      } catch {}
    }, HEARTBEAT_MS);


    // --- Cleanup Function ---
    // This runs when the component unmounts or when dependencies change,
    // ensuring we disconnect sockets and remove listeners.
    return () => {
      console.log('Cleaning up CollaborationProvider...');
      clearInterval(heartbeat);
      // Remove specific listeners to prevent potential memory leaks
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('initial-state', handleInitialState);
      socket.off('doc-update', handleDocUpdate);
      socket.off('awareness-update', handleAwarenessUpdate);
      socket.off('metadata-changed', handleMetadataChanged);
      socket.off('error', handleServerError);
      
      socket.disconnect(); // Disconnect the WebSocket

      // Remove Yjs listeners
      if (newDoc) newDoc.off('update', docUpdateHandler);
      if (newAwareness) {
        newAwareness.off('change', awarenessUpdateHandler);
        // newAwareness.off('change', awarenessChangeListener);
      }
      
      // Destroy Yjs objects to free memory
      newDoc?.destroy();
      newAwareness?.destroy();

      // Reset React state
      setDoc(null);
      setAwareness(null);
      setMetadata(null);
      setSocketInstance(null);
      setConnectionStatus('disconnected');
    };
  // Dependencies for the main useEffect hook. Re-runs if token or stable user info changes.
  }, [inviteToken, stableCurrentUser]); 

  // Memoize the context value to prevent unnecessary re-renders of consuming components
  const contextValue = useMemo(() => ({
    doc,
    awareness,
    connectionStatus,
    metadata,
    socket: socketInstance,
    currentUser : stableCurrentUser
  }), [doc, awareness, connectionStatus, metadata, socketInstance, stableCurrentUser]);

  return (
    <CollaborationContext.Provider value={contextValue}>
      {children}
    </CollaborationContext.Provider>
  );
};

// Custom hook to easily consume the collaboration context in child components
export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  // Ensure the hook is used within a provider
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};

// Export the provider itself for use in wrapping components/routes
export default CollaborationProvider;