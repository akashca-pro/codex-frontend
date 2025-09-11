import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Ban, Eye } from "lucide-react"
import CopyToClipboard from "@/components/CopyToClipboard"
import { getCloudinaryUrl } from "@/utils/cloudinaryImageResolver"

interface UserCardProps {
  user: any
  onView: () => void
  onBlock: () => void
}

const MobileUserCard = ({ user, onView, onBlock }: UserCardProps) => {
  return (
    <div className="p-4 rounded-xl border bg-card shadow-sm space-y-3">
      {/* Top row: Avatar + Name */}
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={getCloudinaryUrl(user.avatar)} alt={user.username} />
          <AvatarFallback>
            {user.firstName[0]}{user.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user.username}</p>
          <p className="text-sm text-muted-foreground">
            {user.firstName} {user.lastName}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center gap-2">
        <p className="text-sm truncate">{user.email}</p>
        <CopyToClipboard text={user.email} label="Email" />
      </div>

      {/* Status + AuthProvider */}
      <div className="flex items-center justify-between">
        <Badge variant={user.authProvider === "GOOGLE" ? "default" : "secondary"}>
          {user.authProvider}
        </Badge>
        {user.isBlocked ? (
          <Badge className="bg-red-500">Blocked</Badge>
        ) : user.isArchived ? (
          <Badge className="bg-yellow-500">Archived</Badge>
        ) : user.isVerified ? (
          <Badge className="bg-green-500">Active</Badge>
        ) : (
          <Badge variant="secondary">Unverified</Badge>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onView}>
          <Eye className="w-4 h-4 mr-1" /> More
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onBlock}
                className={`h-8 ${
                  user.isBlocked
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {user.isBlocked ? (
                  <>
                    <Ban className="w-4 h-4 mr-1" />
                    Blocked
                  </>
                ) : (
                  "Block"
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {user.isBlocked ? "Click to unblock user" : "Click to block user"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default MobileUserCard
