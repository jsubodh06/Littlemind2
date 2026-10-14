import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SiteSettings } from '../../types';
import { Save, RefreshCw, CheckCircle, Database, Sparkles } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { settings, saveSettings, seedDatabase } = useStore();

  const [form, setForm] = useState<SiteSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSeed = async (force: boolean = false) => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await seedDatabase(force);
      setSeedResult(res.message);
    } catch (err: any) {
      setSeedResult(err.message || 'Seeding failed.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#3B2F2F]">
          Global Store Configuration & Settings
        </h2>
        <p className="text-xs text-[#948282]">
          Manage brand details, flat shipping rules, customer care channels, and database initializers.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-[#EBF4EE] text-[#588469] rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Store settings saved successfully!
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F4EADB] shadow-sm space-y-6 text-xs">
        <h3 className="font-serif text-lg font-bold text-[#3B2F2F] pb-3 border-b border-[#F4EADB]">
          Brand & Shipping Rules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-[#3B2F2F] block mb-1">Brand Name *</label>
            <input
              type="text"
              required
              value={form.brandName || ''}
              onChange={e => setForm({ ...form, brandName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
            />
          </div>

          <div>
            <label className="font-bold text-[#3B2F2F] block mb-1">Instagram Profile URL</label>
            <input
              type="url"
              value={form.instagramUrl || ''}
              onChange={e => setForm({ ...form, instagramUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-[#3B2F2F] block mb-1">Standard Flat Shipping Fee (₹)</label>
            <input
              type="number"
              required
              value={form.shippingFee || 0}
              onChange={e => setForm({ ...form, shippingFee: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
            />
          </div>

          <div>
            <label className="font-bold text-[#3B2F2F] block mb-1">Free Shipping Order Threshold (₹)</label>
            <input
              type="number"
              required
              value={form.freeShippingThreshold || 0}
              onChange={e => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
            />
          </div>
        </div>

        <h3 className="font-serif text-lg font-bold text-[#3B2F2F] pt-4 pb-3 border-b border-[#F4EADB]">
          Customer Support Contacts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-[#3B2F2F] block mb-1">Support Email Address</label>
            <input
              type="email"
              required
              value={form.contactEmail || ''}
              onChange={e => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
            />
          </div>

          <div>
            <label className="font-bold text-[#3B2F2F] block mb-1">Support Phone / WhatsApp</label>
            <input
              type="tel"
              required
              value={form.contactPhone || ''}
              onChange={e => setForm({ ...form, contactPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#F4EADB] flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#7BA88B] hover:bg-[#588469] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" /> Save Site Settings
          </button>
        </div>
      </form>

      {/* Database Seeder Tool */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F4EADB] shadow-sm space-y-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EBF4EE] text-[#588469] flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">
              Firestore Sample Data Seeder
            </h3>
            <p className="text-[#6E5A5A] mt-0.5 leading-relaxed">
              Populate or re-synchronize Firestore with 12 authentic Montessori products (Pikler gym, object permanence box, arch rocker, learning tower, etc.), 6 categories, 5 age stages, 4 testimonials, 8 FAQs, and promotional coupons.
            </p>
          </div>
        </div>

        {seedResult && (
          <div className="p-3 bg-[#EBF4EE] text-[#588469] rounded-xl font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sunshine" /> {seedResult}
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            disabled={seeding}
            onClick={() => handleSeed(false)}
            className="px-5 py-2.5 bg-[#3B2F2F] hover:bg-[#251D1D] text-white font-bold rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
            <span>{seeding ? 'Seeding Firestore...' : 'Seed Initial Sample Dataset'}</span>
          </button>

          <button
            type="button"
            disabled={seeding}
            onClick={() => {
              if (window.confirm('Force overwrite all products and categories with pristine sample data?')) {
                handleSeed(true);
              }
            }}
            className="px-5 py-2.5 border border-[#E2725B] text-[#E2725B] hover:bg-[#FDEEEB] font-bold rounded-xl disabled:opacity-50 cursor-pointer"
          >
            Force Re-Seed & Overwrite
          </button>
        </div>
      </div>
    </div>
  );
};
