import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BlogArticle } from '../../types';
import { Plus, Edit2, Trash2, X, BookOpen, Clock, Check } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const BlogTab: React.FC = () => {
  const { blogs, saveBlog, deleteBlog } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogArticle | null>(null);

  const [form, setForm] = useState<Partial<BlogArticle>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80',
    author: 'Suniti Sharma (AMI Educator)',
    tags: ['Montessori At Home', 'Toddler Milestones'],
    readingTimeMinutes: 5,
    isPublished: true,
  });

  const [tagInput, setTagInput] = useState('');

  const openAdd = () => {
    setEditingBlog(null);
    setForm({
      id: `blog_${Date.now()}`,
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80',
      author: 'Suniti Sharma (AMI Educator)',
      tags: ['Montessori At Home', 'Toy Rotation'],
      readingTimeMinutes: 5,
      isPublished: true,
      publishedAt: new Date().toISOString(),
    });
    setModalOpen(true);
  };

  const openEdit = (b: BlogArticle) => {
    setEditingBlog(b);
    setForm({ ...b });
    setModalOpen(true);
  };

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setForm(prev => ({
      ...prev,
      title,
      slug: editingBlog ? prev.slug : slug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    await saveBlog({
      id: editingBlog?.id || form.id || `blog_${Date.now()}`,
      slug: form.slug || `post-${Date.now()}`,
      title: form.title,
      excerpt: form.excerpt || '',
      content: form.content,
      coverImage: form.coverImage || '',
      author: form.author || 'Montessori Team',
      tags: form.tags || [],
      readingTimeMinutes: Number(form.readingTimeMinutes) || 4,
      publishedAt: editingBlog?.publishedAt || new Date().toISOString(),
      isPublished: form.isPublished ?? true,
    });
    setModalOpen(false);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3B2F2F]">
            Montessori Parenting Blog Manager ({blogs.length})
          </h2>
          <p className="text-xs text-[#948282]">
            Draft and publish developmental articles and guides for parents.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(blog => (
          <div
            key={blog.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#F4EADB] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="h-40 overflow-hidden bg-[#F5EADB]">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      blog.isPublished ? 'bg-[#EBF4EE] text-[#588469]' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-[10px] text-[#948282]">
                    {formatDate(blog.publishedAt)}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base text-[#3B2F2F] line-clamp-2">
                  {blog.title}
                </h4>

                <p className="text-xs text-[#6E5A5A] line-clamp-2">{blog.excerpt}</p>
              </div>
            </div>

            <div className="p-5 pt-0 flex justify-between items-center text-xs text-[#948282] border-t border-[#F4EADB] mt-2">
              <span>{blog.readingTimeMinutes} min read</span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(blog)}
                  className="p-1.5 rounded-lg border border-[#F4EADB] hover:bg-[#FFF8EF] text-[#7BA88B]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete article "${blog.title}"?`)) deleteBlog(blog.id);
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

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 flex justify-center">
          <div className="bg-white rounded-[32px] max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-[#F4EADB] my-8 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4EADB]">
              <h3 className="font-serif text-xl font-bold text-[#3B2F2F]">
                {editingBlog ? 'Edit Blog Article' : 'Compose Montessori Article'}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={form.title || ''}
                  onChange={e => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={form.slug || ''}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={form.author || ''}
                    onChange={e => setForm({ ...form, author: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Read Time (Mins)</label>
                  <input
                    type="number"
                    value={form.readingTimeMinutes || 4}
                    onChange={e => setForm({ ...form, readingTimeMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={form.coverImage || ''}
                  onChange={e => setForm({ ...form, coverImage: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">Short Excerpt</label>
                <textarea
                  rows={2}
                  value={form.excerpt || ''}
                  onChange={e => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3B2F2F] block mb-1">Article Body Content *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Markdown or plain formatted article content..."
                  value={form.content || ''}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB] font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished ?? true}
                    onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                    className="rounded text-[#7BA88B]"
                  />
                  <span className="font-bold text-[#3B2F2F]">Publish to Live Blog</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F4EADB]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-[#948282]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#7BA88B] text-white font-bold rounded-xl shadow-md"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
