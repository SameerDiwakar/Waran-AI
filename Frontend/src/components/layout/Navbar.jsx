
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="waranai-container">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-brand-purple text-white p-1 rounded">
                <span className="font-bold text-xl">W</span>
              </div>
              <span className="text-xl font-bold text-brand-navy">WaranAI</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/features" className="text-gray-600 hover:text-brand-purple transition-colors">Features</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-brand-purple transition-colors">Pricing</Link>
            <Link to="/about" className="text-gray-600 hover:text-brand-purple transition-colors">About</Link>
            <Link to="/login">
              <Button variant="outline" className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-brand-purple text-white hover:bg-opacity-90">
                Sign Up
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-brand-purple focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link to="/features" className="block py-2 text-gray-600 hover:text-brand-purple">Features</Link>
            <Link to="/pricing" className="block py-2 text-gray-600 hover:text-brand-purple">Pricing</Link>
            <Link to="/about" className="block py-2 text-gray-600 hover:text-brand-purple">About</Link>
            <div className="mt-4 space-y-2">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="block">
                <Button className="w-full bg-brand-purple text-white hover:bg-opacity-90">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
