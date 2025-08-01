import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelect } from "@/hooks/useSelect";

interface AuthGuardProps {
  children: ReactNode;
  role: "USER" | "ADMIN";
}

export const AuthGuard = ({ children, role }: AuthGuardProps) => {
  const navigate = useNavigate();
  const { user } = useSelect();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (user.isAuthenticated) {
      if (user.details?.role === role) {
        setIsAllowed(true);
      } else {
        const redirectPath =
          user.details?.role === "ADMIN"
            ? "/admin/dashboard"
            : "/dashboard";
        navigate(redirectPath, { replace: true });
      }
    } else {
      const loginPath = role === "ADMIN" ? "/admin/login" : "/login";
      navigate(loginPath, { replace: true });
    }
  }, [user, role, navigate]);

  if (!isAllowed) return null;

  return <>{children}</>;
};

export default AuthGuard;
