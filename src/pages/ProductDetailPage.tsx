import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, calculateDiscountPercent } from '../lib/utils';
import { ProductCard } from '../components/storefront/ProductCard';
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  CheckCircle,
  Sparkles,
  MapPin,
  Send,
  Eye,
  Check,
} from 'lucide-react';

interface ProductDetailPageProps {
  productSlug: string;
  onNavigate: (path: string, params?: Record<string, string>) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productSlug,
  onNavigate,
}) => {
  const { products, reviews, addReview } = useStore();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = products.find(p => p.slug === productSlug) || products[0];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<{ backgroundPosition: string; backgroundSize: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Review Form Modal / Inline
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const productReviews = reviews.filter(
    r => r.productId === product?.id && r.status === 'approved'
  );

  const isWished = product ? isInWishlist(product.id) : false;
  const discountPercent = product ? calculateDiscountPercent(product.price, product.mrp) : 0;

  // Handle image zoom on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%',
    });
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus(`Standard delivery in 2-3 business days to PIN ${pincode}. Eligible for Free Express Shipping!`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code (e.g. 560001).');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewName.trim() || !reviewComment.trim()) return;

    await addReview({
      productId: product.id,
      customerName: reviewName,
      customerEmail: reviewEmail || 'guest@littlesprout.in',
      rating: reviewRating,
      title: reviewTitle || 'Wonderful Montessori Material',
      comment: reviewComment,
      status: 'approved', // automatic approval for immediate feedback in demo
    });

    setReviewSubmitted(true);
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
  };

  if (!product) return null;

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.categoryId === product.categoryId || p.ageRange === product.ageRange))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 sm:pb-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#948282] mb-6 flex items-center gap-1.5 flex-wrap">
        <button onClick={() => onNavigate('/')} className="hover:text-[#3B2F2F]">
          Home
        </button>
        <span>/</span>
        <button onClick={() => onNavigate('/collections')} className="hover:text-[#3B2F2F]">
          Toys
        </button>
        <span>/</span>
        <span className="text-[#3B2F2F] font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Left: Gallery with Zoom */}
        <div className="space-y-4">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomStyle(null)}
            className="relative aspect-square rounded-[32px] overflow-hidden bg-[#F5EADB]/40 border border-[#F4EADB] shadow-md cursor-crosshair group"
            style={
              zoomStyle
                ? {
                    backgroundImage: `url(${product.images[activeImageIdx] || product.images[0]})`,
                    ...zoomStyle,
                  }
                : {}
            }
          >
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                zoomStyle ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              {product.isBestseller && (
                <span className="bg-[#E2725B] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Bestseller
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-[#F6C453] text-[#3B2F2F] text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#3B2F2F] text-xs font-bold px-3 py-1 rounded-full border border-[#F4EADB]">
              Ages {product.ageRange} Yrs
            </div>

            <div className="absolute bottom-4 right-4 bg-black/40 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none hidden sm:block">
              Hover over image to zoom
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIdx === i
                      ? 'border-[#7BA88B] scale-105 shadow-md'
                      : 'border-[#F4EADB] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-sunshine">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-sunshine' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#3B2F2F]">{product.rating}</span>
              <span className="text-xs text-[#948282]">({product.reviewCount} parent reviews)</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#3B2F2F] leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-[#948282] mt-1">SKU: {product.sku}</p>
          </div>

          {/* Price Bar */}
          <div className="bg-[#FFF8EF] p-5 rounded-2xl border border-[#F4EADB] flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-extrabold text-[#3B2F2F]">
                  {formatPrice(product.price)}
                </span>
                {product.mrp > product.price && (
                  <span className="text-base text-[#948282] line-through">
                    {formatPrice(product.mrp)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-[#E2725B] bg-[#FDEEEB] px-2 py-0.5 rounded-full">
                    Save {formatPrice(product.mrp - product.price)} ({discountPercent}%)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#7BA88B] font-semibold mt-1">
                ✓ Inclusive of all GST taxes & free shipping above ₹1,499
              </p>
            </div>
          </div>

          <p className="text-sm text-[#6E5A5A] leading-relaxed">
            {product.description}
          </p>

          {/* Quantity and Add to Cart Desktop Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-[#F4EADB] rounded-2xl p-1 bg-white">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-xl hover:bg-[#FFF8EF] flex items-center justify-center text-[#3B2F2F]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-sm text-[#3B2F2F]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-10 rounded-xl hover:bg-[#FFF8EF] flex items-center justify-center text-[#3B2F2F]"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#E2725B] hover:bg-[#C45540] text-white font-bold text-sm shadow-lg shadow-[#E2725B]/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add To Toy Basket</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${
                  isWished
                    ? 'bg-[#E2725B] text-white border-[#E2725B]'
                    : 'bg-white text-[#3B2F2F] border-[#F4EADB] hover:bg-[#FFF8EF]'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${isWished ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* PIN Code Delivery Estimator */}
            <div className="bg-white p-4 rounded-2xl border border-[#F4EADB] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3B2F2F]">
                <Truck className="w-4 h-4 text-[#7BA88B]" />
                <span>Check Delivery by PIN Code</span>
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code (e.g. 560001)"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold rounded-xl"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className="text-xs font-semibold text-[#588469] pt-1">
                  {pincodeStatus}
                </p>
              )}
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center">
              <div className="p-3 bg-[#FFFDF9] rounded-xl border border-[#F4EADB]">
                <ShieldCheck className="w-5 h-5 text-[#588469] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#3B2F2F] block">EN-71 Certified</span>
                <span className="text-[10px] text-[#948282]">Non-toxic finish</span>
              </div>
              <div className="p-3 bg-[#FFFDF9] rounded-xl border border-[#F4EADB]">
                <RotateCcw className="w-5 h-5 text-[#E2725B] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#3B2F2F] block">15-Day Free Return</span>
                <span className="text-[10px] text-[#948282]">No questions asked</span>
              </div>
              <div className="p-3 bg-[#FFFDF9] rounded-xl border border-[#F4EADB]">
                <Sparkles className="w-5 h-5 text-sunshine mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#3B2F2F] block">1-Year Warranty</span>
                <span className="text-[10px] text-[#948282]">Solid wood joints</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Deep Details: What's Inside & Developmental Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        {/* What's Inside */}
        <div className="bg-white rounded-3xl p-8 border border-[#F4EADB] shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#3B2F2F] mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#7BA88B]" /> What's Inside The Box
          </h3>
          <ul className="space-y-3">
            {product.whatsInside?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#6E5A5A]">
                <div className="w-5 h-5 rounded-full bg-[#EBF4EE] text-[#588469] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Developmental Benefits */}
        <div className="bg-white rounded-3xl p-8 border border-[#F4EADB] shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#3B2F2F] mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E2725B]" /> Developmental Milestones Supported
          </h3>
          <div className="space-y-4">
            {product.benefits?.map((benefit, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F4EADB]">
                <h4 className="font-serif font-bold text-sm text-[#3B2F2F] mb-1">
                  {benefit.title}
                </h4>
                <p className="text-xs text-[#6E5A5A] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F4EADB] shadow-sm mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-[#F4EADB] gap-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#3B2F2F]">
              Verified Parent Reviews ({product.reviewCount + productReviews.length})
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-sunshine">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-sunshine" />
                ))}
              </div>
              <span className="text-sm font-bold text-[#3B2F2F]">{product.rating} out of 5 stars</span>
            </div>
          </div>
        </div>

        {/* Existing reviews */}
        <div className="py-8 divide-y divide-[#F4EADB] space-y-6">
          {/* Static Seed review sample */}
          <div className="pt-6 first:pt-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-[#3B2F2F]">Shreya P.</span>
                <span className="text-[10px] text-[#7BA88B] bg-[#EBF4EE] px-2 py-0.5 rounded-full font-bold">
                  ✓ Verified Buyer
                </span>
              </div>
              <span className="text-xs text-[#948282]">2 weeks ago</span>
            </div>
            <div className="flex text-sunshine mb-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-sunshine" />
              ))}
            </div>
            <h5 className="text-xs font-bold text-[#3B2F2F]">Exceptional woodworking and smooth curves</h5>
            <p className="text-xs text-[#6E5A5A] mt-1 leading-relaxed">
              Arrived in beautiful plastic-free packaging. You can smell the subtle natural wood oil. My daughter has been engaged with it every day before naptime.
            </p>
          </div>

          {/* User submitted reviews */}
          {productReviews.map(r => (
            <div key={r.id} className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-[#3B2F2F]">{r.customerName}</span>
                  <span className="text-[10px] text-[#7BA88B] bg-[#EBF4EE] px-2 py-0.5 rounded-full font-bold">
                    ✓ Verified Review
                  </span>
                </div>
                <span className="text-xs text-[#948282]">Just now</span>
              </div>
              <div className="flex text-sunshine mb-1.5">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-sunshine" />
                ))}
              </div>
              <h5 className="text-xs font-bold text-[#3B2F2F]">{r.title}</h5>
              <p className="text-xs text-[#6E5A5A] mt-1 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>

        {/* Leave a review form */}
        <div className="mt-8 pt-8 border-t border-[#F4EADB] bg-[#FFF8EF] p-6 rounded-2xl">
          <h4 className="font-serif text-lg font-bold text-[#3B2F2F] mb-3">
            Write a Parent Review
          </h4>
          {reviewSubmitted ? (
            <div className="p-4 bg-[#7BA88B] text-white rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" /> Thank you for sharing your review with the Montessori community!
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-sunshine"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'fill-sunshine' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika M."
                    value={reviewName}
                    onChange={e => setReviewName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Review Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My toddler loves this!"
                    value={reviewTitle}
                    onChange={e => setReviewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Your Feedback</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell other parents about the craftsmanship, play engagement, and milestones observed..."
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Submit Review
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-bold text-[#3B2F2F]">
            You May Also Love
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Add-to-Cart Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#F4EADB] p-3 px-4 z-40 sm:hidden flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-xs font-serif font-bold text-[#3B2F2F] block leading-none">
            {formatPrice(product.price)}
          </span>
          <span className="text-[10px] text-[#7BA88B] font-bold">Free Shipping</span>
        </div>
        <button
          onClick={() => addToCart(product, quantity)}
          className="flex-1 py-3 px-4 rounded-xl bg-[#E2725B] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> Add to Basket
        </button>
      </div>
    </div>
  );
};
