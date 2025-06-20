import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SettingsProfileForm = ({ user, setUser, handleSaveProfile }) => (
  <form onSubmit={handleSaveProfile} className="space-y-4">
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
      <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
      <Input id="phone" type="tel" placeholder="Add a phone number" />
    </div>
    <div className="pt-4">
      <Button type="submit" className="bg-brand-purple hover:bg-opacity-90">
        Save Changes
      </Button>
    </div>
  </form>
);

export default SettingsProfileForm; 