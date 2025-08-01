import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Copy, Mail, User, Globe, Calendar, Code, Edit, Shield, ShieldCheck, Trash2 } from "lucide-react"
import EditProfileModal from "./modals/EditProfileModal"
import ChangePasswordModal from "./modals/ChangePasswordModal"
import ChangeEmailModal from "./modals/ChangeEmailModal"
import DeleteAccountModal from "./modals/DeleteAccountModal"

interface UserProfile {
  username: string
  firstName: string
  lastName: string
  email: string
  country: string
  joinedDate: string
  preferredLanguage: string
  avatar: string
  stats: {
    easy: number
    medium: number
    hard: number
    total: number
  }
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile>({
    username: "johndoe_dev",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    country: "United States",
    joinedDate: "January 2023",
    preferredLanguage: "JavaScript",
    avatar: "/placeholder.svg?height=120&width=120",
    stats: {
      easy: 156,
      medium: 78,
      hard: 13,
      total: 247,
    },
  })

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const copyUsername = async () => {
    await navigator.clipboard.writeText(profile.username)
    // You could add a toast notification here
  }

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      "United States": "🇺🇸",
      Canada: "🇨🇦",
      "United Kingdom": "🇬🇧",
      Germany: "🇩🇪",
      France: "🇫🇷",
      Japan: "🇯🇵",
      China: "🇨🇳",
      India: "🇮🇳",
      Australia: "🇦🇺",
      Brazil: "🇧🇷",
    }
    return flags[country] || "🌍"
  }

  return (
    <TooltipProvider>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.username} />
                    <AvatarFallback className="text-lg">
                      {profile.firstName[0]}
                      {profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center md:text-left space-y-2">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">{profile.username}</h1>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={copyUsername} className="h-8 w-8 p-0">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy username</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <p className="text-lg text-muted-foreground">
                      {profile.firstName} {profile.lastName}
                    </p>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {getCountryFlag(profile.country)} {profile.country}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {profile.joinedDate}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Code className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.preferredLanguage}</span>
                    </div>
                  </div>

                  {/* Stats Overview */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Stats Overview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-green-500">{profile.stats.easy}</div>
                        <div className="text-sm text-muted-foreground">Easy</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-yellow-500">{profile.stats.medium}</div>
                        <div className="text-sm text-muted-foreground">Medium</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-red-500">{profile.stats.hard}</div>
                        <div className="text-sm text-muted-foreground">Hard</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{profile.stats.total}</div>
                        <div className="text-sm text-muted-foreground">Total</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile Info
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Account Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Info Tab */}
            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Profile Information</CardTitle>
                    <Button onClick={() => setIsEditModalOpen(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Username</label>
                        <p className="text-sm mt-1">{profile.username}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">First Name</label>
                        <p className="text-sm mt-1">{profile.firstName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                        <p className="text-sm mt-1">{profile.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Country</label>
                        <p className="text-sm mt-1">
                          {getCountryFlag(profile.country)} {profile.country}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Preferred Language</label>
                        <p className="text-sm mt-1">{profile.preferredLanguage}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Account Security Tab */}
            <TabsContent value="security">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Change Password Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      Change Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Update your password to keep your account secure.
                    </p>
                    <Button onClick={() => setIsPasswordModalOpen(true)}>Change Password</Button>
                  </CardContent>
                </Card>

                {/* Change Email Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Change Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Current email: <span className="font-medium">{profile.email}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Update your email address for account notifications.
                    </p>
                    <Button onClick={() => setIsEmailModalOpen(true)}>Change Email</Button>
                  </CardContent>
                </Card>

                {/* Delete Account Card */}
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <Trash2 className="h-5 w-5" />
                      Delete Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Modals */}
        <AnimatePresence>
          {isEditModalOpen && (
            <EditProfileModal
              profile={profile}
              onClose={() => setIsEditModalOpen(false)}
              onSave={(updatedProfile) => {
                setProfile(updatedProfile)
                setIsEditModalOpen(false)
              }}
            />
          )}

          {isPasswordModalOpen && (
            <ChangePasswordModal
              onClose={() => setIsPasswordModalOpen(false)}
              onSave={() => setIsPasswordModalOpen(false)}
            />
          )}

          {isEmailModalOpen && (
            <ChangeEmailModal
              currentEmail={profile.email}
              onClose={() => setIsEmailModalOpen(false)}
              onSave={(newEmail) => {
                setProfile((prev) => ({ ...prev, email: newEmail }))
                setIsEmailModalOpen(false)
              }}
            />
          )}

          {isDeleteModalOpen && (
            <DeleteAccountModal
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={() => {
                // Handle account deletion
                console.log("Account deleted")
                setIsDeleteModalOpen(false)
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}
