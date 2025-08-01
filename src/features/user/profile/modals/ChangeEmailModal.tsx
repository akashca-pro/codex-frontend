import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, X, Eye, EyeOff, CheckCircle } from "lucide-react"

interface ChangeEmailModalProps {
  currentEmail: string
  onClose: () => void
  onSave: (newEmail: string) => void
}

export default function ChangeEmailModal({ currentEmail, onClose, onSave }: ChangeEmailModalProps) {
  const [formData, setFormData] = useState({
    newEmail: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showVerification, setShowVerification] = useState(false)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.newEmail) {
      newErrors.newEmail = "New email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.newEmail)) {
      newErrors.newEmail = "Please enter a valid email address"
    } else if (formData.newEmail === currentEmail) {
      newErrors.newEmail = "New email must be different from current email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required to confirm this change"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      // In a real app, you'd make an API call here
      setShowVerification(true)
      setTimeout(() => {
        onSave(formData.newEmail)
      }, 2000)
    }
  }

  if (showVerification) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="text-center py-6"
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Verification Email Sent</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We've sent a verification link to <strong>{formData.newEmail}</strong>. Please check your email and click
              the link to confirm your new email address.
            </p>
            <Button onClick={onClose}>Got it</Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Change Email
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Current Email Display */}
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Current Email</p>
              <p className="font-medium">{currentEmail}</p>
            </div>

            <div className="space-y-4">
              {/* New Email */}
              <div className="space-y-2">
                <Label htmlFor="newEmail">New Email Address</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={formData.newEmail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, newEmail: e.target.value }))}
                  className={errors.newEmail ? "border-destructive" : ""}
                  placeholder="Enter your new email address"
                />
                {errors.newEmail && <p className="text-sm text-destructive">{errors.newEmail}</p>}
              </div>

              {/* Password Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="password">Confirm with Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                    placeholder="Enter your current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> You'll need to verify your new email address before the change takes effect.
                We'll send a verification link to your new email.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Change Email</Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
