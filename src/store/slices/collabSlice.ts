import type { ChatMessage } from '@/const/events.const';
import type { CollabUserInfo } from '@/features/collaboration/CollaborationPage';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CollabSessionState {
    inviteToken : string | null;
    isOwner : boolean;
    participants : CollabUserInfo[];
    chatMessages : ChatMessage[];
}

const initialState : CollabSessionState = {
    inviteToken : null,
    isOwner : false,
    participants : [],
    chatMessages : [],
}

const collabSessionSlice = createSlice({
    name : 'collab',
    initialState,
    reducers : {
        initSession : (state, action : PayloadAction<{ inviteToken : string }>) =>  {
            state.inviteToken = action.payload.inviteToken
            state.isOwner = true;
            state.participants = [];
        },
        joinSession : (state, action : PayloadAction<{ inviteToken : string }>) => {
            state.inviteToken = action.payload.inviteToken
            state.participants = [];
        },
        endSession : (state) => {
            state.inviteToken = null;
            state.isOwner = false;
            state.participants = [];
            state.chatMessages = [];
        },
        setParticipants : (state, action : PayloadAction<CollabUserInfo[]>) => {
            state.participants = action.payload;
        },
        leaveSession : (state)=>{
            state.inviteToken = null;
            state.participants = [];
            state.chatMessages = [];
        },
        addChatMessages : (state, action : PayloadAction<ChatMessage>) => {
            state.chatMessages = [...state.chatMessages, action.payload]
        }
    }
})

export const {

    initSession,
    endSession,
    joinSession,
    setParticipants,
    addChatMessages,
    leaveSession,

} = collabSessionSlice.actions

export default collabSessionSlice.reducer