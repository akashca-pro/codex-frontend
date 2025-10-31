import type { CollabUserInfo } from '@/features/collaboration/CollaborationPage';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CollabSessionState {
    inviteToken : string | null;
    isOwner : boolean;
    participants : CollabUserInfo[]
}

const initialState : CollabSessionState = {
    inviteToken : null,
    isOwner : false,
    participants : []
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
        },
        setParticipants : (state, action : PayloadAction<CollabUserInfo[]>) => {
            state.participants = action.payload;
        },
        leaveSession : (state)=>{
            state.inviteToken = null;
            state.participants = [];
        }
    }
})

export const {

    initSession,
    endSession,
    joinSession,
    setParticipants,
    leaveSession,

} = collabSessionSlice.actions

export default collabSessionSlice.reducer