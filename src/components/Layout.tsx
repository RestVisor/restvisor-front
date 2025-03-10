import React from 'react';
import { Menu, Settings, ChefHat, CreditCard, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-800" />
          </div>
          <div className="ml-3">
            <span className="text-sm text-white font-medium">{user?.name}</span>
            <span className="block text-xs text-indigo-200">{user?.role}</span>
          </div>
        </div>
        <button className="text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex w-20 bg-indigo-800 p-4 flex-col items-center">
        <div className="mb-8">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-indigo-800" />
          </div>
          <div className="mt-2 text-center">
            <span className="text-xs text-white font-medium">{user?.name}</span>
            <span className="block text-xs text-indigo-200">{user?.role}</span>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <button className="w-12 h-12 flex items-center justify-center text-white hover:bg-indigo-700 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center text-white hover:bg-indigo-700 rounded-lg">
            <ChefHat className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center text-white hover:bg-indigo-700 rounded-lg">
            <CreditCard className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <button className="w-12 h-12 flex items-center justify-center text-white hover:bg-indigo-700 rounded-lg">
            <Settings className="w-6 h-6" />
          </button>
          <button 
            onClick={logout}
            className="w-12 h-12 flex items-center justify-center text-white hover:bg-indigo-700 rounded-lg"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-indigo-800 px-4 py-2">
        <div className="flex justify-around">
          <button className="p-2 text-white">
            <Menu className="w-6 h-6" />
          </button>
          <button className="p-2 text-white">
            <ChefHat className="w-6 h-6" />
          </button>
          <button className="p-2 text-white">
            <CreditCard className="w-6 h-6" />
          </button>
          <button className="p-2 text-white">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto pb-16 md:pb-0 p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}