import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";

const UserLayout = () => {
  const location = useLocation();
  const isCollabPage = location.pathname.includes('/user/collab');
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Navbar />
      <main className={`flex-1 ${isCollabPage ? 'overflow-hidden p-0' : 'overflow-y-auto p-4'}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;
