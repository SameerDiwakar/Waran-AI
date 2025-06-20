import React from 'react';
import NavbarLinks from './NavbarLinks';
import NavbarAuthButtons from './NavbarAuthButtons';
import NavbarUserMenu from './NavbarUserMenu';

const NavbarMobileMenu = ({ user, handleLogout, onClose }) => (
  <div className="md:hidden py-4 border-t">
    <NavbarLinks className="block py-2" onClick={onClose} />
    {!user ? (
      <div className="mt-4 space-y-2">
        <NavbarAuthButtons isMobile />
      </div>
    ) : (
      <NavbarUserMenu user={user} handleLogout={handleLogout} isMobile />
    )}
  </div>
);

export default NavbarMobileMenu; 