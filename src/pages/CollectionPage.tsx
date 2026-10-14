import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/storefront/ProductCard';
import { Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { SquiggleUnderline } from '../components/common/DoodleAccents';

interface CollectionPageProps {
  onNavigate: (path: string, params?: Record<string, string>) => void;
  initialCategory?: string;
  initialAge?: string;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  onNavigate,
  initialCategory,
  initialAge,
}) => {
  const { products, categories, ageGroups } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedAge, setSelectedAge] = useState<string>(initialAge || 'all');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<'bestseller' | 'price-asc' | 'price-desc' | 'rating'>('bestseller');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Filter and sort
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
        if (selectedAge !== 'all' && p.ageRange !== selectedAge) return false;
        if (p.price > maxPrice) return false;
        if (inStockOnly && p.stock <= 0) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // default bestseller
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [products, selectedCategory, selectedAge, maxPrice, inStockOnly, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedAge('all');
    setMaxPrice(10000);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedAge !== 'all' || maxPrice < 10000 || inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3B2F2F]">
          Montessori Toys & Play Furniture
        </h1>
        <div className="flex justify-center text-[#E2725B] mt-1">
          <SquiggleUnderline className="w-24 h-3" />
        </div>
        <p className="text-xs sm:text-sm text-[#6E5A5A] mt-2">
          Natural materials, purpose-driven milestone progression, and non-toxic heirloom craft.
        </p>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#F4EADB] shadow-sm mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-4 py-2 rounded-xl bg-[#FFF8EF] border border-[#F4EADB] text-xs font-bold text-[#3B2F2F] flex items-center gap-1.5"
          >
            <Filter className="w-4 h-4 text-[#7BA88B]" />
            <span>Filters</span>
          </button>
          <span className="text-xs font-bold text-[#6E5A5A]">
            Showing <strong className="text-[#3B2F2F]">{filteredProducts.length}</strong> toys
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#E2725B] font-bold hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-[#7BA88B]" />
          <span className="text-xs text-[#948282] hidden sm:inline">Sort By:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs font-bold text-[#3B2F2F] bg-[#FFF8EF] border border-[#F4EADB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#7BA88B]"
          >
            <option value="bestseller">Bestsellers First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Customer Rating</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6`}>
          <div className="bg-white rounded-3xl p-6 border border-[#F4EADB] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#F4EADB] pb-3">
              <h3 className="font-serif font-bold text-sm text-[#3B2F2F] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#7BA88B]" /> Filter Toys
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] font-bold text-[#E2725B] hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Age Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#7BA88B] block mb-2.5">
                Age Stage
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => { setSelectedAge('all'); setCurrentPage(1); }}
                  className={`w-full text-left text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                    selectedAge === 'all'
                      ? 'bg-[#7BA88B] text-white'
                      : 'text-[#3B2F2F] hover:bg-[#FFF8EF]'
                  }`}
                >
                  All Ages
                </button>
                {ageGroups.map(a => (
                  <button
                    key={a.id}
                    onClick={() => { setSelectedAge(a.ageRange); setCurrentPage(1); }}
                    className={`w-full text-left text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                      selectedAge === a.ageRange
                        ? 'bg-[#7BA88B] text-white'
                        : 'text-[#3B2F2F] hover:bg-[#FFF8EF]'
                    }`}
                  >
                    <span>{a.ageRange} Years ({a.name})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="pt-4 border-t border-[#F4EADB]">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7BA88B] block mb-2.5">
                Category
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
                  className={`w-full text-left text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[#7BA88B] text-white'
                      : 'text-[#3B2F2F] hover:bg-[#FFF8EF]'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCategory(c.id); setCurrentPage(1); }}
                    className={`w-full text-left text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors truncate ${
                      selectedCategory === c.id
                        ? 'bg-[#7BA88B] text-white'
                        : 'text-[#3B2F2F] hover:bg-[#FFF8EF]'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="pt-4 border-t border-[#F4EADB]">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="uppercase tracking-wider text-[#7BA88B]">Max Price</span>
                <span className="text-[#3B2F2F] font-serif">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={e => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
                className="w-full accent-[#7BA88B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#948282] mt-1">
                <span>₹1,000</span>
                <span>₹10,000+</span>
              </div>
            </div>

            {/* Stock Toggle */}
            <div className="pt-4 border-t border-[#F4EADB]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => { setInStockOnly(e.target.checked); setCurrentPage(1); }}
                  className="rounded text-[#7BA88B] focus:ring-[#7BA88B] h-4 w-4"
                />
                <span className="text-xs font-bold text-[#3B2F2F]">In-Stock Items Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {paginatedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#F4EADB] space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#3B2F2F]">
                No matching toys found
              </h3>
              <p className="text-xs text-[#948282] max-w-sm mx-auto">
                Try widening your price range or clearing age filters to discover other developmental materials.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-[#7BA88B] text-white text-xs font-bold rounded-xl"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map(prod => (
                  <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-4 py-2 rounded-xl border border-[#F4EADB] bg-white text-xs font-bold disabled:opacity-40"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        currentPage === i + 1
                          ? 'bg-[#E2725B] text-white shadow-sm'
                          : 'bg-white border border-[#F4EADB] text-[#3B2F2F] hover:bg-[#FFF8EF]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="px-4 py-2 rounded-xl border border-[#F4EADB] bg-white text-xs font-bold disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
