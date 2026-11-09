/**
 * Chambito Auto v3 (lienzo «Chambito Auto – Chambito Auto v3.html») como mockup navegable, separado de la App integrada.
 * Estado, navegación, datos por país y temporizadores. Las pantallas leen todo con `useVM()` (el mismo contexto que la
 * App integrada), así reutilizan sus componentes (kit.tsx, ds.tsx, chrome.tsx) y sus tokens del sistema de diseño.
 */
import { VM } from '../integrada/model';
import { tokens } from '../integrada/tokens';
import { dark as darkTheme, light as lightTheme } from '../theme';

export type V3Screen =
  | 'X1' | 'A0' | 'A2' | 'A3' | 'A4' | 'A5' | 'A5b' | 'A6' | 'A7' | 'A8' | 'A9' | 'A11'
  | 'D0' | 'D1' | 'D2' | 'D3' | 'D5' | 'D6' | 'D7' | 'D8' | 'D9';
export type V3Sheet = 'explorer' | 'sos' | 'detalles' | 'offer' | null;
export type Mode = 'viaje' | 'moto' | 'envio';
export type Country = 'PY' | 'AR';

export interface V3State {
  screen: V3Screen;
  hist: V3Screen[];
  sheet: V3Sheet;
  mode: Mode;
  envio: 'sobre' | 'chico' | 'mediano';
  dest: 0 | 1;
  level: 'eco' | 'confort';
  card: boolean;
  stars: number;
  chips: Record<string, boolean>;
  tip: number | 'otro';
  pin: string;
  pinErr: boolean;
  online: boolean;
  offerSecs: number;
  wait: number;
  uploads: Record<string, boolean>;
  toast: string | null;
  /** estados que se simulan desde el menú (E1–E4, A0b, V3, V4, A5b) */
  tripActive: boolean;
  guest: boolean;
  locOff: boolean;
  offline: boolean;
  serviceActive: boolean;
  noDrivers: boolean;
}

export const INITIAL: V3State = {
  screen: 'A0', hist: [], sheet: null, mode: 'viaje', envio: 'chico', dest: 0, level: 'eco', card: false, stars: 0, chips: {}, tip: 0, pin: '', pinErr: false,
  online: false, offerSecs: 12, wait: 161, uploads: {}, toast: null,
  tripActive: false, guest: false, locOff: false, offline: false, serviceActive: false, noDrivers: false,
};

/* ---------------- datos por país ---------------- */

