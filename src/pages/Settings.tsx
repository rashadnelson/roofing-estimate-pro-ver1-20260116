import { useState, useEffect, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Settings as SettingsIcon } from "lucide-react";
import LogoUpload from "@/components/settings/LogoUpload";
import { SubscriptionRequired } from "@/components/subscription";
import { fetchSettings, updateSettings, type Settings as SettingsType, type UpdateSettingsInput } from "@/lib/api";
import { toast } from "sonner";

/**
 * Settings content - only rendered when user has active subscription
 */
const SettingsContent = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  // Fetch settings
  const {
    data: settings,
    isLoading: settingsLoading,
    error: settingsError,
  } = useQuery<SettingsType>({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    enabled: !!session?.user,
    retry: 1,
  });

  // Initialize form when settings load
  useEffect(() => {
    if (settings) {
      setCompanyName(settings.companyName || "");
      setLogoFile(null);
      setRemoveLogo(false);
      setHasChanges(false);
      setLogoError(null);
    }
  }, [settings]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (input: UpdateSettingsInput) => updateSettings(input),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(["settings"], updatedSettings);
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setHasChanges(false);
      setLogoFile(null);
      setRemoveLogo(false);
      toast.success("Settings saved successfully");
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to update settings";
      if (errorMessage.includes("Subscription required")) {
        toast.error("An active subscription is required to update settings");
      } else {
        toast.error(errorMessage);
        if (errorMessage.includes("file type") || errorMessage.includes("size")) {
          setLogoError(errorMessage);
        }
      }
    },
  });

  // Track changes
  useEffect(() => {
    if (settings) {
      const nameChanged = companyName !== (settings.companyName || "");
      const logoChanged = logoFile !== null;
      setHasChanges(nameChanged || logoChanged);
    }
  }, [companyName, logoFile, settings]);

  const handleCompanyNameChange = (value: string) => {
    setCompanyName(value);
  };

  const handleLogoSelect = (file: File | null) => {
    setLogoFile(file);
    setLogoError(null);
    
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      const maxSize = 2 * 1024 * 1024; // 2MB
      
      if (!allowedTypes.includes(file.type)) {
        setLogoError("Invalid file type. Allowed types: PNG, JPEG, JPG, WEBP");
        setLogoFile(null);
        return;
      }
      
      if (file.size > maxSize) {
        setLogoError(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`);
        setLogoFile(null);
        return;
      }
    }
  };

  const handleLogoRemove = () => {
    setLogoFile(null);
    setRemoveLogo(true);
    setLogoError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) {
      return;
    }

    const input: UpdateSettingsInput = {};
    
    if (settings) {
      if (companyName !== (settings.companyName || "")) {
        input.companyName = companyName;
      }
      
      if (logoFile !== null) {
        input.companyLogo = logoFile;
      } else if (logoFile === null && settings.companyLogo && !logoFile) {
        input.companyLogo = null;
      }
    }

    await updateMutation.mutateAsync(input);
  };

  const handleCancel = () => {
    if (settings) {
      setCompanyName(settings.companyName || "");
      setLogoFile(null);
      setRemoveLogo(false);
      setHasChanges(false);
      setLogoError(null);
    }
  };

  // Create preview URL for uploaded file
  const logoPreviewUrl = useMemo(() => {
    if (logoFile) {
      return URL.createObjectURL(logoFile);
    }
    return null;
  }, [logoFile]);

  // Cleanup object URL on unmount or when logoFile changes
  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  // Loading state for settings
  if (settingsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center" role="main" aria-label="Settings loading">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" aria-label="Loading settings" />
            <p className="text-sm text-muted-foreground">Loading settings...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (settingsError) {
    const errorMessage = settingsError instanceof Error 
      ? settingsError.message 
      : typeof settingsError === "string"
      ? settingsError
      : "Failed to load settings";
    
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center" role="main" aria-label="Settings error">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Error Loading Settings</CardTitle>
              <CardDescription className="mt-2">
                {errorMessage}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Please check your connection and try again.
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Safety check for settings
  if (!settings) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center" role="main" aria-label="Settings">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Loading Settings</CardTitle>
              <CardDescription>Please wait while we load your settings...</CardDescription>
            </CardHeader>
            <CardContent>
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const currentLogoUrl = logoPreviewUrl
    ? logoPreviewUrl
    : !removeLogo && settings.companyLogo
    ? `${import.meta.env.DEV ? "http://localhost:3001" : ""}${settings.companyLogo}`
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12" role="main" aria-label="Settings">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <SettingsIcon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your company branding and preferences
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Company Branding</CardTitle>
                <CardDescription>
                  Update your company name and logo. These will appear on all your PDF estimates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => handleCompanyNameChange(e.target.value)}
                    placeholder="Enter your company name"
                    maxLength={255}
                    disabled={updateMutation.isPending}
                  />
                  <p className="text-xs text-muted-foreground">
                    This name will appear on all your PDF estimates
                  </p>
                </div>

                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <LogoUpload
                    currentLogoUrl={currentLogoUrl}
                    onFileSelect={handleLogoSelect}
                    onRemove={handleLogoRemove}
                    disabled={updateMutation.isPending}
                    error={logoError}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload your company logo (PNG, JPEG, WEBP up to 2MB). Your logo will appear on all PDF estimates.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={!hasChanges || updateMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!hasChanges || updateMutation.isPending}
                  >
                    {updateMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

/**
 * Settings page - wrapped with subscription access control
 */
const Settings = () => {
  return (
    <SubscriptionRequired featureName="settings">
      <SettingsContent />
    </SubscriptionRequired>
  );
};

export default Settings;
