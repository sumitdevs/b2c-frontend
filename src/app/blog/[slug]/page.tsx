import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BLOG_ARTICLES } from '@/services/mockData';
import { ArrowLeft, Calendar, Clock, User, Tag, Bus, Share2, ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Article Not Found | Hopzy Journal',
    };
  }

  return {
    title: `${article.title} | Hopzy Travel Journal`,
    description: article.excerpt,
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: `/blog/${article.slug}`,
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://hopzy.demo/blog/${article.slug}`,
    },
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hopzy',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hopzy.demo/images/hero-travel-banner.jpg',
      },
    },
    datePublished: '2026-09-12T08:00:00+05:30',
    dateModified: '2026-09-15T09:30:00+05:30',
    keywords: article.tags.join(', '),
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-theme transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Travel Journal</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-theme-light text-theme">
            {article.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Calendar className="w-3.5 h-3.5" />
            {article.publishedAt}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-neutral-900 tracking-tight leading-[1.15]">
          {article.title}
        </h1>

        <p className="text-lg text-neutral-600 leading-relaxed font-normal">
          {article.excerpt}
        </p>

        {/* Author card */}
        <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-12 h-12 rounded-full object-cover border border-neutral-200"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="font-bold text-neutral-900 text-sm">{article.author.name}</div>
            <div className="text-xs text-neutral-500">{article.author.role}</div>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="my-8 rounded-2xl overflow-hidden shadow-lg border border-neutral-200">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-72 sm:h-96 object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Route Highlight Callout */}
      {article.routeHighlight && (
        <div className="my-8 p-5 sm:p-6 bg-theme-light/60 border border-theme/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme text-white flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-theme">
                Featured Route Mentioned in Story
              </div>
              <div className="text-base font-extrabold text-neutral-900">
                {article.routeHighlight.from} → {article.routeHighlight.to}
              </div>
              <div className="text-xs text-neutral-600">
                Recommended Coach: {article.routeHighlight.recommendedBusType}
              </div>
            </div>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-theme text-white text-xs font-bold shadow-sm hover:bg-theme-hover transition-colors"
          >
            <span>Book This Route</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-neutral max-w-none space-y-5 text-neutral-800 leading-relaxed text-base">
        {article.content.split('\n\n').map((para, i) => {
          if (para.startsWith('# ')) {
            return (
              <h2 key={i} className="text-2xl font-bold font-display text-neutral-900 pt-4">
                {para.replace('# ', '')}
              </h2>
            );
          }
          if (para.startsWith('### ')) {
            return (
              <h3 key={i} className="text-lg font-bold text-neutral-900 pt-3">
                {para.replace('### ', '')}
              </h3>
            );
          }
          if (para.trim().length > 0) {
            return <p key={i}>{para.trim()}</p>;
          }
          return null;
        })}
      </div>

      {/* Tags footer */}
      <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-wrap items-center gap-2">
        <Tag className="w-4 h-4 text-neutral-400" />
        <span className="text-xs text-neutral-400 font-semibold mr-1">Tags:</span>
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-semibold px-3 py-1 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 cursor-pointer transition-colors"
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
