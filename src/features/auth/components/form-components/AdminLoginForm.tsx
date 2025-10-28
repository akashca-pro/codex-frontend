import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, type LoginSchemaType } from "@/features/auth/validations/schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useAdminLoginMutation } from "@/apis/auth-user/auth/admin";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Shield, Lock, Mail } from "lucide-react"
import { toast } from "sonner"
import { useAuthActions } from '@/hooks/useDispatch'

export default function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [adminLogin] = useAdminLoginMutation();
  const { login } = useAuthActions();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginSchemaType) => {
    console.log(values)
    const credentials = {
      ...values
    }
    const toastId = toast.loading('Please Wait . . . ',{
      className : 'info-toast'
    })
    try {
      const res = await adminLogin(credentials).unwrap();
      toast.success('Access Granted',{
        className : 'success-toast',
        id : toastId
      })
      login({
            userId : res.data.userId,
            username : res.data.username,
            email : res.data.email,
            role : res.data.role,
            avatar : res.data.avatar
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
    <Card className="bg-gray-900/80 neon-border">
      <CardHeader>
        <CardTitle className="text-center text-white flex items-center justify-center gap-2">
          <Shield className="w-5 h-5 text-orange-500" />
          Admin Access
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

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 bg-gray-900 border-gray-800 text-white placeholder-gray-400 focus:border-orange-500"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
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
            >
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
