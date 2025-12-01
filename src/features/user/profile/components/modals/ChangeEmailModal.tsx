import { useState } from "react"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { updateEmailSchema, type UpdateEmailSchemaType } from "../../schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import OtpVerificationForm from "@/features/auth/components/form-components/OtpVerificationForm"
import type { OtpVerificationSchemaType } from "@/features/auth/validations/schemas"
import { useAuthActions } from '@/hooks/useDispatch'
import { useSelect } from '@/hooks/useSelect'
import type { ProfileMutations } from "./apis"

interface ChangeEmailModalProps {
  currentEmail: string
  open : boolean
  onClose: () => void
  updateEmail : ProfileMutations['updateEmail']
  resendOtp : ProfileMutations['resendOtp']
  verifyEmail : ProfileMutations['verifyEmail']
}

export default function ChangeEmailModal({
    currentEmail, 
    open, 
    onClose, 
    updateEmail, 
    resendOtp, 
    verifyEmail
  } : ChangeEmailModalProps) {
  const { login } = useAuthActions();
  const { user } = useSelect();
  const [showPassword, setShowPassword] = useState(false)
  const [step,setStep] = useState<'form'|'otp'>("form")
  const form = useForm<UpdateEmailSchemaType>({
    resolver : zodResolver(updateEmailSchema),
    defaultValues : {
      newEmail: "",
      password: "",
    }
  })

  const onSubmit = async (values : UpdateEmailSchemaType) => {
    const payload = {
      ...values
    }
    const toastId = toast.loading('Processing...');
    try {
      const res = await updateEmail(payload).unwrap();
      toast.success(res.message,{
        id : toastId,
        className : 'success-toast'
      });
      setStep('otp');
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

  const handleVerifyOtp = async (values : OtpVerificationSchemaType) => {
    const payload = {
      email : form.getValues().newEmail,
      otp : values.otp
    }
    const toastId = toast.loading('Verifying OTP...',{
    })
    try {
      const res = await verifyEmail(payload).unwrap();
      toast.success(res.message,{
        id : toastId,
        className : 'success-toast'
      })
      login({
        ...user.details!,
        email : form.getValues().newEmail
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

  const handleResendOtp = async () => {
    const payload = {
      email : form.getValues().newEmail
    }
    const toastId = toast.loading('Processing...');
    try {
      const res = await resendOtp(payload).unwrap();
      toast.success(res.message,{
        id : toastId,
        className : 'success-toast'
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
    <Dialog open={open} onOpenChange={(open)=>{if(!open) onClose()}}>
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
            <DialogTitle>
            </DialogTitle>
          </DialogHeader>
        
          {step==='form' ? <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
            >
              {/* Current Email Display */}
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Current Email</p>
                <p className="font-medium">{currentEmail}</p>
              </div>

              {/* New Email */}
              <FormField
                control={form.control}
                name='newEmail'
                render={({ field })=>(
                  <FormItem>
                    <FormLabel>New Email Address</FormLabel>
                    <FormControl>
                      <Input
                      type="email"
                      placeholder="Enter your new email address"
                      {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Password confirmation */}
              <FormField
              control={form.control}
              name="password"
              render={({ field })=>(
                <FormItem>
                  <FormLabel>Confirm with Password</FormLabel>
                  <FormControl>
                  <div className="relative" >
                  <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  {...field}
                  className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  </div>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
              />
              {/* Info Message */}
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> You&apos;ll need to verify your new
                  email address before the change takes effect. We&apos;ll send
                  a verification link to your new email.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Change Email</Button>
              </div> 
            </form>
          </Form> 
          : <OtpVerificationForm
            email={form.getValues().newEmail}
            onResendOtp={handleResendOtp}
            onVerifyOtp={handleVerifyOtp}
          /> }

        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
