import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, formatDate } from '../lib/utils';
import { Address } from '../types';
import {
  Package,
  Heart,
  MapPin,
  User as UserIcon,
  LogOut,
  ShoppingBag,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle,
  Truck,
} from 'lucide-react';
import { SproutDoodle } from '../components/common/DoodleAccents';

interface AccountPageProps {
  onNavigate: (path: string, params?: Record<string, string>) => void;
  initialTab?: string;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate, initialTab = 'orders' }) => {
  const {
    currentUser,
    userProfile,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    logout,
    resetPassword,
  } = useAuth();
  const { orders, products } = useStore();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>(
    (initialTab as any) || 'orders'
  );

  // Auth Form State (when logged out)
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Address modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: 'Karnataka',
    pinCode: '',
  });

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        await loginWithEmail(email, password);
      } else if (authMode === 'signup') {
        await signupWithEmail(email, password, fullName);
      } else if (authMode === 'forgot') {
        await resetPassword(email);
        setAuthSuccess('Password reset link sent to your email.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed.');
    }
  };

  // If user is not logged in: Show warm login/register card
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 animate-in fade-in">
        <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#F4EADB] shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#EBF4EE] text-[#588469] flex items-center justify-center mx-auto mb-4">
            <SproutDoodle className="w-8 h-8" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#3B2F2F]">
            {authMode === 'login'
              ? 'Welcome Back, Parent'
              : authMode === 'signup'
              ? 'Create a Family Account'
              : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-[#948282] mt-1 mb-6">
            Track your handcrafted toy shipments, manage wishlists & addresses.
          </p>

          {authError && (
            <div className="bg-[#FDEEEB] text-[#E2725B] p-3 rounded-xl text-xs font-semibold mb-4 text-left">
              {authError}
            </div>
          )}

          {authSuccess && (
            <div className="bg-[#EBF4EE] text-[#588469] p-3 rounded-xl text-xs font-semibold mb-4 text-left">
              {authSuccess}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-left">
            {authMode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sharma"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
              />
            </div>

            {authMode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#3B2F2F]">Password</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[11px] text-[#E2725B] hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {authLoading
                ? 'Processing...'
                : authMode === 'login'
                ? 'Sign In to Account'
                : authMode === 'signup'
                ? 'Create Little Sprout Account'
                : 'Send Reset Link'}
            </button>
          </form>

          {authMode !== 'forgot' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#F4EADB]" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-[#948282] bg-white px-2">
                  Or continue with
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-2.5 px-4 rounded-xl border border-[#F4EADB] bg-white hover:bg-[#FFF8EF] text-xs font-bold text-[#3B2F2F] flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </>
          )}

          <div className="mt-6 pt-4 border-t border-[#F4EADB] text-xs text-[#6E5A5A]">
            {authMode === 'login' ? (
              <p>
                New to Little Sprout?{' '}
                <button
                  onClick={() => setAuthMode('signup')}
                  className="font-bold text-[#E2725B] hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-[#7BA88B] hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Filter user orders
  const userOrders = orders.filter(
    o => o.customerId === currentUser.uid || o.customerEmail.toLowerCase() === currentUser.email?.toLowerCase()
  );

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Account Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EADB] shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-[#7BA88B] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
            {currentUser.displayName?.[0] || currentUser.email?.[0]?.toUpperCase() || 'P'}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#3B2F2F]">
              {userProfile?.name || currentUser.displayName || 'Parent Explorer'}
            </h1>
            <p className="text-xs text-[#948282]">{currentUser.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold text-[#588469] bg-[#EBF4EE] px-2.5 py-0.5 rounded-full">
              🌱 Little Sprout Family Member
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl border border-[#F4EADB] hover:bg-[#FDEEEB] text-[#E2725B] text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#F4EADB] mb-8 overflow-x-auto gap-4 sm:gap-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 font-serif text-sm sm:text-base font-bold flex items-center gap-2 transition-colors relative whitespace-nowrap ${
            activeTab === 'orders' ? 'text-[#E2725B]' : 'text-[#948282] hover:text-[#3B2F2F]'
          }`}
        >
          <Package className="w-4 h-4" /> My Orders ({userOrders.length})
          {activeTab === 'orders' && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E2725B]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 font-serif text-sm sm:text-base font-bold flex items-center gap-2 transition-colors relative whitespace-nowrap ${
            activeTab === 'wishlist' ? 'text-[#E2725B]' : 'text-[#948282] hover:text-[#3B2F2F]'
          }`}
        >
          <Heart className="w-4 h-4" /> Saved Wishlist ({wishlist.length})
          {activeTab === 'wishlist' && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E2725B]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 font-serif text-sm sm:text-base font-bold flex items-center gap-2 transition-colors relative whitespace-nowrap ${
            activeTab === 'addresses' ? 'text-[#E2725B]' : 'text-[#948282] hover:text-[#3B2F2F]'
          }`}
        >
          <MapPin className="w-4 h-4" /> Saved Addresses
          {activeTab === 'addresses' && (
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E2725B]" />
          )}
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#F4EADB] space-y-3">
              <Package className="w-12 h-12 text-[#7BA88B] mx-auto opacity-70" />
              <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">
                No orders placed yet
              </h3>
              <p className="text-xs text-[#948282] max-w-sm mx-auto">
                Explore our developmentally calibrated play kits and learning furniture.
              </p>
              <button
                onClick={() => onNavigate('/collections')}
                className="px-6 py-2.5 bg-[#7BA88B] text-white text-xs font-bold rounded-xl"
              >
                Browse Toys
              </button>
            </div>
          ) : (
            userOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EADB] shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F4EADB] gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#3B2F2F]">
                      Order #{order.orderNumber}
                    </span>
                    <p className="text-[11px] text-[#948282]">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                        order.status === 'delivered'
                          ? 'bg-[#EBF4EE] text-[#588469]'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-700'
                          : order.status === 'packed'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-[#FDEEEB] text-[#E2725B]'
                      }`}
                    >
                      ● {order.status}
                    </span>
                    <span className="font-serif font-bold text-sm text-[#3B2F2F]">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-[#F4EADB] py-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-xl"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-[#3B2F2F]">{item.name}</h4>
                          <span className="text-[10px] text-[#948282]">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#588469]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer notes & tracking */}
                <div className="pt-3 border-t border-[#F4EADB] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#6E5A5A]">
                    Delivering to: {order.shippingAddress.street}, {order.shippingAddress.city} - {order.shippingAddress.pinCode}
                  </span>
                  {order.trackingLink && (
                    <a
                      href={order.trackingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#E2725B] font-bold hover:underline flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" /> Track Courier Package
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#F4EADB] space-y-3">
              <Heart className="w-12 h-12 text-[#E2725B] mx-auto opacity-70" />
              <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-[#948282] max-w-sm mx-auto">
                Tap the heart on any product to save items for future milestones.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistedProducts.map(p => (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl p-4 border border-[#F4EADB] shadow-sm flex flex-col justify-between"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-44 object-cover rounded-2xl mb-3 cursor-pointer"
                    onClick={() => onNavigate(`/product/${p.slug}`)}
                  />
                  <div>
                    <h4
                      onClick={() => onNavigate(`/product/${p.slug}`)}
                      className="font-serif text-sm font-bold text-[#3B2F2F] line-clamp-2 cursor-pointer hover:text-[#E2725B]"
                    >
                      {p.name}
                    </h4>
                    <span className="font-serif text-sm font-bold text-[#588469] mt-1 block">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#F4EADB] flex gap-2">
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="flex-1 py-2 rounded-xl bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="p-2 rounded-xl border border-[#F4EADB] text-[#E2725B] hover:bg-[#FDEEEB]"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Primary default address */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#7BA88B] shadow-sm space-y-2 relative">
              <span className="bg-[#EBF4EE] text-[#588469] text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block">
                Default Delivery Address
              </span>
              <h4 className="font-serif text-base font-bold text-[#3B2F2F]">
                {userProfile?.name || currentUser.displayName || 'Primary Resident'}
              </h4>
              <p className="text-xs text-[#6E5A5A] leading-relaxed">
                #42, Palm Meadows, Whitefield Road, Bengaluru, Karnataka - 560066
              </p>
              <p className="text-xs text-[#948282]">Phone: +91 98450 12345</p>
            </div>

            {/* Add Address Card */}
            <button
              onClick={() => setShowAddressModal(true)}
              className="bg-[#FFF8EF] rounded-3xl p-8 border-2 border-dashed border-[#F4EADB] hover:border-[#7BA88B] transition-colors flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#7BA88B] group-hover:scale-110 transition-transform mb-2">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-serif font-bold text-sm text-[#3B2F2F]">
                Add New Delivery Address
              </span>
              <span className="text-[11px] text-[#948282]">Home, office, or grandparents' house</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#F4EADB] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">Add New Shipping Address</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-3 py-2 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
              />
              <input
                type="text"
                placeholder="Flat / Building / Street"
                className="w-full px-3 py-2 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  className="px-3 py-2 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                />
                <input
                  type="text"
                  placeholder="PIN Code"
                  className="px-3 py-2 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 text-xs text-[#948282]"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-5 py-2 bg-[#7BA88B] text-white text-xs font-bold rounded-xl"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
