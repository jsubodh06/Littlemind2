/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/storefront/CartDrawer';

import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { MontessoriPage } from './pages/MontessoriPage';
import { PolicyPage } from './pages/PolicyPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || window.location.pathname || '/';
  });

  const [queryParams, setQueryParams] = useState<Record<string, string>>(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const obj: Record<string, string> = {};
    params.forEach((val, key) => {
      obj[key] = val;
    });
    return obj;
  });

  // Handle browser popstate & hashchange
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const path = hash || window.location.pathname || '/';
      setCurrentPath(path);

      const params = new URLSearchParams(window.location.search);
      const obj: Record<string, string> = {};
      params.forEach((val, key) => {
        obj[key] = val;
      });
      setQueryParams(obj);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: string, params?: Record<string, string>) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let finalPath = path;
    let searchString = '';

    // If path has embedded query string like /collections?category=xyz
    if (path.includes('?')) {
      const parts = path.split('?');
      finalPath = parts[0];
      const searchParams = new URLSearchParams(parts[1]);
      const mergedParams: Record<string, string> = { ...params };
      searchParams.forEach((val, key) => {
        mergedParams[key] = val;
      });
      setQueryParams(mergedParams);
      searchString = `?${searchParams.toString()}`;
    } else if (params) {
      setQueryParams(params);
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => searchParams.set(k, v));
      searchString = `?${searchParams.toString()}`;
    } else {
      setQueryParams({});
    }

    setCurrentPath(finalPath);
    window.history.pushState(null, '', `${finalPath}${searchString}`);
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col bg-[#FFF8EF] text-[#3B2F2F]">
              {/* Storefront Global Top Headers (hidden on admin pages) */}
              {!isAdminRoute && (
                <>
                  <AnnouncementBar onNavigate={navigate} />
                  <Navbar currentPath={currentPath} onNavigate={navigate} />
                  <CartDrawer onNavigate={navigate} />
                </>
              )}

              {/* Dynamic Route Content */}
              <div className="flex-1">
                {currentPath === '/' && <HomePage onNavigate={navigate} />}

                {currentPath.startsWith('/collections') && (
                  <CollectionPage
                    onNavigate={navigate}
                    initialCategory={queryParams.category}
                    initialAge={queryParams.age}
                  />
                )}

                {currentPath.startsWith('/product/') && (
                  <ProductDetailPage
                    productSlug={currentPath.replace('/product/', '')}
                    onNavigate={navigate}
                  />
                )}

                {currentPath === '/checkout' && <CheckoutPage onNavigate={navigate} />}

                {currentPath.startsWith('/account') && (
                  <AccountPage onNavigate={navigate} initialTab={queryParams.tab} />
                )}

                {currentPath === '/what-is-montessori' && (
                  <MontessoriPage onNavigate={navigate} />
                )}

                {currentPath === '/about' && <AboutPage />}

                {currentPath === '/contact' && <ContactPage />}

                {currentPath.startsWith('/policies') && (
                  <PolicyPage initialType={queryParams.type} />
                )}

                {currentPath === '/blog' && <BlogListPage onNavigate={navigate} />}

                {currentPath.startsWith('/blog/') && (
                  <BlogPostPage
                    slug={currentPath.replace('/blog/', '')}
                    onNavigate={navigate}
                  />
                )}

                {/* Admin Routes */}
                {currentPath === '/admin/login' && (
                  <AdminLoginPage onNavigate={navigate} />
                )}

                {currentPath === '/admin' && <AdminPage onNavigate={navigate} />}
              </div>

              {/* Storefront Global Footer (hidden on admin pages) */}
              {!isAdminRoute && <Footer onNavigate={navigate} />}
            </div>
          </WishlistProvider>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
