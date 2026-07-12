import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { api } from "../services/api";
import { Loader2, Sun, Moon, Building2, Globe, DollarSign, User, Mail, Shield } from "lucide-react";

interface OrgSettings {
  id: number;
  organizationName: string;
  timezone: string;
  currency: string;
}

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const [settings, setSettings] = useState<OrgSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [orgName, setOrgName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [currency, setCurrency] = useState("");

  // Profile name state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data.success && res.data.data) {
          const s = res.data.data as OrgSettings;
          setSettings(s);
          setOrgName(s.organizationName);
          setTimezone(s.timezone);
          setCurrency(s.currency);
        }
      } catch {
        // Settings might not exist yet, that's okay
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveName = async () => {
    if (!profileName.trim()) return;
    setIsSavingName(true);
    try {
      const res = await api.put("/auth/profile", {
        name: profileName.trim(),
      });
      if (res.data.success) {
        updateUser({ name: res.data.data.name });
        toast({ title: "Profile updated", description: "Your name has been updated successfully." });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.put("/settings", {
        organizationName: orgName,
        timezone,
        currency,
      });
      if (res.data.success) {
        setSettings(res.data.data);
        toast({ title: "Settings saved", description: "Organization settings updated successfully." });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    settings &&
    (orgName !== settings.organizationName ||
      timezone !== settings.timezone ||
      currency !== settings.currency);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Info Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="profileName" className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Name
              </label>
              <Input
                id="profileName"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email
              </label>
              <div className="flex h-10 w-full items-center rounded-md border bg-muted/30 px-3 py-2 text-sm">
                {user?.email || "N/A"}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Role
              </label>
              <div className="flex h-10 w-full items-center rounded-md border bg-muted/30 px-3 py-2 text-sm">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {user?.role || "No role assigned"}
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSaveName}
                disabled={isSavingName || profileName === (user?.name || "")}
                size="sm"
              >
                {isSavingName && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Name
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Theme</div>
                <div className="text-xs text-muted-foreground">
                  Switch between light and dark mode
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={toggleTheme} className="gap-2">
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" />
                    Light
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    Dark
                  </>
                )}
              </Button>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium mb-2">Preview</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-background border p-3 text-xs">
                  <div className="font-medium text-foreground">Background</div>
                  <div className="text-muted-foreground">Text color</div>
                </div>
                <div className="rounded-md bg-primary p-3 text-xs text-primary-foreground">
                  <div className="font-medium">Primary</div>
                  <div className="opacity-80">Accent color</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Settings Card */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Organization Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <label htmlFor="orgName" className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> Organization Name
                </label>
                <Input
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="My Organization"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="timezone" className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> Timezone
                </label>
                <Input
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="UTC"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="currency" className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" /> Currency
                </label>
                <Input
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  placeholder="USD"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
