import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import Index from "./pages/Index";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Success from "./pages/Success";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import EstimateGuide from "./pages/blog/EstimateGuide";
import PricingGuide from "./pages/blog/PricingGuide";
import TemplateComparison from "./pages/blog/TemplateComparison";

const queryClient = new QueryClient();

// Component to handle API routes - makes actual API call via fetch (goes through Vite proxy)
const ApiRouteHandler = () => {
  const location = useLocation();
  const [response, setResponse] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  useEffect(() => {
    // For API routes accessed via navigation, make fetch request
    // This goes through Vite proxy correctly
    const makeRequest = async () => {
      try {
        setLoading(true);
        const res = await fetch(location.pathname, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        setResponse(data);
        
        // For test endpoint, automatically redirect to dashboard after success
        if (location.pathname.includes('activate-subscription') && data.message) {
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    makeRequest();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Processing...</h1>
          <p className="text-muted-foreground">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-destructive">Error</h1>
          <p className="mb-4 text-muted-foreground">{error}</p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  // Success response
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-green-600">Success!</h1>
        <p className="mb-4 text-muted-foreground">
          {location.pathname.includes('activate-subscription') 
            ? 'Subscription activated successfully!' 
            : 'Request completed successfully'}
        </p>
        {response && (
          <pre className="mb-4 text-left bg-background p-4 rounded border text-sm overflow-auto max-w-md">
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
        <a href="/dashboard" className="text-primary underline hover:text-primary/90">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/success" element={<Success />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/estimate-guide" element={<EstimateGuide />} />
          <Route path="/blog/pricing-guide" element={<PricingGuide />} />
          <Route path="/blog/template-comparison" element={<TemplateComparison />} />
          {/* Handle API routes separately - allows Vite proxy to work */}
          <Route path="/api/*" element={<ApiRouteHandler />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
