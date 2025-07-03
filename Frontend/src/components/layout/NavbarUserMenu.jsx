import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import { LogOut, Settings, Mail } from "lucide-react";

const NavbarUserMenu = ({ user, handleLogout, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-gray-600">{user.name}</span>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </div>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 rounded-xl border border-brand-purple/20 bg-white shadow-2xl p-1.5 animate-fade-in" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col items-center justify-center space-y-1 text-center">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <span className="flex items-center justify-center gap-2 text-xs leading-none text-brand-purple/80">
              <Mail className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6" />
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-2 group">
            <Settings className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110 text-brand-purple" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 group text-red-600 hover:text-red-700">
          <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarUserMenu; 