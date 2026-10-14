import React from 'react';
import { Award, Users, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export const TrustMarquee: React.FC = () => {
  const items = [
    { icon: <Users className="w-4 h-4 text-[#7BA88B]" />, text: 'Trusted by 1,00,000+ Mindful Parents' },
    { icon: <ShieldCheck className="w-4 h-4 text-[#E2725B]" />, text: '100% Non-Toxic & Edible Oil Finishes' },
    { icon: <Award className="w-4 h-4 text-sunshine" />, text: 'Best Montessori Brand Award 2025' },
    { icon: <Heart className="w-4 h-4 text-[#E2725B]" />, text: 'Proudly Handcrafted in India' },
    { icon: <CheckCircle2 className="w-4 h-4 text-[#7BA88B]" />, text: 'Sustainably Forested European Birch' },
    { icon: <Sparkles className="w-4 h-4 text-sunshine" />, text: 'Pediatrician & Educator Approved' },
  ];

  return (
    <div className="border-y border-[#F4EADB] bg-[#F5EADB]/40 py-3.5 overflow-hidden">
      <div className="flex animate-marquee gap-8 sm:gap-14 whitespace-nowrap">
        {[...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#3B2F2F]">
            {item.icon}
            <span>{item.text}</span>
            <span className="text-[#948282] ml-4">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
