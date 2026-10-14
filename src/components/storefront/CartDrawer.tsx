import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/utils';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, Sparkles, ShoppingBag } from 'lucide-react';
import { SproutDoodle } from '../common/DoodleAccents';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    mrpTotal,
    mrpDiscount,
    coupon,
    couponDiscount,
    shippingFee,
    finalTotal,
    amountToFreeShipping,
    freeShippingThreshold,
    applyCoupon,
    removeCoupon,
    couponError,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(
    100,
    Math.round(((freeShippingThreshold - amountToFreeShipping) / freeShippingThreshold) * 100)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const ok = applyCoupon(couponInput);
      if (ok) setCouponInput('');
    }
  };

  const handleCheckout = () => {
    closeCart();
    onNavigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer content */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF8EF] shadow-2xl flex flex-col justify-between border-l border-[#F4EADB]">
          {/* Header */}
          <div className="p-5 border-b border-[#F4EADB] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#588469]" />
              <h2 className="font-serif text-lg font-bold text-[#3B2F2F]">
                Your Toy Basket ({items.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-[#F5EADB] text-[#3B2F2F] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#EBF4EE] p-3.5 border-b border-[#7BA88B]/20">
            {amountToFreeShipping > 0 ? (
              <div>
                <p className="text-xs text-[#588469] font-bold flex items-center justify-between mb-1.5">
                  <span>Add {formatPrice(amountToFreeShipping)} more for FREE Express Shipping!</span>
                  <span>{freeShippingProgress}%</span>
                </p>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7BA88B] rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#588469] font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sunshine" />
                <span>You’ve unlocked Free Express Shipping across India!</span>
              </p>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#F5EADB] flex items-center justify-center text-[#7BA88B]">
                  <SproutDoodle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">
                    Your basket is empty
                  </h3>
                  <p className="text-xs text-[#948282] mt-1 max-w-xs">
                    Start exploring our Montessori climbing gyms, play boxes, and learning towers!
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    onNavigate('/collections');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#7BA88B] text-white text-xs font-bold shadow-md hover:bg-[#588469] transition-all"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-3.5 border border-[#F4EADB] flex gap-3.5 items-center"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-[#3B2F2F] truncate">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-[#948282] mt-0.5">
                      Age: {product.ageRange} yrs
                    </p>

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-[#588469]">
                          {formatPrice(product.price)}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-[10px] text-[#948282] line-through">
                            {formatPrice(product.mrp)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 border border-[#F4EADB] rounded-lg px-2 py-0.5 bg-[#FFF8EF]">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="text-[#6E5A5A] hover:text-[#3B2F2F]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#3B2F2F] w-4 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="text-[#6E5A5A] hover:text-[#3B2F2F]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-[#948282] hover:text-[#E2725B] p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#F4EADB] bg-white space-y-3">
              {/* Coupon Form */}
              {coupon ? (
                <div className="flex items-center justify-between bg-[#EBF4EE] px-3 py-2 rounded-xl border border-[#7BA88B]/30 text-xs">
                  <div className="flex items-center gap-1.5 text-[#588469] font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{coupon.code} Applied ({formatPrice(couponDiscount)} off)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[#E2725B] font-bold hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. SPROUT10)"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] uppercase placeholder:normal-case focus:outline-none focus:border-[#7BA88B]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold rounded-xl"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-[#E2725B] font-semibold">{couponError}</p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#6E5A5A] pt-2 border-t border-[#F4EADB]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#3B2F2F]">{formatPrice(subtotal)}</span>
                </div>
                {mrpDiscount > 0 && (
                  <div className="flex justify-between text-[#588469]">
                    <span>Catalog Savings</span>
                    <span>-{formatPrice(mrpDiscount)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#E2725B]">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-[#3B2F2F]">
                    {shippingFee === 0 ? (
                      <span className="text-[#588469]">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-[#3B2F2F] pt-2 border-t border-[#F4EADB]">
                  <span>Total Amount</span>
                  <span className="font-serif text-[#588469]">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-[#E2725B] hover:bg-[#C45540] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#E2725B]/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
