import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { authService } from "../../services/auth";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const resetSchema = z
  .object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    password: z.string().regex(passwordRegex, {
      message:
        "Password must be 8+ characters, include uppercase, lowercase, number, and special character",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const email = location.state?.email;

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: "", password: "", confirmPassword: "" },
  });

  const passwordValue = form.watch("password");
  const getStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length > 7) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd) && /[@$!%*?&]/.test(pwd)) strength += 25;
    return strength;
  };
  const strength = getStrength(passwordValue || "");

  if (!email) {
    navigate("/forgot-password", { replace: true });
    return null;
  }

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    setIsLoading(true);
    try {
      const response = await authService.resetPassword({
        email,
        otp: values.otp,
        newPassword: values.password,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Your password has been reset successfully. Please login.",
        });
        navigate("/login");
      } else {
        toast({
          variant: "destructive",
          title: "Reset Failed",
          description: response.message || "An error occurred.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Reset failed.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm"
      >
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-primary">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email and your new password
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>6-Digit Code</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  {passwordValue.length > 0 && (
                    <div className="mt-2 flex gap-1 h-1.5">
                      <div className={`flex-1 rounded-full ${strength >= 25 ? 'bg-red-500' : 'bg-muted'}`} />
                      <div className={`flex-1 rounded-full ${strength >= 50 ? 'bg-orange-500' : 'bg-muted'}`} />
                      <div className={`flex-1 rounded-full ${strength >= 75 ? 'bg-yellow-500' : 'bg-muted'}`} />
                      <div className={`flex-1 rounded-full ${strength >= 100 ? 'bg-green-500' : 'bg-muted'}`} />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
