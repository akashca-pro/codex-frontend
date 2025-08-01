import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import TypewriterTitle from "../features/landing/components/TypewriterTitle";
import { useSelect } from "@/hooks/useSelect";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelect();
  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className={`flex items-center`}>
            {location.pathname === "/" ? (
              <TypewriterTitle />
            ) : (
              <Link
                className="text-orange-600 text-3xl font-bold w-[100px] text-nowrap"
                to="/"
              >
                CodeX
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/problems"
                className="text-gray-300 hover:text-orange-600 px-5 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Problem
              </Link>
              <Link
                to="/code-editor"
                className="text-gray-300 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Editor
              </Link>
              <Link
                to="/battle"
                className="text-gray-300 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                BattleX
              </Link>
              { user.isAuthenticated && <Link
                to={`/${user.details?.role === "ADMIN" ? "admin/dashboard" : "dashboard"}`}
                className="text-gray-300 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          {!user.isAuthenticated && (
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-3">
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-orange-600 hover:bg-black">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-orange-600 hover:bg-orange-700 neon-glow">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 backdrop-blur-md">
            <Link
              to="/problems"
              className="text-gray-300 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Problems
            </Link>
            <Link
              to="/code-editor"
              className="text-gray-300 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Editor
            </Link>
            <Link
              to="/battle"
              className="text-gray-300 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              BattleX
            </Link>
            { user.isAuthenticated && <Link
              to={`/${user.details?.role === "ADMIN" ? "admin/dashboard" : "dashboard"}`}
              className="text-gray-300 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Dashboard
            </Link>}
            
            {!user.isAuthenticated && (
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="space-y-2">
                  <Link to="/login" className="block">
                    <Button variant="ghost" className="w-full text-gray-300 hover:text-orange-500 hover:bg-black">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" className="block">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 neon-glow">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
