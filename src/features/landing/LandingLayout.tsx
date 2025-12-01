import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { Suspense } from "react";
import Loading from "./components/Loading";

const LandingLayout = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Suspense fallback={<Loading />} >
        <main>
          <Outlet />
        </main>
      </Suspense>
      <Footer />
    </div>
  );
};

export default LandingLayout;
