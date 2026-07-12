import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { settingsService, type Settings as OrgSettings } from '../services/settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Organization Settings State
  const [orgSettings, setOrgSettings] = useState<OrgSettings | null>(null);
  const [isOrgLoading, setIsOrgLoading] = useState(false);
  const [isOrgSaving, setIsOrgSaving] = useState(false);

  // Profile Settings State (Mocked)
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  useEffect(() => {
    if (user?.role === 'FleetManager') {
      loadOrgSettings();
    }
  }, [user]);

  const loadOrgSettings = async () => {
    try {
      setIsOrgLoading(true);
      const data = await settingsService.getSettings();
      setOrgSettings(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load organization settings.',
        variant: 'destructive',
      });
    } finally {
      setIsOrgLoading(false);
    }
  };

  const handleOrgSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!orgSettings) return;

    try {
      setIsOrgSaving(true);
      const formData = new FormData(e.currentTarget);
      await settingsService.updateSettings({
        organizationName: formData.get('organizationName') as string,
        timezone: formData.get('timezone') as string,
        currency: formData.get('currency') as string,
      });
      
      toast({
        title: 'Success',
        description: 'Organization settings updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update organization settings.',
        variant: 'destructive',
      });
    } finally {
      setIsOrgSaving(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProfileSaving(true);
    // Mock profile save
    setTimeout(() => {
      setIsProfileSaving(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 p-1 md:p-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {user?.role === 'FleetManager' && (
            <TabsTrigger value="organization">Organization</TabsTrigger>
          )}
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and email address.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name || ''} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue={user?.role || ''} disabled />
                  <p className="text-xs text-muted-foreground">Roles are managed by administrators.</p>
                </div>
                <Button type="submit" disabled={isProfileSaving}>
                  {isProfileSaving ? 'Saving...' : 'Save changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.role === 'FleetManager' && (
          <TabsContent value="organization">
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>
                  Manage global settings for your fleet organization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isOrgLoading ? (
                  <div className="py-4">Loading settings...</div>
                ) : (
                  <form onSubmit={handleOrgSubmit} className="space-y-4 max-w-xl">
                    <div className="grid gap-2">
                      <Label htmlFor="organizationName">Organization Name</Label>
                      <Input 
                        id="organizationName" 
                        name="organizationName"
                        defaultValue={orgSettings?.organizationName} 
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input 
                          id="timezone" 
                          name="timezone"
                          defaultValue={orgSettings?.timezone || 'UTC'} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Input 
                          id="currency" 
                          name="currency"
                          defaultValue={orgSettings?.currency || 'USD'} 
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isOrgSaving}>
                      {isOrgSaving ? 'Saving...' : 'Save organization settings'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how TransitOps looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Theme Preference</Label>
                  <div className="flex gap-4 mt-2">
                    <Button variant="outline" className="border-2 border-primary">System</Button>
                    <Button variant="outline">Light</Button>
                    <Button variant="outline">Dark</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    (Note: The theme toggle is a visual placeholder for this demo).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
