import { Outlet } from "react-router-dom"

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-black">
        <Outlet/>
    </div>
  )
}

export default AdminLayout
