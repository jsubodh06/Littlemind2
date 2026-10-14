import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { SproutDoodle } from '../common/DoodleAccents';

interface HeroCarouselProps {
  onNavigate: (path: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigate }) => {
  const { settings } = useStore();
  const banners = settings.heroBanners || [];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  const currentBanner = banners[currentIdx];

  const handlePrev = () => {
    setCurrentIdx(prev => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIdx(prev => (prev + 1) % banners.length);
  };

  return (
    <section className="relative overflow-hidden pt-4 pb-8 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] overflow-hidden bg-[#F5EADB] min-h-[480px] sm:min-h-[520px] flex items-center shadow-xl border border-[#F4EADB]">
          {/* Background Image with warm gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              className="w-full h-full object-cover object-center transition-all duration-700 transform scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8EF] via-[#FFF8EF]/85 to-transparent sm:w-2/3" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8EF] via-transparent to-transparent sm:hidden" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 max-w-xl p-8 sm:p-14 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#7BA88B]/20 text-[#588469] text-xs font-extrabold px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-[#7BA88B]/30 shadow-sm animate-in fade-in">
              <SproutDoodle className="w-4 h-4 text-[#588469]" />
              <span>{currentBanner.tagline}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#3B2F2F] tracking-tight leading-[1.15]">
              {currentBanner.title}
            </h1>

            <p className="text-sm sm:text-base text-[#6E5A5A] leading-relaxed">
              {currentBanner.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate(currentBanner.ctaLink || '/collections')}
                className="px-7 py-3.5 rounded-2xl bg-[#E2725B] hover:bg-[#C45540] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#E2725B]/25 hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 group cursor-pointer"
              >
                <span>{currentBanner.ctaText || 'Shop Collection'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigate('/what-is-montessori')}
                className="px-6 py-3.5 rounded-2xl bg-white/80 hover:bg-white text-[#3B2F2F] font-bold text-sm border border-[#F4EADB] backdrop-blur-md transition-all shadow-sm"
              >
                Why Montessori?
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#3B2F2F] flex items-center justify-center shadow-md backdrop-blur-sm transition-all"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#3B2F2F] flex items-center justify-center shadow-md backdrop-blur-sm transition-all"
                aria-label="Next banner"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentIdx ? 'w-8 bg-[#E2725B]' : 'w-2 bg-[#3B2F2F]/30 hover:bg-[#3B2F2F]/50'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
