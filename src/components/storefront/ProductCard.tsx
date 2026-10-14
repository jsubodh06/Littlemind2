import React, { useState } from 'react';
import { Product } from '../../types';
import { formatPrice, calculateDiscountPercent } from '../../lib/utils';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const isWished = isInWishlist(product.id);

  const discountPercent = calculateDiscountPercent(product.price, product.mrp);
  const displayImage =
    isHovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-[24px] p-4 border border-[#F4EADB] hover:border-[#7BA88B]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative hover:-translate-y-1.5"
    >
      {/* Top Badges & Wishlist */}
      <div className="relative aspect-square rounded-[20px] overflow-hidden bg-[#F5EADB]/50 mb-4 cursor-pointer"
        onClick={() => onNavigate(`/product/${product.slug}`)}
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestseller && (
            <span className="bg-[#E2725B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Bestseller
            </span>
          )}
          {product.isNewLaunch && (
            <span className="bg-[#7BA88B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              New Launch
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#F6C453] text-[#3B2F2F] text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Age pill top right */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-white/90 backdrop-blur-md text-[#3B2F2F] font-bold text-[10px] px-2.5 py-1 rounded-full border border-[#F4EADB] shadow-sm">
            {product.ageRange} Yrs
          </span>
        </div>

        {/* Wishlist button */}
        <button
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md z-10 ${
            isWished
              ? 'bg-[#E2725B] text-white'
              : 'bg-white/90 hover:bg-white text-[#3B2F2F] hover:text-[#E2725B]'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div onClick={() => onNavigate(`/product/${product.slug}`)} className="cursor-pointer">
          {/* Star rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-sunshine">
              <Star className="w-3.5 h-3.5 fill-sunshine" />
            </div>
            <span className="text-xs font-bold text-[#3B2F2F]">{product.rating}</span>
            <span className="text-[10px] text-[#948282]">({product.reviewCount})</span>
          </div>

          <h3 className="font-serif text-sm sm:text-base font-bold text-[#3B2F2F] group-hover:text-[#E2725B] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-[#948282] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-[#F4EADB] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-base sm:text-lg font-bold text-[#3B2F2F]">
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-[#948282] line-through">
                  {formatPrice(product.mrp)}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] font-bold text-[#E2725B]">
                Only {product.stock} left in stock!
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              product.stock <= 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#7BA88B] hover:bg-[#588469] text-white active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock <= 0 ? 'Out of Stock' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
