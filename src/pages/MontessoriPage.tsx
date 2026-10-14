import React from 'react';
import { SproutDoodle, SquiggleUnderline } from '../components/common/DoodleAccents';
import { Compass, Sparkles, Eye, CheckCircle2, RefreshCw, Smile } from 'lucide-react';

interface MontessoriPageProps {
  onNavigate: (path: string) => void;
}

export const MontessoriPage: React.FC<MontessoriPageProps> = ({ onNavigate }) => {
  const principles = [
    {
      num: '01',
      title: 'The Prepared Environment',
      description: 'Furniture is scaled to child height. Open, low shelves allow self-selection, cultivating deep agency and intrinsic focus without adult micro-direction.',
      icon: <Compass className="w-6 h-6 text-[#7BA88B]" />,
    },
    {
      num: '02',
      title: 'Hands Are The Instruments of Intelligence',
      description: 'Maria Montessori noted that cognitive architecture is constructed through physical manipulation. Abstract thoughts (counting, physics) start in the fingertips.',
      icon: <Sparkles className="w-6 h-6 text-[#E2725B]" />,
    },
    {
      num: '03',
      title: 'Built-In Control of Error',
      description: 'Materials are engineered so children can see their own mistakes without adult correction (e.g. cylinder blocks will only seat fully when matched properly).',
      icon: <CheckCircle2 className="w-6 h-6 text-sunshine-dark" />,
    },
    {
      num: '04',
      title: 'Natural, Honest Materials',
      description: 'Solid wood conveys real mass, thermal conductivity, and tactile friction. Plastic is deceptively light and hollow; wood teaches real physical reality.',
      icon: <Eye className="w-6 h-6 text-[#588469]" />,
    },
    {
      num: '05',
      title: 'Toy Rotation Over Clutter',
      description: 'Displaying 6-8 materials at a time prevents overstimulation and empowers children to immerse themselves in deep, uninterrupted concentration.',
      icon: <RefreshCw className="w-6 h-6 text-[#E2725B]" />,
    },
    {
      num: '06',
      title: 'Respect For The Child’s Rhythm',
      description: 'Children pass through sensitive periods for movement, language, order, and social bonding. When we honor this rhythm, tantrums diminish and curiosity blossoms.',
      icon: <Smile className="w-6 h-6 text-[#7BA88B]" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7BA88B] bg-[#EBF4EE] px-3.5 py-1.5 rounded-full mb-3">
          <SproutDoodle className="w-4 h-4 text-[#588469]" />
          <span>Parent Philosophy Guide</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#3B2F2F]">
          What Is The Montessori Method?
        </h1>
        <div className="flex justify-center text-[#E2725B] mt-2">
          <SquiggleUnderline className="w-32 h-3" />
        </div>
        <p className="text-sm text-[#6E5A5A] mt-4 leading-relaxed">
          Developed in 1907 by Italian physician Dr. Maria Montessori, this scientific pedagogical approach views children not as passive vessels to be filled, but as natural, eager explorers of truth.
        </p>
      </div>

      {/* Quote Banner */}
      <div className="bg-[#FFF8EF] rounded-[32px] p-8 sm:p-12 border border-[#F4EADB] shadow-sm text-center max-w-3xl mx-auto">
        <blockquote className="font-serif text-xl sm:text-2xl text-[#3B2F2F] italic leading-relaxed">
          "The greatest sign of success for a teacher... is to be able to say, 'The children are now working as if I did not exist.'"
        </blockquote>
        <p className="text-xs font-bold text-[#E2725B] uppercase tracking-wider mt-4">
          — Dr. Maria Montessori
        </p>
      </div>

      {/* 6 Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {principles.map(p => (
          <div
            key={p.num}
            className="bg-white rounded-3xl p-8 border border-[#F4EADB] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#7BA88B]/40 transition-all hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8EF] flex items-center justify-center">
                  {p.icon}
                </div>
                <span className="font-mono text-xs font-bold text-[#948282]">{p.num}</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#3B2F2F] mb-2">{p.title}</h3>
              <p className="text-xs text-[#6E5A5A] leading-relaxed">{p.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-[#588469] rounded-[32px] p-8 sm:p-12 text-white text-center max-w-3xl mx-auto shadow-xl space-y-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold">Ready to Prepare Your Home?</h3>
        <p className="text-xs sm:text-sm text-[#EBF4EE] max-w-lg mx-auto">
          Start with one open shelf, a toddler helper tower, or a stage-based developmental play box.
        </p>
        <button
          onClick={() => onNavigate('/collections')}
          className="px-8 py-3.5 bg-[#FFF8EF] text-[#3B2F2F] font-bold text-xs rounded-2xl shadow-md hover:bg-white transition-all cursor-pointer"
        >
          Explore Montessori Materials
        </button>
      </div>
    </div>
  );
};
