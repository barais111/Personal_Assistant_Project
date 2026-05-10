import React from 'react';
import { Home, Calendar, Mic, Newspaper, LogOut } from 'lucide-react';

const Navigation = ({ currentView, setCurrentView, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'voice', label: 'Voice Assistant', icon: Mic },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'task', label: 'Task', icon: Newspaper }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-lg border-b border-white/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-800">Assistant</span>
            </div>

            {/* Navigation Buttons */}
            <nav className="flex gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
