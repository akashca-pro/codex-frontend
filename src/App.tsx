import { Outlet } from "react-router-dom"; 
import { Toaster } from "sonner";
const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        duration={4000}
      />
      <Outlet />
    </>
  )
}

export default App