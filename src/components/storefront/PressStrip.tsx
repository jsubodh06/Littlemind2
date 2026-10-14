import React from 'react';

export const PressStrip: React.FC = () => {
  const publications = [
    'YourStory',
    'Parents India',
    'Architectural Digest',
    'Elle Decor',
    'The Hindu Lifestyle',
    'Vogue Living',
  ];

  return (
    <div className="py-10 border-t border-[#F4EADB] bg-[#FFF8EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#948282] mb-6">
          As Featured In & Celebrated By
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 grayscale hover:grayscale-0 transition-all">
          {publications.map((pub, i) => (
            <span
              key={i}
              className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#3B2F2F] italic"
            >
              {pub}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
