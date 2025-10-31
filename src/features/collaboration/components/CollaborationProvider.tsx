import React, { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import * as Y from 'yjs';
import { Awareness, applyAwarenessUpdate, encodeAwarenessUpdate } from 'y-protocols/awareness';
import { toast } from 'sonner';
import { type Language } from '@/const/language.const'; // Adjust path
import { useSelect } from '@/hooks/useSelect'
import { useUserRefreshTokenMutation } from '@/apis/auth-user/auth/user'
import { useAdminRefreshTokenMutation } from '@/apis/auth-user/auth/admin'
import type { CollabUserInfo } from '../CollaborationPage';
import { useCollabSessionActions } from '@/hooks/useDispatch';
import { useNavigate } from 'react-router-dom';

// Define the shape of the context state
interface CollaborationContextProps {
  doc: Y.Doc | null;
  awareness: Awareness | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  metadata: { language: Language; ownerId: string } | null; // Shared session metadata
  socket: Socket | null; // WebSocket instance
  currentUser : CollabUserInfo | null
}

// Create the context with default values
const CollaborationContext = createContext<CollaborationContextProps>({
  doc: null,
  awareness: null,
  connectionStatus: 'disconnected',
  metadata: null,
  socket: null,
  currentUser : null,
});

interface CollaborationProviderProps {
  children: ReactNode; 
  inviteToken: string;
  currentUser: CollabUserInfo;
}
const SOCKET_URL = import.meta.env.VITE_COLLAB_SERVICE_URL;

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({
  children,
  inviteToken,
  currentUser,
}) => {
  const navigate = useNavigate();
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [awareness, setAwareness] = useState<Awareness | null>(null);
  const [metadata, setMetadata] = useState<{ language: Language; ownerId: string } | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected'); // Start as disconnected
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const { user } = useSelect()
  const {setParticipants} = useCollabSessionActions()
  const stableCurrentUser = useMemo(() => ({
        id: currentUser.id,
        username: currentUser.username,
        firstName : currentUser.firstName,
        avatar : currentUser.avatar
    }), [currentUser.id, currentUser.username, currentUser.firstName, currentUser.avatar]);
  const [refreshTokenApi] = user.details?.role === 'ADMIN' ? useAdminRefreshTokenMutation() : useUserRefreshTokenMutation()

  // Main effect for handling connection, Yjs setup, and listeners
  useEffect(() => {
    // Clear stale participants immediately when provider mounts/swaps sessions
    setParticipants([]);
    // --- Initial Validations ---
    if (!inviteToken) {
      console.error("CollaborationProvider: inviteToken is missing.");
      setConnectionStatus('error');
      toast.error("Collaboration token is missing.",{ className : 'error-toast' });
      return;
    }
    if (!stableCurrentUser.id) {
       console.error("CollaborationProvider: currentUser ID is missing.");
       setConnectionStatus('error');
       toast.error("User information is missing for collaboration.",{ className : 'error-toast' });
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
      username: stableCurrentUser.username,
      firstName: stableCurrentUser.firstName,
      avatar : stableCurrentUser.avatar
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
      toast.success('Collaboration connected!', { className : 'success-toast' });
    };
    const handleDisconnect = (reason: Socket.DisconnectReason) => {
      console.log('Socket disconnected:', reason);
      setConnectionStatus('disconnected');
       if (reason === 'io server disconnect') { // Server explicitly disconnected client
        toast.error('Disconnected by server (session may have ended by the owner or token revoked).',{ className : 'error-toast' });
        toast.info('Editor will be readonly')
      } else if (reason === 'io client disconnect') { // Client called socket.disconnect()
         toast.info('You disconnected from the session.');
      } else { // Transport error, reconnection attempts failed, etc.
        toast.error('Connection lost. Please check your network.',{ className : 'error-toast' });
      }
    };
    const handleConnectError = async (err: Error) => {
      if(err.message === '401'){
          console.log('Refreshing token....');
          try {
            await refreshTokenApi(null).unwrap();
            if (typeof socket.auth === 'object') {
              socket.auth.token = inviteToken;
            } else {
              socket.auth = { token: inviteToken };
            }
            socket.connect();
            return;
          } catch (error) {
            console.error("Token refresh failed:", error);
            toast.error('Authentication failed',{ className : 'error-toast' });
          }
      }
      if(err.message === 'Authentication error: Invalid or expired token.')navigate(-1)
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
      toast.error(friendlyMessage,{ className : 'error-toast' });
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
      console.log('Received initial state from server.', initialState);
      if (newDoc) Y.applyUpdate(newDoc, new Uint8Array(initialState.docUpdate), 'server');
      if (newAwareness) applyAwarenessUpdate(newAwareness, new Uint8Array(initialState.awarenessUpdate), 'server');
    };
    const handleDocUpdate = (update: Uint8Array) => {
      if (newDoc) Y.applyUpdate(newDoc, new Uint8Array(update), 'server');
    };
    const handleUserLeft = (update : { username : string }) => {
      toast.info(`${update.username} left the session.`)
    }
    const handleAwarenessUpdate = (update: Uint8Array) => {
      if (newAwareness) applyAwarenessUpdate(newAwareness, new Uint8Array(update), 'server');
    };
    const handleMetadataChanged = (newMetadata: { language: Language; ownerId: string }) => {
       console.log('Received session metadata update:', newMetadata);
       setMetadata(newMetadata);
    };
    const handleServerError = (error: { message: string; code?: number }) => {
       if(error.message === 'Session is either ended or closed'){
          toast.error(`Server error: ${error.message}`,{ className : 'error-toast' });
          setTimeout(()=>{
            toast.info('Editor will be readonly')
          },1000)
       }else{
        toast.error(`Server error: ${error.message}`,{ className : 'error-toast' });
       }
    };

    socket.on('initial-state', handleInitialState);
    socket.on('doc-update', handleDocUpdate);
    socket.on('user-left', handleUserLeft);
    socket.on('awareness-update', handleAwarenessUpdate);
    socket.on('metadata-changed', handleMetadataChanged);
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

    const syncParticipants = () => {
      const states = newAwareness.getStates();
      const participants = Array.from(states.values())
        .map((session)=> session?.user)
        .filter((user)=> user && user.username && user.firstName && user.avatar && user.id)

      setParticipants(participants)
    };
    newAwareness.on('change', syncParticipants);

    // --- Awareness heartbeat to prevent timeouts ---
    const COLLAB_HEARTBEAT_MS = import.meta.env.VITE_COLLAB_HEARTBEAT_MS;
    const heartbeat = setInterval(() => {
      try {
        if (socket.connected && newAwareness) {
          const update = encodeAwarenessUpdate(newAwareness, [newAwareness.clientID]);
          socket.emit('awareness-update', update);
        }
      } catch {}
    }, COLLAB_HEARTBEAT_MS);


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
        newAwareness.off('change',syncParticipants);
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
      // Clear participants in Redux on teardown
      setParticipants([]);
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
    currentUser : stableCurrentUser,
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