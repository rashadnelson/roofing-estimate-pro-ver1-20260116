import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { data: session, isPending: sessionPending } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!sessionPending && session?.user) {
      navigate("/dashboard", { replace: true });
    }
  }, [session, sessionPending, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const result = await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: async (ctx) => {
            setIsLoading(false);
            toast.success("Welcome back!");
            
            // Redirect to dashboard (will be created in Task #10)
            navigate("/dashboard");
          },
          onError: (ctx) => {
            setIsLoading(false);
            const errorMessage = ctx.error?.message || "Invalid email or password. Please try again.";
            toast.error(errorMessage);
            
            // Handle specific error cases
            if (ctx.error?.message?.includes("Invalid") || ctx.error?.message?.includes("password")) {
              form.setError("password", {
                type: "manual",
                message: "Invalid email or password",
              });
            }
          },
        }
      );

      // Handle result if callbacks don't fire
      if (result?.data) {
        setIsLoading(false);
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else if (result?.error) {
        setIsLoading(false);
        toast.error(result.error.message || "Invalid email or password");
        form.setError("password", {
          type: "manual",
          message: "Invalid email or password",
        });
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
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
        title="Login - PlumbPro Estimate"
        description="Log in to your PlumbPro Estimate account to create and manage professional plumbing estimates."
        canonical="https://plumbproestimate.dev/login"
      />
      <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-white/10 bg-[#242424] text-white shadow-xl">
            <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">Welcome back</CardTitle>
            <CardDescription className="text-center text-white/70">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Sign in form">
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
                      <div className="flex items-center justify-between">
                        <FormLabel htmlFor="password" className="text-white">Password</FormLabel>
                        <Link
                          to="/forgot-password"
                          className="text-xs text-[#C41E3A] hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          disabled={isLoading}
                          autoComplete="current-password"
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.password}
                          aria-describedby={form.formState.errors.password ? "password-error" : undefined}
                          className="bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A]"
                        />
                      </FormControl>
                      <FormMessage id="password-error" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-white/20 data-[state=checked]:bg-[#C41E3A] data-[state=checked]:border-[#C41E3A]"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-white/80 cursor-pointer">
                          Remember me
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="hero" className="w-full min-h-[48px]" disabled={isLoading} aria-label="Sign in">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-white/70">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#C41E3A] hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default Login;
