import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckoutModal } from '@/components/booking/CheckoutModal';

export const viewport: Viewport = {
  themeColor: '#d84e55',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://hopzy.demo'),
  title: {
    default: 'Hopzy - Online Bus Ticket Booking & Travel Guides',
    template: '%s | Hopzy',
  },
  description:
    'Hopzy is India\'s premier online bus ticket booking platform. Compare 3,500+ luxury sleeper and AC coaches, choose seats with real-time maps, and enjoy instant refunds.',
  keywords: [
    'bus booking',
    'online bus tickets',
    'sleeper bus booking',
    'volvo ac bus',
    'hopzy bus',
    'intercity bus tickets',
    'rtc bus booking',
    'bus seat reservation',
  ],
  authors: [{ name: 'Hopzy Travel Technologies' }],
  creator: 'Hopzy',
  publisher: 'Hopzy',
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Hopzy',
    title: 'Hopzy - Online Bus Ticket Booking & Travel Guides',
    description:
      'Book verified luxury AC sleeper and seater buses with live GPS tracking, zero-fee cancellations, and certified sanitized coaches.',
    images: [
      {
        url: '/images/hero-travel-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Hopzy Online Bus Booking Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hopzy - Online Bus Ticket Booking & Travel Guides',
    description:
      'Book verified luxury AC sleeper and seater buses with live GPS tracking, zero-fee cancellations, and sanitized coaches.',
    images: ['/images/hero-travel-banner.jpg'],
    creator: '@hopzytravel',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Schema.org structured data for organization & web reservation application
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://hopzy.demo/#organization',
      name: 'Hopzy',
      url: 'https://hopzy.demo',
      logo: 'https://hopzy.demo/images/hero-travel-banner.jpg',
      sameAs: [
        'https://twitter.com/hopzytravel',
        'https://facebook.com/hopzytravel',
        'https://instagram.com/hopzytravel',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-1800-419-01',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
      },
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://hopzy.demo/#webapp',
      name: 'Hopzy Bus Booking',
      url: 'https://hopzy.demo',
      applicationCategory: 'TravelApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
      description:
        'Online bus ticket booking platform with real-time seat layout selection, live GPS tracking, and instant refund guarantees.',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cabinet+Grotesk:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 text-neutral-900">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CheckoutModal />
        </Providers>
      </body>
    </html>
  );
}
