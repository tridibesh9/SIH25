import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, Wallet } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  const navClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled || !isHomePage
      ? 'bg-white/95 backdrop-blur-md shadow-sm'
      : 'bg-white/10 backdrop-blur-md'
  }`;

  const linkClass = (path) => `
    relative px-4 py-2 text-sm font-medium transition-colors duration-200 hover:text-blue-600
    ${location.pathname === path ? 'text-blue-600' : 'text-gray-700'}
  `;

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-green-800">CarbonCycle</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={linkClass('/')}>
              Home
            </Link>
            <Link to="/marketplace" className={linkClass('/marketplace')}>
              Marketplace
            </Link>
            <Link to="/map-territory" className={linkClass('/map-territory')}>
              Register Project
            </Link>
            <Link to="/dashboard" className={linkClass('/dashboard')}>
              Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
              <Link
                to="/auth"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t">
            <div className="px-4 py-2 space-y-2">
              <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link to="/marketplace" className="block py-2 text-gray-700 hover:text-blue-600">
                Marketplace
              </Link>
              <Link to="/map-territory" className="block py-2 text-gray-700 hover:text-blue-600">
                Register Project
              </Link>
              <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <div className="pt-2 border-t">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg mb-2">
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </button>
                <Link
                  to="/auth"
                  className="block text-center py-2 text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;