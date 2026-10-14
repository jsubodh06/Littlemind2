import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SiteSettings, HeroBanner, Testimonial, Faq } from '../../types';
import { Plus, Edit2, Trash2, Save, Sparkles, Check } from 'lucide-react';

export const CmsTab: React.FC = () => {
  const { settings, saveSettings, testimonials, faqs } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'announcement' | 'banners' | 'testimonials' | 'faqs'>('announcement');
  const [announcementText, setAnnouncementText] = useState(settings.announcementBarText);
  const [announcementLink, setAnnouncementLink] = useState(settings.announcementBarLink);
  const [announcementActive, setAnnouncementActive] = useState(settings.announcementBarActive);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  // Banners state
  const [banners, setBanners] = useState<HeroBanner[]>(settings.heroBanners || []);

  const handleSaveAnnouncement = async () => {
    const updated: SiteSettings = {
      ...settings,
      announcementBarText: announcementText,
      announcementBarLink: announcementLink,
      announcementBarActive: announcementActive,
    };
    await saveSettings(updated);
    setSavedNote('Announcement bar updated and live on storefront!');
    setTimeout(() => setSavedNote(null), 3000);
  };

  const handleSaveBanners = async () => {
    const updated: SiteSettings = {
      ...settings,
      heroBanners: banners,
    };
    await saveSettings(updated);
    setSavedNote('Hero carousel slides updated!');
    setTimeout(() => setSavedNote(null), 3000);
  };

  const updateBannerField = (index: number, field: keyof HeroBanner, value: string) => {
    setBanners(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex border-b border-[#F4EADB] gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('announcement')}
          className={`pb-3 font-serif text-sm font-bold relative whitespace-nowrap ${
            activeSubTab === 'announcement' ? 'text-[#7BA88B]' : 'text-[#948282] hover:text-[#3B2F2F]'
          }`}
        >
          Top Announcement Bar
          {activeSubTab === 'announcement' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#7BA88B]" />}
        </button>

        <button
          onClick={() => setActiveSubTab('banners')}
          className={`pb-3 font-serif text-sm font-bold relative whitespace-nowrap ${
            activeSubTab === 'banners' ? 'text-[#7BA88B]' : 'text-[#948282] hover:text-[#3B2F2F]'
          }`}
        >
          Hero Carousel Slides ({banners.length})
          {activeSubTab === 'banners' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#7BA88B]" />}
        </button>

        <button
          onClick={() => setActiveSubTab('testimonials')}
          className={`pb-3 font-serif text-sm font-bold relative whitespace-nowrap ${
            activeSubTab === 'testimonials' ? 'text-[#7BA88B]' : 'text-[#948282] hover:text-[#3B2F2F]'
          }`}
        >
          Parent Testimonials ({testimonials.length})
          {activeSubTab === 'testimonials' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#7BA88B]" />}
        </button>

        <button
          onClick={() => setActiveSubTab('faqs')}
          className={`pb-3 font-serif text-sm font-bold relative whitespace-nowrap ${
            activeSubTab === 'faqs' ? 'text-[#7BA88B]' : 'text-[#948282] hover:text-[#3B2F2F]'
          }`}
        >
          Store FAQs ({faqs.length})
          {activeSubTab === 'faqs' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#7BA88B]" />}
        </button>
      </div>

      {savedNote && (
        <div className="p-3 bg-[#EBF4EE] text-[#588469] rounded-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" /> {savedNote}
        </div>
      )}

      {/* ANNOUNCEMENT BAR */}
      {activeSubTab === 'announcement' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4EADB] shadow-sm max-w-2xl space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4EADB]">
            <h3 className="font-serif text-base font-bold text-[#3B2F2F]">
              Top Announcement Ribbon
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={announcementActive}
                onChange={e => setAnnouncementActive(e.target.checked)}
                className="rounded text-[#7BA88B]"
              />
              <span className="font-bold text-[#3B2F2F]">Visible on Storefront</span>
            </label>
          </div>

          <div>
            <label className="font-bold text-[#3B2F2F] block mb-1">Banner Announcement Text</label>
            <input
              type="text"
              value={announcementText}
              onChange={e => setAnnouncementText(e.target.value)}
              placeholder="e.g. 🌿 Earth Month: Free Solid Wood Teether on orders above ₹1,999!"
              className="w-full px-3 py-2.5 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
            />
          </div>

          <div>
            <label className="font-bold text-[#3B2F2F] block mb-1">Target Click URL</label>
            <input
              type="text"
              value={announcementLink}
              onChange={e => setAnnouncementLink(e.target.value)}
              placeholder="/collections"
              className="w-full px-3 py-2.5 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
            />
          </div>

          <button
            onClick={handleSaveAnnouncement}
            className="px-6 py-2.5 bg-[#7BA88B] hover:bg-[#588469] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Announcement Bar
          </button>
        </div>
      )}

      {/* HERO BANNERS */}
      {activeSubTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-xs text-[#948282]">
              Edit slide headlines, subtitles, image backgrounds, and CTA links.
            </p>
            <button
              onClick={handleSaveBanners}
              className="px-5 py-2.5 bg-[#7BA88B] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save All Banners
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {banners.map((b, idx) => (
              <div
                key={b.id || idx}
                className="bg-white rounded-3xl p-6 border border-[#F4EADB] shadow-sm space-y-3 text-xs"
              >
                <div className="flex justify-between items-center pb-2 border-b border-[#F4EADB]">
                  <span className="font-bold text-[#7BA88B] uppercase">Slide 0{idx + 1}</span>
                  <span className="text-[10px] text-[#948282]">{b.tagline}</span>
                </div>

                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={b.tagline}
                    onChange={e => updateBannerField(idx, 'tagline', e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Main Heading</label>
                  <input
                    type="text"
                    value={b.title}
                    onChange={e => updateBannerField(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Subtitle</label>
                  <textarea
                    rows={2}
                    value={b.subtitle}
                    onChange={e => updateBannerField(idx, 'subtitle', e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-[#3B2F2F] block mb-1">Button Text</label>
                    <input
                      type="text"
                      value={b.ctaText}
                      onChange={e => updateBannerField(idx, 'ctaText', e.target.value)}
                      className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#3B2F2F] block mb-1">Button Link</label>
                    <input
                      type="text"
                      value={b.ctaLink}
                      onChange={e => updateBannerField(idx, 'ctaLink', e.target.value)}
                      className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#3B2F2F] block mb-1">Background Image URL</label>
                  <input
                    type="url"
                    value={b.image}
                    onChange={e => updateBannerField(idx, 'image', e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF8EF] rounded-xl border border-[#F4EADB]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TESTIMONIALS */}
      {activeSubTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(t => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-6 border border-[#F4EADB] shadow-sm space-y-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.authorName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#7BA88B]"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#3B2F2F]">{t.authorName}</h4>
                    <p className="text-[11px] text-[#7BA88B]">{t.childAge}</p>
                    <p className="text-[10px] text-[#948282]">{t.location}</p>
                  </div>
                </div>
                <p className="text-[#6E5A5A] italic leading-relaxed">"{t.quote}"</p>
                <span className="text-[10px] font-bold text-sunshine-dark block">
                  ★ {t.rating} / 5 Stars
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQS */}
      {activeSubTab === 'faqs' && (
        <div className="space-y-3">
          {faqs.map(f => (
            <div
              key={f.id}
              className="bg-white rounded-2xl p-4 border border-[#F4EADB] shadow-sm text-xs space-y-1"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-serif font-bold text-sm text-[#3B2F2F]">{f.question}</h4>
                <span className="text-[10px] bg-[#EBF4EE] text-[#588469] font-bold px-2 py-0.5 rounded-full">
                  {f.category}
                </span>
              </div>
              <p className="text-[#6E5A5A] leading-relaxed pt-1">{f.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
