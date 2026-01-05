import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  User, 
  Bell, 
  Shield, 
  Building2, 
  Users,
  Save,
  Mail,
  Phone,
  Lock,
  Globe,
  Palette
} from 'lucide-react';
import { currentUser } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    emailApprovals: true,
    emailUpdates: true,
    smsUrgent: false,
    inAppAll: true,
  });

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  return (
    <MainLayout 
      title="Settings" 
      subtitle="Manage your account and system preferences"
    >
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="organization" className="gap-2">
            <Building2 className="h-4 w-4" />
            Organization
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Personal Information</h3>
            
            <div className="flex items-start gap-6 mb-6">
              <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-2xl font-bold">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm">Change Photo</Button>
                <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Mitchell" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" defaultValue={currentUser.email} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" defaultValue={currentUser.phone} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" defaultValue={currentUser.designation} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Project Manager" disabled className="bg-muted" />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border flex justify-end">
              <Button variant="accent" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h3>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Email Notifications</h4>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Approval Requests</p>
                    <p className="text-sm text-muted-foreground">Receive emails when requests need your approval</p>
                  </div>
                  <Switch 
                    checked={notifications.emailApprovals}
                    onCheckedChange={(v) => setNotifications({ ...notifications, emailApprovals: v })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Status Updates</p>
                    <p className="text-sm text-muted-foreground">Get notified when your requests are updated</p>
                  </div>
                  <Switch 
                    checked={notifications.emailUpdates}
                    onCheckedChange={(v) => setNotifications({ ...notifications, emailUpdates: v })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">SMS Notifications</h4>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Urgent Requests Only</p>
                    <p className="text-sm text-muted-foreground">SMS alerts for urgent material requests</p>
                  </div>
                  <Switch 
                    checked={notifications.smsUrgent}
                    onCheckedChange={(v) => setNotifications({ ...notifications, smsUrgent: v })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">In-App Notifications</h4>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">All Activity</p>
                    <p className="text-sm text-muted-foreground">Show notifications for all procurement activity</p>
                  </div>
                  <Switch 
                    checked={notifications.inAppAll}
                    onCheckedChange={(v) => setNotifications({ ...notifications, inAppAll: v })}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border flex justify-end">
              <Button variant="accent" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Security Settings</h3>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Change Password
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>

                <Button variant="outline">Update Password</Button>
              </div>

              <div className="pt-6 border-t border-border space-y-4">
                <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>

              <div className="pt-6 border-t border-border space-y-4">
                <h4 className="font-medium text-foreground">Active Sessions</h4>
                <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <Globe className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Current Session</p>
                      <p className="text-xs text-muted-foreground">Chrome on Windows • IP: 192.168.1.1</p>
                    </div>
                  </div>
                  <span className="text-xs text-success">Active now</span>
                </div>
                <Button variant="outline" className="text-destructive">Sign Out All Other Sessions</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Organization Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" defaultValue="BuildCorp Construction" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select defaultValue="construction">
                  <SelectTrigger id="industry">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="realestate">Real Estate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc-5">
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea 
                  id="address" 
                  defaultValue="123 Construction Way, Building District, NY 10001" 
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border flex justify-end">
              <Button variant="accent" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Team Members</h3>
                <p className="text-sm text-muted-foreground">Manage users and their roles</p>
              </div>
              <Button variant="accent">
                <Users className="h-4 w-4 mr-2" />
                Invite User
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'John Mitchell', email: 'john.mitchell@buildcorp.com', role: 'Project Manager' },
                { name: 'Emily Torres', email: 'emily.torres@buildcorp.com', role: 'Procurement Manager' },
                { name: 'Mike Chen', email: 'mike.chen@buildcorp.com', role: 'Site Engineer' },
                { name: 'Sarah Johnson', email: 'sarah.johnson@buildcorp.com', role: 'Foreman' },
              ].map((user) => (
                <div key={user.email} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{user.role}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
