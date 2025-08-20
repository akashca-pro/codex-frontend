import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { OtpVerificationSchema, type OtpVerificationSchemaType } from "@/features/auth/validations/schemas"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useAuthActions } from '@/hooks/useDispatch'
import { useSelect } from '@/hooks/useSelect'
import { useUserResendOtpMutation, useUserVerifyOtpMutation} from '@/apis/auth-user/auth/user'

export default function OtpVerificationForm() {
  const [resendOtp] = useUserResendOtpMutation();
  const [verifyOtp] = useUserVerifyOtpMutation();
  const { login } = useAuthActions();
  const navigate = useNavigate();
  const { email : globalEmail } = useSelect();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [timer, setTimer] = useState(60); // 60 seconds
  const [canResend, setCanResend] = useState(false);

  const form = useForm<OtpVerificationSchemaType>({
    resolver: zodResolver(OtpVerificationSchema),
    defaultValues: {
      otp: "",
    },
  })

  useEffect(() => {
    setCanResend(false); // disable resend button on mount or reset
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const restartTimer = () => {
    setTimer(60);
    setCanResend(false);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async() => {
    const credentials = {
        email : globalEmail.email
    }
    const toastId = toast.loading('New OTP generating',{
        className : 'info-toast'
    })
    try {
        await resendOtp(credentials).unwrap()
        toast.success(`New OTP sent to ${globalEmail.email}`,{
            id : toastId,
            className : 'success-toast'
        });
        restartTimer();
    } catch (error : any) {
      toast.error('Error',{
        className : 'error-toast',
        id : toastId,
        description : error?.data?.message
      })
    }
  }

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = form.getValues("otp").split("")
    newOtp[index] = value

    // Update form value
    form.setValue("otp", newOtp.join(""))

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

    const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
    ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
        inputRefs.current[index - 1]?.focus()
    }
    }

  const onSubmit = async (values: OtpVerificationSchemaType) => {
    console.log("OTP Verification:", values)
    const credentials = {
        email : globalEmail.email,
        otp : values.otp
    }
    const toastId = toast.loading('Verifying OTP',{
        description : 'Please wait . . . ',
        className : 'info-toast'
    })
    try {
        const res = await verifyOtp(credentials).unwrap();
        toast.success('OTP Verified',{
            id : toastId,
            className : 'success-toast',
            description : `Welcome , ${res.data.username} You're now part of the CodeX swarm.`
        })
        console.log(res);
        login({
            userId : res.data.userId,
            username : res.data.username,
            email : res.data.email,
            role : res.data.role,
            avatar : res.data.avatar
        })
        navigate('/dashboard');
    } catch (error : any) {
        console.log(error);
      toast.error('Error',{
        className : 'error-toast',
        id : toastId,
        description : error?.data?.message
      })
    }
  }

  const otpValue = form.watch("otp")

  return (
    <Card className="bg-gray-900/80 neon-border">
      <CardHeader>
        <CardTitle className="text-center text-white flex items-center justify-center gap-2">
          <Shield className="w-5 h-5 text-orange-500" />
          Verify OTP
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* OTP Field */}
            <FormField
              control={form.control}
              name="otp"
              render={() => (
                <FormItem>
                  <Label className="text-gray-300">Enter 6-digit OTP</Label>
                  <FormControl>
                    <div className="flex gap-2 justify-center">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <Input
                          key={index}
                          ref={(el) => {
                          inputRefs.current[index] = el
                          }}
                          type="text"
                          maxLength={1}
                          className="w-12 h-12 text-center text-lg font-semibold bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                          value={otpValue[index] || ""}
                          onChange={(e) => {
                            const target = e.target as HTMLInputElement
                            const value = target.value.replace(/\D/g, "")
                            if (value.length <= 1) {
                                handleOtpChange(value, index)
                            }
                          }}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 neon-glow">
              Verify OTP
            </Button>

            {/* Timer Countdown */}
            <div className="text-center mt-2 text-sm text-gray-300">
              {canResend ? (
                <span className="text-green-400">You can now resend OTP</span>
              ) : (
                <span>
                  Resend available in{" "}
                  <span className="text-orange-400 font-semibold">{timer}s</span>
                </span>
              )}
            </div>

          </form>
        </Form>
      </CardContent>
            <div className="mt-4 text-center">
        <p className="text-gray-400">
        Didn't got one? {" "}
          <Button
            onClick={handleResendOtp}
            disabled={!canResend}
            className={`ml-2 ${
              canResend
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Resend OTP
          </Button>
        </p>
      </div>
    </Card>
  )
}
