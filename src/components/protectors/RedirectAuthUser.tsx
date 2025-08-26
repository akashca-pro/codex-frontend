import type { ReactNode } from "react";
import { useEffect, useState }  from  "react";
import { useNavigate } from "react-router-dom";
import { useSelect } from "@/hooks/useSelect"; 

type Props = {
  children: ReactNode;
};

export const RedirectAuthUser = ({ children }: Props) => {
  const { user } = useSelect();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (user.isAuthenticated) {
      const protectedPath =
        user.details?.role === "ADMIN"
          ? "/admin/dashboard"
          : "/user/dashboard";
      navigate(protectedPath, { replace: true });
    } else {
      setChecked(true); // not authenticated, allow page to show
    }
  }, [user, navigate]);

  if (!checked) {
    return null; // optionally show a spinner
  }

  return <>{children}</>;
};
