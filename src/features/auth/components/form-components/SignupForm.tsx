import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema, type SignupSchemaType } from "@/features/auth/validations/schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { useUserSignupMutation } from '@/apis/auth-user/auth/user'
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useUserEmailActions } from '@/hooks/useDispatch';
import { generateRandomUsername } from "@/utils/generateRandomUsername"
import { countryMap } from "@/utils/countryMap"

export default function SignupForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const { setEmail } = useUserEmailActions()
  const [userSignup] = useUserSignupMutation();
  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      country: "",
      confirmPassword : "",
    },
  })
  const watchedUsername = form.watch("username");
  
  const onSubmit = async(data: SignupSchemaType) => {
    console.log("Form Submitted: ", data);
    const credentials = {
      ...data
    }
    const toastId = toast.loading('Please wait . . .',{
        className : 'info-toast'
    })
    try {
      await userSignup(credentials).unwrap();
      toast.success('OTP Dispatched', {
        description: 'A one-time code was injected into your inbox.',
        className: 'success-toast',
        id : toastId
      })
      setEmail({email : data.email})
      navigate('/signup/verify-otp')
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
        <CardTitle className="text-center text-white">Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* First & Last Name */}
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormControl>
                      <Input
                        placeholder="First Name"
                        className="bg-gray-900 border-gray-800 text-white placeholder-gray-400 focus:border-orange-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormControl>
                      <Input
                        placeholder="Last Name"
                        className="bg-gray-900 border-gray-800 text-white placeholder-gray-400 focus:border-orange-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />
            </div>

            {/* Username + Country */}
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-4/5">
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Username"
                          className="pl-10 bg-gray-900 border-gray-800 text-white placeholder-gray-400 focus:border-orange-500"
                          {...field}
                        />
                      {!watchedUsername && <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-orange-400 px-2 hover:bg-transparent"
                        onClick={() => {
                          const newUsername = generateRandomUsername();
                          form.setValue("username", newUsername, { shouldValidate: true });
                        }}
                      >
                        Random
                      </Button>}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => {
                const selectedCode = field.value;
                return (
                  <FormItem className="w-1/2">
                    <Select
                      onValueChange={field.onChange}
                      value={selectedCode}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="bg-gray-900 border border-gray-800 text-white placeholder-gray-400 focus:outline-none"
                        >
                          <SelectValue
                            placeholder="Country"
                          >
                            {selectedCode ? selectedCode.toUpperCase() : "Country"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        className="bg-gray-900 text-white border-gray-800 max-h-[250px] overflow-y-auto"
                      >
                        {Object.entries(countryMap).map(([code, name]) => (
                          <SelectItem
                            key={code}
                            value={code}
                            title={name}
                            className=" overflow-hidden text-ellipsis"
                          >
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                );
              }}
            />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Email"
                        type="email"
                        className="pl-10 bg-gray-900 border-gray-800 text-white placeholder-gray-400 focus:border-orange-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
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

            {/* Confirm password */}

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Confirm Password"
                        type="password"
                        className="pl-10 pr-10 bg-gray-900 border-gray-800 text-white placeholder-gray-400 focus:border-orange-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />
            {/* Submit */}
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 neon-glow">
              Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
