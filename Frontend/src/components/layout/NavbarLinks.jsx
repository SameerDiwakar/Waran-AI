import React from 'react';
import { Link } from 'react-router-dom';

const NavbarLinks = ({ className = '', onClick, onFeaturesClick }) => (
  <>
    <a href="#features" className={`text-gray-600 hover:text-brand-purple transition-colors ${className}`} onClick={onFeaturesClick}>Features</a>
    <Link to="/pricing" className={`text-gray-600 hover:text-brand-purple transition-colors ${className}`} onClick={onClick}>Pricing</Link>
    <Link to="/about" className={`text-gray-600 hover:text-brand-purple transition-colors ${className}`} onClick={onClick}>About</Link>
  </>
);

export default NavbarLinks; 