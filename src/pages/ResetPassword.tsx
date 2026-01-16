import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidToken, setIsInvalidToken] = useState(false);

  const token = searchParams.get("token");
  const error = searchParams.get("error");

  // Check for error in URL (invalid or expired token)
  useEffect(() => {
    if (error === "INVALID_TOKEN") {
      setIsInvalidToken(true);
    }
  }, [error]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: data.password,
        token: token,
      });

      if (result?.error) {
        toast.error(result.error.message || "Failed to reset password");
      } else {
        setIsSuccess(true);
        toast.success("Password reset successfully!");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Invalid or expired token state
  if (isInvalidToken || (!token && !isSuccess)) {
    return (
      <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-white/10 bg-[#242424] text-white shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-red-500/20 p-3">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">Invalid or expired link</CardTitle>
              <CardDescription className="text-white/70">
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-center text-white/70">
                Password reset links expire after 1 hour for security reasons.
                Please request a new link.
              </p>
              <Button asChild variant="hero" className="w-full min-h-[48px]">
                <Link to="/forgot-password">Request new reset link</Link>
              </Button>
            </CardContent>
            <CardFooter>
              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center gap-2 text-sm text-white/70 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Success state - password reset
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-white/10 bg-[#242424] text-white shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-500/20 p-3">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">Password reset!</CardTitle>
              <CardDescription className="text-white/70">
                Your password has been successfully reset.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-center text-white/70">
                You can now sign in with your new password.
              </p>
              <Button asChild variant="hero" className="w-full min-h-[48px]">
                <Link to="/login">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-white/10 bg-[#242424] text-white shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">Reset your password</CardTitle>
            <CardDescription className="text-center text-white/70">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Reset password form">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password" className="text-white">New Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter new password"
                          {...field}
                          disabled={isLoading}
                          autoComplete="new-password"
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.password}
                          aria-describedby={form.formState.errors.password ? "password-error password-help" : "password-help"}
                          className="bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A]"
                        />
                      </FormControl>
                      <FormMessage id="password-error" />
                      <p id="password-help" className="text-xs text-white/50 mt-1">
                        Must be at least 8 characters with uppercase, lowercase, and a number
                      </p>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPassword" className="text-white">Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          {...field}
                          disabled={isLoading}
                          autoComplete="new-password"
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.confirmPassword}
                          aria-describedby={form.formState.errors.confirmPassword ? "confirmPassword-error" : undefined}
                          className="bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A]"
                        />
                      </FormControl>
                      <FormMessage id="confirmPassword-error" />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="hero" className="w-full min-h-[48px]" disabled={isLoading} aria-label="Reset password">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Resetting...
                    </>
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center gap-2 text-sm text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
