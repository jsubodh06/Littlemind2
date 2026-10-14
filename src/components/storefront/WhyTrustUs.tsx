import React from 'react';
import { TreePine, ShieldCheck, Milestone, BookOpen } from 'lucide-react';
import { SproutDoodle } from '../common/DoodleAccents';

export const WhyTrustUs: React.FC = () => {
  const pillars = [
    {
      icon: <TreePine className="w-8 h-8 text-[#588469]" />,
      title: '100% Solid Natural Wood',
      description: 'Sustainably sourced European Birch and German Beech. Zero MDF, plastic fillers, or formaldehyde-laden particle boards.',
      badge: 'Certified Birch',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#E2725B]" />,
      title: 'Non-Toxic & Teething Safe',
      description: 'Sealed strictly with cold-pressed coconut oils, natural beeswax, and certified waterborne non-toxic pigments.',
      badge: 'EN-71 Tested',
    },
    {
      icon: <Milestone className="w-8 h-8 text-sunshine-dark" />,
      title: 'Calibrated to Milestones',
      description: 'Engineered alongside AMI-certified educators and pediatric physical therapists for exact developmental sensitive windows.',
      badge: 'AMI Approved',
    },
    {
      icon: <BookOpen className="w-8 h-8 text-[#7BA88B]" />,
      title: 'Expert Activity Guides Included',
      description: 'Every play kit includes step-by-step parent guides showing how to introduce materials and observe concentration.',
      badge: 'Parent Playbooks',
    },
  ];

  return (
    <section className="py-20 bg-[#FFFDF9] border-y border-[#F4EADB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#7BA88B] mb-2">
            <SproutDoodle className="w-4 h-4 text-[#588469]" />
            <span>The Little Sprout Standard</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3B2F2F]">
            Why 1,00,000+ Parents Trust Us
          </h2>
          <p className="text-sm text-[#6E5A5A] mt-2">
            We don't manufacture noisy disposable toys. We build heirloom developmental tools designed to be passed down through generations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FFF8EF] rounded-[24px] p-7 border border-[#F4EADB] hover:border-[#7BA88B]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E2725B] bg-[#FDEEEB] px-2.5 py-1 rounded-full inline-block mb-3">
                  {item.badge}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#3B2F2F] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6E5A5A] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
