import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `text-gray-700 hover:text-brand-saffron transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-orange-100 text-brand-saffron' : ''
    }`;

  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `block text-gray-700 hover:text-brand-saffron transition-colors duration-200 px-3 py-2 rounded-md text-base font-medium ${
      isActive ? 'bg-orange-100 text-brand-saffron' : ''
    }`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Logo className="h-12 w-auto text-brand-dark" />
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={navLinkClasses}>Home</NavLink>
            <NavLink to="/ads" className={navLinkClasses}>All Ads</NavLink>
            <NavLink to="/community" className={navLinkClasses}>Community</NavLink>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/create"
              className="bg-brand-saffron hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 text-sm shadow-sm"
            >
              Post Ad
            </Link>
            {isAuthenticated && user ? (
              <div className="relative group">
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <img src={user.avatarUrl} alt={user.fullName} className="h-8 w-8 rounded-full" />
                  <span className="text-sm font-medium hidden lg:inline">{user.fullName}</span>
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Ads</Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                    <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-gray-600 hover:text-brand-saffron transition-colors"
              >
                <UserCircleIcon className="h-6 w-6 mr-1"/>
                <span className="text-sm font-medium">Login</span>
              </Link>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link
                to="/create"
                className="bg-brand-saffron hover:bg-orange-600 text-white font-bold p-2 rounded-full transition duration-300 text-sm shadow-sm mr-2"
              >
                +
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-brand-saffron focus:outline-none">
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/ads" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>All Ads</NavLink>
            <NavLink to="/community" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>Community</NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated && user ? (
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.fullName} />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.fullName}</div>
                </div>
              </div>
            ) : null}
            <div className="mt-3 px-2 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-saffron hover:bg-gray-50">My Ads</Link>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-saffron hover:bg-gray-50">My Profile</Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-saffron hover:bg-gray-50">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-saffron hover:bg-gray-50">Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;