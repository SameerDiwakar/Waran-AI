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
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
);

export default DashboardHeader; 