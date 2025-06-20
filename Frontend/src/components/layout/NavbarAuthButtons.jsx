import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const NavbarAuthButtons = ({ isMobile = false }) => (
  <>
    <Link to="/login" className={isMobile ? 'block' : ''}>
      <Button variant="outline" className={`${isMobile ? 'w-full' : 'border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white'}`}>Login</Button>
    </Link>
    <Link to="/register" className={isMobile ? 'block' : ''}>
      <Button className={`${isMobile ? 'w-full' : 'bg-brand-purple text-white hover:bg-opacity-90'}`}>Sign Up</Button>
    </Link>
  </>
);

export default NavbarAuthButtons; 