import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Globe,
  Code,
  Calendar,
  Shield,
  Archive,
  Ban,
  CheckCircle,
  Trophy,
  Flame,
  Target,
} from "lucide-react"
import { getCloudinaryUrl } from "@/utils/cloudinaryImageResolver"
import CopyToClipboard from "@/components/CopyToClipboard"
import { getCountryFlag } from "@/utils/countryFlag"
import { formatDate } from "@/utils/formatData"

interface UserDetailsModalProps {
  user: any
  isOpen: boolean
  onClose: () => void
}

export default function UserDetailsModal({ user, isOpen, onClose }: UserDetailsModalProps) {
  if (!user) return null

  const getStatusColor = (status: boolean, type: "verified" | "blocked" | "archived") => {
    if (type === "verified") return status ? "text-green-600" : "text-gray-500"
    if (type === "blocked") return status ? "text-red-600" : "text-gray-500"
    if (type === "archived") return status ? "text-orange-600" : "text-gray-500"
    return "text-gray-500"
  }

  const totalSolved = user.easySolved + user.mediumSolved + user.hardSolved

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[95vw] sm:!w-[80vw] !max-w-6xl max-h-[90vh] overflow-y-auto scrollbar-hide p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">User Details</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                  <AvatarImage src={getCloudinaryUrl(user.avatar)} alt={user.username} />
                  <AvatarFallback className="text-lg font-bold">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2 sm:space-y-4 w-full overflow-x-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground">User ID</label>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <p className="font-mono text-xs sm:text-sm">{user.userId}</p>
                        <CopyToClipboard text={user.userId} label="UserId" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground">Username</label>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <p className="font-mono text-xs sm:text-sm">{user.username}</p>
                        <CopyToClipboard text={user.username} label="Username" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground">First Name</label>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <p className="font-mono text-xs sm:text-sm">{user.firstName}</p>
                        <CopyToClipboard text={user.firstName} label="First name" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground">Last Name</label>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <p className="font-mono text-xs sm:text-sm">{user.lastName}</p>
                        {user && user.lastName !== 'null' ? <CopyToClipboard text={user.lastName} label="Last name" /> : ''}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                        Email
                      </label>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <p className="font-mono text-xs sm:text-sm">{user.email}</p>
                        <CopyToClipboard text={user.email} label="Email" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                        Country
                      </label>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <p className="font-mono text-xs sm:text-sm">{user.country}</p>
                        {user && user.country !== 'null' ? getCountryFlag(user.country) : ''}
                        {user && user.country !== 'null' ? <CopyToClipboard text={user.country} label="Country" /> : ''}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Code className="w-3 h-3 sm:w-4 sm:h-4" />
                        Preferred Language
                      </label>
                      <Badge variant="outline" className="text-xs sm:text-sm">{user.preferredLanguage}</Badge>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">Auth Provider</label>
                      <Badge variant={user.authProvider === "GOOGLE" ? "default" : "secondary"} className="text-xs sm:text-sm">
                        {user.authProvider}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${getStatusColor(user.isVerified, "verified")}`} />
                  <span className="font-medium text-xs sm:text-sm">Verified:</span>
                  <Badge variant={user.isVerified ? "default" : "secondary"} className="text-xs sm:text-sm">{user.isVerified ? "Yes" : "No"}</Badge>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Ban className={`w-4 h-4 sm:w-5 sm:h-5 ${getStatusColor(user.isBlocked, "blocked")}`} />
                  <span className="font-medium text-xs sm:text-sm">Blocked:</span>
                  <Badge variant={user.isBlocked ? "destructive" : "secondary"} className="text-xs sm:text-sm">{user.isBlocked ? "Yes" : "No"}</Badge>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Archive className={`w-4 h-4 sm:w-5 sm:h-5 ${getStatusColor(user.isArchived, "archived")}`} />
                  <span className="font-medium text-xs sm:text-sm">Archived:</span>
                  <Badge variant={user.isArchived ? "outline" : "secondary"} className="text-xs sm:text-sm">{user.isArchived ? "Yes" : "No"}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coding Statistics Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                Coding Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div className="text-center p-2 sm:p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{user.easySolved}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Easy Solved</p>
                </div>
                <div className="text-center p-2 sm:p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-xl sm:text-2xl font-bold text-yellow-600">{user.mediumSolved}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Medium Solved</p>
                </div>
                <div className="text-center p-2 sm:p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-xl sm:text-2xl font-bold text-red-600">{user.hardSolved}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Hard Solved</p>
                </div>
                <div className="text-center p-2 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalSolved}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Solved</p>
                </div>
              </div>

              <Separator className="my-2 sm:my-4" />

              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  <span className="font-medium text-xs sm:text-sm">Current Streak:</span>
                  <Badge variant="outline" className="text-xs sm:text-sm text-orange-600 border-orange-200">
                    {user.streak} days
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                Account Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Created At</label>
                  <p className="text-xs sm:text-sm">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-xs sm:text-sm">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
