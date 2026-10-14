import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';
import { formatPrice } from '../../lib/utils';
import { Plus, Tag, Trash2, Edit2, X, Check } from 'lucide-react';

export const CouponsTab: React.FC = () => {
  const { coupons, saveCoupon, deleteCoupon } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [form, setForm] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percent',
    discountValue: 10,
    minCartValue: 999,
    expiresAt: '2026-12-31',
    isActive: true,
    usageCount: 0,
  });

  const openAdd = () => {
    setEditingCoupon(null);
    setForm({
      id: `coup_${Date.now()}`,
      code: '',
      discountType: 'percent',
      discountValue: 10,
      minCartValue: 999,
      expiresAt: '2026-12-31',
      isActive: true,
      usageCount: 0,
    });
    setModalOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setForm({ ...c });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code) return;
    await saveCoupon({
      id: editingCoupon?.id || form.id || `coup_${Date.now()}`,
      code: form.code.toUpperCase().trim(),
      discountType: form.discountType || 'percent',
      discountValue: Number(form.discountValue) || 10,
      minCartValue: Number(form.minCartValue) || 0,
      expiresAt: form.expiresAt || '2026-12-31',
      isActive: form.isActive ?? true,
      usageCount: form.usageCount || 0,
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3B2F2F]">
            Promotional Coupons & Vouchers ({coupons.length})
          </h2>
          <p className="text-xs text-[#948282]">
            Create percentage or flat discount promo codes for campaigns.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map(cp => (
          <div
            key={cp.id}
            className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between ${
              cp.isActive ? 'border-[#7BA88B]/40' : 'border-gray-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-extrabold text-base text-[#3B2F2F] bg-[#FFF8EF] border border-[#F4EADB] px-3 py-1 rounded-xl">
                  {cp.code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    cp.isActive ? 'bg-[#EBF4EE] text-[#588469]' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {cp.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#6E5A5A]">
                <p className="font-serif text-xl font-bold text-[#588469]">
                  {cp.discountType === 'percent'
                    ? `${cp.discountValue}% OFF`
                    : `${formatPrice(cp.discountValue)} FLAT OFF`}
                </p>
                <p>Min Cart Value: <strong>{formatPrice(cp.minCartValue)}</strong></p>
                <p>Expires On: <strong>{cp.expiresAt}</strong></p>
                <p className="text-[#948282]">Total Usages: {cp.usageCount} times</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[#F4EADB]">
              <button
                onClick={() => openEdit(cp)}
                className="p-1.5 rounded-lg border border-[#F4EADB] hover:bg-[#FFF8EF] text-[#7BA88B]"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete coupon ${cp.code}?`)) deleteCoupon(cp.id);
                }}
                className="p-1.5 rounded-lg border border-[#F4EADB] hover:bg-[#FDEEEB] text-[#E2725B]"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#F4EADB] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SPROUT20"
                  value={form.code || ''}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8EF] uppercase rounded-xl border border-[#F4EADB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Discount Type</label>
                  <select
                    value={form.discountType || 'percent'}
                    onChange={e => setForm({ ...form, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={form.discountValue || 0}
                    onChange={e => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Min Cart Value (₹)</label>
                  <input
                    type="number"
                    value={form.minCartValue || 0}
                    onChange={e => setForm({ ...form, minCartValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiresAt || ''}
                    onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive ?? true}
                    onChange={e => setForm({ ...form, isActive: e.target.checked })}
                    className="rounded text-[#7BA88B]"
                  />
                  <span className="font-bold text-[#3B2F2F]">Activate Coupon Immediately</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F4EADB]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#948282]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7BA88B] text-white font-bold rounded-xl"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
