import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/utils';
import { Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag, Star } from 'lucide-react';
import { SproutDoodle, SquiggleUnderline } from '../common/DoodleAccents';
import { Product } from '../../types';

interface ToyFinderQuizProps {
  onNavigate: (path: string) => void;
}

export const ToyFinderQuiz: React.FC<ToyFinderQuizProps> = ({ onNavigate }) => {
  const { products } = useStore();
  const { addToCart } = useCart();

  const [step, setStep] = useState<number>(1);
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [recommended, setRecommended] = useState<Product[]>([]);

  const ageOptions = [
    { id: '0-1', label: '0 - 12 Months', desc: 'Infant Discovery & Visual Tracking' },
    { id: '1-2', label: '1 - 2 Years', desc: 'First Steps, Climbing & Grasping' },
    { id: '2-3', label: '2 - 3 Years', desc: 'Toddler Independence & Sorting' },
    { id: '3-4', label: '3 - 4 Years', desc: 'Problem Solving & Early Math' },
    { id: '4-15', label: '4+ Years', desc: 'Master Building & STEM Logic' },
  ];

  const goalOptions = [
    { id: 'climb', label: 'Active Indoor Movement & Energy', category: 'cat-climbing' },
    { id: 'focus', label: 'Concentration & Sensory Calm', category: 'cat-boxes' },
    { id: 'independence', label: 'Practical Life & Kitchen Helper', category: 'cat-practical' },
    { id: 'motor', label: 'Fine Motor & Hand-Eye Precision', category: 'cat-sensory' },
    { id: 'stem', label: 'Early Math, Art & Architecture', category: 'cat-stem' },
  ];

  const handleCalculate = (age: string, goal: string) => {
    // Filter matching products
    let matches = products.filter(p => p.ageRange === age);
    const goalObj = goalOptions.find(g => g.id === goal);
    if (goalObj) {
      const categoryMatches = matches.filter(p => p.categoryId === goalObj.category);
      if (categoryMatches.length > 0) {
        matches = categoryMatches;
      }
    }
    if (matches.length === 0) {
      matches = products.slice(0, 3);
    }
    setRecommended(matches.slice(0, 3));
    setStep(3);
  };

  const resetQuiz = () => {
    setStep(1);
    setSelectedAge('');
    setSelectedGoal('');
    setRecommended([]);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#FFF8EF] to-[#F5EADB]/40 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[32px] p-8 sm:p-14 shadow-2xl border border-[#F4EADB] relative">
          <div className="text-center max-w-lg mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7BA88B] bg-[#EBF4EE] px-3.5 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sunshine" />
              <span>Interactive Recommendation Tool</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3B2F2F]">
              Find The Perfect Toy In 30 Seconds
            </h2>
            <div className="flex justify-center text-[#E2725B] mt-1">
              <SquiggleUnderline className="w-24 h-3" />
            </div>
            <p className="text-xs sm:text-sm text-[#6E5A5A] mt-3">
              Answer 2 simple questions to receive pediatric-matched developmental play recommendations.
            </p>
          </div>

          {/* Step 1: Select Age */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-[#F4EADB] pb-3">
                <span className="text-xs font-extrabold uppercase text-[#7BA88B]">Step 1 of 2</span>
                <span className="text-xs text-[#948282]">Child's Age Bracket</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3B2F2F] text-center">
                How old is your little explorer?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ageOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedAge(opt.id);
                      setStep(2);
                    }}
                    className="p-5 rounded-2xl border-2 border-[#F4EADB] hover:border-[#7BA88B] hover:bg-[#EBF4EE]/50 text-left transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-serif text-lg font-bold text-[#3B2F2F] group-hover:text-[#588469]">
                        {opt.label}
                      </span>
                      <p className="text-xs text-[#6E5A5A] mt-1">{opt.desc}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <span className="w-7 h-7 rounded-full bg-[#F5EADB] group-hover:bg-[#7BA88B] group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                        →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Goal */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-[#F4EADB] pb-3">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-[#948282] hover:text-[#3B2F2F]"
                >
                  ← Back to Age
                </button>
                <span className="text-xs font-extrabold uppercase text-[#7BA88B]">Step 2 of 2</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#3B2F2F] text-center">
                What developmental milestone are you focusing on most right now?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {goalOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedGoal(opt.id);
                      handleCalculate(selectedAge, opt.id);
                    }}
                    className="p-5 rounded-2xl border-2 border-[#F4EADB] hover:border-[#E2725B] hover:bg-[#FDEEEB]/40 text-left transition-all group flex items-center justify-between"
                  >
                    <span className="font-serif text-base font-bold text-[#3B2F2F] group-hover:text-[#E2725B]">
                      {opt.label}
                    </span>
                    <ArrowRight className="w-5 h-5 text-[#948282] group-hover:text-[#E2725B] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Recommendations Output */}
          {step === 3 && (
            <div className="space-y-8 animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between border-b border-[#F4EADB] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase text-[#7BA88B]">Custom Play Plan</span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3B2F2F] mt-0.5">
                    Recommended for your child's milestone
                  </h3>
                </div>
                <button
                  onClick={resetQuiz}
                  className="text-xs font-bold text-[#E2725B] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {recommended.map(prod => (
                  <div
                    key={prod.id}
                    className="bg-[#FFF8EF] rounded-2xl p-4 border border-[#F4EADB] flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-36 object-cover rounded-xl mb-3 cursor-pointer"
                        onClick={() => onNavigate(`/product/${prod.slug}`)}
                      />
                      <div className="flex items-center gap-1 text-xs text-sunshine mb-1">
                        <Star className="w-3.5 h-3.5 fill-sunshine" />
                        <span className="font-bold text-[#3B2F2F]">{prod.rating}</span>
                      </div>
                      <h4
                        onClick={() => onNavigate(`/product/${prod.slug}`)}
                        className="font-serif text-sm font-bold text-[#3B2F2F] line-clamp-2 cursor-pointer hover:text-[#E2725B]"
                      >
                        {prod.name}
                      </h4>
                      <p className="text-xs text-[#588469] font-bold mt-1">
                        {formatPrice(prod.price)}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F4EADB] flex gap-2">
                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="flex-1 py-2 rounded-xl bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => onNavigate('/collections')}
                  className="text-xs font-bold text-[#6E5A5A] hover:text-[#3B2F2F] underline"
                >
                  Or explore all {products.length} Montessori materials →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
