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
import axios from 'axios';
import SettingsSkeleton from '../components/settings/SettingsSkeleton';
import { useUser } from '../UserContext';

const Settings = () => {
  const { user, setUser, ready } = useUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [resetPasswords, setResetPasswords] = useState(false); // NEW

  // If user context is not ready, show skeleton
  if (!ready) return <SettingsSkeleton />;
  if (!user) return <div className="text-center mt-10">User not found.</div>;

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
        setResetPasswords(true); // RESET PASSWORD FIELDS
      } else {
        toast.error(res.data.message || 'Failed to update profile');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
    setDeletePassword("");
  };

  const confirmDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password to confirm deletion');
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch('https://waran-ai.onrender.com/account', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword })
      });
      if (res.ok) {
        toast.success('Account deleted');
        setUser(null); // Clear user context
        window.location.href = '/';
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete account');
      }
    } catch (e) {
      toast.error('Failed to delete account');
    }
    setDeleting(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SettingsHeader user={user} />
      <div className="waranai-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content first for mobile */}
          <div className="lg:col-span-2 space-y-6 lg:order-2">
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
                <SettingsProfileForm user={user} setUser={setUser} handleSaveProfile={handleSaveProfile} resetPasswords={resetPasswords} setResetPasswords={setResetPasswords} />
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
                  {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-2">Confirm Account Deletion</h3>
                        <p className="text-sm mb-4">Please enter your password to confirm account deletion. This action cannot be undone.</p>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          value={deletePassword}
                          onChange={e => setDeletePassword(e.target.value)}
                          className="mb-4"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={deleting}>Cancel</Button>
                          <Button variant="destructive" onClick={confirmDeleteAccount} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
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
          {/* Sidebar second for mobile, first for desktop */}
          <div className="lg:order-1">
            <SettingsSidebar user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
