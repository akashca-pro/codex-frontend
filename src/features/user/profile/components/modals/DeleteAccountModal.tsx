import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, X, Eye, EyeOff } from "lucide-react"

interface DeleteAccountModalProps {
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteAccountModal({ onClose, onConfirm }: DeleteAccountModalProps) {
  const [password, setPassword] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!password) {
      newErrors.password = "Password is required to confirm deletion"
    }

    if (confirmText !== "DELETE") {
      newErrors.confirmText = "Please type DELETE to confirm"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm()
    }
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
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Delete Account
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Warning Message */}
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-destructive">This action cannot be undone</h4>
                  <p className="text-sm text-muted-foreground">Deleting your account will permanently remove:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Your profile and personal information</li>
                    <li>• All your problem solutions and submissions</li>
                    <li>• Your progress statistics and achievements</li>
                    <li>• Any saved code or notes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Confirmation Text */}
              <div className="space-y-2">
                <Label htmlFor="confirmText">
                  Type <strong>DELETE</strong> to confirm
                </Label>
                <Input
                  id="confirmText"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className={errors.confirmText ? "border-destructive" : ""}
                  placeholder="DELETE"
                />
                {errors.confirmText && <p className="text-sm text-destructive">{errors.confirmText}</p>}
              </div>

              {/* Password Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="password">Confirm with your password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                    placeholder="Enter your password"
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirm} disabled={!password || confirmText !== "DELETE"}>
                Delete Account
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
