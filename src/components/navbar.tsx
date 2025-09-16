import { Bell, Moon, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useUserLogoutMutation } from '@/apis/auth-user/auth/user'
import { useAdminLogoutMutation } from '@/apis/auth-user/auth/admin'
import { toast } from "sonner"
import { useAuthActions } from '@/hooks/useDispatch'
import { useSelect } from '@/hooks/useSelect'
import { getCloudinaryUrl } from "@/utils/cloudinaryImageResolver"
import { useState } from "react"
import TypewriterTitle from "../features/landing/components/TypewriterTitle"

const navItems = [
  { id: "dashboard", label: "Dashboard", protected : true },
  { id: "problems", label: "Problems", protected : false },
  { id: "users", label: "Users", protected : true },
  { id: "leaderboard", label: "Leaderboard", protected : true },
  { id : "codepad", label : "CodePad", protected : false},
]

export default function Navbar() {
  const { user } = useSelect()
  const navigate = useNavigate()
  const location = useLocation()
  const [userLogout] = useUserLogoutMutation();
  const [adminLogout] = useAdminLogoutMutation();
  const { logout: reduxLogout } = useAuthActions()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const segments = location.pathname.split("/").filter(Boolean); 
  const currentPath = segments.length === 0 
    ? "home" 
    : segments[segments.length - 1];

  const role = user && user.details?.role.toLowerCase();
  
  const publicRoutes = ["problems","codepad"];
  const protectedRoutes = ["dashboard", "profile","leaderboard"];
  const adminOnlyRoutes = ["problems","users"]

  const visibleNavitems = navItems.filter((item) => {
    if (!item.protected) return true;
    if (!user.isAuthenticated) return false;
    if (adminOnlyRoutes.includes(item.id)) {
      return role === "admin";
    }
    return true;
  });
  
  const logoutApi = role === 'admin' ? adminLogout : userLogout

  const getPath = (itemId: string) => {
    // Special admin route
    if (adminOnlyRoutes.includes(itemId) && role === "admin") {
      return `/admin/${itemId}`;
    }

    // Public routes → no role prefix
    if (publicRoutes.includes(itemId)) {
      return `/${itemId}`;
    }

    // Protected routes → prefix with role if authenticated
    if (protectedRoutes.includes(itemId) && user.isAuthenticated && role) {
      return `/${role}/${itemId}`;
    }

    // Home or fallback
    return itemId === "home" ? "/" : `/${itemId}`;
  };

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out. . .")
    try {
      await logoutApi().unwrap()
      toast.success("Logout success", {
        className: "success-toast",
        id: toastId,
      })
      reduxLogout()
    } catch (error: any) {
      toast.error("Logout error", {
        className: "error-toast",
        id: toastId,
        description: "Something went wrong",
      })
    }
  }

  if(currentPath === 'codepad') return null

  return (
    <div>
    <header className="h-16 bg-card/80 border-b border-gray-800 flex items-center justify-between px-10 relative">

      {/* Logo */}
      { location.pathname === "/" 
      ? (<TypewriterTitle/>) 
      : <Link
        className="text-orange-600 text-2xl font-bold w-[100px] text-nowrap"
        to="/"
      >
        CodeX
      </Link>}

      {/* Desktop Navigation */}
    <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
      <Tabs
        value={currentPath}
        onValueChange={(val) => {
          navigate(getPath(val));
        }}
        className="hidden md:block"
      >
        <TabsList className="bg-transparent space-x-2">
          {visibleNavitems.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1 text-sm"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>

      {/* Desktop Right Section */}
    <div className="hidden md:flex items-center gap-4">
      {user.isAuthenticated ? (
        <>
          {/* Notifications */}
          {/* <Button variant="ghost" size="sm" className="relative hidden sm:flex">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive">
              3
            </Badge>
          </Button> */}

          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Moon className="w-5 h-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={getCloudinaryUrl(user.details?.avatar!)}
                    alt="User"
                  />
                  <AvatarFallback>
                    {user.details?.username
                      .split("_")
                      .map((s) => s[0].toUpperCase())}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="border border-gray-800 rounded-xl shadow-lg"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.details?.username}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate max-w-[180px]">
                    {user.details?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/${role}/profile`)}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleLogout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className="ml-4 flex items-center md:ml-6 space-x-3">
          <Link to="/login">
            <Button size="sm" variant="ghost" className="text-gray-300 hover:text-orange-600 hover:bg-black">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 neon-glow">
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

    {/* Mobile Navigation */}
    {mobileMenuOpen && (
      <div className="md:hidden absolute top-16 left-0 w-full bg-black/90 backdrop-blur-md z-50">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {visibleNavitems.map((item) => (
            <Link
              key={item.id}
              to={getPath(item.id)}
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {user.isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-gray-800 space-y-3">
              {/* Notifications */}
              {/* <Button variant="ghost" size="sm" className="w-full justify-start relative">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
                <Badge className="absolute top-1 right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive">
                  3
                </Badge>
              </Button> */}

              {/* Theme Toggle */}
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Moon className="w-5 h-5 mr-2" />
                Toggle Theme
              </Button>

              {/* Profile */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  navigate(`/${role}/profile`);
                  setMobileMenuOpen(false);
                }}
              >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage
                    src={getCloudinaryUrl(user.details?.avatar!)}
                    alt="User"
                  />
                  <AvatarFallback>
                    {user.details?.username
                      .split("_")
                      .map((s) => s[0].toUpperCase())}
                  </AvatarFallback>
                </Avatar>
                Profile
              </Button>

              {/* Logout */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Log out
              </Button>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-800 space-y-2">
              <Link to="/login" className="block">
                <Button
                  variant="ghost"
                  className="w-full text-gray-300 hover:text-orange-500 hover:bg-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="block">
                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700 neon-glow"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    )}
    </header>
    </div>
  )
}
