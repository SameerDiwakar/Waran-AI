import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SettingsProfileForm = ({ user, setUser, handleSaveProfile }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleSaveProfile({
      name: user.name,
      email: user.email,
      oldPassword: oldPassword || undefined,
      newPassword: newPassword || undefined,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Full Name</label>
        <Input 
          id="name" 
          type="text" 
          value={user.name} 
          onChange={(e) => setUser({...user, name: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email Address</label>
        <Input 
          id="email" 
          type="email" 
          value={user.email} 
          onChange={(e) => setUser({...user, email: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="oldPassword" className="text-sm font-medium">Current Password</label>
        <Input 
          id="oldPassword" 
          type="password" 
          value={oldPassword} 
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Enter current password to change email or password"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
        <Input 
          id="newPassword" 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Leave blank to keep current password"
        />
      </div>
      <div className="pt-4">
        <Button type="submit" className="bg-brand-purple hover:bg-opacity-90">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default SettingsProfileForm; 