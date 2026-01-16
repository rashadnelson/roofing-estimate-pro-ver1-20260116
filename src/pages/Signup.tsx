import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authClient, useSession } from "@/lib/auth-client";
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
import { Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  companyName: z.string().min(1, "Company name is required").max(255, "Company name is too long"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const { data: session, isPending: sessionPending } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!sessionPending && session?.user) {
      navigate("/dashboard", { replace: true });
    }
  }, [session, sessionPending, navigate]);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      companyName: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);

    try {
      console.log("Attempting signup with:", {
        email: data.email,
        name: data.companyName,
        companyName: data.companyName,
      });

      const result = await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.companyName, // User's display name (using company name)
          companyName: data.companyName, // Additional field for company name
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: async (ctx) => {
            setIsLoading(false);
            toast.success("Account created successfully!");
            
            // Redirect to Stripe Payment Link with pre-filled email
            const paymentLinkUrl = import.meta.env.VITE_STRIPE_PAYMENT_LINK_URL;
            if (paymentLinkUrl) {
              // Pre-fill the user's email in Stripe checkout for better UX
              const urlWithEmail = `${paymentLinkUrl}?prefilled_email=${encodeURIComponent(data.email)}`;
              window.location.href = urlWithEmail;
            } else {
              // Fallback: redirect to login if payment link not configured
              toast.warning("Payment link not configured. Redirecting to login...");
              navigate("/login");
            }
          },
          onError: (ctx) => {
            setIsLoading(false);
            console.error("Signup error:", ctx.error);
            
            // Extract error message from Better-Auth error response
            let errorMessage = "Failed to create account. Please try again.";
            
            if (ctx.error) {
              // Better-Auth error structure
              if (ctx.error.message) {
                errorMessage = ctx.error.message;
              } else if (typeof ctx.error === "string") {
                errorMessage = ctx.error;
              } else if (ctx.error.cause) {
                errorMessage = String(ctx.error.cause);
              }
            }
            
            toast.error(errorMessage);
            
            // Handle specific error cases
            const lowerMessage = errorMessage.toLowerCase();
            if (lowerMessage.includes("already exists") || 
                lowerMessage.includes("email") || 
                lowerMessage.includes("duplicate") ||
                lowerMessage.includes("422")) {
              form.setError("email", {
                type: "manual",
                message: "An account with this email already exists",
              });
            } else if (lowerMessage.includes("password")) {
              form.setError("password", {
                type: "manual",
                message: errorMessage,
              });
            }
          },
        }
      );

      // Handle result if callbacks don't fire
      if (result?.data) {
        setIsLoading(false);
        toast.success("Account created successfully!");
        const paymentLinkUrl = import.meta.env.VITE_STRIPE_PAYMENT_LINK_URL;
        if (paymentLinkUrl) {
          // Pre-fill the user's email in Stripe checkout
          const urlWithEmail = `${paymentLinkUrl}?prefilled_email=${encodeURIComponent(data.email)}`;
          window.location.href = urlWithEmail;
        } else {
          navigate("/login");
        }
      } else if (result?.error) {
        setIsLoading(false);
        toast.error(result.error.message || "Failed to create account");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Signup catch error:", error);
      
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
        // Check if it's a network error
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          errorMessage = "Unable to connect to server. Please ensure the backend server is running.";
        }
      }
      
      toast.error(errorMessage);
    }
  };

  // Show loading state while checking session
  if (sessionPending) {
    return (
      <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#C41E3A]" />
        </main>
        <Footer />
      </div>
    );
  }

  // Don't render form if user is authenticated (will redirect)
  if (session?.user) {
    return null;
  }

  return (
    <>
      <SEO 
        title="Sign Up - PlumbPro Estimate"
        description="Create your free PlumbPro Estimate account. Start generating professional plumbing estimates in under 60 seconds."
        canonical="https://plumbproestimate.dev/signup"
      />
      <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-white/10 bg-[#242424] text-white shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-white">Create your account</CardTitle>
              <CardDescription className="text-center text-white/70">
                Sign up to start creating professional estimates
              </CardDescription>
            </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Sign up form">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="companyName" className="text-white">Company Name</FormLabel>
                      <FormControl>
                        <Input
                          id="companyName"
                          placeholder="Your Plumbing Company"
                          {...field}
                          disabled={isLoading}
                          autoComplete="organization"
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.companyName}
                          aria-describedby={form.formState.errors.companyName ? "companyName-error" : undefined}
                          className="bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A]"
                        />
                      </FormControl>
                      <FormMessage id="companyName-error" />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password" className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a strong password"
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
                <Button type="submit" variant="hero" className="w-full min-h-[48px]" disabled={isLoading} aria-label="Sign up">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Creating account...
                    </>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-white/70">
              Already have an account?{" "}
              <Link to="/login" className="text-[#C41E3A] hover:underline font-medium">
                Sign in
              </Link>
            </div>
            <p className="text-xs text-center text-white/50">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="text-[#C41E3A] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-[#C41E3A] hover:underline">
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default Signup;
