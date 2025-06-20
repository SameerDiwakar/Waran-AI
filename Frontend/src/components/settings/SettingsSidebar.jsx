import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SettingsSidebar = ({ user }) => (
  <div className="lg:col-span-1">
    <div className="card">
      <div className="p-6">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-brand-purple text-xl text-white">{user.name?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="font-medium text-lg">{user.name}</h3>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start font-normal">Profile</Button>
          <Button variant="ghost" className="w-full justify-start font-normal">Notifications</Button>
          <Button variant="ghost" className="w-full justify-start font-normal">Security</Button>
          <Button variant="ghost" className="w-full justify-start font-normal">Preferences</Button>
          <Button variant="ghost" className="w-full justify-start font-normal text-red-500 hover:text-red-600 hover:bg-red-50">Logout</Button>
        </nav>
      </div>
    </div>
  </div>
);

export default SettingsSidebar; 