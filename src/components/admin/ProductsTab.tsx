import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Package,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';

export const ProductsTab: React.FC = () => {
  const { products, categories, ageGroups, saveProduct, deleteProduct } = useStore();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterAge, setFilterAge] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [form, setForm] = useState<Partial<Product>>({
    name: '',
    slug: '',
    price: 1999,
    mrp: 2499,
    sku: '',
    stock: 20,
    ageRange: '1-2',
    categoryId: categories[0]?.id || 'cat-boxes',
    tags: ['Montessori', 'Natural Wood'],
    isBestseller: false,
    isNewLaunch: false,
    description: '',
    whatsInside: ['Handcrafted wooden element', 'Activity parent playbook'],
    benefits: [
      { title: 'Fine Motor Skills', description: 'Supports pincer grip and hand-eye dexterity.' },
    ],
    images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80'],
    rating: 5.0,
    reviewCount: 1,
    seoTitle: '',
    seoDescription: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [insideInput, setInsideInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Filter products
  const filtered = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'all' || p.categoryId === filterCat;
    const matchesAge = filterAge === 'all' || p.ageRange === filterAge;
    return matchesSearch && matchesCat && matchesAge;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      id: `prod_${Date.now()}`,
      name: '',
      slug: '',
      price: 1999,
      mrp: 2499,
      sku: `LS-${Math.floor(1000 + Math.random() * 9000)}`,
      stock: 15,
      ageRange: '1-2',
      categoryId: categories[0]?.id || 'cat-boxes',
      tags: ['Montessori', 'Natural Wood'],
      isBestseller: false,
      isNewLaunch: true,
      description: '',
      whatsInside: ['Solid Beechwood Core Item', 'Parent Activity Card'],
      benefits: [
        { title: 'Sensory Tactile Experience', description: 'Promotes sensory tactile exploration.' },
      ],
      images: [
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80',
      ],
      rating: 5.0,
      reviewCount: 0,
      seoTitle: '',
      seoDescription: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setForm({ ...p });
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setForm(prev => ({
      ...prev,
      name,
      slug: editingProduct ? prev.slug : slug,
      seoTitle: prev.seoTitle || name,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        id: editingProduct?.id || form.id || `prod_${Date.now()}`,
        updatedAt: new Date().toISOString(),
        createdAt: editingProduct?.createdAt || new Date().toISOString(),
      } as Product;

      await saveProduct(payload);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      await deleteProduct(id);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags?.includes(tagInput.trim())) {
      setForm(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags?.filter(tag => tag !== t) }));
  };

  const addWhatsInside = () => {
    if (insideInput.trim()) {
      setForm(prev => ({ ...prev, whatsInside: [...(prev.whatsInside || []), insideInput.trim()] }));
      setInsideInput('');
    }
  };

  const removeWhatsInside = (index: number) => {
    setForm(prev => ({ ...prev, whatsInside: prev.whatsInside?.filter((_, i) => i !== index) }));
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setForm(prev => ({ ...prev, images: [...(prev.images || []), imageInput.trim()] }));
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3B2F2F]">
            Product Catalog ({products.length})
          </h2>
          <p className="text-xs text-[#948282]">
            Manage items, pricing, woodshop inventory, and developmental benefits.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#F4EADB] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-[#FFF8EF] px-3 py-2 rounded-xl border border-[#F4EADB]">
          <Search className="w-4 h-4 text-[#948282]" />
          <input
            type="text"
            placeholder="Search products by title or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-[#3B2F2F] placeholder-[#948282] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="text-xs font-bold text-[#3B2F2F] bg-[#FFF8EF] border border-[#F4EADB] rounded-xl px-3 py-2"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={filterAge}
            onChange={e => setFilterAge(e.target.value)}
            className="text-xs font-bold text-[#3B2F2F] bg-[#FFF8EF] border border-[#F4EADB] rounded-xl px-3 py-2"
          >
            <option value="all">All Ages</option>
            {ageGroups.map(a => (
              <option key={a.id} value={a.ageRange}>{a.ageRange} Yrs</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#F4EADB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF8EF] text-[#948282] uppercase font-bold border-b border-[#F4EADB]">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-4">Category & Age</th>
                <th className="py-3.5 px-4">Price / MRP</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Flags</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EADB]">
              {filtered.map(prod => (
                <tr key={prod.id} className="hover:bg-[#FFFDF9] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-12 h-12 object-cover rounded-xl shrink-0"
                      />
                      <div>
                        <span className="font-serif font-bold text-sm text-[#3B2F2F] block">
                          {prod.name}
                        </span>
                        <span className="text-[10px] text-[#948282] font-mono">SKU: {prod.sku}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-[#3B2F2F] block">
                      {categories.find(c => c.id === prod.categoryId)?.name || prod.categoryId}
                    </span>
                    <span className="text-[10px] text-[#7BA88B] font-bold">
                      Ages {prod.ageRange} Yrs
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-[#588469] block">{formatPrice(prod.price)}</span>
                    <span className="text-[10px] text-[#948282] line-through">{formatPrice(prod.mrp)}</span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`font-bold px-2.5 py-1 rounded-full text-[10px] ${
                        prod.stock <= 5
                          ? 'bg-[#FDEEEB] text-[#E2725B]'
                          : 'bg-[#EBF4EE] text-[#588469]'
                      }`}
                    >
                      {prod.stock} in stock
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {prod.isBestseller && (
                        <span className="bg-[#E2725B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Bestseller
                        </span>
                      )}
                      {prod.isNewLaunch && (
                        <span className="bg-[#7BA88B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          New
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 rounded-lg border border-[#F4EADB] hover:bg-[#FFF8EF] text-[#7BA88B]"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 rounded-lg border border-[#F4EADB] hover:bg-[#FDEEEB] text-[#E2725B]"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-[#F4EADB] my-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F4EADB]">
              <h3 className="font-serif text-xl font-bold text-[#3B2F2F]">
                {editingProduct ? 'Edit Product' : 'Add New Montessori Material'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#FFF8EF] text-[#3B2F2F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              {/* Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={form.name || ''}
                    onChange={e => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug || ''}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
              </div>

              {/* Price, MRP, SKU, Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.price || 0}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">MRP Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.mrp || 0}
                    onChange={e => setForm({ ...form, mrp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={form.sku || ''}
                    onChange={e => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Units in Stock *</label>
                  <input
                    type="number"
                    required
                    value={form.stock || 0}
                    onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
              </div>

              {/* Category, Age Range, Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Category</label>
                  <select
                    value={form.categoryId || ''}
                    onChange={e => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Age Range</label>
                  <select
                    value={form.ageRange || '1-2'}
                    onChange={e => setForm({ ...form, ageRange: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  >
                    {ageGroups.map(a => (
                      <option key={a.id} value={a.ageRange}>{a.ageRange} Years ({a.name})</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isBestseller || false}
                      onChange={e => setForm({ ...form, isBestseller: e.target.checked })}
                      className="rounded text-[#E2725B]"
                    />
                    <span className="font-bold text-[#3B2F2F]">Bestseller</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isNewLaunch || false}
                      onChange={e => setForm({ ...form, isNewLaunch: e.target.checked })}
                      className="rounded text-[#7BA88B]"
                    />
                    <span className="font-bold text-[#3B2F2F]">New Launch</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={form.description || ''}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                />
              </div>

              {/* Images list */}
              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">Image URLs</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageInput}
                    onChange={e => setImageInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 bg-[#7BA88B] text-white font-bold rounded-xl"
                  >
                    Add Image
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {form.images?.map((img, i) => (
                    <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-[#F4EADB]">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* "What's Inside" Checklist */}
              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">What's Inside The Box</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. 1x Solid Birch Climbing Ramp"
                    value={insideInput}
                    onChange={e => setInsideInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                  <button
                    type="button"
                    onClick={addWhatsInside}
                    className="px-4 py-2 bg-[#7BA88B] text-white font-bold rounded-xl"
                  >
                    Add Item
                  </button>
                </div>
                <div className="space-y-1">
                  {form.whatsInside?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#FFF8EF] p-2 rounded-xl border border-[#F4EADB]">
                      <span>{item}</span>
                      <button type="button" onClick={() => removeWhatsInside(i)} className="text-red-500 hover:underline">
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO Meta Fields */}
              <div className="p-4 bg-[#FFF8EF] rounded-2xl border border-[#F4EADB] space-y-3">
                <span className="font-bold text-[#7BA88B] uppercase tracking-wider block">
                  SEO & Search Optimization
                </span>
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={form.seoTitle || ''}
                    onChange={e => setForm({ ...form, seoTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#F4EADB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Meta Description</label>
                  <input
                    type="text"
                    value={form.seoDescription || ''}
                    onChange={e => setForm({ ...form, seoDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#F4EADB]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#F4EADB]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#F4EADB] text-xs font-bold text-[#6E5A5A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-2.5 bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
