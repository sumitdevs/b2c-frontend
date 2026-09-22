import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { BlogPage } from '@/views/BlogPage';

export const metadata: Metadata = {
  title: 'Travel Guides, Sleeper Tips & Route Reviews | Hopzy Journal',
  description:
    'Discover curated intercity bus travel guides, sleeper coach packing hacks, scenic highway itineraries, and electric bus reviews on the official Hopzy Travel Journal.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Travel Guides, Sleeper Tips & Route Reviews | Hopzy Journal',
    description:
      'Discover curated intercity bus travel guides, sleeper coach packing hacks, scenic highway itineraries, and electric bus reviews.',
    url: '/blog',
    type: 'website',
  },
};

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Hopzy Travel Journal',
  description: 'Official travel tips, sleeper bus packing guides, and route reviews for travelers across India.',
  url: 'https://hopzy.demo/blog',
  publisher: {
    '@type': 'Organization',
    name: 'Hopzy',
    logo: {
      '@type': 'ImageObject',
      url: 'https://hopzy.demo/images/hero-travel-banner.jpg',
    },
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://hopzy.demo/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Travel Journal',
        item: 'https://hopzy.demo/blog',
      },
    ],
  },
};

export default function BlogRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <Suspense fallback={<div className="p-12 text-center text-neutral-500">Loading travel articles...</div>}>
        <BlogPage />
      </Suspense>
    </>
  );
}
