import { Bell, Search, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { useNavigate } from "react-router-dom"
import { useUserLogoutMutation } from '@/apis/auth-user/auth/user';
import { toast } from "sonner"
import { useAuthActions } from '@/hooks/useDispatch'

export default function UserNavbar() {
    const navigate = useNavigate();
    const [logout] = useUserLogoutMutation();
    const { logout : reduxLogout } = useAuthActions();

    const handleLogout = async () =>{
        const toastId = toast.loading('Logging out. . .');
        try {
            await logout().unwrap();
            toast.success('Logout success',{
                className : 'success-toast',
                id : toastId
            });
            reduxLogout();
        } catch (error : any) {
        toast.error('Logout error',{
            className : 'error-toast',
            id : toastId,
            description : 'Something went wrong'
        })
        }

    }

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search problems, topics..." className="pl-10 bg-background border-border" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive">
            3
          </Badge>
        </Button>

        {/* Theme Toggle */}
        <Button variant="ghost" size="sm">
          <Moon className="w-5 h-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=>navigate('/profile')}>
                Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleLogout}
            >Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
