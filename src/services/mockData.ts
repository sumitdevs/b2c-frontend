import { Bus, Offer, RoutePopular, BlogArticle, Seat } from '../types';

export const CITIES = [
  'Bangalore',
  'Goa',
  'Mumbai',
  'Pune',
  'Delhi',
  'Jaipur',
  'Hyderabad',
  'Chennai',
  'Coimbatore',
  'Ahmedabad',
  'Manali',
  'Shimla'
];

export const POPULAR_ROUTES: RoutePopular[] = [
  {
    id: 'route-1',
    from: 'Bangalore',
    to: 'Goa',
    startingPrice: 849,
    duration: '10h 30m',
    dailyBuses: 48,
    popularOperator: 'IntrCity SmartBus',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'route-2',
    from: 'Delhi',
    to: 'Jaipur',
    startingPrice: 429,
    duration: '5h 15m',
    dailyBuses: 92,
    popularOperator: 'Zingbus Electric',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'route-3',
    from: 'Mumbai',
    to: 'Pune',
    startingPrice: 310,
    duration: '3h 30m',
    dailyBuses: 135,
    popularOperator: 'Orange Travels AC',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'route-4',
    from: 'Hyderabad',
    to: 'Bangalore',
    startingPrice: 699,
    duration: '8h 45m',
    dailyBuses: 76,
    popularOperator: 'VRL Multi-Axle Volvo',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'route-5',
    from: 'Delhi',
    to: 'Manali',
    startingPrice: 999,
    duration: '12h 00m',
    dailyBuses: 54,
    popularOperator: 'Himalayan SmartBus',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 'route-6',
    from: 'Chennai',
    to: 'Coimbatore',
    startingPrice: 550,
    duration: '7h 20m',
    dailyBuses: 62,
    popularOperator: 'SRS Travels AC',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=700&auto=format&fit=crop&q=80',
  },
];

export const MOCK_OFFERS: Offer[] = [
  {
    id: 'off-1',
    code: 'FIRSTBUS',
    title: 'Flat 20% OFF on First Booking',
    description: 'Use code FIRSTBUS to get instant flat 20% discount on all Volvo and AC Sleeper buses up to ₹250.',
    discountPercentage: 20,
    maxDiscount: 250,
    validTill: '30 Sep 2026',
    category: 'New User',
    badge: 'Trending',
  },
  {
    id: 'off-2',
    code: 'WEEKEND50',
    title: 'Save ₹150 on Weekend Getaways',
    description: 'Special weekend gateway discount on departures between Friday and Sunday nights.',
    discountPercentage: 15,
    maxDiscount: 150,
    validTill: '15 Oct 2026',
    category: 'Weekend',
    badge: 'Special',
  },
  {
    id: 'off-3',
    code: 'ELEC100',
    title: '₹100 Eco Cashback on Electric Buses',
    description: 'Ride zero-emission NueGo and Zingbus EV coaches with instant discount + cashback.',
    discountPercentage: 18,
    maxDiscount: 180,
    validTill: '31 Oct 2026',
    category: 'Green Travel',
    badge: 'Eco Friendly',
  },
  {
    id: 'off-4',
    code: 'RETURN25',
    title: '25% OFF on Round Trip Tickets',
    description: 'Book your return ticket together and unlock 25% discount across all private operators.',
    discountPercentage: 25,
    maxDiscount: 350,
    validTill: '30 Nov 2026',
    category: 'Round Trip',
    badge: 'Best Value',
  },
];

