import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, hasPermission, isSuperAdmin } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  return (
    <div className="flex min-h-screen bg-surface-50">
      {/* Sidebar for Desktop & Mobile */}
      <div className={`${mobileSidebarOpen ? 'block' : 'hidden'} md:block`}>
        {/* Mobile Backdrop */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-surface-900/50 backdrop-blur-sm md:hidden"
            onClick={toggleMobileSidebar}
          ></div>
        )}
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar}
          user={user}
          hasPermission={hasPermission}
          isSuperAdmin={isSuperAdmin}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar toggleMobileSidebar={toggleMobileSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
