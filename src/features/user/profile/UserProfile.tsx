import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Copy, Mail, User, Globe, Calendar, Edit, Shield, ShieldCheck, Trash2, Code2 } from "lucide-react"
import EditProfileModal from "./components/modals/EditProfileModal"
import ChangePasswordModal from "./components/modals/ChangePasswordModal"
import ChangeEmailModal from "./components/modals/ChangeEmailModal"
import DeleteAccountModal from "./components/modals/DeleteAccountModal"
import { getCountryFlag } from "@/utils/countryFlag"
import { useProfileQuery } from '@/apis/auth-user/profile/user'
import type { UserProfileResponse } from "@/types/apiTypes"
import { formatDate } from "@/utils/formatData"
import { getLanguageIcon } from "@/utils/languageIcon"
import { getCloudinaryUrl } from "@/utils/cloudinaryImageResolver"
import { toast } from "sonner"
import UserProfileSkeleton from "./components/UserProfileSkeleton"
import ErrorPage from "@/components/ErrorPage"
import { useSelect } from '@/hooks/useSelect'
import { useProfileMutations } from "./components/modals/apis"
import { useAdminProfileQuery } from '@/apis/auth-user/profile/admin'

export default function UserProfile() {
  const { user } = useSelect();
  const isAdmin = user.details?.role === 'ADMIN'
  console.log(isAdmin);
  const { 
    updateProfile, 
    changePassword, 
    updateEmail, 
    resendOtp, 
    verifyEmail, 
    deleteAccount 
  } = useProfileMutations(isAdmin);
  
  const { data, refetch, isLoading, isError } = isAdmin ? useAdminProfileQuery() : useProfileQuery();

  const [profile, setProfile] = useState<UserProfileResponse>({
    userId: "",
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    avatar: "",
    country: "",
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalSubmission: 0,
    streak: 0,
    preferredLanguage: "",
    createdAt: "",
    updatedAt: "",
  })

  useEffect(() => {
    if (data?.data) {
      setProfile({ ...profile, ...data.data })
    }
  }, [data])

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const copyUsername = async () => {
    await navigator.clipboard.writeText(profile.username)
    toast.info("Username copied to clipboard")
  }

  if (isError) return <ErrorPage />
  if (isLoading) return <UserProfileSkeleton />

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <main className="flex-1 overflow-y-auto p-4">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex flex-col md:flex-row gap-4 sm:gap-6 max-sm:items-center max-sm:text-center">
                    {/* Avatar and Basic Info */}
                    <div className="flex flex-col items-center md:items-start">
                      <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mb-3 sm:mb-4">
                        <AvatarImage src={getCloudinaryUrl(profile.avatar)} alt={profile.username} />
                        <AvatarFallback className="text-base sm:text-lg">
                          {profile.firstName}
                          {profile.lastName}
                        </AvatarFallback>
                      </Avatar>

                      <div className="text-center md:text-left space-y-1 sm:space-y-2">
                        <div className="flex items-center gap-2 max-sm:justify-center">
                          <h1 className="text-xl sm:text-2xl font-bold">{profile.username}</h1>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={copyUsername} className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy username</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        <p className="text-base sm:text-lg text-muted-foreground">
                          {profile.firstName} {profile.lastName === "null" ? "" : profile.lastName}
                        </p>
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {profile.country === "null" ? "" : getCountryFlag(profile.country)}
                            {profile.country === "null" ? "not-set" : profile.country?.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.email}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Joined {formatDate(profile.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-muted-foreground" />
                          <i className={getLanguageIcon(profile.preferredLanguage)}></i>
                        </div>
                      </div>

                      {/* Stats Overview */}
                      <div className="mt-4 sm:mt-6">
                        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Stats Overview</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                          <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-green-500">{profile.easySolved}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">Easy</div>
                          </div>
                          <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-yellow-500">{profile.mediumSolved}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">Medium</div>
                          </div>
                          <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-red-500">{profile.hardSolved}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">Hard</div>
                          </div>
                          <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-primary">{profile.totalSubmission}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">Total</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
                <TabsList className="grid w-full grid-cols-2 max-sm:grid-cols-1">
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
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <Card>
                      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                        <CardTitle>Profile Information</CardTitle>
                        <Button onClick={() => setIsEditModalOpen(true)} className="w-full sm:w-auto">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-muted-foreground">Username</label>
                            <p className="text-sm mt-1">{profile.username}</p>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-muted-foreground">First Name</label>
                            <p className="text-sm mt-1">{profile.firstName}</p>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-muted-foreground">Last Name</label>
                            <p className="text-sm mt-1">{profile.country === "null" ? "not-set" : profile.lastName}</p>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-muted-foreground">Country</label>
                            <p className="text-sm mt-1">
                              {getCountryFlag(profile.country)} {profile.country}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-muted-foreground">Preferred Language</label>
                            <span> {profile.preferredLanguage}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Account Security Tab */}
                <TabsContent value="security">
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-3 sm:space-y-4">
                    {/* Change Password Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5" />
                          Change Password
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
                          Update your password to keep your account secure.
                        </p>
                        <Button onClick={() => setIsPasswordModalOpen(true)} className="w-full sm:w-auto">
                          Change Password
                        </Button>
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
                        <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
                          Update your email address for account notifications.
                        </p>
                        <Button onClick={() => setIsEmailModalOpen(true)} className="w-full sm:w-auto">
                          Change Email
                        </Button>
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
                        <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)} className="w-full sm:w-auto">
                          Delete Account
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </main>

        {/* Modals */}
        <AnimatePresence>
          {isEditModalOpen && (
            <EditProfileModal
              profile={{
                username: profile.username,
                firstName: profile.firstName,
                lastName: profile.lastName,
                avatar: profile.avatar,
                country: profile.country,
                preferredLanguage: profile.preferredLanguage,
              }}
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              refetch={refetch}
              updateProfile={updateProfile}
            />
          )}

          {isPasswordModalOpen && (
            <ChangePasswordModal 
            open={isPasswordModalOpen} 
            onClose={() => setIsPasswordModalOpen(false)} 
            changePassword={changePassword}
            />
          )}

          {isEmailModalOpen && (
            <ChangeEmailModal
              currentEmail={profile.email}
              open={isEmailModalOpen}
              onClose={() => setIsEmailModalOpen(false)}
              updateEmail={updateEmail}
              resendOtp={resendOtp}
              verifyEmail={verifyEmail}
            />
          )}

          {isDeleteModalOpen && (
            <DeleteAccountModal
             open={isDeleteModalOpen}
             deleteAccount={deleteAccount}
             onClose={() => setIsDeleteModalOpen(false)} />
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}
