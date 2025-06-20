import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import SettingsHeader from '../components/settings/SettingsHeader';
import SettingsSidebar from '../components/settings/SettingsSidebar';
import SettingsProfileForm from '../components/settings/SettingsProfileForm';

const Settings = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    notifications: {
      email: true,
      push: true,
      sms: false,
      warrantyExpiry: true,
      warrantyReminder: true,
      productRecalls: true
    },
    theme: 'light'
  });

  const handleNotificationChange = (key) => {
    setUser(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
    toast.success(`${key} notifications ${user.notifications[key] ? 'disabled' : 'enabled'}`);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.success('Account deleted');
      // In a real app, this would redirect to home after account deletion
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SettingsHeader />
      <div className="waranai-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SettingsSidebar user={user} />
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsProfileForm user={user} setUser={setUser} handleSaveProfile={handleSaveProfile} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={user.notifications.email} 
                      onCheckedChange={() => handleNotificationChange('email')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                    </div>
                    <Switch 
                      checked={user.notifications.push} 
                      onCheckedChange={() => handleNotificationChange('push')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-gray-500">Receive text message alerts</p>
                    </div>
                    <Switch 
                      checked={user.notifications.sms}
                      onCheckedChange={() => handleNotificationChange('sms')}
                    />
                  </div>
                  
                  <div className="pt-2 border-t">
                    <h4 className="font-medium mt-4 mb-3">Alert Preferences</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Warranty expiration alerts</span>
                        <Switch 
                          checked={user.notifications.warrantyExpiry}
                          onCheckedChange={() => handleNotificationChange('warrantyExpiry')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Warranty renewal reminders</span>
                        <Switch 
                          checked={user.notifications.warrantyReminder}
                          onCheckedChange={() => handleNotificationChange('warrantyReminder')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Product recall notifications</span>
                        <Switch 
                          checked={user.notifications.productRecalls}
                          onCheckedChange={() => handleNotificationChange('productRecalls')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-red-200 rounded-md p-4 bg-red-50">
                  <h4 className="text-red-600 font-medium mb-2">Delete Account</h4>
                  <p className="text-sm text-red-500 mb-4">
                    Once you delete your account, there is no going back. This action is permanent.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