const fmtPY = (n: number) => 'Gs. ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const fmtAR = (n: number) => '$ ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const DATA = {
  PY: {
    fmt: fmtPY, city: 'Asunción',
    passenger: { name: 'Lucía', ini: 'LG' },
    driver: { name: 'Marcos Rivas', first: 'Marcos', ini: 'MR', female: false, rating: '4,9', plate: 'ABCD 123', car: 'Toyota Vitz', color: 'Blanco', year: '2019', carShort: 'Toyota Vitz blanco' },
    origin: 'Av. España y Brasilia', myPlace: 'Tu ubicación · Av. España 1520',
    dests: [
      { name: 'Paseo La Galería', sub: 'Av. Santa Teresa 1827, Asunción', km: '6,2', min: 18, kmReal: '6,4', minReal: 19, tripLeft: '12 min · 4,1 km', arrive: '14:58' },
      { name: 'Aeropuerto Silvio Pettirossi', sub: 'Reciente · Luque', km: '14', min: 31, kmReal: '15,1', minReal: 33, tripLeft: '24 min · 11,8 km', arrive: '15:12' },
    ],
    eco: 32000, confort: 41500, etaEco: 3, etaConfort: 5, radiusNew: 35500,
    cashOnly: false, payCash: 'Efectivo', payCard: 'Visa •••• 4521',
    tips: [3000, 5000, 10000], pinCode: '4827',
    times: { arrives: '14:36', assigned: '14:33', arrived: '14:36', started: '14:39' },
    fare: [['Banderazo', 5000], ['Distancia · 6,2 km', 15400], ['Tiempo · 18 min', 4200], ['Demanda alta', 7400]] as [string, number][],
    earn: 28160, commission: 12, todayTrips: 9, todayEarn: 186000, zone: 'Villa Morra', avg: 28000,
    offer: { from: 'Villa Morra', fromKm: '1,2', to: 'Recoleta', toKm: '6,2', pay: 'Cobro en efectivo' },
    week: 1240000, payout: 'lunes 9 de noviembre', debt: 48300, debtCap: 150000,
    moves: [['Viaje · Paseo La Galería', 'Hoy 14:58 · Efectivo', 28160], ['Viaje · Aeropuerto', 'Hoy 12:05 · Tarjeta', 59840], ['Liquidación · Banco Itaú', '2 nov · Pagada', -980000]] as [string, string, number][],
    history: [
      ['Av. España → Paseo La Galería', 'Hoy, 14:58 · Auto Económico', 37000, 'Completado', 'auto'],
      ['Limpieza general · 4 h', '1 nov · Av. España 1520', 180000, 'Completado', 'servicios'],
      ['Casa → Aeropuerto', '30 oct · Auto Confort', 0, 'Cancelado', 'auto'],
    ] as [string, string, number, string, string][],
  },
  AR: {
    fmt: fmtAR, city: 'Buenos Aires',
    passenger: { name: 'Lucía', ini: 'LG' },
    driver: { name: 'Sofía Méndez', first: 'Sofía', ini: 'SM', female: true, rating: '4,9', plate: 'AB 123 CD', car: 'Fiat Cronos', color: 'Gris', year: '2021', carShort: 'Fiat Cronos gris' },
    origin: 'Av. Corrientes y Gallo', myPlace: 'Tu ubicación · Av. Corrientes 3200',
    dests: [
      { name: 'Plaza Serrano', sub: 'Palermo Soho, CABA', km: '4,8', min: 16, kmReal: '4,9', minReal: 17, tripLeft: '9 min · 3,2 km', arrive: '18:49' },
      { name: 'Aeroparque Jorge Newbery', sub: 'Reciente · CABA', km: '7', min: 22, kmReal: '7,2', minReal: 23, tripLeft: '15 min · 5,1 km', arrive: '18:58' },
    ],
    eco: 8500, confort: 11200, etaEco: 3, etaConfort: 4, radiusNew: 9400,
    cashOnly: false, payCash: 'Mercado Pago · Visa •••• 4521', payCard: 'Mercado Pago · dinero en cuenta',
    tips: [500, 1000, 2000], pinCode: '3156',
    times: { arrives: '18:31', assigned: '18:28', arrived: '18:31', started: '18:34' },
    fare: [['Banderazo', 1300], ['Distancia · 4,8 km', 4300], ['Tiempo · 16 min', 1200], ['Demanda alta', 1700]] as [string, number][],
    earn: 7300, commission: 14, todayTrips: 9, todayEarn: 62400, zone: 'Palermo', avg: 7300,
    offer: { from: 'Almagro', fromKm: '0,9', to: 'Palermo Soho', toKm: '4,8', pay: 'Cobro con Mercado Pago' },
    week: 412000, payout: 'lunes 9 de noviembre', debt: 0, debtCap: 0,
    moves: [['Viaje · Plaza Serrano', 'Hoy 18:49 · Mercado Pago', 7300], ['Viaje · Aeroparque', 'Hoy 16:20 · Mercado Pago', 9800], ['Liquidación · Mercado Pago', '2 nov · Acreditada', -298000]] as [string, string, number][],
    history: [
      ['Av. Corrientes → Plaza Serrano', 'Hoy, 18:49 · Auto Económico', 9500, 'Completado', 'auto'],
      ['Limpieza general · 4 h', '1 nov · Av. Corrientes 3200', 42000, 'Completado', 'servicios'],
      ['Casa → Aeroparque', '30 oct · Auto Confort', 0, 'Cancelado', 'auto'],
    ] as [string, string, number, string, string][],
  },
};
export type CountryData = (typeof DATA)['PY'];

