// Tokens taken from "Chambito Auto v3.dc.html" (brief v3: DESIGN_SYSTEM v1.6.0 colors).
export type ThemeName = 'dark' | 'light';

export interface Theme {
  name: ThemeName;
  bg: string; // screen background
  sheet: string; // bottom sheets, floating controls
  card: string; // cards and fields inside a sheet
  cardOnBg: string; // cards placed straight on the screen background
  btn2: string; // secondary buttons
  chip: string; // chips, list icon circles, PIN boxes
  well: string; // avatar / icon container inside a card
  handle: string; // sheet grabber
  track: string; // step progress (off segment)
  barTrack: string; // linear progress background
  divider: string;
  dividerStrong: string;
  text: string;
  text2: string;
  text3: string;
  link: string;
  success: string;
  error: string;
  warn: string;
  green: string;
  greenSoft: string;
  icon: string;
  navBg: string;
  navOutline: string;
  navInactive: string;
  navActive: string;
  chipSelBg: string;
  chipSelText: string;
  sosBg: string;
  sosText: string;
  scrimDialog: string;
  scrimOffer: string;
  dashed: string;
  // Chambito Market (Tienda): screen bg, surfaces and photo placeholders
  mBg: string;
  mSurface: string;
  mChip: string;
  ph: [string, string, string];
  phIcon: string;
  map: { bg: string; street: string; avenue: string; park: string; water: string; dest: string; car: string; traveled: string };
}

export const GREEN = '#4BAC4F';

export const dark: Theme = {
  name: 'dark',
  bg: '#000000',
  sheet: '#1A1A1A',
  card: '#333333',
  cardOnBg: '#333333',
  btn2: '#333333',
  chip: '#333333',
  well: '#4D4D4D',
  handle: '#4D4D4D',
  track: '#4D4D4D',
  barTrack: '#333333',
  divider: '#333333',
  dividerStrong: '#4D4D4D',
  text: '#FFFFFF',
  text2: '#B3B3B3',
  text3: '#808080',
  link: GREEN,
  success: '#7CCB7F',
  error: '#FF6B6B',
  warn: '#FFB547',
  green: GREEN,
  greenSoft: 'rgba(75,172,79,0.2)',
  icon: '#FFFFFF',
  navBg: '#333333',
  navOutline: 'none',
  navInactive: '#B3B3B3',
  navActive: GREEN,
  chipSelBg: '#FFFFFF',
  chipSelText: '#000000',
  sosBg: '#FF6B6B',
  sosText: '#000000',
  scrimDialog: 'rgba(0,0,0,0.7)',
  scrimOffer: 'rgba(0,0,0,0.5)',
  dashed: '#808080',
  mBg: '#000000',
  mSurface: '#1A1A1A',
  mChip: '#333333',
  ph: ['#2E2E2E', '#262626', '#3A3A3A'],
  phIcon: '#808080',
  map: { bg: '#111111', street: '#232323', avenue: '#2E2E2E', park: '#171717', water: '#080808', dest: '#FFFFFF', car: '#FFFFFF', traveled: '#4D4D4D' },
};

export const light: Theme = {
  name: 'light',
  bg: '#F5F5F5',
  sheet: '#FFFFFF',
  card: '#F5F5F5',
  cardOnBg: '#FFFFFF',
  btn2: '#EBEBEB',
  chip: '#EBEBEB',
  well: '#EBEBEB',
  handle: '#CCCCCC',
  track: '#EBEBEB',
  barTrack: '#EBEBEB',
  divider: '#CCCCCC',
  dividerStrong: '#CCCCCC',
  text: '#000000',
  text2: '#5C5C5C',
  text3: '#707070',
  link: '#2F7A33',
  success: '#24602A',
  error: '#B71C1C',
  warn: '#7A4D00',
  green: GREEN,
  greenSoft: 'rgba(75,172,79,0.2)',
  icon: '#000000',
  navBg: '#FFFFFF',
  navOutline: '1px solid #E0E0E0',
  navInactive: '#5C5C5C',
  navActive: '#2F7A33',
  chipSelBg: '#000000',
  chipSelText: '#FFFFFF',
  sosBg: '#B71C1C',
  sosText: '#FFFFFF',
  scrimDialog: 'rgba(0,0,0,0.5)',
  scrimOffer: 'rgba(0,0,0,0.35)',
  dashed: '#707070',
  mBg: '#FFFFFF',
  mSurface: '#F5F5F5',
  mChip: '#EBEBEB',
  ph: ['#E3E3E3', '#D6D6D6', '#CCCCCC'],
  phIcon: '#707070',
  map: { bg: '#E6E6E6', street: '#FFFFFF', avenue: '#FFFFFF', park: '#D6D6D6', water: '#CCCCCC', dest: '#000000', car: '#000000', traveled: '#B3B3B3' },
};

export const themes = { dark, light };

/** CSS `font` shorthand helpers matching the design (Poppins Bold / Roboto). */
export const P = (size: number) => `700 ${size}px Poppins, sans-serif`;
export const R = (size: number, weight: 400 | 500 = 400) => `${weight} ${size}px Roboto, sans-serif`;
