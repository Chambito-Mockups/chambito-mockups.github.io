// Mock data per country. Values marked "design" come from Chambito Auto v3;
// values marked "extrapolated" fill states the canvas only drew for one country.
export type Country = 'PY' | 'AR';
export type Level = 'eco' | 'confort';

export interface Place {
  name: string;
  detail: string;
  km: string;
  icon: 'mapPin' | 'clock';
}

export interface CountryData {
  currency: (n: number) => string;
  cashAllowed: boolean;
  city: string;
  myLocation: string;
  pickupCandidates: string[]; // addresses shown while moving the pin
  savedPlaces: { label: string; icon: 'home' | 'bookmark' }[];
  recents: { name: string; detail: string }[];
  searchPlaces: Place[];
  destination: { name: string; detail: string };
  trip: { km: string; min: string };
  levels: Record<Level, { label: string; price: number; eta: string }>;
  card: string;
  surge: boolean;
  expanded: { radius: string; price: number; eta: string };
  fare: { base: number; distance: number; time: number; surge: number };
  driver: {
    name: string;
    first: string;
    initials: string;
    rating: string;
    onTheWay: string; // "Conductor/a en camino"
    plate: string;
    make: string;
    detail: string;
    short: string;
  };
  eta: string; // "4 min · 14:32"
  etaMin: number;
  pin: string;
  timeline: [string, string, string, string];
  arrival: string;
  remaining: string;
  final: string; // "6,4 km · 19 min"
  tips: number[];
  history: { title: string; detail: string; amount: string; status: 'ok' | 'cancel'; icon: 'car' | 'limpieza' }[];
  // driver side
  passenger: { name: string; initials: string; pickup: string; reference: string };
  offer: { earn: number; payment: string; toPickup: string; duration: string; fromHood: string; fromKm: string; toHood: string; toKm: string };
  driverFare: number;
  commissionPct: number;
  driverPayment: 'cash' | 'card';
  today: { trips: number; earnings: number; hotspot: string };
  avgEarn: { city: string; amount: number };
  wallet: {
    week: number;
    nextPayout: string;
    debt: number;
    cap: number;
    moves: { title: string; detail: string; amount: number; icon: 'car' | 'wallet'; positive?: boolean }[];
  };
  bank: string;
}

