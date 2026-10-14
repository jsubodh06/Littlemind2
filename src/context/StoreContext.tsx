import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Product,
  Category,
  AgeGroup,
  Order,
  Coupon,
  Testimonial,
  Faq,
  Review,
  BlogArticle,
  SiteSettings,
  OrderStatus,
} from '../types';
import {
  initialProducts,
  initialCategories,
  initialAgeGroups,
  initialTestimonials,
  initialFaqs,
  initialCoupons,
  initialBlogs,
  initialSiteSettings,
} from '../lib/seedData';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  ageGroups: AgeGroup[];
  testimonials: Testimonial[];
  faqs: Faq[];
  reviews: Review[];
  blogs: BlogArticle[];
  settings: SiteSettings;
  orders: Order[];
  coupons: Coupon[];
  loading: boolean;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  saveAgeGroup: (ageGroup: AgeGroup) => Promise<void>;
  deleteAgeGroup: (id: string) => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingLink?: string, courierName?: string) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  updateReviewStatus: (reviewId: string, status: 'approved' | 'rejected') => Promise<void>;
  saveBlog: (blog: BlogArticle) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  saveSettings: (settings: SiteSettings) => Promise<void>;
  saveCoupon: (coupon: Coupon) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  seedDatabase: (force?: boolean) => Promise<{ success: boolean; message: string }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>(initialAgeGroups);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<BlogArticle[]>(initialBlogs);
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [loading, setLoading] = useState<boolean>(true);

  // Firestore listeners with graceful fallbacks
  useEffect(() => {
    let unsubProducts: (() => void) | undefined;
    let unsubCategories: (() => void) | undefined;
    let unsubSettings: (() => void) | undefined;
    let unsubOrders: (() => void) | undefined;
    let unsubReviews: (() => void) | undefined;
    let unsubCoupons: (() => void) | undefined;
    let unsubBlogs: (() => void) | undefined;

    try {
      unsubProducts = onSnapshot(collection(db, 'products'), snap => {
        if (!snap.empty) {
          const list: Product[] = [];
          snap.forEach(d => list.push(d.data() as Product));
          setProducts(list);
        }
      }, err => {
        handleFirestoreError(err, OperationType.GET, 'products');
      });

      unsubCategories = onSnapshot(collection(db, 'categories'), snap => {
        if (!snap.empty) {
          const list: Category[] = [];
          snap.forEach(d => list.push(d.data() as Category));
          setCategories(list.sort((a, b) => a.order - b.order));
        }
      }, err => {
        handleFirestoreError(err, OperationType.GET, 'categories');
      });

      unsubSettings = onSnapshot(doc(db, 'settings', 'general'), snap => {
        if (snap.exists()) {
          setSettings(snap.data() as SiteSettings);
        }
      }, err => {
        console.warn('Settings listener note:', err.message);
      });

      unsubOrders = onSnapshot(collection(db, 'orders'), snap => {
        const list: Order[] = [];
        snap.forEach(d => list.push(d.data() as Order));
        setOrders(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }, err => {
        console.warn('Orders listener notice (requires sign-in / admin):', err.message);
      });

      unsubReviews = onSnapshot(collection(db, 'reviews'), snap => {
        const list: Review[] = [];
        snap.forEach(d => list.push(d.data() as Review));
        setReviews(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }, err => {
        console.warn('Reviews listener notice:', err.message);
      });

      unsubCoupons = onSnapshot(collection(db, 'coupons'), snap => {
        if (!snap.empty) {
          const list: Coupon[] = [];
          snap.forEach(d => list.push(d.data() as Coupon));
          setCoupons(list);
        }
      }, err => {
        console.warn('Coupons listener notice:', err.message);
      });

      unsubBlogs = onSnapshot(collection(db, 'blogs'), snap => {
        if (!snap.empty) {
          const list: BlogArticle[] = [];
          snap.forEach(d => list.push(d.data() as BlogArticle));
          setBlogs(list);
        }
      }, err => {
        console.warn('Blogs listener notice:', err.message);
      });
    } catch (e) {
      console.warn('Realtime listeners initialization:', e);
    } finally {
      setLoading(false);
    }

    return () => {
      unsubProducts?.();
      unsubCategories?.();
      unsubSettings?.();
      unsubOrders?.();
      unsubReviews?.();
      unsubCoupons?.();
      unsubBlogs?.();
    };
  }, []);

  const saveProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.id), product);
      setProducts(prev => {
        const idx = prev.findIndex(p => p.id === product.id);
        if (idx > -1) {
          const next = [...prev];
          next[idx] = product;
          return next;
        }
        return [product, ...prev];
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  const saveCategory = async (category: Category) => {
    try {
      await setDoc(doc(db, 'categories', category.id), category);
      setCategories(prev => {
        const idx = prev.findIndex(c => c.id === category.id);
        if (idx > -1) {
          const next = [...prev];
          next[idx] = category;
          return next.sort((a, b) => a.order - b.order);
        }
        return [...prev, category].sort((a, b) => a.order - b.order);
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `categories/${category.id}`);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
    }
  };

  const saveAgeGroup = async (ageGroup: AgeGroup) => {
    try {
      await setDoc(doc(db, 'ageGroups', ageGroup.id), ageGroup);
      setAgeGroups(prev => {
        const idx = prev.findIndex(a => a.id === ageGroup.id);
        if (idx > -1) {
          const next = [...prev];
          next[idx] = ageGroup;
          return next.sort((a, b) => a.order - b.order);
        }
        return [...prev, ageGroup].sort((a, b) => a.order - b.order);
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `ageGroups/${ageGroup.id}`);
    }
  };

  const deleteAgeGroup = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'ageGroups', id));
      setAgeGroups(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `ageGroups/${id}`);
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    const id = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullOrder: Order = {
      ...orderData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'orders', id), fullOrder);
      setOrders(prev => [fullOrder, ...prev]);

      // Deduct stock in products
      for (const item of fullOrder.items) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const updatedProd = { ...prod, stock: Math.max(0, prod.stock - item.quantity) };
          await setDoc(doc(db, 'products', prod.id), updatedProd).catch(console.warn);
        }
      }

      return fullOrder;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `orders/${id}`);
      throw err;
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    trackingLink?: string,
    courierName?: string
  ) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const updates: Partial<Order> = {
        status,
        updatedAt: new Date().toISOString(),
        ...(trackingLink !== undefined ? { trackingLink } : {}),
        ...(courierName !== undefined ? { courierName } : {}),
      };
      await setDoc(orderRef, updates, { merge: true });
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, ...updates } : o))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const id = `rev_${Date.now()}`;
    const newRev: Review = {
      ...reviewData,
      id,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'reviews', id), newRev);
      setReviews(prev => [newRev, ...prev]);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `reviews/${id}`);
    }
  };

  const updateReviewStatus = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      await setDoc(doc(db, 'reviews', reviewId), { status }, { merge: true });
      setReviews(prev =>
        prev.map(r => (r.id === reviewId ? { ...r, status } : r))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `reviews/${reviewId}`);
    }
  };

  const saveBlog = async (blog: BlogArticle) => {
    try {
      await setDoc(doc(db, 'blogs', blog.id), blog);
      setBlogs(prev => {
        const idx = prev.findIndex(b => b.id === blog.id);
        if (idx > -1) {
          const next = [...prev];
          next[idx] = blog;
          return next;
        }
        return [blog, ...prev];
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `blogs/${blog.id}`);
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blogs', id));
      setBlogs(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `blogs/${id}`);
    }
  };

  const saveSettings = async (newSettings: SiteSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'general'), newSettings);
      setSettings(newSettings);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/general');
    }
  };

  const saveCoupon = async (coupon: Coupon) => {
    try {
      await setDoc(doc(db, 'coupons', coupon.id), coupon);
      setCoupons(prev => {
        const idx = prev.findIndex(c => c.id === coupon.id);
        if (idx > -1) {
          const next = [...prev];
          next[idx] = coupon;
          return next;
        }
        return [coupon, ...prev];
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `coupons/${coupon.id}`);
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'coupons', id));
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `coupons/${id}`);
    }
  };

  const seedDatabase = useCallback(async (force: boolean = false) => {
    try {
      const prodSnap = await getDocs(collection(db, 'products'));
      if (!force && !prodSnap.empty) {
        return { success: true, message: `Database already populated with ${prodSnap.size} products.` };
      }

      // Seed products
      for (const p of initialProducts) {
        await setDoc(doc(db, 'products', p.id), p);
      }
      // Seed categories
      for (const c of initialCategories) {
        await setDoc(doc(db, 'categories', c.id), c);
      }
      // Seed age groups
      for (const a of initialAgeGroups) {
        await setDoc(doc(db, 'ageGroups', a.id), a);
      }
      // Seed testimonials
      for (const t of initialTestimonials) {
        await setDoc(doc(db, 'testimonials', t.id), t);
      }
      // Seed FAQs
      for (const f of initialFaqs) {
        await setDoc(doc(db, 'faqs', f.id), f);
      }
      // Seed coupons
      for (const cp of initialCoupons) {
        await setDoc(doc(db, 'coupons', cp.id), cp);
      }
      // Seed blogs
      for (const b of initialBlogs) {
        await setDoc(doc(db, 'blogs', b.id), b);
      }
      // Seed settings
      await setDoc(doc(db, 'settings', 'general'), initialSiteSettings);

      setProducts(initialProducts);
      setCategories(initialCategories);
      setAgeGroups(initialAgeGroups);
      setTestimonials(initialTestimonials);
      setFaqs(initialFaqs);
      setCoupons(initialCoupons);
      setBlogs(initialBlogs);
      setSettings(initialSiteSettings);

      return { success: true, message: 'Successfully seeded 12 products, 6 categories, 5 age groups, 4 testimonials, 8 FAQs, and CMS settings!' };
    } catch (err) {
      console.error('Failed to seed database:', err);
      return { success: false, message: `Seeding error: ${err instanceof Error ? err.message : String(err)}` };
    }
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        ageGroups,
        testimonials,
        faqs,
        reviews,
        blogs,
        settings,
        orders,
        coupons,
        loading,
        saveProduct,
        deleteProduct,
        saveCategory,
        deleteCategory,
        saveAgeGroup,
        deleteAgeGroup,
        createOrder,
        updateOrderStatus,
        addReview,
        updateReviewStatus,
        saveBlog,
        deleteBlog,
        saveSettings,
        saveCoupon,
        deleteCoupon,
        seedDatabase,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
