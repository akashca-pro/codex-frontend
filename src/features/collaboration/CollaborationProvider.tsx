import React, { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import * as Y from 'yjs';
import { Awareness, applyAwarenessUpdate, encodeAwarenessUpdate } from 'y-protocols/awareness';
import { ControlMsgType } from '@/const/events.const'; // Adjust path as needed
import { toast } from 'sonner';
import { type Language } from '@/const/language.const'; // Adjust path

// Define the shape of the context state
interface CollaborationContextProps {
  doc: Y.Doc | null;
  awareness: Awareness | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  metadata: { language: Language; ownerId: string } | null; // Shared session metadata
  socket: Socket | null; // WebSocket instance
}

// Create the context with default values
const CollaborationContext = createContext<CollaborationContextProps>({
  doc: null,
  awareness: null,
  connectionStatus: 'disconnected',
  metadata: null,
  socket: null,
});

// Define the props required by the provider component
interface CollaborationProviderProps {
  children: ReactNode; // Standard React prop for component children
  inviteToken: string; // The token obtained from the backend to join/auth the session
  currentUser: { id: string; name: string; color: string }; // Info about the local user
}

// Define your backend URL (use environment variable for flexibility)
const SOCKET_URL = import.meta.env.VITE_COLLAB_SERVICE_URL || 'http://localhost:3001'; // Default for local dev

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({
  children,
  inviteToken,
  currentUser,
}) => {
  // State variables managed by the provider
  const [doc, setDoc] = useState<Y.Doc | null>(null); // The shared Yjs document
  const [awareness, setAwareness] = useState<Awareness | null>(null); // Yjs awareness state (cursors, selections)
  const [metadata, setMetadata] = useState<{ language: Language; ownerId: string } | null>(null); // Session metadata from backend
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null); // The Socket.IO instance

  // Memoize currentUser stable parts to prevent unnecessary effect re-runs if the parent object reference changes
  const stableCurrentUser = useMemo(() => ({
      id: currentUser.id,
      name: currentUser.name,
      color: currentUser.color || '#30bced', // Default color if not provided
  }), [currentUser.id, currentUser.name, currentUser.color]);


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
    // If a socket instance already exists or a doc is already set up, don't run again.
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

    // --- WebSocket Connection ---
    console.log(`Attempting to connect to ${SOCKET_URL} with token...`);
    const socket: Socket = io(SOCKET_URL, {
      auth: { token: inviteToken },
      withCredentials: true,
      reconnectionAttempts: 3,  
      timeout: 10000,
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
    const handleConnectError = (err: Error) => {
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
      // Apply the full document state received from the server
      if (newDoc) Y.applyUpdate(newDoc, initialState.docUpdate, 'server');
      // Apply the full awareness state (cursors of others)
      if (newAwareness) applyAwarenessUpdate(newAwareness, initialState.awarenessUpdate, 'server');
    };
    const handleDocUpdate = (update: Uint8Array) => {
      // Apply incremental document changes from others
      if (newDoc) Y.applyUpdate(newDoc, update, 'server');
    };
    const handleAwarenessUpdate = (update: Uint8Array) => {
      // Apply incremental awareness changes (cursor movements, etc.)
      if (newAwareness) applyAwarenessUpdate(newAwareness, update, 'server');
    };
    const handleMetadataChanged = (newMetadata: { language: Language; ownerId: string }) => {
       console.log('Received session metadata update:', newMetadata);
       setMetadata(newMetadata); // Update the metadata state
       // You could trigger side effects here, like updating the editor's language mode
    };
    const handleServerError = (error: { message: string; code?: number }) => {
       // Handle custom error events sent from the backend
       console.error('Received server error event:', error);
       toast.error(`Server error: ${error.message}`);
    };

    socket.on('initial-state', handleInitialState);
    socket.on('doc-update', handleDocUpdate);
    socket.on('awareness-update', handleAwarenessUpdate);
    socket.on('metadata-changed', handleMetadataChanged);
    socket.on('error', handleServerError); // Listen for specific 'error' events

    // --- Yjs Synchronization Event Handlers (Client -> Server) ---
    // Listen for local changes to the Y.Doc
    const docUpdateHandler = (update: Uint8Array, origin: any) => {
      // If the change wasn't from the server (i.e., it was local) and we're connected
      if (origin !== 'server' && socket.connected) {
        // Send the binary update data to the server via the 'control-message' event
        socket.emit('control-message', {
          type: ControlMsgType.DOC_UPDATE,
          payload: update,
        });
      }
    };
    if (newDoc) newDoc.on('update', docUpdateHandler); // Attach listener

    // Listen for local changes to awareness state (e.g., cursor movement)
    const awarenessUpdateHandler = (changes: any, origin: any) => {
      // Get IDs of clients whose states were added, updated, or removed
      const updatedClients = [
        ...Object.keys(changes.added),
        ...Object.keys(changes.updated),
        ...Object.keys(changes.removed)
      ].map(Number);
      
      // If the change originated locally, there were changes, and we're connected
      if (origin === 'local' && updatedClients.length > 0 && socket.connected) {
        // Encode the relevant awareness changes into binary data
        const update = encodeAwarenessUpdate(newAwareness, updatedClients);
        // Send the update to the server
        socket.emit('control-message', {
          type: ControlMsgType.AWARENESS_UPDATE,
          payload: update,
        });
      }
    };
    if (newAwareness) newAwareness.on('update', awarenessUpdateHandler); // Attach listener

    // --- Cleanup Function ---
    // This runs when the component unmounts or when dependencies change,
    // ensuring we disconnect sockets and remove listeners.
    return () => {
      console.log('Cleaning up CollaborationProvider...');
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
      if (newAwareness) newAwareness.off('update', awarenessUpdateHandler);
      
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
  }), [doc, awareness, connectionStatus, metadata, socketInstance]);

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