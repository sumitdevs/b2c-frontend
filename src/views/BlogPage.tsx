'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchBlogArticles,
  setSelectedCategory,
  setSelectedTag,
  setBlogSearchQuery,
  setActiveArticle,
} from '../store/slices/blogSlice';
import { setSearchParams, searchBuses } from '../store/slices/searchSlice';
import { setCurrentPage } from '../store/slices/navigationSlice';
import { BlogArticle } from '../types';
import { BLOG_ARTICLES } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/Dialog';
import {
  BookOpen,
  Calendar,
  Clock,
  Compass,
  Search,
  Sparkles,
  Tag,
  ArrowRight,
  User,
  Share2,
  Bus,
  Check,
  ExternalLink,
} from 'lucide-react';

export const BlogPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { articles, selectedCategory, selectedTag, searchQuery, activeArticle, isLoading } =
    useAppSelector((state) => state.blog);

  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    dispatch(
      fetchBlogArticles({
        category: selectedCategory,
        tag: selectedTag || undefined,
        search: searchQuery || undefined,
      })
    );
  }, [dispatch, selectedCategory, selectedTag, searchQuery]);

  useEffect(() => {
    const articleSlug = searchParams?.get('article');
    if (articleSlug) {
      const source = articles && articles.length > 0 ? articles : BLOG_ARTICLES;
      const match = source.find((a) => a.slug === articleSlug);
      if (match) {
        dispatch(setActiveArticle(match));
      }
    }
  }, [searchParams, articles, dispatch]);

  const CATEGORIES = [
    'All',
    'Travel Guide',
    'Tips & Hacks',
    'Route Reviews',
    'Weekend Getaways',
  ];

  const handleBookRoute = (from?: string, to?: string) => {
    if (from && to) {
      const updated = { from, to, date: '2026-09-22' };
      dispatch(setSearchParams(updated));
      dispatch(searchBuses(updated));
      dispatch(setActiveArticle(null));
      dispatch(setCurrentPage('search'));
      router.push('/search');
    }
  };

  const handleShareArticle = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const displayArticles = articles && articles.length > 0 ? articles : BLOG_ARTICLES;
  const featured = displayArticles[0];
  const regularArticles = displayArticles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-light text-theme text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>The Official Hopzy Travel Journal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-neutral-900">
          Stories, Route Guides & Sleeper Travel Tips
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
          Expert guides on long-distance overnight buses, road trip itineraries, scenic mountain highways, and eco-friendly transit.
        </p>

        {/* SEARCH & FILTER BAR */}
        <div className="pt-2 max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setBlogSearchQuery(e.target.value))}
              placeholder="Search guides (e.g. 'sleeper', 'Bangalore', 'electric', 'scenic')..."
              className="w-full h-12 pl-11 pr-4 bg-white border border-neutral-300 rounded-2xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-theme focus:border-theme shadow-xs"
            />
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => dispatch(setSelectedCategory(cat))}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURED STORY HERO CARD */}
      {featured && !searchQuery && (
        <div
          id={`blog-card-featured-${featured.id}`}
          className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all group grid grid-cols-1 lg:grid-cols-12"
        >
          <Link
            href={`/blog/${featured.slug}`}
            className="lg:col-span-7 h-64 sm:h-80 lg:h-full relative overflow-hidden block"
          >
            <img
              src={featured.coverImage}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="theme">{featured.category}</Badge>
            </div>
          </Link>

          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {featured.publishedAt}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readTime}
                </span>
              </div>

              <div>
                <Link href={`/blog/${featured.slug}`} className="block group/title">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-neutral-900 group-hover/title:text-theme transition-colors leading-snug">
                    {featured.title}
                  </h2>
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                <img
                  src={featured.author.avatar}
                  alt={featured.author.name}
                  className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                />
                <div>
                  <div className="text-xs font-bold text-neutral-900">{featured.author.name}</div>
                  <div className="text-[10px] text-neutral-500">{featured.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  id="featured-read-details-btn"
                  href={`/blog/${featured.slug}`}
                  className="text-xs font-bold text-white bg-theme hover:bg-theme-hover px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ARTICLES GRID */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-neutral-900">
            {searchQuery
              ? `Search Results for "${searchQuery}" (${displayArticles.length})`
              : 'Latest Travel Guides'}
          </h2>
          {selectedTag && (
            <button
              onClick={() => dispatch(setSelectedTag(null))}
              className="text-xs text-theme hover:underline cursor-pointer"
            >
              Clear tag: #{selectedTag}
            </button>
          )}
        </div>

        {displayArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 space-y-3">
            <BookOpen className="w-8 h-8 text-neutral-400 mx-auto" />
            <p className="text-sm font-semibold text-neutral-700">No articles match your search</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                dispatch(setSelectedCategory('All'));
                dispatch(setBlogSearchQuery(''));
                dispatch(setSelectedTag(null));
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchQuery ? displayArticles : regularArticles).map((article) => (
              <article
                key={article.id}
                id={`blog-card-${article.id}`}
                className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <Link href={`/blog/${article.slug}`} className="block h-48 relative overflow-hidden">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-xs font-semibold">
                        {article.category}
                      </Badge>
                    </div>
                  </Link>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                      <span>{article.publishedAt}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    <Link href={`/blog/${article.slug}`} className="block group/title">
                      <h3 className="font-bold font-display text-base text-neutral-900 group-hover/title:text-theme transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {article.tags.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => dispatch(setSelectedTag(tag))}
                        className="text-[10px] font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                    <span className="font-medium text-neutral-800">{article.author.name}</span>
                    <div className="flex items-center gap-2">
                      <Link
                        id={`read-details-btn-${article.id}`}
                        href={`/blog/${article.slug}`}
                        className="text-xs text-theme hover:text-theme-hover font-bold px-2.5 py-1 rounded-lg hover:bg-theme-light transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Read Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* DETAILED ARTICLE READER DIALOG */}
      {activeArticle && (
        <Dialog
          open={Boolean(activeArticle)}
          onOpenChange={(open) => {
            if (!open) dispatch(setActiveArticle(null));
          }}
        >
          <DialogContent
            id="blog-details-modal"
            className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-10"
          >
            <DialogHeader className="text-left pb-2 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <Badge variant="theme">{activeArticle.category}</Badge>
                <div className="flex items-center gap-2 pr-6">
                  <Link
                    href={`/blog/${activeArticle.slug}`}
                    className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-700 flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Full Page</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleShareArticle}
                    className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 cursor-pointer flex items-center gap-1 text-xs"
                    title="Share Guide Link"
                  >
                    {shareCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                    <span>{shareCopied ? 'Copied!' : 'Share'}</span>
                  </button>
                </div>
              </div>

              <DialogTitle className="text-2xl sm:text-3xl font-black font-display text-neutral-900 leading-tight">
                {activeArticle.title}
              </DialogTitle>

              <DialogDescription className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                {activeArticle.excerpt}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 pt-2">
              {/* Author header */}
              <div className="flex items-center gap-3 py-2.5 border-y border-neutral-100">
                <img
                  src={activeArticle.author.avatar}
                  alt={activeArticle.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                />
                <div>
                  <div className="text-xs font-bold text-neutral-900">
                    {activeArticle.author.name}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {activeArticle.author.role} • {activeArticle.publishedAt} •{' '}
                    {activeArticle.readTime}
                  </div>
                </div>
              </div>

              {/* Cover image */}
              <div className="rounded-2xl overflow-hidden max-h-72 border border-neutral-200/80">
                <img
                  src={activeArticle.coverImage}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Related Bus Route Callout Box */}
              {activeArticle.routeHighlight && (
                <div className="bg-theme-light border border-theme-light rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-theme text-white flex items-center justify-center shrink-0">
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-theme block">
                        Featured Bus Route
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-neutral-900">
                        {activeArticle.routeHighlight.from} → {activeArticle.routeHighlight.to}
                      </h4>
                      <p className="text-xs text-neutral-600">
                        Recommended: {activeArticle.routeHighlight.recommendedBusType}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="theme"
                    size="sm"
                    onClick={() =>
                      handleBookRoute(
                        activeArticle.routeHighlight?.from,
                        activeArticle.routeHighlight?.to
                      )
                    }
                    className="shrink-0 font-bold"
                  >
                    Book This Route <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}

              {/* Formatted Article Body content */}
              <div className="text-neutral-800 text-sm leading-relaxed space-y-4 font-normal">
                {activeArticle.content.split('\n\n').map((para, idx) => {
                  if (para.startsWith('### ')) {
                    return (
                      <h4 key={idx} className="text-base font-bold text-neutral-900 pt-2">
                        {para.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (para.startsWith('## ')) {
                    return (
                      <h3 key={idx} className="text-lg font-bold text-neutral-900 pt-3 border-b pb-1 border-neutral-100">
                        {para.replace('## ', '')}
                      </h3>
                    );
                  }
                  if (para.startsWith('# ')) {
                    return (
                      <h2 key={idx} className="text-xl font-black text-neutral-900 pt-4">
                        {para.replace('# ', '')}
                      </h2>
                    );
                  }
                  return (
                    <p key={idx} className="text-neutral-700 leading-relaxed">
                      {para}
                    </p>
                  );
                })}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-400 font-medium">Tags:</span>
                {activeArticle.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                <Link
                  href={`/blog/${activeArticle.slug}`}
                  className="text-xs font-semibold text-theme hover:underline flex items-center gap-1"
                >
                  Open in Dedicated Full Page <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(setActiveArticle(null))}
                >
                  Close Reader
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
