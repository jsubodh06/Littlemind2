import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatDate } from '../lib/utils';
import { Clock, ArrowLeft, Share2, User } from 'lucide-react';

interface BlogPostPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigate }) => {
  const { blogs } = useStore();
  const blog = blogs.find(b => b.slug === slug) || blogs[0];

  if (!blog) return null;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => onNavigate('/blog')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7BA88B] hover:text-[#588469] mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Articles
      </button>

      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {blog.tags?.map((t, idx) => (
            <span
              key={idx}
              className="text-xs font-bold text-[#588469] bg-[#EBF4EE] px-3 py-1 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#3B2F2F] leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#948282] pt-2 border-y border-[#F4EADB] py-3">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#7BA88B]" />
            <span className="font-bold text-[#3B2F2F]">{blog.author}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{blog.readingTimeMinutes} min read</span>
          </div>
          <span>•</span>
          <span>{formatDate(blog.publishedAt)}</span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="rounded-[32px] overflow-hidden shadow-lg border border-[#F4EADB] mb-12 aspect-[16/9]">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="prose prose-stone max-w-none text-[#6E5A5A] text-sm sm:text-base leading-relaxed space-y-6">
        <p className="font-serif text-lg sm:text-xl text-[#3B2F2F] font-semibold leading-relaxed italic border-l-4 border-[#7BA88B] pl-4 py-1">
          {blog.excerpt}
        </p>

        <div className="whitespace-pre-line leading-loose">
          {blog.content}
        </div>
      </div>

      {/* Share / Back */}
      <div className="mt-14 pt-6 border-t border-[#F4EADB] flex justify-between items-center">
        <button
          onClick={() => onNavigate('/blog')}
          className="px-6 py-2.5 rounded-xl border border-[#F4EADB] bg-white text-xs font-bold text-[#3B2F2F] hover:bg-[#FFF8EF]"
        >
          ← Back to Articles
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: blog.title, url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Article link copied to clipboard!');
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-[#7BA88B] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#588469]"
        >
          <Share2 className="w-3.5 h-3.5" /> Share Article
        </button>
      </div>
    </article>
  );
};
