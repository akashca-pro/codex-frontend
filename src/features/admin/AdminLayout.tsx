import { Outlet } from "react-router-dom"
import AdminNavbar from "./AdminNavbar";

export const AdminLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <AdminNavbar/>
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout
