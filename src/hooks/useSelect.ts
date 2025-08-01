import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export const useSelect = () => {
  return {
    user: useSelector((state: RootState) => state.auth),
    email: useSelector((state: RootState) => state.userEmail)
  };
};
