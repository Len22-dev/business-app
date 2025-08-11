import React, { useState } from 'react';
import { 
  Search, Bell, Settings, User, Sun, Moon, Monitor, ChevronDown,
  Menu, X, BarChart3, ShoppingCart, Receipt, Package, 
  DollarSign,  Home, Star
} from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const searchSuggestions = [
    'Dashboard Analytics',
    'Sales Report',
    'Inventory Management',
    'User Settings'
  ].filter(item => 
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const notifications = [
    { id: 1, title: 'New order received', time: '5 min ago' },
    { id: 2, title: 'Inventory low alert', time: '1 hour ago' },
    { id: 3, title: 'Payment processed', time: '2 hours ago' }
  ];

  const sidebarTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'sales', label: 'Sales', icon: BarChart3 },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'purchase', label: 'Purchase', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const breadcrumbs = ['Dashboard', 'Analytics'];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 bg-blue-600 transition-transform duration-300 
        lg:relative lg:translate-x-0 ${
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center h-16 px-4 bg-blue-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">D</span>
              </div>
              {(!sidebarCollapsed || sidebarOpen) && (
                <span className="text-white font-semibold text-lg">
                  Dashboard Pro
                </span>
              )}
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 mt-8 px-4">
            {sidebarTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors mb-2 ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600'
                      : 'text-blue-200 hover:bg-blue-500'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {(!sidebarCollapsed || sidebarOpen) && (
                    <span className="ml-3">{tab.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Upgrade Card */}
          {(!sidebarCollapsed || sidebarOpen) && (
            <div className="p-4">
              <div className="bg-blue-800 rounded-lg p-4 text-center">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm mb-2">
                  Upgrade to Premium
                </h3>
                <p className="text-blue-200 text-xs mb-3">
                  Unlock advanced features
                </p>
                <button className="w-full bg-yellow-400 text-blue-900 py-2 rounded-md text-sm font-semibold hover:bg-yellow-300 transition-colors">
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4">
          {/* Left Side */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-3 p-2 rounded-md hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>

            {/* Desktop Collapse Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block mr-3 p-2 rounded-md hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>

            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setSearchExpanded(!searchExpanded)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <Search size={20} />
              </button>
              
              {searchExpanded && (
                <div className="absolute top-12 left-0 bg-white rounded-lg shadow-lg w-80 z-50">
                  <div className="p-3">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                  {searchQuery && (
                    <div className="border-t">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="flex-1 flex items-center justify-center">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-gray-500 text-sm">{item}</span>
                    {index < breadcrumbs.length - 1 && (
                      <span className="text-gray-400 mx-2">/</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* Theme Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowThemeOptions(!showThemeOptions)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                {theme === 'light' && <Sun size={20} />}
                {theme === 'dark' && <Moon size={20} />}
                {(theme === 'system' || theme === 'custom') && <Monitor size={20} />}
              </button>
              
              {showThemeOptions && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg w-48 z-50">
                  {[
                    { id: 'light', icon: Sun, label: 'Light' },
                    { id: 'dark', icon: Moon, label: 'Dark' },
                    { id: 'custom', icon: Monitor, label: 'Custom' },
                    { id: 'system', icon: Monitor, label: 'System' }
                  ].map((option) => {
                    const OptionIcon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          setTheme(option.id);
                          setShowThemeOptions(false);
                        }}
                        className="w-full flex items-center px-4 py-2 hover:bg-gray-50"
                      >
                        <OptionIcon size={16} className="mr-3" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-md hover:bg-gray-100 relative"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg w-80 z-50">
                  <div className="p-3 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-3 border-b hover:bg-gray-50">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User size={18} />
                </div>
                <ChevronDown size={16} />
              </button>
              
              {showUserDropdown && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg w-64 z-50">
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm text-gray-500">john@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button className="w-full flex items-center px-4 py-2 hover:bg-gray-50">
                      <User size={16} className="mr-3" />
                      Profile
                    </button>
                    <button className="w-full flex items-center px-4 py-2 hover:bg-gray-50">
                      <Settings size={16} className="mr-3" />
                      Settings
                    </button>
                    <button className="w-full flex items-center px-4 py-2 hover:bg-gray-50 text-red-600">
                      <X size={16} className="mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-600 mb-4">
                  Welcome to Dashboard
                </h1>
                <p className="text-xl text-gray-500">
                  Your main content area is ready to be customized
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;