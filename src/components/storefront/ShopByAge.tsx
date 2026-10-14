import React from 'react';
import { useStore } from '../../context/StoreContext';
import { SquiggleUnderline } from '../common/DoodleAccents';

interface ShopByAgeProps {
  onNavigate: (path: string) => void;
}

export const ShopByAge: React.FC<ShopByAgeProps> = ({ onNavigate }) => {
  const { ageGroups } = useStore();

  const blobClasses = [
    'rounded-blob bg-[#EBF4EE] hover:bg-[#D9EADC]',
    'rounded-blob-2 bg-[#FEF8E7] hover:bg-[#FCECC3]',
    'rounded-blob bg-[#FDEEEB] hover:bg-[#F9D7D0]',
    'rounded-blob-2 bg-[#E8F1F5] hover:bg-[#D4E4EC]',
    'rounded-blob bg-[#F2EAF7] hover:bg-[#E3D1EE]',
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3B2F2F] tracking-tight">
          Shop by Developmental Stage
        </h2>
        <div className="flex justify-center mt-2 text-[#E2725B]">
          <SquiggleUnderline className="w-28 h-3" />
        </div>
        <p className="text-sm text-[#6E5A5A] mt-3">
          Every developmental window is unique. Choose precision age-matched toys that align with your child’s sensitive periods.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {ageGroups.map((group, index) => {
          const bgStyle = blobClasses[index % blobClasses.length];
          return (
            <div
              key={group.id}
              onClick={() => onNavigate(`/collections?age=${group.ageRange}`)}
              className={`${bgStyle} p-6 sm:p-8 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl flex flex-col items-center text-center border border-[#F4EADB]/60 group`}
            >
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center font-serif text-xl sm:text-2xl font-bold text-[#3B2F2F] group-hover:bg-[#E2725B] group-hover:text-white transition-all duration-300">
                {group.ageRange}
              </div>

              <span className="text-xs uppercase font-extrabold tracking-wider text-[#7BA88B] mt-4 block">
                Years Old
              </span>

              <h3 className="font-serif text-base sm:text-lg font-bold text-[#3B2F2F] mt-1 group-hover:text-[#E2725B] transition-colors">
                {group.name}
              </h3>

              <p className="text-xs text-[#6E5A5A] mt-2 line-clamp-2">
                {group.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
