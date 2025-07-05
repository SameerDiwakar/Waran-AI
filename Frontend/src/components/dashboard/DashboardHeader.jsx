import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, Mail } from "lucide-react";

const DashboardHeader = ({ user, setShowUploader, handleLogout }) => (
  <header className="bg-white shadow-sm">
    <div className="waranai-container py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-brand-purple text-white p-1 rounded">
          <span className="font-bold text-xl">W</span>
        </div>
        <span className="text-xl font-bold text-brand-navy">WaranAI</span>
      </Link>
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white transition-transform duration-200 active:scale-95 hover:scale-105 shadow-md"
          onClick={() => setShowUploader(true)}
        >
          Upload Warranty
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-brand-purple/10 transition-all duration-300">
              <Avatar className="h-10 w-10 border-2 border-brand-purple/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-gradient-to-br from-brand-purple/10 to-brand-navy/10">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-brand-purple to-brand-navy text-white font-bold">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 rounded-2xl border border-gray-200/50 bg-white/95 backdrop-blur-md shadow-2xl p-3 animate-in fade-in-0 zoom-in-95 duration-200" align="end">
            <div className="flex flex-col items-center justify-center space-y-3 text-center p-4 bg-gradient-to-br from-brand-purple/5 to-brand-navy/5 rounded-xl">
              <Avatar className="h-16 w-16 border-3 border-brand-purple/40 shadow-lg">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-brand-purple to-brand-navy text-white font-bold text-lg">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-gray-900 leading-none">{user?.name || 'User'}</p>
                <span className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {user?.email || 'user@example.com'}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem asChild className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
              <Link to="/settings" className="flex items-center gap-3 w-full">
                <div className="p-2 bg-brand-purple/10 rounded-lg group-hover:bg-brand-purple/20 transition-colors">
                  <Settings className="h-4 w-4 text-brand-purple" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">Settings</span>
                  <span className="text-xs text-gray-500">Manage your account</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors cursor-pointer group text-red-600 hover:text-red-700">
              <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <LogOut className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Logout</span>
                <span className="text-xs text-red-500">Sign out of your account</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
);

export default DashboardHeader; 