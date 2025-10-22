
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo className="h-12 w-auto text-white" />
            <p className="text-sm text-gray-400">
              Connecting the Gujarati community across Germany.
            </p>
          </div>
          <div>
            <h3 className="font-bold tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/ads" className="hover:text-brand-saffron transition-colors">Browse Ads</Link></li>
              <li><Link to="/create" className="hover:text-brand-saffron transition-colors">Post an Ad</Link></li>
              <li><Link to="/login" className="hover:text-brand-saffron transition-colors">Login / Register</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold tracking-wider uppercase">Categories</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/ads?category=housing" className="hover:text-brand-saffron transition-colors">Housing</Link></li>
              <li><Link to="/ads?category=second-hand" className="hover:text-brand-saffron transition-colors">Second-hand</Link></li>
              <li><Link to="/ads?category=jobs" className="hover:text-brand-saffron transition-colors">Jobs</Link></li>
              <li><Link to="/ads?category=community-events" className="hover:text-brand-saffron transition-colors">Events</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:text-brand-saffron transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-saffron transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Gujarati Marketplace Germany. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
