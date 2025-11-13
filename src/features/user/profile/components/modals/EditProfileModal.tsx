import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"
import { countryMap, getCountryName } from "@/utils/countryMap"
import { useAuthActions } from '@/hooks/useDispatch'

import { toast } from "sonner"
import { getCloudinaryUrl } from "@/utils/cloudinaryImageResolver"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProfileMutations } from "./apis"

interface UserProfile {
  username: string
  firstName: string
  lastName: string
  country: string
  preferredLanguage: string
  avatar: string
}

interface EditProfileModalProps {
  profile: UserProfile
  isOpen : boolean
  onClose: () => void
  refetch : () => void
  updateProfile : ProfileMutations['updateProfile']
}

const languages = [
  "javascript",
  "python",
  "go",
]

export default function EditProfileModal({ profile, isOpen, onClose, refetch, updateProfile }: EditProfileModalProps) {
  const [imagePreview,setImagePreview] = useState('');
  const { updateUser } = useAuthActions();
  const [formData, setFormData] = useState({
    username: profile.username,
    firstName: profile.firstName,
    lastName: profile.lastName,
    country: profile.country,
    preferredLanguage: profile.preferredLanguage,
    avatar: profile.avatar,
    avatarFile : null as File | null
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.username ||!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (!formData.lastName || !formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName || !formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    setErrors(newErrors)
    return newErrors
  }

  const handleSave = async () => {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        Object.values(validationErrors).forEach((msg) => toast.error(msg))
        return
      }
      const data = new FormData();
      if (formData.username !== profile.username) {
        data.append("username", formData.username);
      }
      if (formData.firstName !== profile.firstName) {
        data.append("firstName", formData.firstName);
      }
      if (formData.lastName !== profile.lastName) {
        data.append("lastName", formData.lastName);
      }
      if (formData.country !== profile.country) {
        data.append("country", formData.country);
      }
      if (formData.preferredLanguage !== profile.preferredLanguage) {
        data.append("preferredLanguage", formData.preferredLanguage);
      }
      if (formData.avatarFile !== null) {
        data.append("avatar", formData.avatarFile)
      }
      const toastId = toast.loading('Processing...');
      try {
        const updatedData = await updateProfile(data).unwrap();
        toast.success('Profile update successful',{
          className : 'success-toast',
          id : toastId
        })
        updateUser({
          ...updatedData.data
        });
        refetch();
        onClose();
      } catch (error : any) {
      const apiErrors = error?.data?.error
      
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        toast.dismiss(toastId);
        apiErrors.forEach((e: any) => {
          toast.error(`field : ${e.field}`, {
            description: `Error : ${e.message}`,
          })
        })
      }
      toast.error('Error',{
          className : 'error-toast',
          id : toastId,
          description : error?.data?.message
      })
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
           ...prev, 
           avatarFile : file 
          }))
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open)=>{if(!open) onClose();}}>
      <DialogContent 
      className="sm:max-w-md "
      onInteractOutside={(e) => e.preventDefault()} 
      onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Edit Profile
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={imagePreview || getCloudinaryUrl(formData.avatar)} alt="Profile" />
                <AvatarFallback>
                  {formData?.firstName[0]}
                  {formData.lastName && formData?.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Avatar
                    </span>
                  </Button>
                </Label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                  className={errors.username ? "border-destructive" : ""}
                />
                {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                </div>
              </div>

            {/* Country Selector */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, country: value }))
                }
                value={formData.country}
              >
                <SelectTrigger
                  id="country"
                  className="w-full border border-input bg-background text-foreground rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <SelectValue placeholder="Select Country">
                    {formData.country ? getCountryName(formData.country) : "Select Country"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent className="max-h-[250px] overflow-y-auto">
                  {Object.entries(countryMap).map(([code, name]) => (
                    <SelectItem
                      key={code}
                      value={code}
                      title={name}
                      className="truncate"
                    >
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preferred Language Selector */}
            <div className="space-y-2">
              <Label htmlFor="preferredLanguage">Preferred Language</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, preferredLanguage: value }))
                }
                value={formData.preferredLanguage}
              >
                <SelectTrigger
                  id="preferredLanguage"
                  className="w-full border border-input bg-background text-foreground rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <SelectValue placeholder="Select Language">
                    {formData.preferredLanguage || "Select Language"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent className="max-h-[250px] overflow-y-auto">
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
