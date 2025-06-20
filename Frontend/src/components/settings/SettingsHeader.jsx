import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const SettingsHeader = () => (
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
          asChild
        >
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  </header>
);

export default SettingsHeader; 