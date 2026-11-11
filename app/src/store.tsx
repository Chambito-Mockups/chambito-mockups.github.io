import { usePersistent } from './persist';
import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Country, CountryData, DATA, Level } from './data';
import { Theme, ThemeName, themes } from './theme';
import { Plan } from './commission';

export type ScreenId =
  | 'inicio' | 'perfil' | 'equipos' | 'comercios'
  | 'A0' | 'A0b' | 'A2' | 'A3' | 'A4' | 'A5' | 'A5b' | 'A6' | 'A7' | 'A8' | 'A9' | 'A11'
  | 'E1' | 'E2' | 'E3' | 'E4'
  | 'D0' | 'D1' | 'D2' | 'D3' | 'D5' | 'D6' | 'D7' | 'D8' | 'D9'
  // Chambito Market (Tienda)
  | 'M01' | 'M03' | 'M04' | 'M05' | 'M06' | 'M09' | 'M10' | 'M11' | 'EA4'
  | 'V14' | 'V15' | 'V16' | 'V17' | 'V18' | 'V19' | 'V21' | 'V22'
  // ventas y cobros del vendedor (comisiones, fase 2)
  | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8' | 'C9';

export type Overlay = null | 'sos' | 'details' | 'offer' | 'cancel' | 'report' | 'guest' | 'draft' | 'actions' | 'limit' | 'explorer';
export type Section = 'servicios' | 'auto' | 'market';
export type Role = 'pasajero' | 'prestador' | 'conductor';
export type TripPhase = 'none' | 'searching' | 'assigned' | 'arrived' | 'ontrip';

export interface Settings {
  theme: ThemeName;
  country: Country;
  role: Role;
  guest: boolean;
  locationOff: boolean;
  offline: boolean;
  otherService: boolean;
  teams: boolean;
  autoEnabled: boolean;
  simulate: boolean;
  noDrivers: boolean;
  tiendaEntry: 'card' | 'tab';
  /** «Prototipo Auto» explorer: a section selector in each home and a bar of Inicio · Actividad · Perfil */
  navModel: 'tabs' | 'explorer';
  /** last section used: Inicio opens there and the app reopens there */
  lastSection: Section;
  almostEmpty: boolean;
  sellerStatus: 'verificado' | 'sin-verificar' | 'en-revision' | 'suspendido';
  manualReview: boolean;
  atLimit: boolean;
  /** cómo paga el vendedor (fase 2): B · comisión por venta, o A · un nivel de membresía sin comisión */
  sellerPlan: Plan;
}

export interface Trip {
  destination: string;
  pickup: string;
  reference: string;
  level: Level;
  payment: 'card' | 'cash';
  phase: TripPhase;
  expanded: boolean;
  completed: boolean; // shows in Actividad as last trip
}

interface Ctx {
  t: Theme;
  d: CountryData;
  settings: Settings;
  set: (patch: Partial<Settings>) => void;
  screen: ScreenId;
  go: (s: ScreenId, opts?: { replace?: boolean }) => void;
  back: () => void;
  overlay: Overlay;
  setOverlay: (o: Overlay) => void;
  trip: Trip;
  setTrip: (patch: Partial<Trip>) => void;
  resetTrip: () => void;
  toast: string | null;
  showToast: (m: string) => void;
  autoRoot: () => ScreenId;
  driverAvailable: boolean;
  setDriverAvailable: (v: boolean) => void;
  docsSubmitted: boolean;
  setDocsSubmitted: (v: boolean) => void;
}

const AppCtx = createContext<Ctx | null>(null);
/** Lets showcase pages render a component in a fixed theme regardless of the global one. */
export const ThemeScope = createContext<Theme | null>(null);

