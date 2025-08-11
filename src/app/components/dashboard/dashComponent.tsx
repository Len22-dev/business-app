"use client"

import { useState } from 'react';
import { 
  Menu,
  Search, 
  Bell, 
  User, 
  Settings,
  Palette,
  ChevronRight,
  Home,
  BarChart3,
  ShoppingBag,
  Users,
  X
} from 'lucide-react';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: BarChart3, label: 'Analytics' },
    { icon: ShoppingBag, label: 'Sales' },
    { icon: Users, label: 'Customers' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-blue-600 text-white transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center h-16 px-6 border-b border-blue-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">GE</span>
            </div>
            <span className="text-xl font-semibold">GrowEazie</span>
          </div>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`
                flex items-center px-6 py-3 text-sm font-medium transition-colors
                ${item.active 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Left side - Menu and Breadcrumbs */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Breadcrumbs */}
              <nav className="hidden sm:flex items-center ml-4 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-700">Home</a>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-gray-900 font-medium">Overview</span>
              </nav>
            </div>

            {/* Right side - Search, Theme, Notifications, Avatar */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search */}
              <div className="relative">
                {isSearchExpanded ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-48 md:w-64 px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                      onBlur={(e) => {
                        if (!e.target.value) {
                          setIsSearchExpanded(false);
                        }
                      }}
                    />
                    <button
                      onClick={() => setIsSearchExpanded(false)}
                      className="absolute right-3 p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearchExpanded(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Theme Toggle */}
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Palette className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Avatar */}
              <button className="p-1">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="h-96 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-center">
            <p className="text-gray-500 text-lg">Main content area - Empty for now</p>
          </div>
        </main>
      </div>
    </div>
  );
}