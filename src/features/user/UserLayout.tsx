import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";

const UserLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <UserNavbar />
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;
