import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Lock } from "lucide-react"
import { useState } from "react"
import {
  changePasswordSchema,
  type ChangePasswordSchemaType,
} from "../../schema"
import { toast } from "sonner"
import { useChangePasswordMutation } from '@/apis/auth-user/profile/user'

interface ChangePasswordModalProps {
  open: boolean
  onClose: () => void
}

export default function ChangePasswordModal({
  open,
  onClose,
}: ChangePasswordModalProps) {
  const [changePassword] = useChangePasswordMutation()
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currPass: "",
      newPass: "",
      confirmPassword: "",
    },
  })

  const togglePasswordVisibility = (
    field: "current" | "new" 
  ) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const onSubmit = async (values: ChangePasswordSchemaType) => {
    const payload = {
      currPass : values.currPass,
      newPass : values.newPass
    }
    console.log(payload)
    const toastId = toast.loading('Processing...');
    try {
      const res = await changePassword(payload).unwrap();
      toast.success(res.message,{
        className : 'success-toast',
        id : toastId
      })
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

  return (
    <Dialog open={open} onOpenChange={(open)=>{if(!open)onClose()}}>
      <DialogContent 
      className="sm:max-w-md"
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
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </div>
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 py-4"
            >
              {/* Current Password */}
              <FormField
                control={form.control}
                name="currPass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswords.current ? "text" : "password"}
                          placeholder="Enter current password"
                          {...field}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() =>
                            togglePasswordVisibility("current")
                          }
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={form.control}
                name="newPass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswords.new ? "text" : "password"}
                          placeholder="Enter new password"
                          {...field}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => togglePasswordVisibility("new")}
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswords.confirm ? "text" : "password"}
                          placeholder="Re-enter new password"
                          {...field}
                          className="pr-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Requirements */}
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  Password Requirements:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Must be different from current password</li>
                  <li>
                    • Consider using a mix of letters, numbers, and symbols
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Change Password</Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
