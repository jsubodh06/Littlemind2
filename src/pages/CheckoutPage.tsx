import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatPrice, generateOrderNumber } from '../lib/utils';
import { Address, Order, PaymentMethod } from '../types';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Printer,
  ShoppingBag,
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (path: string, params?: Record<string, string>) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const {
    items,
    subtotal,
    mrpTotal,
    mrpDiscount,
    coupon,
    couponDiscount,
    shippingFee,
    finalTotal,
    clearCart,
  } = useCart();
  const { currentUser, userProfile } = useAuth();
  const { createOrder } = useStore();

  const [address, setAddress] = useState<Address>({
    fullName: userProfile?.name || currentUser?.displayName || '',
    email: userProfile?.email || currentUser?.email || '',
    phone: userProfile?.phone || '',
    street: '',
    city: '',
    state: 'Karnataka',
    pinCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay_mock');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Razorpay mock modal state
  const [mockRazorpayOpen, setMockRazorpayOpen] = useState(false);

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi NCR', 'Goa', 'Gujarat',
    'Haryana', 'Karnataka', 'Kerala', 'Maharashtra', 'Punjab', 'Rajasthan',
    'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (paymentMethod === 'razorpay_mock') {
      setMockRazorpayOpen(true);
      return;
    }

    // Process COD directly
    await finalizeOrder('pending');
  };

  const finalizeOrder = async (paymentStatus: 'pending' | 'paid') => {
    setIsSubmitting(true);
    try {
      const orderNumber = generateOrderNumber();
      const orderPayload: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        orderNumber,
        customerId: currentUser?.uid || 'guest_' + Date.now(),
        customerName: address.fullName,
        customerEmail: address.email,
        customerPhone: address.phone,
        shippingAddress: address,
        items: items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          mrp: i.product.mrp,
          quantity: i.quantity,
          image: i.product.images[0],
        })),
        subtotal,
        discount: mrpDiscount + couponDiscount,
        shipping: shippingFee,
        total: finalTotal,
        couponCode: coupon?.code,
        status: 'placed',
        paymentMethod,
        paymentStatus,
        notes: orderNotes,
      };

      const order = await createOrder(orderPayload);
      clearCart();
      setCompletedOrder(order);

      // Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7BA88B', '#E2725B', '#F6C453', '#3B2F2F'],
      });
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Unable to process order. Please check all details.');
    } finally {
      setIsSubmitting(false);
      setMockRazorpayOpen(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-[32px] p-8 sm:p-14 border border-[#F4EADB] shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 bg-[#EBF4EE] text-[#588469] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase font-extrabold tracking-widest text-[#7BA88B]">
            Order Confirmed!
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3B2F2F] mt-1 mb-2">
            Thank You For Growing With Us
          </h1>
          <p className="text-sm text-[#6E5A5A] max-w-md mx-auto mb-6">
            We've sent an order receipt to <strong className="text-[#3B2F2F]">{completedOrder.customerEmail}</strong>.
            Our master carpenters are now preparing your handcrafted wooden materials.
          </p>

          <div className="bg-[#FFF8EF] rounded-2xl p-5 border border-[#F4EADB] max-w-md mx-auto mb-8 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#948282]">Order Reference:</span>
              <span className="font-mono font-bold text-[#3B2F2F]">{completedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#948282]">Payment Method:</span>
              <span className="font-bold text-[#3B2F2F] uppercase">
                {completedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#948282]">Total Amount:</span>
              <span className="font-serif font-bold text-[#588469] text-sm">
                {formatPrice(completedOrder.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#948282]">Estimated Delivery:</span>
              <span className="font-bold text-[#3B2F2F]">3 - 5 Business Days</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 rounded-xl border border-[#F4EADB] bg-white text-xs font-bold text-[#3B2F2F] hover:bg-[#FFF8EF] flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
            <button
              onClick={() => onNavigate('/account?tab=orders')}
              className="px-6 py-3 rounded-xl bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold shadow-md flex items-center gap-2"
            >
              Track in Account <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/collections')}
              className="px-6 py-3 rounded-xl bg-[#E2725B] hover:bg-[#C45540] text-white text-xs font-bold shadow-md"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#3B2F2F]">Your Cart is Empty</h2>
        <p className="text-xs text-[#948282]">Add some Montessori toys to proceed to checkout.</p>
        <button
          onClick={() => onNavigate('/collections')}
          className="px-6 py-3 bg-[#7BA88B] text-white text-xs font-bold rounded-xl shadow-md"
        >
          Explore Toys
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-extrabold text-[#3B2F2F]">
          Secure Checkout
        </h1>
        <p className="text-xs text-[#948282] mt-0.5">
          Fast delivery with eco-friendly plastic-free packaging.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Customer Details & Address */}
        <div className="lg:col-span-7 space-y-6">
          {/* Contact Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EADB] shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#3B2F2F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#7BA88B] text-white text-xs flex items-center justify-center">1</span>
              Customer & Shipping Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neha Sharma"
                  value={address.fullName}
                  onChange={e => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Phone Number (WhatsApp updates) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={address.phone}
                  onChange={e => setAddress({ ...address, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Email Address (Order confirmation) *</label>
              <input
                type="email"
                required
                placeholder="e.g. neha@gmail.com"
                value={address.email}
                onChange={e => setAddress({ ...address, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Street Address, Apartment & Landmark *</label>
              <textarea
                required
                rows={2}
                placeholder="e.g. Flat 402, Lotus Greens, 14th Main, Indiranagar"
                value={address.street}
                onChange={e => setAddress({ ...address, street: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-[#3B2F2F] block mb-1">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru"
                  value={address.city}
                  onChange={e => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#3B2F2F] block mb-1">State *</label>
                <select
                  value={address.state}
                  onChange={e => setAddress({ ...address, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                >
                  {indianStates.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#3B2F2F] block mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="560038"
                  value={address.pinCode}
                  onChange={e => setAddress({ ...address, pinCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Delivery Notes / Gift Message (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Leave with security or add birthday note"
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EADB] shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#3B2F2F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#7BA88B] text-white text-xs flex items-center justify-center">2</span>
              Payment Preference
            </h2>

            <div className="space-y-3">
              {/* Razorpay Online */}
              <label
                onClick={() => setPaymentMethod('razorpay_mock')}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start justify-between transition-all ${
                  paymentMethod === 'razorpay_mock'
                    ? 'border-[#7BA88B] bg-[#EBF4EE]/40'
                    : 'border-[#F4EADB] hover:bg-[#FFF8EF]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'razorpay_mock'}
                    onChange={() => setPaymentMethod('razorpay_mock')}
                    className="mt-1 text-[#7BA88B] focus:ring-[#7BA88B]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#3B2F2F] flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#7BA88B]" />
                      Online Payment (UPI, Cards, NetBanking via Razorpay)
                    </span>
                    <p className="text-[11px] text-[#6E5A5A] mt-0.5">
                      Instant checkout with GPay, PhonePe, Paytm, Visa, Mastercard, or RuPay.
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-[#588469] bg-[#EBF4EE] px-2 py-0.5 rounded-full">
                      Razorpay Sandbox Integration Active
                    </span>
                  </div>
                </div>
              </label>

              {/* COD */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start justify-between transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#7BA88B] bg-[#EBF4EE]/40'
                    : 'border-[#F4EADB] hover:bg-[#FFF8EF]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-[#7BA88B] focus:ring-[#7BA88B]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#3B2F2F] flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#E2725B]" />
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-[11px] text-[#6E5A5A] mt-0.5">
                      Pay cash or UPI upon delivery to your doorstep.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EADB] shadow-sm sticky top-28 space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#3B2F2F] pb-3 border-b border-[#F4EADB]">
              Order Summary ({items.length} items)
            </h3>

            {/* Items review */}
            <div className="max-h-60 overflow-y-auto divide-y divide-[#F4EADB] pr-1 space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#3B2F2F] truncate">{product.name}</p>
                    <p className="text-[10px] text-[#948282]">Qty: {quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-[#588469]">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-[#6E5A5A] pt-4 border-t border-[#F4EADB]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#3B2F2F]">{formatPrice(subtotal)}</span>
              </div>
              {mrpDiscount > 0 && (
                <div className="flex justify-between text-[#588469]">
                  <span>Catalog MRP Savings</span>
                  <span>-{formatPrice(mrpDiscount)}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#E2725B]">
                  <span>Coupon ({coupon?.code})</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span className="font-bold text-[#3B2F2F]">
                  {shippingFee === 0 ? <span className="text-[#588469]">FREE</span> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#3B2F2F] pt-3 border-t border-[#F4EADB]">
                <span>Total Payable</span>
                <span className="font-serif text-[#588469] text-xl">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#E2725B] hover:bg-[#C45540] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#E2725B]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'cod' ? 'Place Order (COD)' : `Pay ${formatPrice(finalTotal)} with Razorpay`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-[11px] text-[#948282] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#7BA88B]" />
              <span>256-Bit Bank Grade SSL Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </form>

      {/* Mock Razorpay Popup Modal */}
      {mockRazorpayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200">
            {/* Razorpay Brand Bar */}
            <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#3395FF] flex items-center justify-center text-white font-bold text-sm">
                  R
                </div>
                <div>
                  <h4 className="font-bold text-sm">Razorpay Checkout</h4>
                  <p className="text-[10px] text-blue-200">Little Sprout Playcrafts Pvt Ltd</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-blue-200 block">Amount</span>
                <span className="font-bold text-sm">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-800">
                <p className="font-bold">⚡ Razorpay Simulation Mode Active</p>
                <p className="text-[11px] mt-0.5">
                  This mock integration confirms real order processing and Firestore record synchronization.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-700">Select Test Payment Mode:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => finalizeOrder('paid')}
                    className="p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 text-left font-semibold text-gray-800 flex items-center gap-2"
                  >
                    <span>📱 UPI (GPay / PhonePe)</span>
                  </button>
                  <button
                    onClick={() => finalizeOrder('paid')}
                    className="p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 text-left font-semibold text-gray-800 flex items-center gap-2"
                  >
                    <span>💳 Credit / Debit Card</span>
                  </button>
                  <button
                    onClick={() => finalizeOrder('paid')}
                    className="p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 text-left font-semibold text-gray-800 flex items-center gap-2"
                  >
                    <span>🏛️ NetBanking</span>
                  </button>
                  <button
                    onClick={() => finalizeOrder('paid')}
                    className="p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 text-left font-semibold text-gray-800 flex items-center gap-2"
                  >
                    <span>⚡ Instant Mock Success</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => setMockRazorpayOpen(false)}
                  className="text-xs text-gray-500 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => finalizeOrder('paid')}
                  className="px-6 py-2.5 bg-[#3395FF] hover:bg-[#2080E5] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Simulate Successful Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
