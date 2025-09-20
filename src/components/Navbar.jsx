import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🏠 Home', key: 'home' },
    { path: '/data', label: '📊 Data', key: 'data' }
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
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => handleNavigation('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <h1 className="text-2xl font-bold text-white">DataFlow</h1>
          </div>
                     
          {/* Navigation Links */}
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
        </div>
      </div>
    </nav>
  );
}

// Extracted NavButton component for better reusability
function NavButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full transition-all duration-200 font-medium transform hover:scale-105 cursor-pointer ${
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