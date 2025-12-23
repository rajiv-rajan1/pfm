import { User, Lock, Globe, Bell, Download, Trash2, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';

export function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select defaultValue="india">
                <SelectTrigger id="country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Localization */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <CardTitle>Localization</CardTitle>
          </div>
          <CardDescription>
            Set your currency and date format preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="inr">
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                  <SelectItem value="usd">US Dollar ($)</SelectItem>
                  <SelectItem value="eur">Euro (€)</SelectItem>
                  <SelectItem value="gbp">British Pound (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="locale">Date Format</Label>
              <Select defaultValue="en-IN">
                <SelectTrigger id="locale">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-IN">DD/MM/YYYY (Indian)</SelectItem>
                  <SelectItem value="en-US">MM/DD/YYYY (US)</SelectItem>
                  <SelectItem value="en-GB">DD/MM/YYYY (UK)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button>Save Preferences</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Bill Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about upcoming bills and EMIs
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Goal Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates on your financial goal progress
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Investment Insights</Label>
              <p className="text-sm text-muted-foreground">
                Get AI-powered insights on your investments
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Monthly Reports</Label>
              <p className="text-sm text-muted-foreground">
                Receive monthly P&L and financial summary
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <Switch defaultChecked />
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Change Password</Label>
            <div className="grid grid-cols-1 gap-3">
              <Input type="password" placeholder="Current password" />
              <Input type="password" placeholder="New password" />
              <Input type="password" placeholder="Confirm new password" />
            </div>
            <Button variant="outline" className="mt-2">
              Update Password
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Active Sessions</Label>
            <p className="text-sm text-muted-foreground mb-2">
              You're logged in on 2 devices
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Chrome on Windows</p>
                  <p className="text-xs text-muted-foreground">Last active: 2 minutes ago</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Current
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Safari on iPhone</p>
                  <p className="text-xs text-muted-foreground">Last active: 3 hours ago</p>
                </div>
                <Button variant="outline" size="sm">
                  Revoke
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            <CardTitle>Data Management</CardTitle>
          </div>
          <CardDescription>
            Export or delete your financial data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Export Your Data</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Download all your financial data in CSV or JSON format
            </p>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export as CSV
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export as JSON
              </Button>
            </div>
          </div>
          <Separator />
          <div>
            <Label className="text-red-600">Danger Zone</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Permanently delete your account and all associated data
            </p>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Your Privacy Matters</h4>
              <p className="text-sm text-blue-800">
                Your financial data is encrypted and secure. We never share your information
                with third parties. This is a demo application - please do not enter real
                sensitive financial information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Badge({ variant, className, children }: { variant?: string; className?: string; children: React.ReactNode }) {
  return <span className={className}>{children}</span>;
}