/** Pasos que avanzan solos con «Simular el viaje»: el pasajero ve al conductor llegar, subir y terminar. */
export const TRIP_STEPS: [V3Screen, V3Screen, number][] = [['A5', 'A6', 3500], ['A6', 'A7', 7000], ['A7', 'A8', 6000], ['A8', 'A9', 9000]];
const ROOTS: V3Screen[] = ['X1', 'A0', 'A11', 'D3', 'D0'];

export interface V3Props { country: Country; dark: boolean; sim: boolean }

export interface V3IO {
  st: V3State;
  set: (o: Partial<V3State>) => void;
  get: () => V3State;
}

/** Arma el view model: tokens, datos del país, acciones y lo que necesitan las piezas compartidas (barra, hojas, aviso). */
export function buildV3(p: V3Props, { st, set, get }: V3IO): VM {
  const t = tokens(p.dark);
  const D = DATA[p.country];
  const fmt = D.fmt;
  const dest = D.dests[st.dest];
  const modeF = st.mode === 'moto' ? 0.56 : st.mode === 'envio' ? (st.envio === 'mediano' ? 1 : 0.7) : 1;
  const round = (n: number) => Math.round(n / (p.country === 'PY' ? 500 : 100)) * (p.country === 'PY' ? 500 : 100);
  const priceEco = round(D.eco * modeF);
  const priceConfort = round(D.confort * modeF);
  const price = st.level === 'confort' ? priceConfort : priceEco;
  const tipValue = st.tip === 'otro' ? D.tips[2] * 1.5 : st.tip;
  const pay = st.card ? D.payCard : D.payCash;
  const driverSide = st.screen.startsWith('D');

  const go = (screen: V3Screen, extra: Partial<V3State> = {}) => {
    const cur = get();
    set({ screen, hist: ROOTS.includes(screen) ? [] : [...cur.hist, cur.screen], sheet: null, ...extra });
  };
  const replace = (screen: V3Screen, extra: Partial<V3State> = {}) => set({ screen, sheet: null, ...extra });
  const back = () => {
    const h = get().hist;
    if (!h.length) { set({ screen: driverSide ? 'D3' : 'A0', sheet: null }); return; }
    set({ screen: h[h.length - 1], hist: h.slice(0, -1), sheet: null });
  };
  const toast = (msg: string) => set({ toast: msg });

  const a = {
    back, go, replace, toast,
    /** cambia el estado sin navegar (elegir nivel, pago, estrellas, chips…) */
    patch: (o: Partial<V3State>) => set(o),
    sheet: (s: V3Sheet) => set({ sheet: s }),
    closeSheet: () => set({ sheet: null }),
    openExplorer: () => set({ sheet: 'explorer' }),
    setMode: (mode: Mode) => set({ mode, level: 'eco' }),
    pickDest: (i: 0 | 1) => go('A3', { dest: i }),
    confirmPoint: () => go('A4'),
    order: () => replace('A5', { tripActive: true }),
    cancelSearch: () => { set({ screen: 'A0', hist: [], sheet: null, tripActive: false }); toast('Cancelaste el pedido. No se te cobró nada'); },
    acceptRadius: () => replace('A5', { noDrivers: false }),
    sos911: () => { set({ sheet: null }); toast('Llamando al 911… Avisamos a Soporte'); },
    sosSupport: () => { set({ sheet: null }); toast('Avisamos a Soporte. Te escriben por el chat'); },
    share: () => toast('Abrimos la hoja de compartir del sistema'),
    chat: () => toast('Abrimos el chat con ' + D.driver.first),
    sendRating: () => {
      if (!get().stars) { toast('Elegí de 1 a 5 estrellas'); return; }
      const s = get();
      if (s.stars <= 2 && !Object.values(s.chips).some(Boolean)) { toast('Contanos qué pasó para enviar la calificación'); return; }
      set({ screen: 'A0', hist: [], sheet: null, tripActive: false, stars: 0, chips: {} });
      toast('¡Gracias! Tu calificación cuida a la comunidad');
    },
    // conductor
    connect: () => { set({ online: true }); toast('Te conectaste. Ya podés recibir viajes'); },
    disconnect: () => set({ online: false, sheet: null }),
    acceptOffer: () => go('D5', { sheet: null }),
    rejectOffer: () => { set({ sheet: null, offerSecs: 12 }); toast('Listo, seguís disponible'); },
    arrived: () => go('D6', { pin: '', pinErr: false }),
    press: (d: string) => {
      const pin = get().pin + d;
      if (pin.length < 4) { set({ pin, pinErr: false }); return; }
      if (pin === D.pinCode) { replace('D7', { pin: '' }); toast('PIN correcto. ¡Buen viaje!'); } else set({ pin: '', pinErr: true });
    },
    erase: () => set({ pin: get().pin.slice(0, -1) }),
    finish: () => replace('D8'),
    collected: () => { set({ screen: 'D3', hist: [], sheet: null }); toast(`Sumaste ${fmt(D.earn)} a tus ganancias`); },
    upload: (k: string) => set({ uploads: { ...get().uploads, [k]: true } }),
  };

  // piezas compartidas con la App integrada (chrome.tsx)
  const onMap = ['A3', 'A4', 'A5', 'A5b', 'A6', 'A7', 'A8', 'D3', 'D5', 'D7'].includes(st.screen);
  const showTabs = ['X1', 'A0', 'A11', 'D3', 'D0'].includes(st.screen);
  const section = st.screen === 'X1' ? 'servicios' : 'auto';
  const tabs = [['Inicio', 'home', ['X1', 'A0', 'D3', 'D0'].includes(st.screen)], ['Actividad', 'bell', st.screen === 'A11'], ['Perfil', 'user', false]].map(([label, icon, on]) => ({
    label, icon, current: on ? 'page' : 'false', fg: on ? t.link : t.text2,
    go: () => (label === 'Actividad' ? go('A11') : label === 'Perfil' ? toast('Perfil no está en este lienzo') : go(driverSide ? 'D3' : st.screen === 'X1' ? 'X1' : 'A0')),
  }));
  const explorer = {
    show: st.sheet === 'explorer',
    items: [
      ['servicios', 'Servicios', 'servicios', 'Limpieza, enfermería, niñeras y más', ''],
      ['auto', 'Chambito Auto', 'car', st.tripActive ? `${D.driver.first} llega en ${D.etaEco} min` : 'Viajes, motos y envíos. También podés manejar.', st.tripActive ? 'En curso' : ''],
      ['market', 'Chambito Market', 'bag', 'Comprá y vendé con gente verificada', 'Nuevo'],
    ].map(([k, title, icon, hint, tag]) => {
      const on = k === section;
      return {
        t, title, icon, hint, on, tag: on ? 'Estás acá' : tag, hasTag: on || !!tag,
        aria: `${title}: ${hint}${on ? ', estás acá' : ''}`,
        pick: () => (on ? set({ sheet: null }) : k === 'servicios' ? go('X1') : k === 'auto' ? go('A0') : toast('Market está en la App integrada')),
      };
    }),
  };

  return {
    ...st, // el estado primero: lo calculado de abajo (dest, toast…) tiene prioridad
    t, D, fmt, dest, price, priceEco, priceConfort, tipValue, pay, a, dark: p.dark, country: p.country, sim: p.sim, onMap,
    // chrome.tsx
    showTabs, tabs, tabCols: 3, live: { show: false },
    selector: { show: true, label: section === 'servicios' ? 'Servicios' : 'Auto', icon: section === 'servicios' ? 'servicios' : 'car', aria: `Sección: ${section === 'servicios' ? 'Servicios' : 'Auto'}. Cambiar de sección` },
    explorer, sheetSos: st.sheet === 'sos',
    toast: { show: !!st.toast, msg: st.toast ?? '', top: onMap ? '108px' : 'auto', bottom: onMap ? 'auto' : showTabs ? '128px' : '120px' },
    map: p.dark ? darkTheme.map : lightTheme.map,
  };
}
