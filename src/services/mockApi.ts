import { Bus, SearchParams, Offer, RoutePopular, BlogArticle, BookingPayload } from '../types';
import { BASE_BUSES, POPULAR_ROUTES, MOCK_OFFERS, BLOG_ARTICLES, CITIES } from './mockData';

// Simulated network latency for realistic UX with loading indicators
const SIMULATED_LATENCY_MS = 250;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Integration-Ready Bus Booking Service Interface
 * Easily replaceable with Axios or Fetch against a production REST API
 */
export interface BusServiceContract {
  getCities(): Promise<string[]>;
  getPopularRoutes(): Promise<RoutePopular[]>;
  getOffers(): Promise<Offer[]>;
  searchBuses(params?: Partial<SearchParams>): Promise<Bus[]>;
  getBusById(id: string): Promise<Bus | null>;
  getBlogs(params?: { category?: string; tag?: string; search?: string }): Promise<BlogArticle[]>;
  getBlogBySlug(slug: string): Promise<BlogArticle | null>;
  createBooking(payload: BookingPayload): Promise<{ success: boolean; pnr: string; booking: BookingPayload }>;
}

export const MockBusApi: BusServiceContract = {
  async getCities(): Promise<string[]> {
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/api/cities');
        if (res.ok) {
          const json = await res.json();
          if (json.data) return json.data;
        }
      }
    } catch {
      // Fallback
    }
    return CITIES;
  },

  async getPopularRoutes(): Promise<RoutePopular[]> {
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/api/routes/popular');
        if (res.ok) {
          const json = await res.json();
          if (json.data) return json.data;
        }
      }
    } catch {
      // Fallback
    }
    return POPULAR_ROUTES;
  },

  async getOffers(): Promise<Offer[]> {
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/api/offers');
        if (res.ok) {
          const json = await res.json();
          if (json.data) return json.data;
        }
      }
    } catch {
      // Fallback
    }
    return MOCK_OFFERS;
  },

  async searchBuses(params?: Partial<SearchParams>): Promise<Bus[]> {
    const origin = (params?.from || 'Bangalore').trim();
    const destination = (params?.to || 'Goa').trim();
    const date = params?.date || '2026-09-22';

    try {
      if (typeof window !== 'undefined') {
        const query = new URLSearchParams({
          from: origin,
          to: destination,
          date,
        }).toString();
        const res = await fetch(`/api/buses/search?${query}`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            return json.data;
          }
        }
      }
    } catch {
      // Fallback to local generation
    }

    const originCode = origin.slice(0, 3).toLowerCase() || 'blr';
    const destCode = destination.slice(0, 3).toLowerCase() || 'goa';

    return BASE_BUSES.map((base, idx) => {
      const priceVariation = (idx % 3) * 40;
      return {
        ...base,
        id: base.id,
        originCity: origin,
        destinationCity: destination,
        price: base.price + priceVariation,
        originalPrice: base.originalPrice + priceVariation,
        boardingPoints: [
          {
            id: `bp-${base.id}-1`,
            time: base.departureTime,
            location: `${origin} Main Bus Terminal`,
            landmark: 'Platform 3, Central Bay',
          },
          {
            id: `bp-${base.id}-2`,
            time: '22:15',
            location: `${origin} Highway Toll Hub`,
            landmark: 'Near Toll Plaza Counter 2',
          },
        ],
        droppingPoints: [
          {
            id: `dp-${base.id}-1`,
            time: base.arrivalTime,
            location: `${destination} Central Stand`,
            landmark: 'Main City Circle',
          },
          {
            id: `dp-${base.id}-2`,
            time: '07:30',
            location: `${destination} Bus Interchange`,
            landmark: 'Opposite State Bank',
          },
        ],
        seats: base.seats && base.seats.length > 0 ? base.seats : BASE_BUSES[0].seats,
      };
    });
  },

  async getBusById(id: string): Promise<Bus | null> {
    const found = BASE_BUSES.find((b) => b.id === id);
    if (!found) {
      return {
        ...BASE_BUSES[0],
        id,
        originCity: 'Bangalore',
        destinationCity: 'Goa',
      };
    }
    return {
      ...found,
      originCity: 'Bangalore',
      destinationCity: 'Goa',
    };
  },

  async getBlogs(params?: { category?: string; tag?: string; search?: string }): Promise<BlogArticle[]> {
    try {
      if (typeof window !== 'undefined') {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.set('category', params.category);
        if (params?.tag) queryParams.set('tag', params.tag);
        if (params?.search) queryParams.set('search', params.search);

        const res = await fetch(`/api/blogs?${queryParams.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data)) return json.data;
        }
      }
    } catch {
      // Fallback
    }

    let filtered = [...BLOG_ARTICLES];

    if (params?.category && params.category !== 'All') {
      filtered = filtered.filter(
        (b) => b.category.toLowerCase() === params.category?.toLowerCase()
      );
    }

    if (params?.tag) {
      filtered = filtered.filter((b) =>
        b.tags.some((t) => t.toLowerCase() === params.tag?.toLowerCase())
      );
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return filtered;
  },

  async getBlogBySlug(slug: string): Promise<BlogArticle | null> {
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) return json.data;
        }
      }
    } catch {
      // Fallback
    }
    const article = BLOG_ARTICLES.find((a) => a.slug === slug);
    return article || null;
  },

  async createBooking(payload: BookingPayload): Promise<{ success: boolean; pnr: string; booking: BookingPayload }> {
    const randomPNR = `RDB${Math.floor(10000000 + Math.random() * 90000000)}`;
    return {
      success: true,
      pnr: randomPNR,
      booking: payload,
    };
  },
};
