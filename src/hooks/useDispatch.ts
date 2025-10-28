import { useDispatch } from "react-redux";
import { clearUser, setUser } from '@/store/slices/authSlice'
import type { User } from "@/store/slices/authSlice"; 
import { setEmail, clearEmail } from '@/store/slices/emailSlice'
import { setOAuthVerified, resetOAuthVerified } from '@/store/slices/oAuthSlice'
import { closeTab, createFile, deleteFile, openTab, renameFile, setActiveFile, unsetActiveFile, updateContent } from "@/store/slices/codepadSlice";
import { endSession, initSession, type CollabSessionState } from "@/store/slices/collabSlice";

export const useUserEmailActions = () => {
  const dispatch = useDispatch();
  return {
    setEmail: (payload: { email: string }) => dispatch(setEmail(payload)),
    clearEmail: () => dispatch(clearEmail()),
  };
};

export const useAuthActions = () => {
  const dispatch = useDispatch();
  return {
    login: (payload: User) => dispatch(setUser(payload)),
    logout: () => dispatch(clearUser()),
  };
};

export const useOAuthCheckActions = () => {
  const dispatch = useDispatch();
  return {
    setOAuthVerified : () => dispatch(setOAuthVerified()),
    resetOAuthVerified : () => dispatch(resetOAuthVerified())
  }
}

export const useCodePadActions = () => {
  const dispatch = useDispatch();
  return {
    createFile : (payload : {name : string, language : string}) => dispatch(createFile(payload)),
    updateContent : (content : string) => dispatch(updateContent(content)),
    openTab : (id : string) => dispatch(openTab(id)),
    closeTab : (id : string) => dispatch(closeTab(id)),
    renameFile : (payload : {id : string, name : string}) => dispatch(renameFile(payload)),
    deleteFile : (id : string) => dispatch(deleteFile(id)),
    setActiveFile : (id : string) => dispatch(setActiveFile(id)),
    unsetActiveFile : () => dispatch(unsetActiveFile()), 
  }
}

export const useCollabSessionActions = () => {
  const dispatch = useDispatch();
  return {
    initSession : (payload : CollabSessionState) => dispatch(initSession(payload)),
    endSession : () => dispatch(endSession())
  }
}