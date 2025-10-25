import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CollabSessionState {
    inviteToken : string | null;
}

const initialState : CollabSessionState = {
    inviteToken : null
}

const collabSessionSlice = createSlice({
    name : 'collab',
    initialState,
    reducers : {
        initSession : (state, action : PayloadAction<CollabSessionState>) =>  {
            state.inviteToken = action.payload.inviteToken
        },
        endSession : (state) => {
            state.inviteToken = null;
        }
    }
})

export const {

    initSession,
    endSession

} = collabSessionSlice.actions

export default collabSessionSlice.reducer