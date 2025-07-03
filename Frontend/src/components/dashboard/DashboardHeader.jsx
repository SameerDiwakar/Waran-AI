import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
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
          className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
          onClick={() => setShowUploader(true)}
        >
          Upload Warranty
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <div className="h-10 w-10 rounded-full bg-brand-purple/10 flex items-center justify-center">
                <span className="text-brand-purple font-semibold py-3 px-4">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 rounded-xl border border-brand-purple/20 bg-white shadow-2xl p-1.5 animate-fade-in" align="end">
            <div className="flex items-center justify-center gap-2 p-2">
              <div className="flex flex-col items-center justify-center space-y-1 text-center leading-none">
                <p className="font-medium">{user?.name || 'User'}</p>
                <span className="flex items-center justify-center gap-2 text-sm text-brand-purple/80">
                  <Mail className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6" />
                  {user?.email || 'user@example.com'}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2 group">
                <Settings className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110 text-brand-purple" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 group text-red-600 hover:text-red-700">
              <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
);

export default DashboardHeader; 