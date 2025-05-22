
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, ChartPieIcon, ClipboardCheck, Upload, Users } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { name: 'Scorekeeper', path: '/scorekeeping', icon: <ClipboardCheck size={20} /> },
    { name: 'Teams', path: '/teams', icon: <Users size={20} /> },
    { name: 'Stats', path: '/dashboard', icon: <ChartPieIcon size={20} /> },
    { name: 'Upload', path: '/upload', icon: <Upload size={20} /> },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-baseball-navy text-white">
      <div className="baseball-container">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="text-xl font-bold flex items-center space-x-2">
            <Calendar size={24} />
            <span>ScoreKeeper</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 focus:outline-none"
          >
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </button>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 py-2 border-b-2 ${
                  isActive(item.path) 
                    ? 'border-baseball-orange text-baseball-orange' 
                    : 'border-transparent hover:text-gray-300'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in pb-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 py-3 px-4 rounded-md ${
                  isActive(item.path) 
                    ? 'bg-baseball-orange/20 text-baseball-orange' 
                    : 'hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
