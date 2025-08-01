import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserNavbar from "./UserNavbar";

const UserLayout = () => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <UserNavbar/>
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
);
 
}

export default UserLayout;