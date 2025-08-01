import { useDispatch } from "react-redux";
import { clearUser, setUser } from '@/store/slices/authSlice'
import type { User } from "@/store/slices/authSlice";
import { setEmail, clearEmail } from '@/store/slices/emailSlice'

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
