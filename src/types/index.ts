export type AgeRange = '0-1' | '1-2' | '2-3' | '3-4' | '4-15' | string;

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  sku: string;
  stock: number;
  ageRange: AgeRange;
  categoryId: string;
  tags: string[];
  isBestseller?: boolean;
  isNewLaunch?: boolean;
  description: string;
  whatsInside: string[];
  benefits: {
    title: string;
    description: string;
    icon?: string;
  }[];
  images: string[];
  rating: number;
  reviewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
}

export interface AgeGroup {
  id: string;
  name: string;
  ageRange: string;
  description: string;
  color: string;
  order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault?: boolean;
}

export type OrderStatus = 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'razorpay_mock';
export type PaymentStatus = 'pending' | 'paid';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  trackingLink?: string;
  trackingNumber?: string;
  courierName?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'flat';
  discountValue: number;
  minCartValue: number;
  expiresAt: string;
  isActive: boolean;
  usageCount: number;
}

export interface Testimonial {
  id: string;
  authorName: string;
  childAge: string;
  quote: string;
  rating: number;
  location: string;
  avatar: string;
  isFeatured?: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  readingTimeMinutes: number;
  publishedAt: string;
  isPublished: boolean;
}

export interface HeroBanner {
  id: string;
  tagline: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  accentColor: string;
}

export interface SiteSettings {
  brandName: string;
  announcementBarText: string;
  announcementBarLink: string;
  announcementBarActive: boolean;
  heroBanners: HeroBanner[];
  shippingFee: number;
  freeShippingThreshold: number;
  contactEmail: string;
  contactPhone: string;
  instagramUrl: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
}
