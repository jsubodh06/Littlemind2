import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { formatPrice, formatDate } from '../../lib/utils';
import {
  Search,
  Truck,
  Printer,
  X,
  ExternalLink,
  CheckCircle,
  Clock,
  Package,
} from 'lucide-react';
import { SproutDoodle } from '../common/DoodleAccents';

export const OrdersTab: React.FC = () => {
  const { orders, updateOrderStatus, settings } = useStore();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Tracking modal state
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [trackingUrl, setTrackingUrl] = useState('');
  const [courierName, setCourierName] = useState('BlueDart Express');

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
  };

  const handleSaveTracking = async () => {
    if (trackingOrder) {
      await updateOrderStatus(trackingOrder.id, 'shipped', trackingUrl, courierName);
      setTrackingOrder(null);
      setTrackingUrl('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3B2F2F]">
            Customer Orders & Shipments ({orders.length})
          </h2>
          <p className="text-xs text-[#948282]">
            Monitor fulfillment, update logistics tracking, and print GST tax invoices.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#F4EADB] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[220px] bg-[#FFF8EF] px-3 py-2 rounded-xl border border-[#F4EADB]">
          <Search className="w-4 h-4 text-[#948282]" />
          <input
            type="text"
            placeholder="Search by order #, parent name, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-[#3B2F2F] placeholder-[#948282] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'placed', 'packed', 'shipped', 'delivered', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                filterStatus === st
                  ? 'bg-[#3B2F2F] text-white'
                  : 'bg-[#FFF8EF] text-[#6E5A5A] hover:bg-[#F5EADB]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#F4EADB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF8EF] text-[#948282] uppercase font-bold border-b border-[#F4EADB]">
              <tr>
                <th className="py-3.5 px-6">Order Details</th>
                <th className="py-3.5 px-4">Customer & City</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EADB]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#948282]">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-[#FFFDF9] transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-sm text-[#3B2F2F] block">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] text-[#948282]">{formatDate(order.createdAt)}</span>
                      <span className="text-[10px] uppercase font-bold text-[#7BA88B] block mt-0.5">
                        {order.paymentMethod === 'cod' ? 'COD' : 'Razorpay (Paid)'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-[#3B2F2F] block">{order.customerName}</span>
                      <span className="text-[11px] text-[#6E5A5A]">{order.customerEmail}</span>
                      <span className="text-[10px] text-[#948282] block">
                        {order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.pinCode})
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-[#3B2F2F] block">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)} units
                      </span>
                      <span className="text-[10px] text-[#948282] truncate max-w-[140px] block">
                        {order.items.map(i => i.name).join(', ')}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-serif font-bold text-sm text-[#588469]">
                      {formatPrice(order.total)}
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold uppercase rounded-xl px-2.5 py-1.5 border border-transparent focus:outline-none ${
                          order.status === 'delivered'
                            ? 'bg-[#EBF4EE] text-[#588469]'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'packed'
                            ? 'bg-amber-100 text-amber-700'
                            : order.status === 'cancelled'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-[#FDEEEB] text-[#E2725B]'
                        }`}
                      >
                        <option value="placed">Placed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setTrackingOrder(order);
                            setTrackingUrl(order.trackingLink || '');
                          }}
                          className="p-1.5 rounded-lg border border-[#F4EADB] hover:bg-[#FFF8EF] text-[#7BA88B]"
                          title="Attach Courier Tracking Link"
                        >
                          <Truck className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="p-1.5 rounded-lg border border-[#F4EADB] hover:bg-[#FFF8EF] text-[#3B2F2F]"
                          title="Print Branded Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Link Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#F4EADB] space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">
                Fulfillment & Tracking (Order #{trackingOrder.orderNumber})
              </h3>
              <button onClick={() => setTrackingOrder(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Courier Partner</label>
              <select
                value={courierName}
                onChange={e => setCourierName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
              >
                <option value="BlueDart Express">BlueDart Express</option>
                <option value="Delhivery">Delhivery</option>
                <option value="DTDC">DTDC Courier</option>
                <option value="Speed Post">India Post Speed Post</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Tracking URL or AWB</label>
              <input
                type="url"
                placeholder="https://track.bluedart.com/..."
                value={trackingUrl}
                onChange={e => setTrackingUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setTrackingOrder(null)}
                className="px-4 py-2 text-xs text-[#948282]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTracking}
                className="px-5 py-2 bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold rounded-xl"
              >
                Mark Shipped & Save Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-2xl w-full p-8 sm:p-12 border border-[#F4EADB] shadow-2xl space-y-6 my-8">
            {/* Header */}
            <div className="flex justify-between items-start pb-6 border-b border-[#F4EADB]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#7BA88B] text-white flex items-center justify-center">
                  <SproutDoodle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#3B2F2F]">
                    {settings.brandName || 'Little Sprout'}
                  </h3>
                  <p className="text-[10px] text-[#948282]">Montessori Playcrafts Pvt Ltd</p>
                  <p className="text-[10px] text-[#948282]">GSTIN: 29AAACL1234F1Z8</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#3B2F2F] block">
                  TAX INVOICE
                </span>
                <span className="font-mono text-xs text-[#588469] block">
                  #{selectedInvoiceOrder.orderNumber}
                </span>
                <span className="text-[10px] text-[#948282]">
                  {formatDate(selectedInvoiceOrder.createdAt)}
                </span>
              </div>
            </div>

            {/* Bill to */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <strong className="text-[#3B2F2F] block mb-1">Billed & Shipped To:</strong>
                <p className="font-semibold text-[#3B2F2F]">{selectedInvoiceOrder.customerName}</p>
                <p className="text-[#6E5A5A]">{selectedInvoiceOrder.shippingAddress.street}</p>
                <p className="text-[#6E5A5A]">
                  {selectedInvoiceOrder.shippingAddress.city}, {selectedInvoiceOrder.shippingAddress.state} -{' '}
                  {selectedInvoiceOrder.shippingAddress.pinCode}
                </p>
                <p className="text-[#948282]">{selectedInvoiceOrder.customerPhone}</p>
              </div>
              <div className="text-right">
                <strong className="text-[#3B2F2F] block mb-1">Payment Method:</strong>
                <p className="uppercase font-bold text-[#588469]">
                  {selectedInvoiceOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}
                </p>
                <p className="text-[#948282]">Status: {selectedInvoiceOrder.paymentStatus.toUpperCase()}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-[#F4EADB] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFF8EF] font-bold text-[#948282]">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EADB]">
                  {selectedInvoiceOrder.items.map((it, i) => (
                    <tr key={i}>
                      <td className="p-3 font-semibold text-[#3B2F2F]">{it.name}</td>
                      <td className="p-3 text-center">{it.quantity}</td>
                      <td className="p-3 text-right">{formatPrice(it.price)}</td>
                      <td className="p-3 text-right font-bold">{formatPrice(it.price * it.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total calculation */}
            <div className="space-y-1.5 text-xs text-[#6E5A5A] text-right">
              <p>Subtotal: <strong className="text-[#3B2F2F]">{formatPrice(selectedInvoiceOrder.subtotal)}</strong></p>
              {selectedInvoiceOrder.discount > 0 && (
                <p className="text-[#E2725B]">Discount: -{formatPrice(selectedInvoiceOrder.discount)}</p>
              )}
              <p>Shipping: <strong>{selectedInvoiceOrder.shipping === 0 ? 'FREE' : formatPrice(selectedInvoiceOrder.shipping)}</strong></p>
              <p className="font-serif text-base font-bold text-[#588469] pt-2 border-t border-[#F4EADB]">
                Grand Total: {formatPrice(selectedInvoiceOrder.total)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-[#F4EADB]">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 text-xs font-bold text-[#948282] hover:text-[#3B2F2F]"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-[#3B2F2F] hover:bg-[#251D1D] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
