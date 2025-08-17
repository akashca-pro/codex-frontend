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
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate, useLocation } from "react-router-dom"
import { useUserLogoutMutation } from '@/apis/auth-user/auth/user'
import { toast } from "sonner"
import { useAuthActions } from '@/hooks/useDispatch'
import { useSelect } from '@/hooks/useSelect'
import { getCloudinaryUrl } from "@/utils/cloudinaryImageResolver"
import { useState } from "react"

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "problems", label: "Problems" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "settings", label: "Settings" },
  { id : "editor", label : "CodePad" }
]

export default function UserNavbar() {
  const { user } = useSelect()
  const navigate = useNavigate()
  const location = useLocation()
  const [logout] = useUserLogoutMutation()
  const { logout: reduxLogout } = useAuthActions()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const currentPath = location.pathname.split("/")[1] || "dashboard"

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out. . .")
    try {
      await logout().unwrap()
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

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">

      {/* Logo */}
      <div className="h-16 p-4 flex items-center">
        <span
          onClick={() => navigate("/")}
          className="font-bold text-xl text-foreground cursor-pointer"
        >
          Code<span className="text-primary">X</span>
        </span>
      </div>

      {/* Desktop Navigation */}
      <Tabs
        value={currentPath}
        onValueChange={(val) => navigate(`/${val}`)}
        className="hidden md:block"
      >
        <TabsList className="bg-transparent space-x-2">
          {navItems.map((item) => (
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

      {/* Mobile Navigation Dropdown */}
      <div className="md:hidden flex items-center gap-2">
        <span className="text-sm font-medium border-b-2 border-primary pb-0.5">
          {navItems.find((i) => i.id === currentPath)?.label || "Dashboard"}
        </span>

        <DropdownMenu onOpenChange={(open) => setMobileMenuOpen(open)}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              {mobileMenuOpen ? (
                <X className="w-5 h-5 transition-all" />
              ) : (
                <Menu className="w-5 h-5 transition-all" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg">
            {navItems.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => {
                  navigate(`/${item.id}`)
                  setMobileMenuOpen(false)
                }}
                className={`cursor-pointer rounded-md px-3 py-2 ${
                  currentPath === item.id
                    ? "bg-primary text-primary-foreground font-semibold" // active
                    : "hover:bg-muted" // only hover if not active
                }`}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative hidden sm:flex">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive">
            3
          </Badge>
        </Button>

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
            <DropdownMenuItem onClick={() => navigate("/profile")}>
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
      </div>
    </header>
  )
}
