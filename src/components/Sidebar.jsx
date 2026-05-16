import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Users,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Store,
  FileText,
  Image as ImageIcon,
  Grid,
  Layers,
  Play
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, user, hasPermission, isSuperAdmin }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, show: true },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      show: hasPermission('view_products')
    },
    {
      name: 'Media Manager',
      href: '/admin/media-manager',
      icon: ImageIcon,
      show: hasPermission('view_products')
    },
    {
      name: 'Shop by Category',
      href: '/admin/categories',
      icon: Grid,
      show: hasPermission('manage_products')
    },
    {
      name: 'Banners',
      href: '/admin/banners',
      icon: Layers,
      show: hasPermission('manage_products')
    },
    {
      name: 'Videos',
      href: '/admin/videos',
      icon: Play,
      show: hasPermission('manage_products')
    },
    {
      name: 'Suit Set Edition',
      href: '/admin/suit-set-edition',
      icon: Layers,
      show: hasPermission('manage_products')
    },
    {
      name: 'Add Product',
      href: '/admin/products/add',
      icon: PlusCircle,
      show: hasPermission('manage_products')
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      show: hasPermission('view_orders')
    },
    {
      name: 'Admin Management',
      href: '/admin/management',
      icon: ShieldCheck,
      show: hasPermission('manage_admins')
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      show: hasPermission('view_users')
    },
    {
      name: 'Activity Logs',
      href: '/admin/activity-logs',
      icon: FileText,
      show: isSuperAdmin()
    }
  ].filter(item => item.show);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-surface-200 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'
        } md:relative`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-surface-200">
        <div className={`flex items-center gap-3 overflow-hidden ${!isOpen && 'justify-center w-full'}`}>
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/30">
            <Store className="text-white w-6 h-6" />
          </div>
          {isOpen && (
            <span className="text-lg font-bold tracking-tight text-surface-900 whitespace-nowrap">
              TaraTara <span className="text-primary-600">Admin</span>
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-100 text-surface-500 transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                } ${!isOpen && 'justify-center px-0'}`}
              title={!isOpen ? item.name : ''}
            >
              <item.icon size={22} className={isActive ? 'text-primary-600' : ''} />
              {isOpen && <span>{item.name}</span>}
              {!isOpen && isActive && <div className="absolute left-0 w-1 h-6 bg-primary-600 rounded-r-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-surface-200">
        <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm border-2 border-white shadow-sm flex-shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-surface-900 truncate">{user?.name}</p>
              <p className="text-xs text-surface-500 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
