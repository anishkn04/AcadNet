import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Shield, User, Bell, Key, Users } from "lucide-react";
import JoinByCodeDialog from '@/components/own_components/JoinByCodeDialog';

const Settings = () => {
  const navigate = useNavigate();
  const [showJoinByCodeDialog, setShowJoinByCodeDialog] = useState(false);

  const handlePasswordReset = () => {
    navigate('/forgot');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col gap-1 pb-6">
          <h1 className="text-slate-900 text-4xl font-bold leading-tight">Settings</h1>
          <p className="text-slate-600 text-lg">Manage your account settings and preferences</p>
        </div>
      </header>

      <div className="grid gap-8">
        {/* Account Settings */}
        <section>
          <h3 className="text-slate-800 text-xl font-semibold leading-tight tracking-tight mb-4">Account Settings</h3>
          <div className="bg-white shadow rounded-xl border border-slate-200 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Key className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-medium">Password Reset</h4>
                    <p className="text-slate-500 text-sm">Reset your account password</p>
                  </div>
                </div>
                <Button 
                  onClick={handlePasswordReset}
                  variant="outline"
                  className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                >
                  Reset Password
                </Button>
              </div>
              
              <div className="border-t border-slate-200"></div>
              
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-medium">Join by Code</h4>
                    <p className="text-slate-500 text-sm">Join a study group using an invite code</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowJoinByCodeDialog(true)}
                  variant="outline"
                  className="hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                >
                  Join Group
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Security */}
        <section>
          <h3 className="text-slate-800 text-xl font-semibold leading-tight tracking-tight mb-4">Privacy & Security</h3>
          <div className="bg-white shadow rounded-xl border border-slate-200 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-medium">Privacy Settings</h4>
                    <p className="text-slate-500 text-sm">Manage your privacy and data settings</p>
                  </div>
                </div>
                <Button variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
              
              <div className="border-t border-slate-200"></div>
              
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-medium">Notification Settings</h4>
                    <p className="text-slate-500 text-sm">Configure your notification preferences</p>
                  </div>
                </div>
                <Button variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Settings */}
        <section>
          <h3 className="text-slate-800 text-xl font-semibold leading-tight tracking-tight mb-4">Profile Settings</h3>
          <div className="bg-white shadow rounded-xl border border-slate-200 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <User className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-medium">Edit Profile</h4>
                    <p className="text-slate-500 text-sm">Update your personal information and preferences</p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/user')}
                  variant="outline"
                  className="hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <JoinByCodeDialog 
        isOpen={showJoinByCodeDialog} 
        onClose={() => setShowJoinByCodeDialog(false)} 
      />
    </div>
  );
};

export default Settings;
