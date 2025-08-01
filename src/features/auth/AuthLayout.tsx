import Navbar from '@/components/navbar'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Navbar/>
      <div className="w-full max-w-md">
        <Outlet/>
      </div>
    </div>
  )
}

export default AuthLayout
