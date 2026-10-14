import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { SquiggleUnderline } from '../common/DoodleAccents';
import { ArrowRight } from 'lucide-react';

interface BestsellersProps {
  onNavigate: (path: string) => void;
}

export const Bestsellers: React.FC<BestsellersProps> = ({ onNavigate }) => {
  const { products, ageGroups } = useStore();
  const [selectedAge, setSelectedAge] = useState<string>('all');

  const filteredProducts = products.filter(p => {
    if (selectedAge === 'all') return true;
    return p.ageRange === selectedAge;
  });

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#E2725B]">
            Loved By 1,00,000+ Homes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3B2F2F] tracking-tight mt-1">
            Our Most-Cherished Bestsellers
          </h2>
          <div className="text-[#7BA88B] mt-1">
            <SquiggleUnderline className="w-28 h-3" />
          </div>
        </div>

        {/* Age Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#F5EADB]/80 p-1.5 rounded-2xl border border-[#F4EADB]">
          <button
            onClick={() => setSelectedAge('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedAge === 'all'
                ? 'bg-white text-[#3B2F2F] shadow-sm'
                : 'text-[#6E5A5A] hover:text-[#3B2F2F]'
            }`}
          >
            All Ages
          </button>
          {ageGroups.map(a => (
            <button
              key={a.id}
              onClick={() => setSelectedAge(a.ageRange)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedAge === a.ageRange
                  ? 'bg-white text-[#3B2F2F] shadow-sm'
                  : 'text-[#6E5A5A] hover:text-[#3B2F2F]'
              }`}
            >
              {a.ageRange} Yrs
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {filteredProducts.slice(0, 8).map(prod => (
          <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => onNavigate('/collections')}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border border-[#F4EADB] hover:border-[#7BA88B] text-[#3B2F2F] hover:text-[#588469] font-bold text-sm shadow-sm transition-all"
        >
          <span>View All Montessori Materials</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
