import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, Wallet, LogOut, User } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const Navigation = ({account, setupBlockchain, setAccount}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedName = localStorage.getItem('userName');
      const storedRole = localStorage.getItem('userRole');

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp >= currentTime) {
            setIsAuthenticated(true);
            setUserName(storedName || 'User');
            setUserRole(storedRole || '');
          } else {
            // Token expired
            handleLogout();
          }
        } catch (err) {
          console.error('Token validation error:', err);
          handleLogout();
        }
      } else {
        setIsAuthenticated(false);
        setUserName('');
        setUserRole('');
      }
    };

    checkAuth();
    // Re-check auth on location change
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserName('');
    setUserRole('');
    navigate('/auth');
    setAccount('');
  };

  const isHomePage = location.pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

  const navClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled || !isHomePage
      ? 'bg-white/95 backdrop-blur-md shadow-sm'
      : 'bg-white/10 backdrop-blur-md'
  }`;

  const linkClass = (path) => `
    relative px-4 py-2 text-sm font-medium transition-colors duration-200
    ${location.pathname === path 
      ? isTransparent ? 'text-white font-semibold' : 'text-blue-600'
      : isTransparent ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-blue-600'
    }
  `;

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isTransparent ? 'bg-white/20' : 'bg-green-800'
            }`}>
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-xl transition-colors duration-300 ${
              isTransparent ? 'text-white' : 'text-green-800'
            }`}>CarbonCycle</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={linkClass('/')}>
              Home
            </Link>
            <Link to="/marketplace" className={linkClass('/marketplace')}>
              Marketplace
            </Link>
            <Link to="/dashboard" className={linkClass('/dashboard')}>
              Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              {account.length > 0 ? (
                <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isTransparent 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}>
                  <Wallet className="w-4 h-4" />
                  <span>
                    Connected: {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </button>
              ) : (
                <button
                  onClick={setupBlockchain}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isTransparent 
                      ? 'bg-white/20 text-white hover:bg-white/30' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </button>
              )}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    isTransparent 
                      ? 'bg-white/20' 
                      : 'bg-gray-100'
                  }`}>
                    <User className={`w-4 h-4 ${isTransparent ? 'text-white' : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium ${isTransparent ? 'text-white' : 'text-gray-700'}`}>{userName}</span>
                    {userRole && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isTransparent 
                          ? 'bg-white/30 text-white' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {userRole}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isTransparent 
                        ? 'bg-red-500/80 text-white hover:bg-red-500' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className={`text-sm font-medium transition-colors ${
                    isTransparent 
                      ? 'text-white hover:text-gray-200' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-colors ${isTransparent ? 'text-white' : 'text-gray-700'}`}
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
              <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <div className="pt-2 border-t">
                <button 
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg mb-2"
                  onClick={setupBlockchain}
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </button>
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg mb-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{userName}</span>
                      {userRole && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {userRole}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="block text-center py-2 text-gray-700 hover:text-blue-600"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;