export function generateSeats(): Seat[] {
  const seats: Seat[] = [];
  const bookedSeatNumbers = new Set(['L1', 'L4', 'L7', 'L11', 'U2', 'U5', 'U9', 'U12', 'L15']);
  const femaleSeatNumbers = new Set(['L2', 'L8', 'U4']);

  // Lower deck (Sleeper 2+1 layout, rows 1-6)
  for (let r = 1; r <= 6; r++) {
    // Single berth side
    const seatIdL1 = `L${(r - 1) * 3 + 1}`;
    seats.push({
      id: `seat-${seatIdL1}`,
      number: seatIdL1,
      type: 'sleeper',
      deck: 'lower',
      row: r,
      column: 1,
      price: 950,
      status: bookedSeatNumbers.has(seatIdL1)
        ? 'booked'
        : femaleSeatNumbers.has(seatIdL1)
        ? 'female-only'
        : 'available',
    });

    // Double berth side
    const seatIdL2 = `L${(r - 1) * 3 + 2}`;
    seats.push({
      id: `seat-${seatIdL2}`,
      number: seatIdL2,
      type: 'sleeper',
      deck: 'lower',
      row: r,
      column: 2,
      price: 890,
      status: bookedSeatNumbers.has(seatIdL2)
        ? 'booked'
        : femaleSeatNumbers.has(seatIdL2)
        ? 'female-only'
        : 'available',
    });

    const seatIdL3 = `L${(r - 1) * 3 + 3}`;
    seats.push({
      id: `seat-${seatIdL3}`,
      number: seatIdL3,
      type: 'sleeper',
      deck: 'lower',
      row: r,
      column: 3,
      price: 890,
      status: bookedSeatNumbers.has(seatIdL3)
        ? 'booked'
        : femaleSeatNumbers.has(seatIdL3)
        ? 'female-only'
        : 'available',
    });
  }

  // Upper deck (Upper sleeper berths)
  for (let r = 1; r <= 6; r++) {
    const seatIdU1 = `U${(r - 1) * 3 + 1}`;
    seats.push({
      id: `seat-${seatIdU1}`,
      number: seatIdU1,
      type: 'sleeper',
      deck: 'upper',
      row: r,
      column: 1,
      price: 1050,
      status: bookedSeatNumbers.has(seatIdU1)
        ? 'booked'
        : femaleSeatNumbers.has(seatIdU1)
        ? 'female-only'
        : 'available',
    });

    const seatIdU2 = `U${(r - 1) * 3 + 2}`;
    seats.push({
      id: `seat-${seatIdU2}`,
      number: seatIdU2,
      type: 'sleeper',
      deck: 'upper',
      row: r,
      column: 2,
      price: 990,
      status: bookedSeatNumbers.has(seatIdU2)
        ? 'booked'
        : femaleSeatNumbers.has(seatIdU2)
        ? 'female-only'
        : 'available',
    });

    const seatIdU3 = `U${(r - 1) * 3 + 3}`;
    seats.push({
      id: `seat-${seatIdU3}`,
      number: seatIdU3,
      type: 'sleeper',
      deck: 'upper',
      row: r,
      column: 3,
      price: 990,
      status: bookedSeatNumbers.has(seatIdU3)
        ? 'booked'
        : femaleSeatNumbers.has(seatIdU3)
        ? 'female-only'
        : 'available',
    });
  }

  return seats;
}

