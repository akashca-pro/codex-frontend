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
import { toast } from "sonner"
import { useUserPasswordChangeMutation,
    useForgotPassResendOtpMutation
 } from '@/apis/auth-user/auth/user'
import { ResetPasswordSchema, type ResetPasswordSchemaType } from "../../validations/schemas"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import OtpInput from "@/components/OtpInput"

interface ResetPasswordModalProps {
  open: boolean
  onClose: () => void
  email : string
}

export default function ResetPasswordModal({
  email,
  open,
  onClose,
}: ResetPasswordModalProps) {
  const navigate = useNavigate()
  const [resetPassword] = useUserPasswordChangeMutation();
  const [resendOtp] = useForgotPassResendOtpMutation();
  const [showPasswords, setShowPasswords] = useState(false)

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
        newPassword : "",
        otp : "",
        confirmPassword : ""
    },
  })

  const onSubmit = async (values: ResetPasswordSchemaType) => {
    const payload = {
      email,
      newPassword : values.newPassword,
      otp : values.otp
    }
    const toastId = toast.loading('Processing...');
    try {
      const res = await resetPassword(payload).unwrap();
      toast.success(res.message,{
        className : 'success-toast',
        id : toastId
      })
      navigate('/login')
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

  const onResendOtp = async () => {
    const payload = {
        email
    }
    const toastId = toast.loading('Processing...');
    try {
        const res = await resendOtp(payload).unwrap();
        toast.success(res.message,{
            id : toastId,
            className : 'success-toast',
        })
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
    <Dialog 
    open={open} 
    onOpenChange={(open)=>{if(!open)onClose()}}
    >
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

             {/* OTP */}
            <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
                <FormItem>
                <Label>Enter OTP</Label>
                <FormControl>
                    <OtpInput 
                    value={field.value} 
                    onChange={field.onChange} 
                    onResendOtp={onResendOtp}
                    formReset={()=>{
                        form.resetField('otp')
                        form.clearErrors()
                    }}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswords ? "text" : "password"}
                          placeholder="Enter new password"
                          {...field}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPasswords((prev)=>!prev)}
                        >
                          {showPasswords ? (
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
                          type={"password"}
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
                <Button type="submit">Reset Password</Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
