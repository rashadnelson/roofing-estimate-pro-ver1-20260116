import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);

    try {
      const result = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (result?.error) {
        toast.error(result.error.message || "Failed to send reset email");
      } else {
        setIsEmailSent(true);
        setSentToEmail(data.email);
        toast.success("Password reset email sent!");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Success state - email sent
  if (isEmailSent) {
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
              <CardTitle className="text-2xl font-bold text-white">Check your email</CardTitle>
              <CardDescription className="text-white/70">
                We've sent a password reset link to:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#1A1A1A] rounded-lg p-4 text-center border border-white/10">
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-white">
                  <Mail className="h-4 w-4 text-[#C41E3A]" />
                  {sentToEmail}
                </div>
              </div>
              <p className="text-sm text-center text-white/70">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
              <p className="text-sm text-center text-white/70">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setIsEmailSent(false);
                    form.reset();
                  }}
                  className="text-[#C41E3A] hover:underline font-medium"
                >
                  try again
                </button>
              </p>
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

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-white/10 bg-[#242424] text-white shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">Forgot password?</CardTitle>
            <CardDescription className="text-center text-white/70">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Forgot password form">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email" className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          disabled={isLoading}
                          autoComplete="email"
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.email}
                          aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                          className="bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A]"
                        />
                      </FormControl>
                      <FormMessage id="email-error" />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="hero" className="w-full min-h-[48px]" disabled={isLoading} aria-label="Send reset link">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
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

export default ForgotPassword;
