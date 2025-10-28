import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { toast } from "sonner"
import { ForgotPasswordSchema, type ForgotPasswordSchemaType } from "../../validations/schemas"
import { useUserForgotPasswordMutation } from '@/apis/auth-user/auth/user'
import ResetPasswordModal from "../../user/forgotPassword/ResetPasswordModal"

export default function ForgotPasswordForm() {
  const [forgotPassword,{isLoading}] = useUserForgotPasswordMutation();
  const [isModalOpen,setIsModalOpen] = useState(false);
  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    const payload = {
        email : values.email
    }
    const toastId = toast.loading('Processing...');
    try {
        await forgotPassword(payload).unwrap();
        toast.success(`OTP send to ${values.email}`,{
            id : toastId,
            className : 'success-toast',
        })
        setIsModalOpen(true);
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
    <div>
    <Card className="bg-gray-900/80 neon-border">
      <CardHeader>
        <CardTitle className="text-center text-white">
          Forgot Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 bg-gray-900 border-gray-800 text-white placeholder-gray-400 focus:border-orange-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 neon-glow"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
            
    <ResetPasswordModal
      email={form.getValues().email}
      open={isModalOpen}
      onClose={()=>setIsModalOpen(false)}
    />

    </div>
  )
}
