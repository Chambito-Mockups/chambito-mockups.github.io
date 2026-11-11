import { setCodec, usePersistent } from '../persist';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { Category, ChatMsg, LISTINGS, MY_LISTINGS, MyListing, MyStatus } from './data';
import { Plan, ShipPay } from '../commission';

export interface Filters {
  category: Category | null;
  condition: 'Todos' | 'Nuevo' | 'Usado';
  min: string;
  max: string;
  km: 5 | 10 | 25 | 50;
  sort: 'Más recientes' | 'Menor precio' | 'Mayor precio' | 'Más cerca';
}
export const DEFAULT_FILTERS: Filters = { category: null, condition: 'Todos', min: '', max: '', km: 25, sort: 'Más recientes' };

export type PhotoState = 'subiendo' | 'procesando' | 'lista' | 'no-permitida';
export interface Draft {
  step: 1 | 2 | 3;
  photos: { id: number; state: PhotoState; ph: 0 | 1 | 2 }[];
  title: string;
  category: Category;
  condition: 'Nuevo' | 'Usado';
  price: string;
  attrs: Record<string, string>;
  description: string;
  zone: string;
  /** unidades para vender */
  stock?: number;
  /** quién paga el envío */
  shipping?: ShipPay;
  editing?: string; // id of MyListing when editing
  savedAt?: number;
}
export const emptyDraft = (): Draft => ({ step: 1, photos: [], title: '', category: 'Deportes', condition: 'Usado', price: '', attrs: {}, description: '', zone: 'Lambaré', stock: 1, shipping: 'comprador' });

export interface Notif {
  id: string;
  icon: string;
  tone: 'success' | 'error' | 'neutral';
  title: string;
  text: string;
  time: string;
  go: { screen: 'M06' | 'M10' | 'V21'; listing?: string };
}

interface MarketCtx {
  saved: Set<string>;
  toggleSaved: (id: string) => boolean; // returns new state
  listingId: string;
  openListing: (id: string) => void;
  sellerId: string;
  setSellerId: (id: string) => void;
  query: string;
  setQuery: (q: string) => void;
  recentSearches: string[];
  removeRecent: (q: string) => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  resultsTab: 'Productos' | 'Servicios';
  setResultsTab: (t: 'Productos' | 'Servicios') => void;
  chats: Record<string, ChatMsg[]>;
  sendMsg: (listing: string, text: string) => void;
  chatListing: string;
  setChatListing: (id: string) => void;
  mine: MyListing[];
  setMine: (f: (m: MyListing[]) => MyListing[]) => void;
  myTab: MyStatus;
  setMyTab: (t: MyStatus) => void;
  actionsFor: string | null;
  setActionsFor: (id: string | null) => void;
  draft: Draft | null;
  setDraft: (d: Draft | null | ((d: Draft) => Draft)) => void;
  welcomed: boolean;
  setWelcomed: (v: boolean) => void;
  lastPublished: { title: string; price: number; review: boolean } | null;
  setLastPublished: (v: { title: string; price: number; review: boolean } | null) => void;
  notifs: Notif[];
  activityTab: 'Servicios' | 'Tienda';
  setActivityTab: (v: 'Servicios' | 'Tienda') => void;
  pendingAction: (() => void) | null;
  pendingVerb: string;
  setPendingAction: (f: (() => void) | null, verb?: string) => void;
  /** ventas y cobros del vendedor (fase 2) */
  cobros: Cobros;
  setCobros: (patch: Partial<Cobros>) => void;
}

/** Estado de la demo de ventas y cobros: qué venta se mira, plan, retiros hechos y ajustes. */
export interface Cobros {
  saleId: string;
  filter: 'todas' | 'pendiente' | 'disponible' | 'reclamo';
  /** el comprador de la venta pendiente confirmó (pasa a disponible) */
  released: boolean;
  planPick: Plan | null;
  /** plan al que se baja al terminar el mes */
  planNext: Plan | null;
  /** guaraníes ya retirados en la demo */
  withdrawn: number;
  payCount: number;
  lastPayout: number;
  newPayouts: { when: string; amount: number; status: string }[];
  autoPay: boolean;
  /** C1: Publicar 2 muestra cuánto recibís con compra protegida */
  feePreview: boolean;
}
export const DEFAULT_COBROS: Cobros = { saleId: 'v6', filter: 'todas', released: false, planPick: null, planNext: null, withdrawn: 0, payCount: 0, lastPayout: 0, newPayouts: [], autoPay: false, feePreview: false };

const Ctx = createContext<MarketCtx | null>(null);

const firstChat = (listing: string): ChatMsg[] => {
  const l = LISTINGS.find((x) => x.id === listing);
  return [{ from: 'system', text: `Consultaste por «${l ? l.title.split(',')[0] : 'el producto'}». Hablá solo por este chat y nunca pagues por adelantado.` }];
};

