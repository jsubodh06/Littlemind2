import React, { useState } from 'react';
import { SproutDoodle, LeafDoodle, StarDoodle } from './DoodleAccents';
import { Mail, Phone, MapPin, Instagram, Heart, ArrowRight, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#3B2F2F] text-[#FFF8EF] pt-16 pb-12 mt-24 relative overflow-hidden">
      {/* Decorative organic background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7BA88B]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E2725B]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Newsletter Card */}
        <div className="bg-[#4A3B3B] rounded-3xl p-8 sm:p-12 mb-16 border border-[#6E5A5A]/30 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#7BA88B]/20 text-sunshine text-xs font-bold px-3 py-1 rounded-full mb-3">
                <StarDoodle className="w-3.5 h-3.5 fill-sunshine" />
                <span>The Mindful Play Club</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FFF8EF] leading-snug">
                Join 1,00,000+ parents getting weekly Montessori play ideas
              </h3>
              <p className="text-sm text-[#F5EADB]/80 mt-2">
                No spam, ever. Just pediatric milestone guides, free printable activity schedules, and early access to woodshop drops.
              </p>
            </div>

            <div>
              {subscribed ? (
                <div className="bg-[#7BA88B] text-white p-4 rounded-2xl flex items-center gap-3 animate-in fade-in">
                  <div className="w-8 h-8 rounded-full bg-white text-[#588469] flex items-center justify-center font-bold">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Welcome to the Little Sprout family!</p>
                    <p className="text-xs text-white/90">Check your inbox for your 10% welcome voucher.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-1 px-5 py-3.5 rounded-2xl bg-[#3B2F2F] text-white placeholder-[#948282] border border-[#6E5A5A] focus:outline-none focus:border-[#7BA88B] text-sm"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-[#E2725B] hover:bg-[#C45540] text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm shrink-0"
                  >
                    Subscribe <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4-Column Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#7BA88B] text-[#FFF8EF] flex items-center justify-center">
                <SproutDoodle className="w-6 h-6 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FFF8EF]">
                {settings.brandName || 'Little Sprout'}
              </span>
            </div>
            <p className="text-xs text-[#F5EADB]/80 leading-relaxed max-w-sm">
              We handcraft Montessori developmental toys and architectural play furniture made from sustainably forested European Birch and steam-bent Beechwood. Finished with cold-pressed natural oils and non-toxic waterborne sealants.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#4A3B3B] hover:bg-[#7BA88B] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="w-9 h-9 rounded-full bg-[#4A3B3B] hover:bg-[#7BA88B] flex items-center justify-center text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-sunshine mb-4">
              Explore Toys
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F5EADB]/80">
              <li>
                <button onClick={() => onNavigate('/collections')} className="hover:text-white transition-colors">
                  All Collections
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/collections?category=cat-boxes')} className="hover:text-white transition-colors">
                  Developmental Boxes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/collections?category=cat-climbing')} className="hover:text-white transition-colors">
                  Pikler Triangles & Arches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/collections?category=cat-furniture')} className="hover:text-white transition-colors">
                  Learning Towers & Tables
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/collections?category=cat-sensory')} className="hover:text-white transition-colors">
                  Sensorial & Cylinder Sockets
                </button>
              </li>
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-sunshine mb-4">
              Montessori Life
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F5EADB]/80">
              <li>
                <button onClick={() => onNavigate('/what-is-montessori')} className="hover:text-white transition-colors">
                  What is Montessori?
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                  Our Woodshop & Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/blog')} className="hover:text-white transition-colors">
                  Developmental Blog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                  Help & FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Policies & Contact */}
          <div>
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-sunshine mb-4">
              Care & Help
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F5EADB]/80">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#7BA88B]" />
                <span>{settings.contactPhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#7BA88B]" />
                <span>{settings.contactEmail}</span>
              </li>
              <li className="pt-2">
                <button onClick={() => onNavigate('/policies?type=refund')} className="hover:text-white transition-colors">
                  15-Day Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/policies?type=privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/policies?type=terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#6E5A5A]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F5EADB]/60 gap-4">
          <p>© {new Date().getFullYear()} Little Sprout Playcrafts Pvt Ltd. Handcrafted in India.</p>
          <div className="flex items-center gap-2 text-xs">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-[#E2725B] fill-[#E2725B]" />
            <span>for natural childhood wonder</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
