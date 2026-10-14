import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Palette,
  MessageSquare,
  BookOpen,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { SproutDoodle } from '../common/DoodleAccents';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'cms'
  | 'reviews'
  | 'blogs'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onNavigateStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onNavigateStore,
  children,
}) => {
  const { currentUser, userProfile, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories & Ages', icon: <Layers className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders & Shipments', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'coupons', label: 'Discount Coupons', icon: <Tag className="w-4 h-4" /> },
    { id: 'cms', label: 'Homepage CMS', icon: <Palette className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews Moderation', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'blogs', label: 'Blog Articles', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'settings', label: 'Store Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5EADB]/40 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#3B2F2F] text-[#FFF8EF] flex flex-col justify-between p-4 transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#7BA88B] text-white flex items-center justify-center">
                <SproutDoodle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-lg font-bold text-white tracking-tight">
                  Little Sprout
                </h1>
                <span className="text-[10px] font-bold tracking-widest uppercase text-sunshine block">
                  Admin Console
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 lg:hidden text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-[#7BA88B] text-white shadow-md'
                      : 'text-[#FFF8EF]/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <button
            onClick={onNavigateStore}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-sunshine hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Storefront</span>
          </button>

          <div className="px-3 py-2 bg-white/5 rounded-xl flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {userProfile?.name || currentUser?.displayName || 'Master Admin'}
              </p>
              <p className="text-[10px] text-[#948282] truncate">{currentUser?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-white/70 hover:text-[#E2725B] hover:bg-white/10 rounded-lg"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#F4EADB] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-[#3B2F2F] hover:bg-[#F5EADB] lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-lg font-bold text-[#3B2F2F] capitalize">
              {currentTab === 'cms' ? 'Homepage CMS & Content' : currentTab}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#588469] bg-[#EBF4EE] px-3 py-1 rounded-full font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Session Secured</span>
            </div>
            <button
              onClick={onNavigateStore}
              className="text-xs font-bold text-[#7BA88B] hover:text-[#588469] flex items-center gap-1 border border-[#7BA88B]/30 px-3 py-1.5 rounded-xl hover:bg-[#EBF4EE]"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Tab Body */}
        <main className="p-4 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
};
