import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { SquiggleUnderline } from '../common/DoodleAccents';

export const FaqSection: React.FC = () => {
  const { faqs } = useStore();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7BA88B] mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Parent Questions Answered</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3B2F2F]">
          Frequently Asked Questions
        </h2>
        <div className="flex justify-center text-[#E2725B] mt-1">
          <SquiggleUnderline className="w-24 h-3" />
        </div>
      </div>

      <div className="space-y-3.5">
        {faqs.map(faq => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all ${
                isOpen
                  ? 'bg-white border-[#7BA88B]/40 shadow-md'
                  : 'bg-[#FFF8EF] border-[#F4EADB] hover:border-[#7BA88B]/30'
              }`}
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-serif text-base sm:text-lg font-bold text-[#3B2F2F]"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#7BA88B] transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#6E5A5A] leading-relaxed border-t border-[#F4EADB]/50 animate-in fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
