import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { SearchPage } from '@/views/SearchPage';

export const metadata: Metadata = {
  title: 'Search & Book Luxury Sleeper Bus Tickets | Hopzy',
  description:
    'Compare ticket prices, departure timings, boarding points, operator ratings, and live seat layouts across 3,500+ private and government RTC bus routes in India.',
  alternates: {
    canonical: '/search',
  },
  openGraph: {
    title: 'Search & Book Luxury Sleeper Bus Tickets | Hopzy',
    description:
      'Compare ticket prices, departure timings, boarding points, operator ratings, and live seat layouts across 3,500+ bus routes.',
    url: '/search',
  },
};

const searchJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SearchResultsPage',
  name: 'Hopzy Bus Search & Seat Booking',
  description: 'Live availability and seat layout reservation for intercity luxury buses across India.',
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
        name: 'Bus Search',
        item: 'https://hopzy.demo/search',
      },
    ],
  },
};

export default function SearchRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchJsonLd) }}
      />
      <Suspense fallback={<div className="p-12 text-center text-neutral-500">Loading bus schedules...</div>}>
        <SearchPage />
      </Suspense>
    </>
  );
}
