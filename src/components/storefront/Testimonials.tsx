import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { SquiggleUnderline } from '../common/DoodleAccents';

export const Testimonials: React.FC = () => {
  const { testimonials } = useStore();
  const [current, setCurrent] = useState(0);

  if (!testimonials.length) return null;

  const next = () => setCurrent(prev => (prev + 1) % testimonials.length);
  const prev = () => setCurrent(prev => (prev - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="py-20 bg-[#FFFDF9] border-t border-[#F4EADB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#7BA88B]">
            Stories From The Playroom
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3B2F2F] tracking-tight mt-1">
            Loved By 1,00,000+ Families
          </h2>
          <div className="text-[#E2725B] mt-1 flex justify-center">
            <SquiggleUnderline className="w-24 h-3" />
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-[#FFF8EF] rounded-[32px] p-8 sm:p-14 border border-[#F4EADB] shadow-xl relative">
          <Quote className="w-16 h-16 text-[#F6C453]/20 absolute top-6 left-6 -rotate-12 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Stars */}
            <div className="flex items-center gap-1 text-sunshine mb-6">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-sunshine" />
              ))}
            </div>

            <p className="font-serif text-lg sm:text-2xl text-[#3B2F2F] italic leading-relaxed mb-8">
              "{t.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <img
                src={t.avatar}
                alt={t.authorName}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#7BA88B] shadow-sm"
              />
              <div className="text-left">
                <h4 className="font-serif font-bold text-base text-[#3B2F2F]">
                  {t.authorName}
                </h4>
                <p className="text-xs text-[#7BA88B] font-semibold">{t.childAge}</p>
                <p className="text-[11px] text-[#948282]">{t.location}</p>
              </div>
            </div>
          </div>

          {/* Carousel Arrows */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#F4EADB]">
            <button
              onClick={prev}
              className="p-2.5 rounded-full bg-white hover:bg-[#F5EADB] text-[#3B2F2F] transition-colors shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? 'w-6 bg-[#E2725B]' : 'w-2 bg-[#948282]/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2.5 rounded-full bg-white hover:bg-[#F5EADB] text-[#3B2F2F] transition-colors shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