const dots = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const DATA: Record<Country, CountryData> = {
  PY: {
    currency: (n) => `Gs. ${dots(n)}`,
    cashAllowed: true,
    city: 'Asunción',
    myLocation: 'Av. España 1520',
    pickupCandidates: ['Av. España y Brasilia', 'Av. España 1480', 'Brasilia y Gral. Santos', 'Av. España y Sacramento'],
    savedPlaces: [
      { label: 'Casa', icon: 'home' },
      { label: 'Trabajo', icon: 'bookmark' },
      { label: 'Mamá', icon: 'bookmark' },
    ],
    recents: [
      { name: 'Paseo La Galería', detail: 'Av. Santa Teresa 1827' },
      { name: 'Aeropuerto Silvio Pettirossi', detail: 'Luque' },
    ],
    searchPlaces: [
      { name: 'Paseo La Galería', detail: 'Av. Santa Teresa 1827, Asunción', km: '5,8 km', icon: 'mapPin' },
      { name: 'Aeropuerto Silvio Pettirossi', detail: 'Reciente · Luque', km: '14 km', icon: 'clock' },
      { name: 'Shopping del Sol', detail: 'Av. Aviadores del Chaco, Asunción', km: '6,9 km', icon: 'mapPin' },
      { name: 'Paseo Carmelitas', detail: 'Av. España y Malutín, Asunción', km: '3,4 km', icon: 'mapPin' },
    ],
    destination: { name: 'Paseo La Galería', detail: 'Av. Santa Teresa 1827' },
    trip: { km: '6,2 km', min: '18 min' },
    levels: {
      eco: { label: 'Económico', price: 32000, eta: '3 min' },
      confort: { label: 'Confort', price: 41500, eta: '5 min' },
    },
    card: 'Visa •••• 4521',
    surge: true,
    expanded: { radius: '6 km', price: 35500, eta: '9 min' },
    fare: { base: 5000, distance: 15400, time: 4200, surge: 7400 },
    driver: {
      name: 'Marcos Rivas',
      first: 'Marcos',
      initials: 'MR',
      rating: '4,9',
      onTheWay: 'Conductor en camino',
      plate: 'ABCD 123',
      make: 'Toyota Vitz',
      detail: 'Blanco · 2019',
      short: 'Toyota Vitz blanco',
    },
    eta: '4 min · 14:32',
    etaMin: 4,
    pin: '4827',
    timeline: ['14:09', '14:13', '14:14', '14:58'],
    arrival: '14:58',
    remaining: '12 min · 4,1 km',
    final: '6,4 km · 19 min',
    tips: [3000, 5000, 10000],
    history: [
      { title: 'Limpieza general · 4 h', detail: '1 nov · Av. España 1520', amount: 'Gs. 180.000', status: 'ok', icon: 'limpieza' },
      { title: 'Casa → Aeropuerto', detail: '30 oct · Auto Confort', amount: 'Sin cargo', status: 'cancel', icon: 'car' },
    ],
    passenger: { name: 'Lucía', initials: 'LG', pickup: 'Av. España y Brasilia', reference: 'portón negro, frente a la farmacia' },
    offer: { earn: 28160, payment: 'Cobro en efectivo', toPickup: '3 min', duration: '18 min', fromHood: 'Villa Morra', fromKm: '1,2 km', toHood: 'Recoleta', toKm: '6,2 km' },
    driverFare: 32000,
    commissionPct: 12,
    driverPayment: 'cash',
    today: { trips: 9, earnings: 186000, hotspot: 'Villa Morra · 2,1 km' },
    avgEarn: { city: 'Asunción', amount: 28000 },
    wallet: {
      week: 1240000,
      nextPayout: 'lunes 9 de noviembre',
      debt: 48300,
      cap: 150000,
      moves: [
        { title: 'Viaje · Paseo La Galería', detail: 'Hoy 14:58 · Efectivo', amount: 28160, icon: 'car' },
        { title: 'Viaje · Aeropuerto', detail: 'Hoy 12:05 · Tarjeta', amount: 59840, icon: 'car' },
        { title: 'Liquidación · Banco Itaú', detail: '2 nov · Pagada', amount: 980000, icon: 'wallet', positive: true },
      ],
    },
    bank: 'Banco Itaú',
  },
  AR: {
    currency: (n) => `$ ${dots(n)}`,
    cashAllowed: false,
    city: 'Buenos Aires',
    myLocation: 'Av. Corrientes 3200',
    pickupCandidates: ['Av. Corrientes y Gallo', 'Av. Corrientes 3150', 'Gallo y Valentín Gómez', 'Av. Corrientes y Agüero'],
    savedPlaces: [
      { label: 'Casa', icon: 'home' },
      { label: 'Trabajo', icon: 'bookmark' },
    ],
    recents: [
      { name: 'Plaza Serrano', detail: 'Palermo Soho' },
      { name: 'Aeroparque Jorge Newbery', detail: 'CABA' },
    ],
    searchPlaces: [
      { name: 'Plaza Serrano', detail: 'Palermo Soho, CABA', km: '4,8 km', icon: 'mapPin' },
      { name: 'Aeroparque Jorge Newbery', detail: 'Reciente', km: '7 km', icon: 'clock' },
      { name: 'Abasto Shopping', detail: 'Av. Corrientes 3247, CABA', km: '0,6 km', icon: 'mapPin' },
      { name: 'Planetario', detail: 'Av. Sarmiento y Belisario Roldán, CABA', km: '5,9 km', icon: 'mapPin' },
    ],
    destination: { name: 'Plaza Serrano', detail: 'Palermo Soho' },
    trip: { km: '4,8 km', min: '16 min' },
    levels: {
      eco: { label: 'Económico', price: 8500, eta: '2 min' },
      confort: { label: 'Confort', price: 11200, eta: '4 min' },
    },
    card: 'Mercado Pago · Visa •••• 4521',
    surge: true,
    expanded: { radius: '6 km', price: 9400, eta: '8 min' }, // extrapolated
    fare: { base: 1300, distance: 4300, time: 1100, surge: 1800 }, // extrapolated
    driver: {
      name: 'Sofía Méndez',
      first: 'Sofía',
      initials: 'SM',
      rating: '4,9',
      onTheWay: 'Conductora en camino',
      plate: 'AB 123 CD',
      make: 'Fiat Cronos',
      detail: 'Gris · 2021',
      short: 'Fiat Cronos gris',
    },
    eta: '3 min · 18:31',
    etaMin: 3,
    pin: '3156',
    timeline: ['18:28', '18:31', '18:32', '18:47'],
    arrival: '18:47',
    remaining: '9 min · 3,2 km',
    final: '5,0 km · 17 min', // extrapolated
    tips: [500, 1000, 2000],
    history: [
      { title: 'Limpieza general · 4 h', detail: '1 nov · Av. Corrientes 3200', amount: '$ 48.000', status: 'ok', icon: 'limpieza' },
      { title: 'Casa → Aeroparque', detail: '30 oct · Auto Confort', amount: 'Sin cargo', status: 'cancel', icon: 'car' },
    ],
    passenger: { name: 'Lucía', initials: 'LG', pickup: 'Av. Corrientes y Gallo', reference: 'edificio con toldo verde' },
    offer: { earn: 7300, payment: 'Cobro con Mercado Pago', toPickup: '3 min', duration: '16 min', fromHood: 'Almagro', fromKm: '0,9 km', toHood: 'Palermo Soho', toKm: '4,8 km' },
    driverFare: 8500,
    commissionPct: 14, // extrapolated so 8.500 − 14 % ≈ 7.300 (design)
    driverPayment: 'card',
    today: { trips: 9, earnings: 62400, hotspot: 'Palermo · 2,1 km' },
    avgEarn: { city: 'Buenos Aires', amount: 7500 }, // extrapolated
    wallet: {
      week: 412000,
      nextPayout: 'lunes 9 de noviembre',
      debt: 0,
      cap: 40000,
      moves: [
        { title: 'Viaje · Plaza Serrano', detail: 'Hoy 18:47 · Mercado Pago', amount: 7300, icon: 'car' },
        { title: 'Viaje · Aeroparque', detail: 'Hoy 16:05 · Mercado Pago', amount: 13900, icon: 'car' },
        { title: 'Liquidación · Mercado Pago', detail: '2 nov · Pagada', amount: 318000, icon: 'wallet', positive: true },
      ],
    },
    bank: 'Mercado Pago',
  },
};
