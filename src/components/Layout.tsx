import React from 'react';
import { Menu, Settings, ChefHat, CreditCard, LogOut, User, LayoutGrid, History } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = user?.role === 'admin' 
    ? [
        { icon: LayoutGrid, label: 'Dashboard', path: '/admin' },
        { icon: Menu, label: 'Menu', path: '/admin/menu' },
        { icon: History, label: 'Orders', path: '/admin/orders' },
      ]
    : [
        { icon: Menu, label: 'Orders', path: '/waiter' },
        { icon: ChefHat, label: 'Kitchen', path: '/waiter/kitchen' },
        { icon: CreditCard, label: 'Payments', path: '/waiter/payments' },
      ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r shadow-sm">
          <div className="flex items-center h-16 px-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-white' : 'text-gray-400'} mr-3`} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5 text-gray-400 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 rounded-lg ${
                isActive(item.path)
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <div className="h-full overflow-auto p-4 md:p-6 pt-20 md:pt-6 pb-20 md:pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}