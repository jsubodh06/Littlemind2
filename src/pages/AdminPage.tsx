import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminLayout, AdminTab } from '../components/admin/AdminLayout';
import { DashboardTab } from '../components/admin/DashboardTab';
import { ProductsTab } from '../components/admin/ProductsTab';
import { CategoriesTab } from '../components/admin/CategoriesTab';
import { OrdersTab } from '../components/admin/OrdersTab';
import { CustomersTab } from '../components/admin/CustomersTab';
import { CouponsTab } from '../components/admin/CouponsTab';
import { CmsTab } from '../components/admin/CmsTab';
import { ReviewsTab } from '../components/admin/ReviewsTab';
import { BlogTab } from '../components/admin/BlogTab';
import { SettingsTab } from '../components/admin/SettingsTab';
import { ShieldAlert, ArrowLeft, Key } from 'lucide-react';
import { SproutDoodle } from '../components/common/DoodleAccents';

interface AdminPageProps {
  onNavigate: (path: string, params?: Record<string, string>) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { currentUser, isAdmin, loading, bootstrapAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [bootstrapLoading, setBootstrapLoading] = useState(false);

  // If still resolving auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8EF] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#7BA88B]/20 flex items-center justify-center animate-spin text-[#588469]">
          <SproutDoodle className="w-6 h-6" />
        </div>
        <p className="font-serif text-sm font-bold text-[#3B2F2F]">
          Verifying security credentials...
        </p>
      </div>
    );
  }

  // Not signed in: redirect to /admin/login
  if (!currentUser) {
    onNavigate('/admin/login');
    return null;
  }

  // Signed in, but not an admin
  if (!isAdmin) {
    const handlePromote = async () => {
      setBootstrapLoading(true);
      try {
        await bootstrapAdmin();
      } catch (e: any) {
        alert(e.message);
      } finally {
        setBootstrapLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-[#FFF8EF] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-md w-full border border-[#F4EADB] shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#FDEEEB] text-[#E2725B] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#3B2F2F]">
            Restricted Admin Area
          </h2>

          <p className="text-xs text-[#6E5A5A] leading-relaxed">
            You are signed in as <strong>{currentUser.email}</strong>, which does not currently have administrator privileges.
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={handlePromote}
              disabled={bootstrapLoading}
              className="w-full py-3 bg-[#588469] hover:bg-[#436650] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>{bootstrapLoading ? 'Granting...' : '👑 Grant Master Admin Status'}</span>
            </button>
            <p className="text-[10px] text-[#948282]">
              (One-time development bootstrap setup)
            </p>
          </div>

          <div className="pt-4 border-t border-[#F4EADB]">
            <button
              onClick={() => onNavigate('/')}
              className="text-xs font-bold text-[#948282] hover:text-[#3B2F2F] flex items-center justify-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Admin
  return (
    <AdminLayout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onNavigateStore={() => onNavigate('/')}
    >
      {currentTab === 'dashboard' && <DashboardTab onNavigateTab={setCurrentTab} />}
      {currentTab === 'products' && <ProductsTab />}
      {currentTab === 'categories' && <CategoriesTab />}
      {currentTab === 'orders' && <OrdersTab />}
      {currentTab === 'customers' && <CustomersTab />}
      {currentTab === 'coupons' && <CouponsTab />}
      {currentTab === 'cms' && <CmsTab />}
      {currentTab === 'reviews' && <ReviewsTab />}
      {currentTab === 'blogs' && <BlogTab />}
      {currentTab === 'settings' && <SettingsTab />}
    </AdminLayout>
  );
};
