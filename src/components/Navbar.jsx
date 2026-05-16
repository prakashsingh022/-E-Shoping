import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  LogOut, 
  User as UserIcon, 
  Settings,
  ChevronDown,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    { id: 1, title: 'New order received', time: '5m ago', type: 'order' },
    { id: 2, title: 'Product stock low', time: '1h ago', type: 'stock' },
    { id: 3, title: 'New user registered', time: '2h ago', type: 'user' },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-surface-200 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-surface-100 text-surface-500"
        >
          <Menu size={22} />
        </button>
        
        {/* Global Search */}
        <div className="hidden sm:flex items-center flex-1 max-w-md relative">
          <Search className="absolute left-3 text-surface-400" size={18} />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-surface-500 hover:bg-surface-100 hover:text-primary-600 transition-all relative"
          >
            <Bell size={22} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-surface-200 z-20 overflow-hidden animate-in fade-in slide-in-from-top-5 duration-200">
                <div className="px-4 py-3 border-b border-surface-100 flex items-center justify-between">
                  <span className="font-semibold">Notifications</span>
                  <span className="text-xs text-primary-600 cursor-pointer hover:underline">Mark all as read</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="px-4 py-3 hover:bg-surface-50 cursor-pointer border-b border-surface-50 last:border-0">
                      <p className="text-sm text-surface-900">{n.title}</p>
                      <p className="text-xs text-surface-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-surface-100 text-center">
                  <span className="text-sm text-surface-500 hover:text-primary-600 cursor-pointer">View all notifications</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-100 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden lg:block text-left mr-1">
              <p className="text-xs font-semibold text-surface-900 leading-none">{user?.name}</p>
              <p className="text-[10px] text-surface-500 mt-1 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <ChevronDown size={14} className={`text-surface-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showProfileDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowProfileDropdown(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-surface-200 z-20 overflow-hidden animate-in fade-in slide-in-from-top-5 duration-200">
                <div className="p-4 border-b border-surface-100">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-surface-500">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-surface-700 hover:bg-surface-50">
                    <UserIcon size={18} className="text-surface-400" />
                    Profile
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-surface-700 hover:bg-surface-50">
                    <Settings size={18} className="text-surface-400" />
                    Settings
                  </button>
                </div>
                <div className="py-1 border-t border-surface-100">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