export function MarketProvider({ children }: { children: ReactNode }) {
  // what the user builds in the demo survives reloads
  const [saved, setSaved] = usePersistent<Set<string>, string[]>('market.saved', () => new Set(['nike', 'campera', 'trek', 'iphone']), setCodec);
  const [listingId, setListingId] = useState('trek');
  const [sellerId, setSellerId] = useState('carla');
  const [query, setQuery] = useState('');
  const [recentSearches, setRecent] = usePersistent('market.recent', ['silla gamer', 'iphone 12']);
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS, condition: 'Usado' });
  const [resultsTab, setResultsTab] = useState<'Productos' | 'Servicios'>('Productos');
  const [chats, setChats] = usePersistent<Record<string, ChatMsg[]>>('market.chats', {
    trek: [
      ...firstChat('trek'),
      { from: 'me', text: 'Hola, ¿sigue disponible? ¿Se puede ver en Lambaré?', time: '15:02' },
      { from: 'them', text: '¡Hola! Sí, está disponible. Podemos vernos cerca del shopping, te paso el punto.', time: '15:05' },
      { from: 'me', text: 'Perfecto, ¿mañana a la tarde?', time: '15:06' },
    ],
  });
  const [chatListing, setChatListing] = useState('trek');
  const [mine, setMineState] = usePersistent<MyListing[]>('market.mine', MY_LISTINGS);
  const [myTab, setMyTab] = useState<MyStatus>('Activas');
  const [actionsFor, setActionsFor] = useState<string | null>(null);
  const [draft, setDraftState] = usePersistent<Draft | null>('market.draft', null);
  const [welcomed, setWelcomed] = usePersistent('market.welcomed', false);
  const [lastPublished, setLastPublished] = useState<MarketCtx['lastPublished']>(null);
  const [pendingAction, setPending] = useState<(() => void) | null>(null);
  const [pendingVerb, setPendingVerb] = useState('consultar');
  const [activityTab, setActivityTab] = useState<'Servicios' | 'Tienda'>('Servicios');
  const [cobros, setCobrosState] = useState<Cobros>(DEFAULT_COBROS);
  const setCobros = useCallback((patch: Partial<Cobros>) => setCobrosState((c) => ({ ...c, ...patch })), []);

  const toggleSaved = useCallback((id: string) => {
    const was = saved.has(id);
    setSaved((s) => {
      const n = new Set(s);
      if (was) n.delete(id);
      else n.add(id);
      return n;
    });
    return !was;
  }, [saved]);

  const sendMsg = useCallback((listing: string, text: string) => {
    const time = new Date().toTimeString().slice(0, 5);
    setChats((c) => ({ ...c, [listing]: [...(c[listing] ?? firstChat(listing)), { from: 'me', text, time }] }));
    // the seller answers a moment later (mock)
    window.setTimeout(() => {
      const reply = /precio/i.test(text) ? 'Te lo dejo un poco menos si lo retirás esta semana.' : /retira|dónde/i.test(text) ? 'Lo podés retirar por mi zona, te paso el punto por acá.' : '¡Hola! Sí, sigue disponible.';
      setChats((c) => ({ ...c, [listing]: [...(c[listing] ?? []), { from: 'them', text: reply, time: new Date().toTimeString().slice(0, 5) }] }));
    }, 1600);
  }, []);

  const value = useMemo<MarketCtx>(
    () => ({
      saved, toggleSaved,
      listingId, openListing: setListingId,
      sellerId, setSellerId,
      query, setQuery: (q: string) => { setQuery(q); if (q.trim()) setRecent((r) => [q.trim(), ...r.filter((x) => x !== q.trim())].slice(0, 4)); },
      recentSearches, removeRecent: (q: string) => setRecent((r) => r.filter((x) => x !== q)),
      filters, setFilters, resultsTab, setResultsTab,
      chats: { ...chats }, sendMsg, chatListing, setChatListing,
      mine, setMine: setMineState, myTab, setMyTab, actionsFor, setActionsFor,
      draft, setDraft: (d) => setDraftState((cur) => (typeof d === 'function' ? (cur ? d(cur) : cur) : d)),
      welcomed, setWelcomed, lastPublished, setLastPublished,
      notifs: NOTIFS, activityTab, setActivityTab,
      pendingAction, pendingVerb, setPendingAction: (f, verb) => { setPending(() => f); if (verb) setPendingVerb(verb); },
      cobros, setCobros,
    }),
    [cobros, setCobros, activityTab, pendingVerb, saved, toggleSaved, listingId, sellerId, query, recentSearches, filters, resultsTab, chats, sendMsg, chatListing, mine, myTab, actionsFor, draft, welcomed, lastPublished, pendingAction],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMarket() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useMarket outside MarketProvider');
  return c;
}

const NOTIFS: Notif[] = [
  { id: 'n1', icon: 'check', tone: 'success', title: 'Tu publicación ya está activa', text: '«Bicicleta Trek rodado 29» ya se ve en la Tienda.', time: 'Ahora', go: { screen: 'V21' } },
  { id: 'n2', icon: 'messageCircle', tone: 'neutral', title: 'Nuevo mensaje sobre «Bicicleta Trek rodado 29»', text: 'Carla: Sí, está disponible. Podemos vernos…', time: '15:05', go: { screen: 'M10', listing: 'trek' } },
  { id: 'n3', icon: 'tag', tone: 'neutral', title: 'Bajó el precio de algo que guardaste', text: '«Campera de jean talle M» ahora cuesta {price}.', time: 'Ayer', go: { screen: 'M06', listing: 'campera' } },
  { id: 'n4', icon: 'error', tone: 'error', title: 'No pudimos publicar «Campera de jean talle M»', text: 'Motivo: la foto de portada muestra otro producto. Tocá para corregirla.', time: 'Lun', go: { screen: 'V21' } },
];
