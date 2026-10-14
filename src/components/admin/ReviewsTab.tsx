import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, Check, X, MessageSquare, ShieldCheck } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const ReviewsTab: React.FC = () => {
  const { reviews, products, updateReviewStatus } = useStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredReviews = reviews.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3B2F2F]">
            Product Reviews Moderation ({reviews.length})
          </h2>
          <p className="text-xs text-[#948282]">
            Approve genuine customer submissions to feature them on product pages.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#F4EADB]">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                filter === tab
                  ? 'bg-[#3B2F2F] text-white shadow-sm'
                  : 'text-[#6E5A5A] hover:text-[#3B2F2F]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#F4EADB] space-y-2">
            <MessageSquare className="w-10 h-10 text-[#7BA88B] mx-auto opacity-60" />
            <h3 className="font-serif font-bold text-sm text-[#3B2F2F]">
              No reviews in this queue
            </h3>
            <p className="text-xs text-[#948282]">
              Customer submissions from product pages will appear here for review.
            </p>
          </div>
        ) : (
          filteredReviews.map(rev => {
            const prod = products.find(p => p.id === rev.productId);
            return (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 border border-[#F4EADB] shadow-sm flex flex-col sm:flex-row items-start justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-bold text-sm text-[#3B2F2F]">
                      {rev.customerName}
                    </span>
                    <span className="text-[10px] text-[#948282]">({rev.customerEmail})</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        rev.status === 'approved'
                          ? 'bg-[#EBF4EE] text-[#588469]'
                          : rev.status === 'rejected'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {rev.status}
                    </span>
                    <span className="text-[10px] text-[#948282]">{formatDate(rev.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-1 text-sunshine">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-sunshine' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>

                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3B2F2F]">
                    {rev.title}
                  </h4>
                  <p className="text-xs text-[#6E5A5A] leading-relaxed max-w-2xl">{rev.comment}</p>

                  {prod && (
                    <div className="pt-2 flex items-center gap-2 text-xs text-[#7BA88B]">
                      <span className="text-[#948282]">Product:</span>
                      <strong className="text-[#3B2F2F]">{prod.name}</strong>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => updateReviewStatus(rev.id, 'approved')}
                    className="px-4 py-2 bg-[#7BA88B] hover:bg-[#588469] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => updateReviewStatus(rev.id, 'rejected')}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
