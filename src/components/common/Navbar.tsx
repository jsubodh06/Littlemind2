import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { SproutDoodle } from './DoodleAccents';
import { formatPrice } from '../../lib/utils';
import { Product } from '../../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string, params?: Record<string, string>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { openCart, itemCount } = useCart();
  const { wishlist } = useWishlist();
  const { currentUser, userProfile, logout } = useAuth();
  const { categories, ageGroups, products, settings } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  // Active mega menu dropdown: 'category' | 'age' | null
  const [activeMega, setActiveMega] = useState<'category' | 'age' | null>(null);
  const megaTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Live search suggestions
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return products
      .filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [products, searchQuery]);

  const handleMouseEnter = (menu: 'category' | 'age') => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setActiveMega(menu);
  };

  const handleMouseLeave = () => {
    megaTimeoutRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 200);
  };

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSelect = (product: Product) => {
    setSearchOpen(false);
    setSearchQuery('');
    onNavigate(`/product/${product.slug}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8EF]/95 backdrop-blur-md border-b border-[#F4EADB] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#3B2F2F] hover:bg-[#F5EADB] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#7BA88B]/20 text-[#588469] flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6">
              <SproutDoodle className="w-7 h-7 text-[#588469]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#3B2F2F] block leading-none">
                {settings.brandName || 'Little Sprout'}
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#7BA88B] block mt-0.5">
                Montessori Play & Living
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links with Mega-menus */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-[#3B2F2F]">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#E2725B] transition-colors py-2 text-sm tracking-wide"
            >
              Home
            </button>

            {/* Shop by Category Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('category')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => onNavigate('/collections')}
                className={`flex items-center gap-1.5 py-2 text-sm tracking-wide transition-colors ${
                  activeMega === 'category' ? 'text-[#E2725B] font-semibold' : 'hover:text-[#E2725B]'
                }`}
              >
                Shop by Category
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeMega === 'category' ? 'rotate-180 text-[#E2725B]' : ''
                  }`}
                />
              </button>

              {activeMega === 'category' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-[#FFF8EF] rounded-3xl p-6 shadow-2xl border border-[#F4EADB] grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  {categories.map(cat => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setActiveMega(null);
                        onNavigate(`/collections?category=${cat.id}`);
                      }}
                      className="group cursor-pointer p-3 rounded-2xl hover:bg-[#F5EADB] transition-all flex gap-3 items-center"
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-[#3B2F2F] group-hover:text-[#E2725B] leading-tight">
                          {cat.name}
                        </h4>
                        <p className="text-xs text-[#948282] line-clamp-2 mt-0.5">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-3 pt-3 border-t border-[#F4EADB] flex justify-between items-center text-xs text-[#588469] font-semibold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-sunshine" />
                      100% Solid European Birch & Beechwood
                    </span>
                    <button
                      onClick={() => {
                        setActiveMega(null);
                        onNavigate('/collections');
                      }}
                      className="text-[#E2725B] hover:underline flex items-center gap-1"
                    >
                      View All Products <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Shop by Age Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('age')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => onNavigate('/collections')}
                className={`flex items-center gap-1.5 py-2 text-sm tracking-wide transition-colors ${
                  activeMega === 'age' ? 'text-[#E2725B] font-semibold' : 'hover:text-[#E2725B]'
                }`}
              >
                Shop by Age
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeMega === 'age' ? 'rotate-180 text-[#E2725B]' : ''
                  }`}
                />
              </button>

              {activeMega === 'age' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[650px] bg-[#FFF8EF] rounded-3xl p-6 shadow-2xl border border-[#F4EADB] grid grid-cols-5 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  {ageGroups.map(grp => (
                    <div
                      key={grp.id}
                      onClick={() => {
                        setActiveMega(null);
                        onNavigate(`/collections?age=${grp.ageRange}`);
                      }}
                      className="cursor-pointer group flex flex-col items-center text-center p-3 rounded-2xl hover:scale-105 transition-all border border-transparent hover:border-[#F4EADB]"
                      style={{ backgroundColor: grp.color }}
                    >
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center font-serif font-bold text-sm text-[#3B2F2F] group-hover:bg-[#E2725B] group-hover:text-white transition-colors">
                        {grp.ageRange}
                      </div>
                      <span className="text-xs font-bold text-[#3B2F2F] mt-2 block">
                        {grp.name}
                      </span>
                      <span className="text-[10px] text-[#6E5A5A] mt-1 line-clamp-2">
                        {grp.description}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('/what-is-montessori')}
              className="hover:text-[#E2725B] transition-colors py-2 text-sm tracking-wide"
            >
              Montessori Guide
            </button>

            <button
              onClick={() => onNavigate('/blog')}
              className="hover:text-[#E2725B] transition-colors py-2 text-sm tracking-wide"
            >
              Blog
            </button>

            <button
              onClick={() => onNavigate('/about')}
              className="hover:text-[#E2725B] transition-colors py-2 text-sm tracking-wide"
            >
              About
            </button>
          </nav>

          {/* Action Icons Right */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-full text-[#3B2F2F] hover:bg-[#F5EADB] transition-colors"
                aria-label="Search toys"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Live Search Floating Dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#F4EADB] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]">
                    <Search className="w-4 h-4 text-[#948282]" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search boxes, climbers, easels..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#3B2F2F] placeholder-[#948282] focus:outline-none"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')}>
                        <X className="w-4 h-4 text-[#948282] hover:text-[#3B2F2F]" />
                      </button>
                    )}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="mt-3 divide-y divide-[#F4EADB] max-h-80 overflow-y-auto">
                      {searchResults.map(prod => (
                        <div
                          key={prod.id}
                          onClick={() => handleSearchSelect(prod)}
                          className="p-2 flex items-center gap-3 hover:bg-[#FFF8EF] rounded-xl cursor-pointer transition-colors"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-lg shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[#3B2F2F] truncate">
                              {prod.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-bold text-[#588469]">
                                {formatPrice(prod.price)}
                              </span>
                              <span className="text-[10px] text-[#948282] bg-[#F5EADB] px-1.5 py-0.5 rounded-full">
                                {prod.ageRange} yrs
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchQuery && searchResults.length === 0 && (
                    <div className="p-4 text-center text-xs text-[#948282]">
                      No toys found for "{searchQuery}". Try "box" or "pikler".
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={() => onNavigate('/account?tab=wishlist')}
              className="p-2.5 rounded-full text-[#3B2F2F] hover:bg-[#F5EADB] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute 1 top-1 right-1 w-4 h-4 bg-[#E2725B] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Button */}
            <button
              onClick={openCart}
              className="p-2.5 rounded-full text-[#3B2F2F] hover:bg-[#F5EADB] transition-colors relative flex items-center"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#3B2F2F]" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#7BA88B] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Customer Account Icon & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="p-2.5 rounded-full text-[#3B2F2F] hover:bg-[#F5EADB] transition-colors flex items-center gap-1.5"
                aria-label="User Account"
              >
                <UserIcon className="w-5 h-5" />
                {currentUser && (
                  <span className="hidden md:inline-block text-xs font-semibold max-w-[100px] truncate">
                    {userProfile?.name?.split(' ')[0] || 'Account'}
                  </span>
                )}
              </button>

              {accountMenuOpen && (
                <div
                  onMouseLeave={() => setAccountMenuOpen(false)}
                  className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-[#F4EADB] p-2 z-50 animate-in fade-in zoom-in-95"
                >
                  {currentUser ? (
                    <>
                      <div className="px-3 py-2 border-b border-[#F4EADB] mb-1">
                        <p className="text-xs font-bold text-[#3B2F2F] truncate">
                          {userProfile?.name || currentUser.displayName || 'Parent Explorer'}
                        </p>
                        <p className="text-[10px] text-[#948282] truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          onNavigate('/account?tab=orders');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#3B2F2F] hover:bg-[#FFF8EF] transition-colors"
                      >
                        📦 My Orders
                      </button>
                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          onNavigate('/account?tab=wishlist');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#3B2F2F] hover:bg-[#FFF8EF] transition-colors"
                      >
                        ❤️ Wishlist ({wishlist.length})
                      </button>
                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          onNavigate('/account?tab=addresses');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#3B2F2F] hover:bg-[#FFF8EF] transition-colors"
                      >
                        🏡 Saved Addresses
                      </button>
                      <div className="my-1 border-t border-[#F4EADB]" />
                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#E2725B] hover:bg-[#FDEEEB] transition-colors"
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-3 text-center">
                        <p className="text-xs text-[#3B2F2F] font-semibold mb-2">
                          Welcome to Little Sprout
                        </p>
                        <button
                          onClick={() => {
                            setAccountMenuOpen(false);
                            onNavigate('/account');
                          }}
                          className="w-full py-2 bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                        >
                          Sign In / Register
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFF8EF] border-b border-[#F4EADB] px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/collections');
              }}
              className="w-full text-left font-serif text-lg font-bold text-[#3B2F2F] py-2 border-b border-[#F4EADB]"
            >
              All Toys & Furniture
            </button>

            {/* Mobile Categories Accordion */}
            <div className="py-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7BA88B] mb-2">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate(`/collections?category=${c.id}`);
                    }}
                    className="text-left text-xs text-[#3B2F2F] hover:text-[#E2725B] py-1 truncate"
                  >
                    • {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Ages */}
            <div className="py-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7BA88B] mb-2">
                Shop by Age
              </p>
              <div className="flex flex-wrap gap-2">
                {ageGroups.map(a => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate(`/collections?age=${a.ageRange}`);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#F5EADB] text-[#3B2F2F]"
                  >
                    {a.ageRange} yrs
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/what-is-montessori');
              }}
              className="w-full text-left font-medium text-sm text-[#3B2F2F] py-2"
            >
              What is Montessori?
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/blog');
              }}
              className="w-full text-left font-medium text-sm text-[#3B2F2F] py-2"
            >
              Parenting Blog
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/about');
              }}
              className="w-full text-left font-medium text-sm text-[#3B2F2F] py-2"
            >
              About Our Woodshop
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/contact');
              }}
              className="w-full text-left font-medium text-sm text-[#3B2F2F] py-2"
            >
              Contact & Support
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
