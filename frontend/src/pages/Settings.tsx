import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, User, Bell, Key } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  const handlePasswordReset = () => {
    navigate('/forgot');
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account information and security settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">
                  Reset your account password for security.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePasswordReset}
                className="flex items-center gap-2"
              >
                <Key className="h-4 w-4" />
                Reset Password
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Account Security</h3>
                <p className="text-sm text-muted-foreground">
                  Additional security settings will be available soon.
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                <Shield className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Notification preferences will be available soon.
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
