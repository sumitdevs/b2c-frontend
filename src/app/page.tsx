import React from 'react';
import type { Metadata } from 'next';
import { LandingPage } from '@/views/LandingPage';

export const metadata: Metadata = {
  title: 'Hopzy - Online Bus Ticket Booking & Luxury Sleeper Buses',
  description:
    'Book online bus tickets across 3,500+ private and state bus operators. Enjoy flat 20% OFF with code FIRSTBUS, live GPS tracking, and instant refunds.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Hopzy - Online Bus Ticket Booking & Luxury Sleeper Buses',
    description:
      'Book online bus tickets across 3,500+ private and state bus operators. Enjoy flat 20% OFF with code FIRSTBUS.',
    url: '/',
    images: [
      {
        url: '/images/hero-travel-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Hopzy Bus Booking Banner',
      },
    ],
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I book a bus ticket on Hopzy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simply enter your departure city, destination city, and date of travel in the search box. Compare available buses, select your preferred sleeper or seater berth in the interactive seat map, enter passenger details, and proceed to book.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I select specific sleeper berths (Upper or Lower Deck)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Our interactive two-tier deck selector allows you to view live seat availability with visual distinction between Lower Deck and Upper Deck, single sleeper berths, double shared berths, and ladies-reserved seats.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the instant cancellation and refund policy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cancellations made up to 6 hours before departure qualify for a 100% instant refund back to your original payment method with zero platform cancellation penalty fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I track my bus with live GPS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Once your booking is confirmed, an SMS and email with your live GPS tracking link and bus conductor contact number is dispatched 2 hours prior to scheduled departure.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LandingPage />
    </>
  );
}
