import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatDate } from '../lib/utils';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { SproutDoodle, SquiggleUnderline } from '../components/common/DoodleAccents';

interface BlogListPageProps {
  onNavigate: (path: string) => void;
}

export const BlogListPage: React.FC<BlogListPageProps> = ({ onNavigate }) => {
  const { blogs } = useStore();
  const publishedBlogs = blogs.filter(b => b.isPublished);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center max-w-xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7BA88B] bg-[#EBF4EE] px-3.5 py-1.5 rounded-full mb-3">
          <BookOpen className="w-4 h-4 text-[#588469]" />
          <span>The Mindful Playbook</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3B2F2F]">
          Montessori Parenting & Developmental Articles
        </h1>
        <div className="flex justify-center text-[#E2725B] mt-1">
          <SquiggleUnderline className="w-24 h-3" />
        </div>
        <p className="text-xs sm:text-sm text-[#6E5A5A] mt-2">
          Evidence-backed play insights, toy rotation strategies, and room setups curated by child development specialists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publishedBlogs.map(post => (
          <article
            key={post.id}
            onClick={() => onNavigate(`/blog/${post.slug}`)}
            className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-[#F4EADB] hover:border-[#7BA88B]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-[#F5EADB]">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags?.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold text-[#588469] bg-[#EBF4EE] px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#3B2F2F] group-hover:text-[#E2725B] transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-[#6E5A5A] line-clamp-3 mt-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between text-xs text-[#948282] border-t border-[#F4EADB] mt-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {post.readingTimeMinutes} min read
              </span>
              <span className="text-[#E2725B] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