export const BASE_BUSES: Omit<Bus, 'originCity' | 'destinationCity'>[] = [
  {
    id: 'bus-101',
    operatorName: 'IntrCity SmartBus',
    busType: 'BharatBenz AC Sleeper (2+1)',
    isAC: true,
    isSleeper: true,
    isElectric: false,
    rating: 4.8,
    totalReviews: 2450,
    departureTime: '21:00',
    arrivalTime: '06:30',
    duration: '09h 30m',
    price: 899,
    originalPrice: 1150,
    seatsAvailable: 24,
    amenities: ['Live GPS Tracking', 'Type-C Charging', 'Fresh Blanket', 'Mineral Water', 'Reading Light', 'CCTV Security'],
    boardingPoints: [
      { id: 'bp-1', time: '21:00', location: 'Majestic Bus Stand', landmark: 'Platform 12, Terminal 2' },
      { id: 'bp-2', time: '21:30', location: 'Electronic City Toll', landmark: 'Near Toll Plaza Gate 3' },
      { id: 'bp-3', time: '22:00', location: 'Silk Board Junction', landmark: 'Opposite Police Station' },
    ],
    droppingPoints: [
      { id: 'dp-1', time: '05:45', location: 'Mapusa Bus Terminal', landmark: 'Main Entrance Bay 4' },
      { id: 'dp-2', time: '06:30', location: 'Panjim KTC Central Stand', landmark: 'Near Mandovi Bridge' },
    ],
    cancellationPolicy: 'Free cancellation up to 6 hours before departure time',
    liveTrackingAvailable: true,
    seats: generateSeats(),
  },
  {
    id: 'bus-102',
    operatorName: 'Zingbus Premium',
    busType: 'Volvo 9600 Multi-Axle AC Sleeper',
    isAC: true,
    isSleeper: true,
    isElectric: false,
    rating: 4.6,
    totalReviews: 1820,
    departureTime: '22:15',
    arrivalTime: '07:45',
    duration: '09h 30m',
    price: 999,
    originalPrice: 1300,
    seatsAvailable: 19,
    amenities: ['High Speed WiFi', 'Live GPS Tracking', 'AC Climate Control', 'Blanket & Pillow', 'Water Bottle', 'Luggage Tagging'],
    boardingPoints: [
      { id: 'bp-4', time: '22:15', location: 'Anand Rao Circle', landmark: 'Zingbus Lounge & Cafe' },
      { id: 'bp-5', time: '22:50', location: 'Yeshwantpur Toll', landmark: 'Near Metro Station' },
    ],
    droppingPoints: [
      { id: 'dp-3', time: '07:00', location: 'Margao KTC Stand', landmark: 'Near Clock Tower' },
      { id: 'dp-4', time: '07:45', location: 'Panjim Central', landmark: 'Opposite State Bank' },
    ],
    cancellationPolicy: '90% refund if cancelled 12h before boarding',
    liveTrackingAvailable: true,
    seats: generateSeats(),
  },
  {
    id: 'bus-103',
    operatorName: 'NueGo Intercity Electric',
    busType: 'Ultra Quiet Electric AC Seater',
    isAC: true,
    isSleeper: false,
    isElectric: true,
    rating: 4.9,
    totalReviews: 3100,
    departureTime: '06:30',
    arrivalTime: '11:45',
    duration: '05h 15m',
    price: 499,
    originalPrice: 650,
    seatsAvailable: 31,
    amenities: ['100% Green Zero Emission', 'Whisper Quiet Ride', 'USB Fast Charger', 'Ergonomic Recliner', 'Emergency SOS Button'],
    boardingPoints: [
      { id: 'bp-6', time: '06:30', location: 'Kashmere Gate ISBT', landmark: 'Gate 2 Departure Bay' },
      { id: 'bp-7', time: '07:15', location: 'Dhaula Kuan Metro', landmark: 'Bus Shelter 1' },
    ],
    droppingPoints: [
      { id: 'dp-5', time: '11:15', location: 'Sindhi Camp', landmark: 'Metro Station Exit 2' },
      { id: 'dp-6', time: '11:45', location: 'Narayan Singh Circle', landmark: 'Near Police Post' },
    ],
    cancellationPolicy: 'Free rescheduling allowed once up to 4h prior',
    liveTrackingAvailable: true,
    seats: generateSeats(),
  },
  {
    id: 'bus-104',
    operatorName: 'Orange Tours and Travels',
    busType: 'Scania Multi-Axle AC Semi-Sleeper',
    isAC: true,
    isSleeper: false,
    isElectric: false,
    rating: 4.4,
    totalReviews: 1240,
    departureTime: '17:30',
    arrivalTime: '02:00',
    duration: '08h 30m',
    price: 749,
    originalPrice: 950,
    seatsAvailable: 15,
    amenities: ['Reclining Pushback Seats', 'Reading Light', 'Charging Plug', 'Water Bottle', 'Live Tracking'],
    boardingPoints: [
      { id: 'bp-8', time: '17:30', location: 'Gachibowli Outer Ring', landmark: 'Near ORR Entry' },
      { id: 'bp-9', time: '18:10', location: 'Ameerpet Metro Station', landmark: 'Opposite Big Bazaar' },
    ],
    droppingPoints: [
      { id: 'dp-7', time: '01:30', location: 'Hebbal Flyover', landmark: 'Bus Bay 2' },
      { id: 'dp-8', time: '02:00', location: 'Madiwala', landmark: 'Orange Office' },
    ],
    cancellationPolicy: 'Partial refund before 8 hours',
    liveTrackingAvailable: true,
    seats: generateSeats(),
  },
  {
    id: 'bus-105',
    operatorName: 'VRL Travels Classic',
    busType: 'Non-AC Sleeper Coach (2+1)',
    isAC: false,
    isSleeper: true,
    isElectric: false,
    rating: 4.2,
    totalReviews: 950,
    departureTime: '19:45',
    arrivalTime: '05:30',
    duration: '09h 45m',
    price: 599,
    originalPrice: 750,
    seatsAvailable: 28,
    amenities: ['Spacious Berths', 'Individual Curtains', 'Charging Port', 'Luggage Compartment'],
    boardingPoints: [
      { id: 'bp-10', time: '19:45', location: 'Majestic Terminal', landmark: 'VRL Office Counter 5' },
      { id: 'bp-11', time: '20:30', location: 'Jalahalli Cross', landmark: 'Near Metro Gate' },
    ],
    droppingPoints: [
      { id: 'dp-9', time: '05:00', location: 'Hubbali Old Bus Stand', landmark: 'Bay 1' },
      { id: 'dp-10', time: '05:30', location: 'Belagavi Central', landmark: 'Near Ashoka Circle' },
    ],
    cancellationPolicy: 'Flat cancellation fee of ₹50',
    liveTrackingAvailable: false,
    seats: generateSeats(),
  },
  {
    id: 'bus-106',
    operatorName: 'SRS Travels Super Luxury',
    busType: 'Mercedes Benz Multi-Axle AC Sleeper',
    isAC: true,
    isSleeper: true,
    isElectric: false,
    rating: 4.7,
    totalReviews: 2190,
    departureTime: '23:00',
    arrivalTime: '07:15',
    duration: '08h 15m',
    price: 1199,
    originalPrice: 1550,
    seatsAvailable: 11,
    amenities: ['Air Suspension', 'Complimentary Snack Box', 'Ultra Wide Berths', 'High Speed WiFi', 'Sanitized Bedrolls'],
    boardingPoints: [
      { id: 'bp-12', time: '23:00', location: 'Kalakkad Junction', landmark: 'SRS Hub' },
    ],
    droppingPoints: [
      { id: 'dp-11', time: '07:15', location: 'Gandhipuram Central', landmark: 'Clock Tower' },
    ],
    cancellationPolicy: 'Free cancellation up to 12 hours before trip',
    liveTrackingAvailable: true,
    seats: generateSeats(),
  }
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'blog-1',
    slug: 'ultimate-night-bus-travel-guide-sleeper-tips',
    title: 'The Ultimate Guide to Overnight Sleeper Buses: How to Sleep Comfortably and Travel Safe',
    excerpt: 'Travelling overnight on an AC sleeper bus can save you hotel costs and daylight travel time. Here are 9 insider tips on picking the right berth, packing essentials, and staying refreshed.',
    content: `
# The Art of Overnight Bus Travel in India

Taking an overnight sleeper bus is one of the most cost-effective and scenic ways to travel across India's vast highways. Whether you're commuting from Bangalore to Goa or heading from Delhi to the Himalayas, a sleeper berth can become your private sanctuary on wheels if you know how to prepare.

### 1. Choosing the Right Berth: Lower vs Upper Deck
- **Lower Deck Berths:** Experience less sway and roll when navigating mountain bends or highway turns. Ideal for travelers prone to motion discomfort or those who prefer ease of boarding and disembarking.
- **Upper Deck Berths:** Enjoy greater privacy and less foot traffic from fellow passengers walking down the central aisle. The windows are also higher, giving you unobstructed views of sunrise over misty hilltops.

### 2. Single Berth vs Double Berth
If you are traveling solo, always reserve a **single berth (column 1)**. You will have your own dedicated window, shelf, and curtain with complete privacy. For couples and families, double berths (columns 2 & 3) offer contiguous sleeping space.

### 3. Smart Packing for the Cabin
Keep your heavy luggage in the undercarriage bus hold. Bring a compact daypack containing:
- Noise-cancelling earbuds or foam earplugs
- A comfortable contoured eye mask
- An extra light jacket or stole (modern Volvo air conditioning can get chilly at 3:00 AM)
- A braided USB-A / Type-C cable for bedside charging ports
- A refillable water flask

### 4. Safety & Live Bus Tracking
Always opt for bus operators providing GPS Live Tracking (like IntrCity, Zingbus, or Orange Travels). Share the tracking link with your loved ones so they can observe your progress and expected boarding and dropping arrival times in real time.
    `,
    author: {
      name: 'Priya Sharma',
      role: 'Senior Travel Writer & Solo Backpacker',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    category: 'Tips & Hacks',
    tags: ['Sleeper Bus', 'Travel Tips', 'Night Journey', 'Solo Travel'],
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80',
    readTime: '6 min read',
    publishedAt: 'Sep 12, 2026',
    routeHighlight: {
      from: 'Bangalore',
      to: 'Goa',
      recommendedBusType: 'AC Sleeper Multi-Axle',
    },
  },
  {
    id: 'blog-2',
    slug: 'top-scenic-bus-routes-in-india-worth-booking-window-seat',
    title: 'Top 7 Most Scenic Bus Routes Across India Where the Journey Is the Destination',
    excerpt: 'From the hairpin switchbacks of the Western Ghats to the desert dunes of Rajasthan, these handpicked bus routes will leave you mesmerized behind your panoramic window.',
    content: `
# Scenic Journeys on Four Wheels

While fast trains and flights get you between cities, nothing matches the raw romance of cruising on state highways as landscapes transform outside your panoramic window. Here are 7 journeys where booking a window seat is non-negotiable.

### 1. Bangalore to Ooty via Bandipur Tiger Reserve
Leaving the tech hub of Karnataka, the bus ascends through the verdant Nilgiri foothills. As early morning fog lifts over Bandipur Forest, passengers frequently spot spotted deer, wild elephants, and peacocks grazing alongside the road.

### 2. Delhi to Manali along the Beas River
As night transitions into dawn, the bus crosses Bilaspur and hugs the rushing torrents of the Beas River. Towering pine groves, snow-dusted peaks, and rustic apple orchards greet you as you approach the Kullu Valley.

### 3. Mumbai to Goa via NH66 (Konkan Coastal Highway)
Rolling through the Western Ghats with glimpses of coastal estuaries, red laterite soils, and lush coconut palm canopies. The air smells of salt and rain, making this an unforgettable coastal expedition.

### 4. Jaipur to Jaisalmer: The Thar Desert Odyssey
Golden sand dunes, vibrant camel caravans, and ancient sandstone cenotaphs line this serene highway journey across Rajasthan. Sunset over the desert horizon is breathtaking from an AC Volvo coach.
    `,
    author: {
      name: 'Aditya Verma',
      role: 'Highway Photographer & Explorer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
    category: 'Travel Guide',
    tags: ['Scenic Routes', 'Himalayas', 'Western Ghats', 'Road Trips'],
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&auto=format&fit=crop&q=80',
    readTime: '8 min read',
    publishedAt: 'Sep 05, 2026',
    routeHighlight: {
      from: 'Delhi',
      to: 'Manali',
      recommendedBusType: 'Volvo 9600 AC Coach',
    },
  },
  {
    id: 'blog-3',
    slug: 'electric-intercity-buses-the-green-revolution-on-indian-roads',
    title: 'Electric Intercity Buses: Why Clean, Silent EVs Are Dominating Expressways',
    excerpt: 'Electric coaches like NueGo and Zingbus EV are transforming long-distance transit with zero emissions, whisper-quiet cabins, and modern digital amenities.',
    content: `
# The Green Transit Revolution

Intercity travel in India is undergoing a quiet revolution — quite literally. The roaring diesel engines and exhaust fumes of yesterday are giving way to whisper-quiet electric coaches capable of covering 300+ kilometers on a single charge.

### The EV Passenger Experience
1. **Zero Cabin Vibration:** Traditional buses vibrate constantly at idle and uphill climbs. Electric motors provide continuous instant torque without mechanical gear judder, minimizing travel fatigue.
2. **Whisper Quiet Cabins:** Without diesel engine noise, sleeping or working on your laptop becomes effortless.
3. **Advanced Fast-Charging Hubs:** Bus operators have set up branded highway lounges equipped with fast DC chargers, sanitized washrooms, and food courts, making midpoint breaks delightful.
4. **Guaranteed Environmental Impact:** Each round trip on an electric bus saves approximately 56 kilograms of CO₂ compared to conventional diesel alternatives.
    `,
    author: {
      name: 'Rohan Mehta',
      role: 'Clean Mobility Analyst',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
    category: 'Route Reviews',
    tags: ['Electric Bus', 'Sustainability', 'Green Travel', 'NueGo'],
    coverImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1000&auto=format&fit=crop&q=80',
    readTime: '5 min read',
    publishedAt: 'Aug 28, 2026',
    routeHighlight: {
      from: 'Delhi',
      to: 'Jaipur',
      recommendedBusType: 'Electric AC Luxury',
    },
  },
  {
    id: 'blog-4',
    slug: '5-weekend-getaways-from-bangalore-by-bus',
    title: '5 Unbeatable Weekend Getaways from Bangalore You Can Easily Reach by Bus',
    excerpt: 'Leave Friday evening after work and wake up amidst coffee plantations, pristine beaches, or heritage ruins. Here is your weekend roadmap.',
    content: `
# Weekend Getaway Escapes from Namma Bengaluru

Bangalore's strategic location in South India makes it the ultimate springboard for weekend road trips. Avoid driving through peak traffic by boarding a luxury overnight sleeper bus on Friday night.

### 1. Coorg (The Scotland of India)
- **Bus Duration:** 6h 30m
- **Highlights:** Misty coffee estates, Abbey Falls, authentic Kodava pork curry, and trekking up Tadiandamol Peak.

### 2. Gokarna
- **Bus Duration:** 9h 45m
- **Highlights:** Kudle and Om beach, cliff-side cafe hopping, bioluminescent plankton sightings, and serene coastal tranquility away from noisy crowds.

### 3. Wayanad, Kerala
- **Bus Duration:** 7h 00m
- **Highlights:** Banasura Sagar dam, Edakkal caves, and spice plantations wrapped in mist.

### 4. Hampi UNESCO Heritage Site
- **Bus Duration:** 8h 00m
- **Highlights:** Bizarre boulder-strewn landscapes, Vijayanagara empire ruins, riverside coracle boat rides, and Hippie Island sunsets.
    `,
    author: {
      name: 'Kavita Sundaram',
      role: 'Weekend Explorer & Food Critic',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    },
    category: 'Weekend Getaways',
    tags: ['Bangalore', 'Weekend Trips', 'Coorg', 'Gokarna', 'Hampi'],
    coverImage: 'https://images.unsplash.com/photo-1600100397608-f010e421d418?w=1000&auto=format&fit=crop&q=80',
    readTime: '7 min read',
    publishedAt: 'Aug 15, 2026',
    routeHighlight: {
      from: 'Bangalore',
      to: 'Goa',
      recommendedBusType: 'AC Sleeper',
    },
  },
];
