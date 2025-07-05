import React from 'react';
import { Link } from 'react-router-dom';

const NavbarLinks = ({ className = '', onClick, onFeaturesClick }) => (
  <>
    <a href="#features" className={`text-gray-800 font-medium hover:text-brand-purple transition-all duration-200 hover:scale-105 ${className}`} onClick={onFeaturesClick}>Features</a>
    <Link to="/pricing" className={`text-gray-800 font-medium hover:text-brand-purple transition-all duration-200 hover:scale-105 ${className}`} onClick={onClick}>Pricing</Link>
    <Link to="/about" className={`text-gray-800 font-medium hover:text-brand-purple transition-all duration-200 hover:scale-105 ${className}`} onClick={onClick}>About</Link>
  </>
);

export default NavbarLinks; 