export const defaultSettings: Settings = {
  theme: 'dark',
  country: 'PY',
  role: 'pasajero',
  guest: false,
  locationOff: false,
  offline: false,
  otherService: false,
  teams: false,
  autoEnabled: true,
  simulate: true,
  noDrivers: false,
  tiendaEntry: 'card',
  navModel: 'tabs',
  lastSection: 'servicios',
  almostEmpty: false,
  sellerStatus: 'verificado',
  manualReview: false,
  atLimit: false,
  sellerPlan: 'comision',
};

const newTrip = (d: CountryData): Trip => ({
  destination: d.destination.name,
  pickup: d.pickupCandidates[0],
  reference: '',
  level: 'eco',
  payment: 'card',
  phase: 'none',
  expanded: false,
  completed: false,
});

export function AppProvider({ children }: { children: ReactNode }) {
  // theme, country and the simulation switches survive reloads
  const [settings, setSettings] = usePersistent<Settings, Partial<Settings>>('settings', defaultSettings, { encode: (s) => s, decode: (s) => ({ ...defaultSettings, ...s }) });
  const d = DATA[settings.country];
  const [screen, setScreen] = useState<ScreenId>('A0');
  const history = useRef<ScreenId[]>([]);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [trip, setTripState] = useState<Trip>(() => newTrip(DATA[settings.country]));
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>();
  const [driverAvailable, setDriverAvailable] = useState(true);
  const [docsSubmitted, setDocsSubmitted] = useState(false);

  const set = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => {
      const next = { ...s, ...patch };
      if (patch.country && patch.country !== s.country) setTripState((tr) => ({ ...newTrip(DATA[patch.country!]), phase: tr.phase, completed: tr.completed }));
      return next;
    });
  }, []);

  const go = useCallback((s: ScreenId, opts?: { replace?: boolean }) => {
    setScreen((cur) => {
      if (!opts?.replace && cur !== s) history.current.push(cur);
      return s;
    });
    setOverlay(null);
  }, []);

  const back = useCallback(() => {
    const prev = history.current.pop();
    setOverlay(null);
    if (prev) setScreen(prev);
  }, []);

  const setTrip = useCallback((patch: Partial<Trip>) => setTripState((tr) => ({ ...tr, ...patch })), []);
  const resetTrip = useCallback(() => setTripState((tr) => ({ ...newTrip(d), completed: tr.completed })), [d]);

  const showToast = useCallback((m: string) => {
    setToast(m);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const autoRoot = useCallback((): ScreenId => {
    if (settings.role === 'prestador') return 'D0';
    if (settings.role === 'conductor') return 'D3';
    if (settings.offline) return 'E3';
    if (trip.phase !== 'none') return 'A0b';
    if (settings.otherService) return 'E4';
    if (settings.locationOff) return 'E2';
    return 'A0';
  }, [settings, trip.phase]);

  const value = useMemo<Ctx>(
    () => ({ t: themes[settings.theme], d, settings, set, screen, go, back, overlay, setOverlay, trip, setTrip, resetTrip, toast, showToast, autoRoot, driverAvailable, setDriverAvailable, docsSubmitted, setDocsSubmitted }),
    [settings, d, set, screen, go, back, overlay, trip, setTrip, resetTrip, toast, showToast, autoRoot, driverAvailable, docsSubmitted],
  );
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  const scoped = useContext(ThemeScope);
  if (!c) throw new Error('useApp outside AppProvider');
  return scoped ? { ...c, t: scoped } : c;
}

/** The prototype's theme when there is one (null outside AppProvider): for pieces that pages like Auto v3 reuse. */
export function useAppTheme(): Theme | null {
  const c = useContext(AppCtx);
  const scoped = useContext(ThemeScope);
  return scoped ?? c?.t ?? null;
}

/** Price helpers shared by quote, search and receipt. */
export function tripPrice(d: CountryData, trip: Trip) {
  if (trip.expanded) return d.expanded.price;
  return d.levels[trip.level].price;
}
export function paymentLabel(d: CountryData, trip: Trip) {
  return trip.payment === 'cash' ? 'Efectivo' : d.card;
}
