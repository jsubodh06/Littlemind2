import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category, AgeGroup } from '../../types';
import { Plus, Edit2, Trash2, X, Layers, Milestone } from 'lucide-react';

export const CategoriesTab: React.FC = () => {
  const { categories, ageGroups, saveCategory, deleteCategory, saveAgeGroup, deleteAgeGroup } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'categories' | 'ages'>('categories');

  // Category Modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    image: '',
    order: categories.length + 1,
  });

  // Age Modal
  const [ageModalOpen, setAgeModalOpen] = useState(false);
  const [editingAge, setEditingAge] = useState<AgeGroup | null>(null);
  const [ageForm, setAgeForm] = useState<Partial<AgeGroup>>({
    name: '',
    ageRange: '',
    description: '',
    color: '#EBF4EE',
    order: ageGroups.length + 1,
  });

  const openAddCategory = () => {
    setEditingCat(null);
    setCatForm({
      id: `cat_${Date.now()}`,
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      order: categories.length + 1,
    });
    setCatModalOpen(true);
  };

  const openEditCategory = (c: Category) => {
    setEditingCat(c);
    setCatForm({ ...c });
    setCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name) return;
    const slug = catForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await saveCategory({
      id: editingCat?.id || catForm.id || `cat_${Date.now()}`,
      name: catForm.name,
      slug: catForm.slug || slug,
      description: catForm.description || '',
      image: catForm.image || '',
      order: Number(catForm.order) || 1,
    });
    setCatModalOpen(false);
  };

  const openAddAge = () => {
    setEditingAge(null);
    setAgeForm({
      id: `age_${Date.now()}`,
      name: '',
      ageRange: '',
      description: '',
      color: '#EBF4EE',
      order: ageGroups.length + 1,
    });
    setAgeModalOpen(true);
  };

  const openEditAge = (a: AgeGroup) => {
    setEditingAge(a);
    setAgeForm({ ...a });
    setAgeModalOpen(true);
  };

  const handleSaveAge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ageForm.name || !ageForm.ageRange) return;
    await saveAgeGroup({
      id: editingAge?.id || ageForm.id || `age_${Date.now()}`,
      name: ageForm.name,
      ageRange: ageForm.ageRange,
      description: ageForm.description || '',
      color: ageForm.color || '#EBF4EE',
      order: Number(ageForm.order) || 1,
    });
    setAgeModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs header */}
      <div className="flex border-b border-[#F4EADB] gap-6">
        <button
          onClick={() => setActiveSubTab('categories')}
          className={`pb-3 font-serif text-base font-bold flex items-center gap-2 relative ${
            activeSubTab === 'categories' ? 'text-[#7BA88B]' : 'text-[#948282] hover:text-[#3B2F2F]'
          }`}
        >
          <Layers className="w-4 h-4" /> Categories ({categories.length})
          {activeSubTab === 'categories' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#7BA88B]" />}
        </button>

        <button
          onClick={() => setActiveSubTab('ages')}
          className={`pb-3 font-serif text-base font-bold flex items-center gap-2 relative ${
            activeSubTab === 'ages' ? 'text-[#7BA88B]' : 'text-[#948282] hover:text-[#3B2F2F]'
          }`}
        >
          <Milestone className="w-4 h-4" /> Age Groups ({ageGroups.length})
          {activeSubTab === 'ages' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#7BA88B]" />}
        </button>
      </div>

      {/* CATEGORIES VIEW */}
      {activeSubTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={openAddCategory}
              className="px-4 py-2 bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(c => (
              <div
                key={c.id}
                className="bg-white rounded-3xl p-5 border border-[#F4EADB] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-36 object-cover rounded-2xl mb-3"
                  />
                  <div className="flex justify-between items-start">
                    <h4 className="font-serif font-bold text-base text-[#3B2F2F]">{c.name}</h4>
                    <span className="text-[10px] font-bold text-[#948282] bg-[#FFF8EF] px-2 py-0.5 rounded-full">
                      Order: {c.order}
                    </span>
                  </div>
                  <p className="text-xs text-[#6E5A5A] mt-1">{c.description}</p>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[#F4EADB]">
                  <button
                    onClick={() => openEditCategory(c)}
                    className="p-1.5 rounded-lg border border-[#F4EADB] hover:bg-[#FFF8EF] text-[#7BA88B]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete category "${c.name}"?`)) deleteCategory(c.id);
                    }}
                    className="p-1.5 rounded-lg border border-[#F4EADB] hover:bg-[#FDEEEB] text-[#E2725B]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AGE GROUPS VIEW */}
      {activeSubTab === 'ages' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={openAddAge}
              className="px-4 py-2 bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Age Stage
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ageGroups.map(a => (
              <div
                key={a.id}
                className="bg-white rounded-3xl p-6 border border-[#F4EADB] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-serif font-bold text-base mb-3 border border-[#F4EADB]"
                    style={{ backgroundColor: a.color }}
                  >
                    {a.ageRange}
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#3B2F2F]">{a.name}</h4>
                  <p className="text-xs text-[#6E5A5A] mt-1">{a.description}</p>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#F4EADB]">
                  <span className="text-[10px] text-[#948282]">Sort: #{a.order}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditAge(a)}
                      className="p-1.5 rounded-lg border border-[#F4EADB] hover:bg-[#FFF8EF] text-[#7BA88B]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete age bracket "${a.ageRange}"?`)) deleteAgeGroup(a.id);
                      }}
                      className="p-1.5 rounded-lg border border-[#F4EADB] hover:bg-[#FDEEEB] text-[#E2725B]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Modal */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#F4EADB] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">
              {editingCat ? 'Edit Category' : 'Create New Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catForm.name || ''}
                  onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                />
              </div>
              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">Image URL</label>
                <input
                  type="url"
                  value={catForm.image || ''}
                  onChange={e => setCatForm({ ...catForm, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                />
              </div>
              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catForm.description || ''}
                  onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                />
              </div>
              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">Display Order</label>
                <input
                  type="number"
                  value={catForm.order || 1}
                  onChange={e => setCatForm({ ...catForm, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#948282]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7BA88B] text-white font-bold rounded-xl shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Age Modal */}
      {ageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#F4EADB] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">
              {editingAge ? 'Edit Age Group' : 'Add Age Group'}
            </h3>
            <form onSubmit={handleSaveAge} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Age Range *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2-3"
                    value={ageForm.ageRange || ''}
                    onChange={e => setAgeForm({ ...ageForm, ageRange: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={ageForm.order || 1}
                    onChange={e => setAgeForm({ ...ageForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">Stage Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Curious Builder"
                  value={ageForm.name || ''}
                  onChange={e => setAgeForm({ ...ageForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                />
              </div>
              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">Tint Color (Hex)</label>
                <input
                  type="text"
                  placeholder="#EBF4EE"
                  value={ageForm.color || ''}
                  onChange={e => setAgeForm({ ...ageForm, color: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                />
              </div>
              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={ageForm.description || ''}
                  onChange={e => setAgeForm({ ...ageForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAgeModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#948282]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7BA88B] text-white font-bold rounded-xl shadow-sm"
                >
                  Save Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
