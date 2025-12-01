import React, { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"

type OtpInputProps = {
  length?: number
  value: string
  onChange: (otp: string) => void
  onResendOtp: () => Promise<void>
  formReset: () => void
}

export default function OtpInput({
  length = 6,
  value,
  onChange,
  onResendOtp,
  formReset,
}: OtpInputProps) {
  const [timer, setTimer] = useState(120); // 120 seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

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
    setTimer(120);
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

  const handleOtpChange = (val: string, index: number) => {
    const otpArray = value.split("")
    otpArray[index] = val
    const newOtp = otpArray.join("")
    onChange(newOtp)

    // Auto-focus next input if value entered
    if (val && index < length - 1) {
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

  const handleResendOtp = async () => {
    await onResendOtp()
    formReset();
    restartTimer();
  }


  return (
    <div>
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="w-12 h-12 text-center text-lg font-semibold bg-gray-800 border-gray-800 text-white placeholder-gray-400 focus:border-orange-500"
            value={value[index] || ""}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D/g, "")
              if (onlyDigits.length <= 1) {
                handleOtpChange(onlyDigits, index)
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-col items-center gap-2">
        <p className="text-gray-400">Didn't get one?</p>

        <div className="flex items-center gap-3 text-sm text-gray-300">
          {canResend ? (
            <span className="text-green-400">You can now resend OTP</span>
          ) : (
            <span>
              Resend available in{" "}
              <span className="text-orange-400 font-semibold">
                {String(Math.floor(timer / 60)).padStart(2, "0")}:
                {String(timer % 60).padStart(2, "0")}
              </span>
            </span>
          )}

          <Button
            onClick={handleResendOtp}
            disabled={!canResend}
            className={`${canResend
              ? "bg-orange-600 hover:bg-orange-700"
              : "bg-gray-600 cursor-not-allowed"
              }`}
          >
            Resend OTP
          </Button>
        </div>
      </div>
    </div>
  )
}
