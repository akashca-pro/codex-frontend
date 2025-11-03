import { useState } from "react"
import { motion } from "framer-motion"
import { useCollaboration } from "./CollaborationProvider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCollabSessionActions } from '@/hooks/useDispatch'
import { useSelect } from '@/hooks/useSelect'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LogOut, Power, Wifi, WifiOff, AlertTriangle, Loader2, Copy, Users } from "lucide-react"
import { toast } from "sonner"
import { useLocation } from "react-router-dom"
import { getCloudinaryUrl } from "@/utils/cloudinaryImageResolver"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CollaborationHeaderProps {
  language: string
  onLanguageChange: (language: string) => void
  fontSize : number;
  onFontSizeChange: (size: number) => void;
  // intelliSense : boolean
  // onToggleIntelliSense : () => void
  disableNavigationBlock: () => void
  triggerConfirmType?: 'end' | 'leave' | null
  onConfirmProceed?: () => void
  onConfirmCancel?: () => void
  onRequestNavigateHome: () => void
}

interface Language {
  id: string
  name: string
  extension: string
  color: string
}

const languages: Language[] = [
  { id: "javascript", name: "JavaScript", extension: "js", color: "bg-yellow-500" },
  { id: "python", name: "Python", extension: "py", color: "bg-green-500" },
  { id: "go", name: "Golang", extension: "go", color: "bg-blue-500" },
]

