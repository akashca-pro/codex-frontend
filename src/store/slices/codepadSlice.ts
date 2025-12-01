import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface File {
  id: string;
  name: string;
  content: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface CodePadState {
  files: File[];
  activeFileId: string | null;
  openTabs: string[];
}

const initialState: CodePadState = {
  files: [],
  activeFileId: null,
  openTabs: [],
};

const codePadSlice = createSlice({
    name : 'codePad',
    initialState,
    reducers : {

        createFile : (state, action : PayloadAction<{ name : string, language : string }>) => {
            const newFile : File = {
                id : uuidv4(),
                name : action.payload.name,
                content : '',
                language : action.payload.language,
                createdAt : new Date().toISOString(),
                updatedAt : new Date().toISOString(),
            }
            state.files.push(newFile);
            state.openTabs.push(newFile.id);
            state.activeFileId = newFile.id;
        },

        updateContent : (state, action : PayloadAction<string>) => {
            const file = state.files.find(f=>f.id === state.activeFileId);
            if(file){
                file.content = action.payload;
                file.updatedAt = new Date().toISOString()
            }
        },

        openTab : (state, action : PayloadAction<string>) => {
            if(!state.openTabs.includes(action.payload)){
                state.openTabs.push(action.payload);
            }
            state.activeFileId = action.payload
        },

        closeTab : (state, action : PayloadAction<string>) => {
            state.openTabs = state.openTabs.filter(id => id !== action.payload)
            if(state.activeFileId === action.payload){
                state.activeFileId = state.activeFileId.at(-1) || null
            }
        },

        renameFile : (state, action : PayloadAction<{ id : string, name : string }>) => {
            const file = state.files.find(file => file.id === action.payload.id);
            if(file) file.name = action.payload.name
        },

        deleteFile : (state, action : PayloadAction<string>) => {
            state.files = state.files.filter(f=> f.id !== action.payload);
            state.openTabs = state.openTabs.filter(id => id !== action.payload);
            if(state.activeFileId === action.payload){
                state.activeFileId = state.openTabs.at(-1) || null
            }
        },

        setActiveFile : (state, action : PayloadAction<string>) => {
            state.activeFileId = action.payload
        },

        unsetActiveFile : (state) => {
            state.activeFileId = null;
        }

    }
})

export const {

    createFile,
    updateContent,
    renameFile,
    deleteFile,
    openTab,
    closeTab,
    setActiveFile,
    unsetActiveFile

} = codePadSlice.actions

export default codePadSlice.reducer