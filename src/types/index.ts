export type BusTypeCategory = 'Sleeper' | 'Seater' | 'Semi-Sleeper' | 'AC' | 'Non-AC' | 'Electric';

export interface BoardingPoint {
  id: string;
  time: string;
  location: string;
  landmark: string;
}

export interface DroppingPoint {
  id: string;
  time: string;
  location: string;
  landmark: string;
}

export type SeatStatus = 'available' | 'booked' | 'female-only' | 'selected';

export interface Seat {
  id: string;
  number: string;
  type: 'sleeper' | 'seater';
  deck: 'lower' | 'upper';
  row: number;
  column: number;
  price: number;
  status: SeatStatus;
}

export interface Bus {
  id: string;
  operatorName: string;
  operatorLogo?: string;
  busType: string;
  isAC: boolean;
  isSleeper: boolean;
  isElectric?: boolean;
  rating: number;
  totalReviews: number;
  departureTime: string; // e.g. "21:30"
  arrivalTime: string;   // e.g. "06:15"
  duration: string;      // e.g. "08h 45m"
  originCity: string;
  destinationCity: string;
  price: number;
  originalPrice: number;
  seatsAvailable: number;
  amenities: string[];
  boardingPoints: BoardingPoint[];
  droppingPoints: DroppingPoint[];
  cancellationPolicy: string;
  liveTrackingAvailable: boolean;
  seats: Seat[];
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  returnDate?: string;
}

export interface FilterState {
  busTypes: string[];       // ['AC', 'Non-AC', 'Sleeper', 'Seater', 'Electric']
  departureTimes: string[]; // ['before-6am', '6am-12pm', '12pm-6pm', 'after-6pm']
  operators: string[];
  boardingPoints: string[];
  droppingPoints: string[];
  amenities: string[];
  priceRange: [number, number];
  minRating: number;
  sortBy: 'cheapest' | 'fastest' | 'early-departure' | 'late-departure' | 'highest-rated';
}

export interface Passenger {
  seatNumber: string;
  seatId: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface BookingPayload {
  busId: string;
  bus: Bus;
  selectedSeats: Seat[];
  boardingPoint: BoardingPoint;
  droppingPoint: DroppingPoint;
  passengers: Passenger[];
  contactEmail: string;
  contactPhone: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  appliedCoupon?: string;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountPercentage: number;
  maxDiscount: number;
  validTill: string;
  category: string;
  badge: string;
}

export interface RoutePopular {
  id: string;
  from: string;
  to: string;
  startingPrice: number;
  duration: string;
  dailyBuses: number;
  popularOperator: string;
  image: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  category: 'Travel Guide' | 'Tips & Hacks' | 'Route Reviews' | 'Weekend Getaways' | 'Safety & Policies';
  tags: string[];
  coverImage: string;
  readTime: string;
  publishedAt: string;
  routeHighlight?: {
    from: string;
    to: string;
    recommendedBusType: string;
  };
}

export interface ThemePreset {
  id: string;
  name: string;
  primary: string;
  hover: string;
  light: string;
  border: string;
  ring: string;
  description: string;
}
