import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SettingsProfileForm = ({ user, setUser, handleSaveProfile, resetPasswords, setResetPasswords }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (resetPasswords) {
      setOldPassword('');
      setNewPassword('');
      setResetPasswords(false);
    }
  }, [resetPasswords, setResetPasswords]);

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
        <div className="relative">
          <Input
            id="oldPassword"
            type={showOldPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter current password to change email or password"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            tabIndex={-1}
            onClick={() => setShowOldPassword((v) => !v)}
            aria-label={showOldPassword ? "Hide password" : "Show password"}
          >
            {showOldPassword ? (
              // Eye-off SVG
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0012 15a3 3 0 002.121-5.121M9.88 9.88A3 3 0 0112 9a3 3 0 013 3c0 .512-.13.995-.357 1.414M15.53 15.53A7.963 7.963 0 0112 17c-4.418 0-8-4-8-4a15.978 15.978 0 013.284-3.284m3.284-1.716A7.963 7.963 0 0112 7c4.418 0 8 4 8 4a15.978 15.978 0 01-3.284 3.284" />
              </svg>
            ) : (
              // Eye SVG
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            tabIndex={-1}
            onClick={() => setShowNewPassword((v) => !v)}
            aria-label={showNewPassword ? "Hide password" : "Show password"}
          >
            {showNewPassword ? (
              // Eye-off SVG
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0012 15a3 3 0 002.121-5.121M9.88 9.88A3 3 0 0112 9a3 3 0 013 3c0 .512-.13.995-.357 1.414M15.53 15.53A7.963 7.963 0 0112 17c-4.418 0-8-4-8-4a15.978 15.978 0 013.284-3.284m3.284-1.716A7.963 7.963 0 0112 7c4.418 0 8 4 8 4a15.978 15.978 0 01-3.284 3.284" />
              </svg>
            ) : (
              // Eye SVG
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
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