const CollaborationHeader = ({
    language,
    onLanguageChange,
    fontSize,
    onFontSizeChange,
    // intelliSense,
    // onToggleIntelliSense,
  disableNavigationBlock,
  triggerConfirmType,
  onConfirmProceed,
  onConfirmCancel,
  onRequestNavigateHome,
  } : CollaborationHeaderProps
) => {
  const { connectionStatus, socket, currentUser } = useCollaboration();
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const { endSession, leaveSession } = useCollabSessionActions();
  const { collabSession } = useSelect();
  const location = useLocation();
  const selectedLanguage = languages.find((lang) => lang.id === language)

  // Open confirmation dialog when parent requests
  
  if (triggerConfirmType === 'end' && !showEndConfirm) {
    setShowEndConfirm(true)
  }
  if (triggerConfirmType === 'leave' && !showLeaveConfirm) {
    setShowLeaveConfirm(true)
  }

  // Helper to detect if a participant is the current user
  const isMe = (user: any) => currentUser && user.id === currentUser.id;

  const handleEndSession = () => {
    if (socket) {
      disableNavigationBlock();
      socket.emit("close-session")
      endSession();
      if (onConfirmProceed) { onConfirmProceed(); }
      else { onRequestNavigateHome(); }
      toast.success("Session ended for all participants",{ className : 'success-toast' })
      setShowEndConfirm(false)
    }
  }

  const handleLeaveSession = () => {
    if (socket) {
      disableNavigationBlock();
      socket.emit("leave-session")
      leaveSession();
      if (onConfirmProceed) { onConfirmProceed(); }
      else { onRequestNavigateHome(); }
      toast.info("You left the session")
      setShowLeaveConfirm(false)
    }
  }

const handleCopyInvite = () => {
  const fullUrl = `${window.location.origin}${location.pathname}?token=${collabSession.inviteToken}`;

  // Check for modern API and secure context
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => toast.info("Invite link copied!"))
      .catch(() => toast.error("Failed to copy link."));
  } else {
    // Fallback for insecure context http
    try {
      const textarea = document.createElement("textarea");
      textarea.value = fullUrl;
      textarea.style.position = "fixed"; // Avoid scrolling to bottom
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);

      if (successful) {
        toast.info("Invite link copied!");
      } else {
        toast.error("Failed to copy link.");
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
      toast.error("Failed to copy link.");
    }
  }
};

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="h-3.5 w-3.5 text-green-500" />
      case "connecting":
        return <Loader2 className="h-3.5 w-3.5 text-yellow-500 animate-spin" />
      case "disconnected":
        return <WifiOff className="h-3.5 w-3.5 text-gray-500" />
      case "error":
        return <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40"
      >
        <Card className="border-b rounded-none border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4">
            {/* Left section: App title and badge */}
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-lg font-bold truncate">Codex Arena</h1>
              {collabSession.isOwner ? (
                <Badge variant="outline" className="text-xs">
                  Owner
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  Participant
                </Badge>
              )}
            </div>
            {/* Right section: All controls, participants, etc. */}
            <div className="flex items-center gap-4 flex-wrap justify-end ml-4">
              {/* Participants bar */}
              <span className="flex items-center gap-1 text-muted-foreground text-xs font-semibold select-none mr-1">
                <Users className="h-4 w-4" />
                Users
              </span>
              <div className="flex items-center gap-2 px-2">
                <div className="flex -space-x-2">
                  {collabSession.participants.map((user) => (
                    <Tooltip key={user.id}>
                      <TooltipTrigger asChild>
                        <span className="relative inline-block">
                          <Avatar className="h-7 w-7 border-2 border-background shadow">
                            <AvatarImage
                              src={getCloudinaryUrl(user.avatar) || '/user.svg'}
                              alt={user.username || user.firstName || 'User'}
                            />
                            <AvatarFallback className="text-xs font-bold">
                              {user.username?.slice(0,1) || user.firstName?.slice(0,1) || '?'}
                            </AvatarFallback>
                            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background bg-green-500" />
                          </Avatar>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{user.firstName || user.username}</span>
                          <span className="text-xs text-muted-foreground">@{user.username}</span>
                          {isMe(user) && <span className="text-xs ml-1 text-primary">You</span>}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            {/* Language selector */}
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-[140px] h-8 bg-background/50">
                <SelectValue>
                  {selectedLanguage && (
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedLanguage.color}`} />
                      <span className="text-sm">{selectedLanguage.name}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-none">
                {languages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${lang.color}`} />
                      <span>{lang.name}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        .{lang.extension}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Intellisense toggle */}
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={onToggleIntelliSense}
              className={`h-8 gap-2 border-b-2 ${
                intelliSense ? "border-orange-500" : "border-transparent"
              }`}
            >
              IntelliSense
            </Button> */}
            {/* Font slider */}
            <div className="flex items-center gap-2 w-52 px-1">
              <span className="text-xs text-muted-foreground">Font</span>
              <Slider
                value={[fontSize]}
                onValueChange={(value) => onFontSizeChange(value[0])}
                min={12}
                max={24}
                step={1}
                className="flex-1"
              />
              <span className="text-xs">{fontSize}px</span>
            </div> 
              {/* Connection status, copy, buttons */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-background/50">
                      {getConnectionIcon()}
                      <span className="text-xs font-medium capitalize">{connectionStatus}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">
                      {connectionStatus === "connected" ? "connected" : "Attempting to reconnect..."}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="outline" size="sm" onClick={handleCopyInvite} className="gap-1 h-7 text-xs">
                <Copy className="h-3 w-3" /> Copy Invite
              </Button>
              {collabSession.isOwner ? (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() => setShowEndConfirm(true)}
                >
                  <Power className="h-3.5 w-3.5" />
                  End Session
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-xs bg-transparent"
                  onClick={() => setShowLeaveConfirm(true)}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Leave Session
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* End Session Confirmation */}
      <Dialog open={showEndConfirm} onOpenChange={(open) => { setShowEndConfirm(open); if (!open && onConfirmCancel) onConfirmCancel(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Collaboration Session?</DialogTitle>
            <DialogDescription>
              This will end the session for all participants. Everyone's editor will become read-only.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 text-sm text-yellow-700 dark:text-yellow-400">
            ⚠️ This action cannot be undone.
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button className="btn btn-outline" onClick={() => onConfirmCancel && onConfirmCancel()}>Cancel</button>
            </DialogClose>
            <button type="button" className="bg-destructive text-white rounded-md px-4 py-2" onClick={handleEndSession}>
              End Session
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Session Confirmation */}
      <Dialog open={showLeaveConfirm} onOpenChange={(open) => { setShowLeaveConfirm(open); if (!open && onConfirmCancel) onConfirmCancel(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Collaboration Session?</DialogTitle>
            <DialogDescription>
              You will disconnect from the session. You can rejoin if session is not ended, use invite link.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button className="btn btn-outline" onClick={() => onConfirmCancel && onConfirmCancel()}>Cancel</button>
            </DialogClose>
            <button type="button" className="bg-destructive text-white rounded-md px-4 py-2" onClick={handleLeaveSession}>
              Leave Session
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CollaborationHeader
