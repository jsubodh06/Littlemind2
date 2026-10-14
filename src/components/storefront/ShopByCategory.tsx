import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowUpRight } from 'lucide-react';
import { SquiggleUnderline } from '../common/DoodleAccents';

interface ShopByCategoryProps {
  onNavigate: (path: string) => void;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ onNavigate }) => {
  const { categories } = useStore();

  return (
    <section className="py-16 bg-[#F5EADB]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-block text-xs uppercase font-extrabold tracking-wider text-[#7BA88B] mb-2">
              Curated Collections
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3B2F2F] tracking-tight">
              Shop by Category
            </h2>
            <div className="text-[#E2725B] mt-1">
              <SquiggleUnderline className="w-24 h-3" />
            </div>
          </div>
          <button
            onClick={() => onNavigate('/collections')}
            className="text-sm font-bold text-[#E2725B] hover:text-[#C45540] flex items-center gap-1 group self-start md:self-auto"
          >
            <span>Browse All Collections</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/collections?category=${cat.id}`)}
              className="group cursor-pointer bg-white rounded-[28px] overflow-hidden border border-[#F4EADB] hover:border-[#7BA88B]/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden bg-[#F5EADB]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[11px] font-bold tracking-widest uppercase bg-[#7BA88B]/90 backdrop-blur-sm px-2.5 py-1 rounded-full inline-block mb-1">
                      0{idx + 1}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                      {cat.name}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white text-[#3B2F2F] group-hover:bg-[#E2725B] group-hover:text-white flex items-center justify-center transition-all shadow-md shrink-0">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-[#6E5A5A] leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-4 pt-3 border-t border-[#F4EADB] flex items-center justify-between text-xs font-bold text-[#7BA88B] group-hover:text-[#E2725B] transition-colors">
                  <span>Explore items</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
