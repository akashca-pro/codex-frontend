import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  Code2,
  Play,
  Trophy,
  Settings,
  ChevronRight,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "problems", icon: Code2, label: "Problems" },
  { id: "editor", icon: Play, label: "Editor" },
  { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
  { id: "settings", icon: Settings, label: "Settings" },
]

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const currentPath = location.pathname.split("/")[1] 

  return (
    <TooltipProvider>
      <motion.div
        className="bg-card border-r border-border flex flex-col"
        initial={{ width: 80 }}
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="h-16 border-b border-border flex items-center justify-center">
        {isExpanded ? (
            <motion.span
            onClick={()=>navigate('/')}
            className="font-bold text-lg text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            >
            Code<span className="text-primary">X</span>
            </motion.span>
        ) : (
            <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-12 h-12  rounded-md flex items-center justify-center"
            >
            <img
                src="/codeX-logo.png"
                alt="CodeX Logo"
                className="w-18 h-18 object-contain"
            />
            </motion.div>
        )}
        </div>


        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.id

            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate(`/${item.id}`)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isExpanded && (
                      <motion.span
                        className="font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {isActive && !isExpanded && (
                      <motion.div
                        className="absolute left-0 w-1 h-8 bg-primary rounded-r"
                        layoutId="activeIndicator"
                      />
                    )}
                  </button>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </nav>

        {/* Expand Indicator */}
        <div className="p-4 border-t border-border">
          <motion.div
            className="flex items-center justify-center"
            animate={{ rotate: isExpanded ? 180 : 0 }}
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
