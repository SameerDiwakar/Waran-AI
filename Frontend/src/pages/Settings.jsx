import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setUser({
          ...data,
          emailNotifications: true,
          theme: 'light',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleEmailNotificationToggle = () => {
    setUser(prev => ({
      ...prev,
      emailNotifications: !prev.emailNotifications
    }));
    toast.success(`Email notifications ${user.emailNotifications ? 'disabled' : 'enabled'}`);
  };

  const handleSaveProfile = async (formData) => {
    const { name, email, oldPassword, newPassword } = formData;
    // Require old password if changing email or password
    if ((email !== user.email || newPassword) && !oldPassword) {
      toast.error('Please enter your current password to change email or password');
      return;
    }
    try {
      const res = await axios.put('/profile', {
        name,
        email,
        oldPassword,
        newPassword,
      }, { withCredentials: true });
      if (res.data && res.data.success) {
        toast.success('Profile updated successfully');
        setUser({ ...user, name, email });
      } else {
        toast.error(res.data.message || 'Failed to update profile');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const res = await fetch('http://localhost:4000/account', {
          method: 'DELETE',
          credentials: 'include',
        });
        if (res.ok) {
          toast.success('Account deleted');
          window.location.href = '/';
        } else {
          toast.error('Failed to delete account');
        }
      } catch (e) {
        toast.error('Failed to delete account');
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <div className="text-center mt-10">User not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <SettingsHeader user={user} />
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
                {/* Profile Completion Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-brand-purple">Profile Completion</span>
                    <span className="text-xs text-gray-500">{(() => {
                      let filled = 0;
                      if (user.name) filled++;
                      if (user.email) filled++;
                      // Add more fields if needed
                      return Math.round((filled / 2) * 100);
                    })()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-brand-teal h-2.5 rounded-full transition-all duration-500" style={{ width: `${(() => {
                      let filled = 0;
                      if (user.name) filled++;
                      if (user.email) filled++;
                      return Math.round((filled / 2) * 100);
                    })()}%` }}></div>
                  </div>
                </div>
                <SettingsProfileForm user={user} setUser={setUser} handleSaveProfile={handleSaveProfile} />
                <div className="flex items-center justify-between mt-8 p-4 border rounded bg-gray-50">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={user.emailNotifications} 
                    onCheckedChange={handleEmailNotificationToggle}
                  />
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

            {/* Fun Fact / AI Tip Card */}
            <div className="rounded-2xl bg-gradient-to-r from-brand-teal via-brand-purple to-brand-navy p-6 shadow-lg flex items-center gap-4 animate-pulse-subtle">
              <div className="bg-white rounded-full p-3 shadow-md border-2 border-brand-teal">
                <svg width="32" height="32" fill="none" viewBox="0 0 56 56"><circle cx="28" cy="28" r="28" fill="#6942EF"/><rect x="16" y="20" width="24" height="16" rx="8" fill="#fff"/><circle cx="22" cy="28" r="2" fill="#6942EF"/><circle cx="34" cy="28" r="2" fill="#6942EF"/><rect x="24" y="34" width="8" height="2" rx="1" fill="#6942EF"/></svg>
              </div>
              <div>
                <div className="text-white font-semibold text-lg mb-1">AI Tip</div>
                <div className="text-white/90 text-sm max-w-md">Did you know? Keeping your warranty info organized can save you hours and money. WaranAI will remind you before your warranty expires—never miss a claim again!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
