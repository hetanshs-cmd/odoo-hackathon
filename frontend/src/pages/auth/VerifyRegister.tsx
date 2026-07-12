import { useState, useRef } from "react";
import type { KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import { authService } from "../../services/auth";
import { Button } from "../../components/ui/button";
import { Loader2 } from "lucide-react";

export default function VerifyRegister() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const email = location.state?.email;

  if (!email) {
    navigate("/register", { replace: true });
    return null;
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError(false);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pastedData.some(char => !/^\d$/.test(char))) return;

    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyEmail({ email, otp: otpString });
      
      if (response.success) {
        toast({
          title: "Account verified!",
          description: "Your registration is pending admin approval.",
        });
        navigate("/login");
      } else {
        setError(true);
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: response.message || "Invalid code.",
        });
      }
    } catch (err: any) {
      setError(true);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Invalid OTP code.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={error ? { x: [-10, 10, -10, 10, 0] } : { opacity: 1, scale: 1 }}
        transition={error ? { duration: 0.4 } : { duration: 0.3 }}
        className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm text-center"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-primary mb-2">
          Verify Email
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>
        </p>

        <div className="flex justify-center gap-2 mb-8" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className={`w-12 h-14 text-center text-2xl rounded-md border ${error ? 'border-destructive focus-visible:ring-destructive' : 'border-input focus-visible:ring-primary'} focus-visible:outline-none focus-visible:ring-2`}
            />
          ))}
        </div>

        <Button 
          onClick={handleVerify} 
          className="w-full mb-4" 
          disabled={isLoading || otp.join("").length !== 6}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify Email
        </Button>
      </motion.div>
    </div>
  );
}
