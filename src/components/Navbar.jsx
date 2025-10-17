import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: '🏠 Home', key: 'home' },
    { path: '/data', label: '🎵 Music Library', key: 'data' }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => handleNavigation('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🎵</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">MusicFlow</h1>
          </div>
                     
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-2">
              {navItems.map((item) => (
                <NavButton
                  key={item.key}
                  label={item.label}
                  isActive={isActive(item.path)}
                  onClick={() => handleNavigation(item.path)}
                />
              ))}
            </div>
            
            <div className="flex items-center space-x-3 text-white">
              <span className="text-sm hidden lg:block">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg transition-all duration-200 text-sm border border-red-500/30 hover:border-red-400/50 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10">
            <div className="flex flex-col space-y-2 mt-4">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    handleNavigation(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex items-center justify-between px-4 py-2 mt-4 border-t border-white/10 pt-4">
                <span className="text-sm text-white">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg transition-all duration-200 text-sm border border-red-500/30 hover:border-red-400/50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Extracted NavButton component for better reusability
function NavButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 lg:px-6 py-2 rounded-full transition-all duration-200 font-medium transform hover:scale-105 cursor-pointer text-sm lg:text-base ${
        isActive
          ? 'bg-white/20 text-white shadow-lg border border-white/20'
          : 'text-gray-300 hover:text-white hover:bg-white/10 hover:border hover:border-white/10'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </button>
  );
}