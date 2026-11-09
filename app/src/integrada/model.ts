/**
 * Estado y lógica de la app integrada (Servicios, Auto y Market), portados de chambito-app.html.
 * `buildModel` arma, en cada render, el «view model» que leen las pantallas con `useVM()`:
 * tokens del tema (`t`), pantalla abierta (`screen`), acciones (`a`), navegación (`go`) y los datos de cada flujo.
 * El estado vive en `useIntegrada` (IntegradaPhone.tsx); los temporizadores del viaje, la oferta y la compra pasan por `later`.
 */
import { createContext, useContext } from 'react';

/* The design's view model is dynamic (built per render from the state), so it is typed loosely. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
export type St = Record<string, Any>;
export type VM = Record<string, Any>;

export interface IntegradaProps {
  navegacion?: string;
  faseMarket?: string;
  pantallaInicial?: string;
  dark?: boolean;
  /** categorías de la Tienda: círculos en una fila, o mosaicos (CategoryTile del sistema de diseño) */
  categorias?: 'Círculos' | 'Mosaicos';
}

export interface ModelIO {
  /** state of this render */
  st: St;
  /** latest state (for timers and handlers that run later) */
  cs: () => St;
  /** merge into the state */
  S: (o: St) => void;
  /** setTimeout that is cleared when the phone unmounts */
  later: (fn: () => void, ms: number) => void;
  /** back to the initial state */
  reset: () => void;
}

export const VMContext = createContext<VM | null>(null);
export function useVM(): VM {
  const vm = useContext(VMContext);
  if (!vm) throw new Error('useVM fuera de la app integrada');
  return vm;
}

export function buildModel(P_: IntegradaProps, { st, cs, S, later, reset }: ModelIO): VM {
  const SCREENS: Any = ["inicio", "explorar", "actividad", "perfil", "notifs", "svc", "svcPros", "svcConfirm", "svcOk", "tienda", "mBuscar", "ficha", "chat", "guardados", "misPubs", "vender", "pub1", "pub2", "pub3", "pubOk", "carrito", "confirmar", "compraOk", "orden", "devolucion", "auto", "aDestino", "aPunto", "aConfirmar", "viaje", "aCalificar", "sInicio", "trabajo", "dHome", "dBuscar", "dPin", "dViaje", "dCobro"];
  // colores del brief de diseño (2026-11-09, TOKENS.json v1.1.0): claro
  const L: Any = {"canvas": "#F5F5F5", "surface": "#FFFFFF", "raised": "#FFFFFF", "muted": "#EBEBEB", "mos": "#F5F5F5", "field": "#FFFFFF", "inverse": "#000000", "onInverse": "#FFFFFF", "brand": "#4BAC4F", "brandPressed": "#3E9642", "brandSubtle": "#4BAC4F33", "text": "#000000", "text2": "#5C5C5C", "text3": "#707070", "link": "#2F7A33", "success": "#24602A", "warning": "#7A4D00", "danger": "#B71C1C", "iconBrand": "#2F7A33", "bSubtle": "#EBEBEB", "bDefault": "#CCCCCC", "bField": "#808080", "bStrong": "#000000", "focus": "#2F7A33", "warnSubtle": "#7A4D001F", "dangerSubtle": "#B71C1C1F", "brandOnInverse": "#4BAC4F", "shadow1": "0 1px 2px #0000000F, 0 2px 8px #0000000A", "shadow3": "0 16px 48px #0000002E", "map": "#E3E7E3", "road": "#FFFFFF", "handle": "#CCCCCC", "badgeNeutral": "#EBEBEB", "onDanger": "#FFFFFF", "skel": "#EBEBEB", "text2Inv": "#B3B3B3"};
  const D: Any = {"canvas": "#000000", "surface": "#333333", "raised": "#1A1A1A", "muted": "#333333", "mos": "#4D4D4D", "field": "#333333", "inverse": "#FFFFFF", "onInverse": "#000000", "brand": "#4BAC4F", "brandPressed": "#3E9642", "brandSubtle": "#4BAC4F33", "text": "#FFFFFF", "text2": "#B3B3B3", "text3": "#9E9E9E", "link": "#7CCB7F", "success": "#7CCB7F", "warning": "#FFB547", "danger": "#FF6B6B", "iconBrand": "#4BAC4F", "bSubtle": "#333333", "bDefault": "#4D4D4D", "bField": "#808080", "bStrong": "#FFFFFF", "focus": "#4BAC4F", "warnSubtle": "#FFB54729", "dangerSubtle": "#FF6B6B29", "brandOnInverse": "#2F7A33", "shadow1": "none", "shadow3": "0 16px 48px #00000099", "map": "#1A1A1A", "road": "#333333", "handle": "#4D4D4D", "badgeNeutral": "#4D4D4D", "onDanger": "#000000", "skel": "#333333", "text2Inv": "#5C5C5C"};
  // bg = bg.canvas · fill = bg.muted (chips, cajas de ícono, buscadores) · cardBg = bg.surface
  const LX: Any = {"bg": "#F5F5F5", "fill": "#EBEBEB", "cardBg": "#FFFFFF", "ph": "#E3E3E3", "ph2": "#D6D6D6", "ph3": "#CCCCCC", "line": "#EBEBEB", "scrim": "#00000080", "outline": "#EBEBEB"};
  const DX: Any = {"bg": "#000000", "fill": "#333333", "cardBg": "#333333", "ph": "#4D4D4D", "ph2": "#5C5C5C", "ph3": "#262626", "line": "#333333", "scrim": "#00000080", "outline": "#4D4D4D"};
  const startKey = P_.pantallaInicial || 'Inicio (cliente)';
  const START: Any = {
    'Inicio (cliente)': ['inicio', 'cliente'], 'Tienda': ['tienda', 'cliente'], 'Auto': ['auto', 'cliente'],
    'Socio · Inicio': ['sInicio', 'socio'], 'Conductor': ['dHome', 'socio']
  };
  const start = START[startKey] || START['Inicio (cliente)'];
  const screen = st.screen || start[0];
  const hist = st.hist || [];
  const role = st.role || start[1];

  // ---------- tokens ----------
  const dark = (st.dark === true || st.dark === false) ? st.dark : !!P_.dark;
  const src = dark ? D : L; const t: Any = {};
  for (const k in src) { t[k] = src[k]; }
  const X = dark ? DX : LX; for (const k2 in X) { t[k2] = X[k2]; }
  t.onBrand = '#FFFFFF'; // texto sobre verde: siempre blanco (brief, regla de color)
  t.logo = dark ? './brand/chambito-horizontal-blanco.png' : './brand/chambito-horizontal.png';
  const fase2 = P_.faseMarket === 'Fase 2 · compra protegida';
  const navMode = P_.navegacion || 'Explorar (prototipo)';
  // «Selector de sección» (Prototipo Auto): each home has «Servicios ▾ / Auto ▾ / Market ▾» and the bar is Inicio · Actividad · Perfil
  const sel = navMode === 'Selector de sección';
  const SECTION_HOME: Any = { servicios: 'inicio', auto: 'auto', market: 'tienda' };
  const SECTION_OF: Any = { inicio: 'servicios', auto: 'auto', tienda: 'market' };
  const section = SECTION_OF[screen] || st.section || 'servicios';
  /** going to a section home in the selector mode remembers it, so Inicio reopens there */
  function withSection(id?: Any, o?: Any) { if (sel && SECTION_OF[id]) o.section = SECTION_OF[id]; return o; }

  // ---------- helpers ----------
  function fmt(n?: Any) { return 'Gs. ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function copy(o?: Any) { const r: Any = {}; for (const kk in (o || {})) r[kk] = o[kk]; return r; }
  function homeOf(r?: Any) { return (r || role) === 'socio' ? 'sInicio' : sel ? SECTION_HOME[cs().section || 'servicios'] : 'inicio'; }
  function curScreen() { const x = cs(); return x.screen || start[0]; }
  function curHist() { return cs().hist || []; }
  function go(id?: Any, extra?: Any) {
    const o: Any = withSection(id, { screen: id, hist: curHist().concat([curScreen()]), sheet: null });
    if (extra) for (const kk in extra) o[kk] = extra[kk];
    S(o);
  }
  function replace(id?: Any, extra?: Any, dropFlow?: Any) {
    let h = curHist();
    if (dropFlow) h = h.filter(function (x?: Any) { return dropFlow.indexOf(x) < 0; });
    const o: Any = { screen: id, hist: h, sheet: null };
    if (extra) for (const kk in extra) o[kk] = extra[kk];
    S(o);
  }
  function root(id?: Any, extra?: Any) {
    const o: Any = withSection(id, { screen: id, hist: [], sheet: null });
    if (extra) for (const kk in extra) o[kk] = extra[kk];
    S(o);
  }
  function back() {
    let h = curHist();
    if (!h.length) { root(homeOf()); return; }
    S({ screen: h[h.length - 1], hist: h.slice(0, -1), sheet: null });
  }
  function toast(msg?: Any) {
    const id = Date.now() + Math.random();
    S({ toast: msg, toastId: id });
    later(function () { if (cs().toastId === id) S({ toast: null }); }, 4000);
  }
  function nav(id?: Any) { return function () { if (tabDefs.some(function (d?: Any) { return d[0] === id; }) || (selHomes && SECTION_OF[id])) root(id); else go(id); }; }
  function chip(label?: Any, on?: Any, pick?: Any) {
    return { t: t, label: label, on: !!on, pressed: on ? 'true' : 'false', pick: pick, bg: on ? t.inverse : t.fill, fg: on ? t.onInverse : t.text };
  }
  function radioV(on?: Any) { return { checked: on ? 'true' : 'false', ring: on ? t.focus : t.bDefault, ringW: on ? 2 : 1, rRing: on ? t.inverse : t.bField, rBg: on ? t.inverse : 'transparent', dot: on ? t.onInverse : 'transparent' }; }
  function assign(a?: Any, b?: Any) { for (const kk in b) a[kk] = b[kk]; return a; }

  // ---------- data ----------
  const PRODUCTS: Any = [
    { id: 'bici', title: 'Bicicleta Trek rodado 29, cambios Shimano', price: 1450000, place: 'Lambaré', km: 3, rating: '4,9', reviews: 23, seller: 'Carla Benítez', ini: 'CB', since: 'ago. 2026', cat: 'deportes', cond: 'Usado', tone: 0, near: true, kw: 'bicicleta bici trek', desc: 'Poco uso, cambios Shimano de 21 velocidades. Incluye luces delanteras y traseras.', attrs: [['Rodado', '29'], ['Marca', 'Trek'], ['Talle', 'M']] },
    { id: 'nike', title: 'Zapatillas Nike Air talle 42, sin uso', price: 350000, place: 'Asunción', km: 1, rating: '4,8', reviews: 41, seller: 'Fernanda Ayala', ini: 'FA', since: 'jun. 2026', cat: 'ropa', cond: 'Nuevo', tone: 1, near: true, kw: 'zapatillas nike', desc: 'Sin uso, en su caja. Me quedaron chicas.', attrs: [['Talle', '42'], ['Marca', 'Nike'], ['Color', 'Blanco']] },
    { id: 'silla', title: 'Silla de oficina ergonómica con apoyabrazos', price: 650000, place: 'San Lorenzo', km: 6, rating: '5,0', reviews: 12, seller: 'Diego Ortiz', ini: 'DO', since: 'mar. 2026', cat: 'hogar', cond: 'Usado', tone: 2, near: true, kw: 'silla oficina', desc: 'Respaldo con soporte lumbar y altura regulable. Un año de uso.', attrs: [['Material', 'Malla'], ['Ruedas', 'Sí'], ['Color', 'Negro']] },
    { id: 'iphone', title: 'iPhone 12 de 128 GB, batería al 86 %', price: 2900000, place: 'Asunción', km: 2, rating: '4,8', reviews: 57, seller: 'Ana Rolón', ini: 'AR', since: 'ene. 2026', cat: 'tecnologia', cond: 'Usado', tone: 0, sold: true, kw: 'iphone celular telefono', desc: 'Siempre con funda y vidrio templado. Incluye cargador.', attrs: [['Memoria', '128 GB'], ['Batería', '86 %'], ['Color', 'Azul']] },
    { id: 'campera', title: 'Campera de jean talle M', price: 180000, was: 220000, place: 'Fdo. de la Mora', km: 4, rating: '4,7', reviews: 9, seller: 'Rocío Cáceres', ini: 'RC', since: 'may. 2026', cat: 'ropa', cond: 'Usado', tone: 1, kw: 'campera jean', desc: 'Talle M, poco uso y sin roturas.', attrs: [['Talle', 'M'], ['Material', 'Jean'], ['Color', 'Azul']] },
    { id: 'heladera', title: 'Heladera Tokyo 300 L', price: 1900000, place: 'Luque', km: 8, rating: '4,9', reviews: 30, seller: 'Martín Sosa', ini: 'MS', since: 'feb. 2026', cat: 'hogar', cond: 'Usado', tone: 2, cross: true, kw: 'heladera tokyo', desc: 'Funciona perfecto. La cambio por una más grande.', attrs: [['Capacidad', '300 L'], ['Marca', 'Tokyo'], ['Frío', 'No frost']] },
    { id: 'notebook', title: 'Notebook Lenovo IdeaPad 15, 8 GB de RAM', price: 2400000, place: 'Asunción', km: 5, rating: '4,8', reviews: 18, seller: 'Gustavo Rojas', ini: 'GR', since: 'abr. 2026', cat: 'tecnologia', cond: 'Usado', tone: 1, kw: 'notebook lenovo computadora', desc: 'Disco SSD de 256 GB. Batería en buen estado, con cargador original.', attrs: [['RAM', '8 GB'], ['Disco', '256 GB'], ['Pantalla', '15"']] },
    { id: 'mesa', title: 'Mesa de luz de madera', price: 250000, place: 'Lambaré', km: 0, rating: '4,9', reviews: 6, seller: 'Lucía Giménez', ini: 'LG', since: 'ago. 2026', cat: 'hogar', cond: 'Usado', tone: 1, mine: true, status: 'ok', kw: 'mesa luz', desc: 'Madera maciza, dos cajones.', attrs: [['Material', 'Madera'], ['Cajones', '2'], ['Alto', '55 cm']] },
    { id: 'coche', title: 'Cochecito de bebé plegable', price: 400000, place: 'Lambaré', km: 0, rating: '4,9', reviews: 6, seller: 'Lucía Giménez', ini: 'LG', since: 'ago. 2026', cat: 'otros', cond: 'Usado', tone: 2, mine: true, status: 'review', hidden: true, kw: 'cochecito bebe', desc: 'Plegable, con capota y canasto.', attrs: [['Edad', '0 a 3 años'], ['Plegable', 'Sí'], ['Color', 'Gris']] }
  ];
  const CATS: Any = [['ropa', 'Ropa', 'tag'], ['tecnologia', 'Tecnología', 'phone'], ['deportes', 'Deportes', 'flag'], ['hogar', 'Hogar', 'home'], ['otros', 'Otros', 'more']];
  const catName: Any = {}; CATS.forEach(function (c?: Any) { catName[c[0]] = c[1]; });
  const pubs = st.pubs || [];
  const ALL = PRODUCTS.concat(pubs);
  function byId(id?: Any) { for (let i = 0; i < ALL.length; i++) if (ALL[i].id === id) return ALL[i]; return ALL[0]; }
  const TONES: Any = [t.ph, t.ph2, t.ph3];
  const saved = st.saved || { nike: true, campera: true, bici: true, iphone: true };
  const cart = st.cart || [];

  function toggleSave(id?: Any) {
    return function () {
      const sv = copy(cs().saved || saved); const on = !sv[id]; sv[id] = on;
      S({ saved: sv }); toast(on ? 'Lo guardaste en Guardados' : 'Lo quitaste de Guardados');
    };
  }
  function openProduct(id?: Any) { return function () { go('ficha', { pid: id }); }; }
  function pview(p?: Any) {
    const on = !!saved[p.id];
    const where = p.mine ? 'Tu publicación · ' + p.place : p.place + ' · a ' + p.km + ' km';
    let tag = '', tagBg = t.fill, tagFg = t.text;
    if (p.sold) { tag = 'Vendida'; tagBg = t.dangerSubtle; tagFg = t.danger; }
    else if (p.was) { tag = 'Bajó de precio'; tagBg = t.brandSubtle; tagFg = t.success; }
    else if (p.mine && p.status === 'review') { tag = 'Revisá la foto de portada'; tagBg = t.warnSubtle; tagFg = t.warning; }
    else if (p.mine) { tag = p.isNew ? 'Activa · nueva' : 'Activa'; tagBg = t.brandSubtle; tagFg = t.success; }
    return {
      t: t, id: p.id, title: p.title, priceTxt: fmt(p.price), hasWas: !!p.was, wasTxt: p.was ? fmt(p.was) : '', where: where, rating: p.rating,
      ph: TONES[p.tone || 0], op: p.sold ? 0.55 : 1, sold: !!p.sold, aria: p.title + ', ' + fmt(p.price),
      open: openProduct(p.id), toggleSave: toggleSave(p.id), saveLabel: on ? 'Quitar de Guardados' : 'Guardar',
      savedStr: on ? 'true' : 'false', heart: on ? t.iconBrand : t.text3, hasTag: !!tag, tag: tag, tagBg: tagBg, tagFg: tagFg
    };
  }

  // ---------- navigation chrome ----------
  const TABSETS: Any = {
    'Explorar (prototipo)': [['inicio', 'home', 'Inicio'], ['explorar', 'search', 'Explorar'], ['actividad', 'bell', 'Actividad'], ['perfil', 'user', 'Perfil']],
    'Combinación 1 · Auto y Tienda': [['inicio', 'home', 'Inicio'], ['auto', 'car', 'Auto'], ['tienda', 'bag', 'Tienda'], ['actividad', 'bell', 'Actividad'], ['perfil', 'user', 'Perfil']],
    'Combinación 2 · Auto': [['inicio', 'home', 'Inicio'], ['auto', 'car', 'Auto'], ['actividad', 'bell', 'Actividad'], ['perfil', 'user', 'Perfil']],
    'Tienda en la barra': [['inicio', 'home', 'Inicio'], ['tienda', 'bag', 'Tienda'], ['actividad', 'bell', 'Actividad'], ['perfil', 'user', 'Perfil']],
    'Selector de sección': [['inicio', 'home', 'Inicio'], ['actividad', 'bell', 'Actividad'], ['perfil', 'user', 'Perfil']]
  };
  const SOCIO_TABS: Any = [['sInicio', 'home', 'Inicio'], ['trabajo', 'inbox', 'Trabajo'], ['actividad', 'bell', 'Actividad'], ['perfil', 'user', 'Perfil']];
  const tabDefs = role === 'socio' ? SOCIO_TABS : (TABSETS[navMode] || TABSETS['Explorar (prototipo)']);
  // in the selector mode the three section homes are roots: the bar shows and Inicio stays marked
  const selHomes = sel && role !== 'socio';
  const isRoot = tabDefs.some(function (d?: Any) { return d[0] === screen; }) || (selHomes && !!SECTION_OF[screen]);
  const showTabs = isRoot && hist.length === 0;

  const SVC: Any = {
    limpieza: { title: 'Limpieza del hogar', icon: 'broom', headline: 'Limpieza por horas', blurb: 'Profesionales verificados con calificaciones', perHour: 25000, unit: 'h' },
    ninera: { title: 'Niñera', icon: 'bottle', headline: 'Cuidado de niños', blurb: 'Niñeras verificadas y con referencias', perHour: 30000, unit: 'h' },
    enfermeria: { title: 'Enfermería a domicilio', icon: 'nurse', headline: 'Enfermería', blurb: 'Personal matriculado y verificado', perHour: 45000, unit: 'h' },
    tecnico: { title: 'Instalación de heladera', icon: 'servicios', headline: 'Técnico de refrigeración', blurb: 'Instalación y prueba en tu casa', perHour: 0, fixed: 150000, unit: 'v' }
  };
  // trip / order / service state
  const trip = st.trip || null;
  const tripActive = trip === 'buscando' || trip === 'enCamino' || trip === 'llego' || trip === 'enCurso';
  const order = st.order || null;
  const orderPhase = st.orderPhase || null;
  const svcStatus = st.svcStatus || null;

  let live: Any = { show: false, title: '', sub: '', icon: 'car', go: nav('viaje') };
  const TRIPTXT: Any = { buscando: ['Buscando conductor…', 'Radio de 3 km'], enCamino: ['Marcos llega en 3 min', 'Toyota Vitz blanco · ABCD 123 · PIN 4827'],
    llego: ['Tu conductor llegó', 'Te espera 5 minutos sin cargo'], enCurso: ['Viaje en curso', 'Llegás 9:59 · Compartí tu viaje'] };
  if (tripActive) { live = { show: true, title: TRIPTXT[trip][0], sub: TRIPTXT[trip][1], icon: 'car', go: nav('viaje') }; }
  else if (trip === 'fin' && !st.tripRated && role === 'cliente') { live = { show: true, title: '¿Cómo estuvo tu viaje?', sub: 'Calificá a Marcos', icon: 'star', go: nav('aCalificar') }; }
  else if (order && (orderPhase === 'preparando' || orderPhase === 'enCamino' || orderPhase === 'pagado')) {
    live = { show: true, title: orderPhase === 'enCamino' ? 'Tu compra está en camino' : 'Tu pago está protegido', sub: byId(order.items[0]).title, icon: 'bag', go: nav('orden') };
  } else if (svcStatus === 'confirmado' && role === 'cliente') { live = { show: true, title: SVC[st.svcType || 'limpieza'].title + ' confirmado', sub: ((SVC[st.svcType || 'limpieza'].fixed ? 'Visita técnica' : (st.hours || 4) + ' h') + ' · ' + (st.day || 'Mañana') + ' ' + (st.time || '10:00')), icon: 'servicios', go: function () { go('svcOk'); } }; }
  else if (role === 'socio' && st.dOnline) { live = { show: true, title: 'Estás conectado para viajes', sub: 'Disponible · ×1,4 en Villa Morra', icon: 'car', go: function () { go('dHome'); } }; }
  const tabPad = 120 + (live.show ? 64 : 0);

  const notifDot = !st.notifsRead;
  const tabs = tabDefs.map(function (d?: Any) {
    // selector mode: Inicio is marked on any section home and reopens the last section used
    const inicioSel = selHomes && d[0] === 'inicio';
    const on = d[0] === screen || (inicioSel && !!SECTION_OF[screen]);
    return { t: t, label: d[2], icon: d[1], current: on ? 'page' : 'false', bg: 'transparent', fg: on ? t.link : t.text2, // activa: #2F7A33 / #7CCB7F
      dot: d[0] === 'actividad' && (tripActive || (order && orderPhase !== 'entregado')) && !on,
      go: function () { root(inicioSel ? SECTION_HOME[cs().section || 'servicios'] : d[0]); } };
  });

  // ---------- actions ----------
  const a: Any = {};
  a.back = back;
  a.home = function () { root(homeOf()); };
  a.notInProto = function () { toast('Esta pantalla no está en el prototipo'); };
  a.share = function () { toast('Abrimos la hoja de compartir del sistema'); };
  a.reset = reset;
  a.closeSheet = function () { S({ sheet: null }); };

  // X2 · «Elegí qué querés hacer»: one row per section, the current one marked
  const SECTIONS: Any = [
    ['servicios', 'Servicios', 'Servicios', 'servicios', 'Limpieza, enfermería, niñeras y más', ''],
    ['auto', 'Auto', 'Chambito Auto', 'car', 'Pedí un viaje o manejá con tu auto', ''],
    ['market', 'Market', 'Chambito Market', 'bag', 'Comprá y vendé con gente verificada', 'Nuevo']
  ];
  const curSec = SECTIONS.filter(function (x?: Any) { return x[0] === section; })[0];
  const selector = { show: selHomes && !!SECTION_OF[screen], label: curSec[1], icon: curSec[3], aria: 'Sección: ' + curSec[1] + '. Cambiar de sección' };
  a.openExplorer = function () { S({ sheet: 'explorer' }); };
  const explorer = {
    show: st.sheet === 'explorer',
    items: SECTIONS.map(function (x?: Any) {
      const on = x[0] === section;
      return { t: t, title: x[2], icon: x[3], hint: x[4], on: on, tag: on ? 'Estás acá' : x[5], hasTag: on || !!x[5],
        aria: x[2] + ': ' + x[4] + (on ? ', estás acá' : x[5] ? ', ' + x[5].toLowerCase() : ''),
        pick: function () { if (on) { S({ sheet: null }); return; } root(SECTION_HOME[x[0]]); } };
    })
  };
  a.toActividad = function () { root('actividad'); };
  a.toConsultas = function () { root('actividad', { actFilter: 'market' }); };
  function popTo(id?: Any, fallback?: Any) {
    let h = curHist(); let i = h.lastIndexOf(id);
    S({ screen: id, hist: i >= 0 ? h.slice(0, i) : fallback, sheet: null });
  }
  a.toTienda = function () { popTo('tienda', tabDefs.some(function (d?: Any) { return d[0] === 'tienda'; }) ? [] : [homeOf()]); };
  a.goDriver = function () { if (role !== 'socio') { S({ role: 'socio', screen: 'dHome', hist: ['sInicio'], sheet: null }); toast('Pasaste a modo socio'); } else { go('dHome'); } };

  // servicios
  function startSvc(type?: Any) { return function () { go('svc', { svcType: type, hours: type === 'tecnico' ? 1 : 4, day: 'Mañana', time: '10:00', pro: 0 }); }; }
  a.svcLimpieza = startSvc('limpieza'); a.svcNinera = startSvc('ninera'); a.svcEnfermeria = startSvc('enfermeria'); a.svcTecnico = startSvc('tecnico');
  const svcType = st.svcType || 'limpieza'; const sv0 = SVC[svcType];
  const hours = st.hours || 4, day = st.day || 'Mañana', time = st.time || '10:00', proIx = st.pro || 0;
  const PROS = svcType === 'tecnico'
    ? [['Carlos Ramírez', 'CR', '4,9', '210 trabajos'], ['Hugo Benítez', 'HB', '4,8', '96 trabajos'], ['Néstor Cabral', 'NC', '5,0', '41 trabajos']]
    : [['María González', 'MG', '4,9', '120 trabajos'], ['Rosa Benítez', 'RB', '4,8', '86 trabajos'], ['Laura Duarte', 'LD', '5,0', '34 trabajos']];
  const svcPrice = sv0.fixed ? sv0.fixed : sv0.perHour * hours;
  const svcSummary = (sv0.fixed ? 'Visita técnica' : hours + ' h') + ' · ' + day + ' ' + time;
  const svc: Any = {
    title: sv0.title, icon: sv0.icon, headline: sv0.headline, blurb: sv0.blurb, qtyTitle: sv0.fixed ? '¿Qué necesitás?' : '¿Cuántas horas?',
    hours: sv0.fixed ? [chip('Instalación y prueba', true, function () {})] : [2, 4, 6, 8].map(function (h?: Any) { return chip(h + ' h', h === hours, function () { S({ hours: h }); }); }),
    days: ['Hoy', 'Mañana', 'Sáb. 14'].map(function (d?: Any) { return chip(d, d === day, function () { S({ day: d }); }); }),
    times: ['08:00', '10:00', '14:00', '17:00'].map(function (x?: Any) { return chip(x, x === time, function () { S({ time: x }); }); }),
    priceTxt: fmt(svcPrice), summary: svcSummary, proName: PROS[proIx][0],
    pros: PROS.map(function (p?: Any, i?: Any) {
      const on = i === proIx;
      return assign({ t: t, name: p[0], ini: p[1], rating: p[2], jobs: p[3], rate: sv0.fixed ? fmt(sv0.fixed) : fmt(sv0.perHour + i * 2000) + '/h', pick: function () { S({ pro: i }); } }, radioV(on));
    }),
    statusLabel: svcStatus === 'confirmado' ? 'Confirmado' : 'Esperando confirmación',
    stBg: svcStatus === 'confirmado' ? t.brandSubtle : t.warnSubtle, stFg: svcStatus === 'confirmado' ? t.success : t.warning
  };
  a.svcSend = function () {
    const id = Date.now();
    replace('svcOk', { svcStatus: 'esperando', svcId: id }, ['svc', 'svcPros', 'svcConfirm']);
    later(function () { if (cs().svcId === id) { S({ svcStatus: 'confirmado' }); toast(PROS[proIx][0] + ' confirmó tu pedido'); } }, 6000);
  };

  // market
  const cat = st.cat || null;
  const visible = ALL.filter(function (p?: Any) { return !p.hidden; });
  function inCat(p?: Any) { return !cat || p.cat === cat; }
  const near = visible.filter(function (p?: Any) { return p.near && inCat(p); }).map(pview);
  const recentIds = pubs.slice().reverse().map(function (p?: Any) { return p.id; }).concat(['iphone', 'notebook', 'campera', 'heladera', 'mesa']);
  const recent = recentIds.map(byId).filter(inCat).map(pview);
  const q = st.q || '';
  let results = q ? visible.filter(function (p?: Any) { return p.kw.indexOf(q) >= 0 || p.title.toLowerCase().indexOf(q) >= 0 || catName[p.cat].toLowerCase() === q; }) : [];
  const sort = st.sort || 'cerca';
  results = results.slice().sort(function (x?: Any, y?: Any) { return sort === 'precio' ? x.price - y.price : x.km - y.km; });
  const m: Any = {
    cats: CATS.map(function (c?: Any) { const on = c[0] === cat; return { t: t, on: on, label: c[1], icon: c[2], pressed: on ? 'true' : 'false', bg: on ? t.inverse : t.fill, fg: on ? t.onInverse : t.text2,
      pick: function () { S({ cat: on ? null : c[0] }); } }; }),
    near: near, recent: recent, hasNear: near.length > 0, hasRecent: recent.length > 0, emptyCat: !near.length && !recent.length,
    catLabel: cat ? catName[cat] : '',
    q: q, hasQ: !!q, noQ: !q, qText: q || 'Buscá en Chambito Market', qColor: q ? t.text : t.text2,
    recents: ['bicicleta', 'heladera', 'iphone'].map(function (r?: Any) { return { t: t, label: r, pick: function () { S({ q: r }); } }; }),
    popular: ['silla', 'zapatillas', 'campera', 'mesa'].map(function (r?: Any) { return chip(r, false, function () { S({ q: r }); }); }),
    sorts: [['cerca', 'Más cerca'], ['precio', 'Menor precio']].map(function (x?: Any) { return chip(x[1], x[0] === sort, function () { S({ sort: x[0] }); }); }),
    results: results.map(pview), noResults: !!q && results.length === 0,
    count: results.length === 1 ? '1 resultado para «' + q + '»' : results.length + ' resultados para «' + q + '»'
  };
  a.clearQ = function () { S({ q: '' }); };

  const pr = byId(st.pid || 'bici');
  const pvb = pview(pr);
  const pv = assign(pvb, {
    cond: pr.cond, desc: pr.desc, cross: !!pr.cross, seller: pr.seller, ini: pr.ini, reviews: pr.reviews, since: pr.since,
    notMine: !pr.mine, attrs: pr.attrs.map(function (x?: Any) { return { t: t, k: x[0], v: x[1] }; }),
    showF1: !fase2 && !pr.sold && !pr.mine, showF2: fase2 && !pr.sold && !pr.mine, showSold: !!pr.sold && !pr.mine, showMine: !!pr.mine,
    consult: function () { go('chat', { cpid: pr.id }); },
    buy: function () { const c = (cs().cart || []).slice(); if (c.indexOf(pr.id) < 0) c.push(pr.id); go('carrito', { cart: c }); },
    similar: function () { go('mBuscar', { q: catName[pr.cat].toLowerCase() }); }
  });

  // chat
  const SEEDS: Any = {
    bici: [{ me: true, text: '¿Sigue disponible?' }, { me: false, text: 'Sí, está disponible. Podemos vernos en Lambaré o en un punto de encuentro.' }],
    silla: [{ me: true, text: '¿Me la guardás hasta el sábado?' }],
    iphone: [{ me: true, text: '¿Sigue disponible?' }, { me: false, text: 'Ya se vendió, gracias por consultar.' }],
    mesa: [{ me: false, text: 'Hola, ¿la mesa de luz sigue disponible?' }]
  };
  const cpid = st.cpid || 'bici'; const cp = byId(cpid);
  const party = cp.mine ? { name: 'Andrea Villalba', ini: 'AV' } : { name: cp.seller, ini: cp.ini };
  const msgsAll = st.msgs || {};
  const thread = msgsAll[cpid] || SEEDS[cpid] || [];
  function reply(p?: Any, text?: Any) {
    if (p.sold) return 'Ya se vendió, gracias por consultar.';
    if (p.mine) return '¡Genial! ¿Me pasás el punto de encuentro?';
    if (text.indexOf('disponible') >= 0) return 'Sí, sigue disponible. ¿Cuándo podrías verlo?';
    if (text.indexOf('precio') >= 0) return 'Te lo dejo en ' + fmt(Math.round(p.price * 0.95 / 10000) * 10000) + ' si lo retirás esta semana.';
    if (text.indexOf('retira') >= 0) return 'En ' + p.place + '. También podemos vernos en un lugar público.';
    return '¡Dale! Coordinamos por acá.';
  }
  function send(text?: Any) {
    return function () {
      const mm = copy(cs().msgs || {}); const arr = (mm[cpid] || SEEDS[cpid] || []).slice(); arr.push({ me: true, text: text }); mm[cpid] = arr;
      S({ msgs: mm, typing: cpid });
      later(function () {
        const m2 = copy(cs().msgs || {}); const a2 = (m2[cpid] || []).slice(); a2.push({ me: false, text: reply(cp, text) }); m2[cpid] = a2;
        S({ msgs: m2, typing: null });
      }, 1600);
    };
  }
  const chat: Any = {
    name: party.name, ini: party.ini, ptitle: cp.title, pprice: fmt(cp.price), ph: TONES[cp.tone || 0], openProduct: openProduct(cp.id),
    empty: thread.length === 0, typing: st.typing === cpid, typingTxt: party.name.split(' ')[0] + ' está escribiendo…',
    msgs: thread.map(function (x?: Any) { return { t: t, text: x.text, align: x.me ? 'flex-end' : 'flex-start', bg: x.me ? (dark ? t.brand : '#000000') : t.fill, fg: x.me ? '#FFFFFF' : t.text, me: !!x.me }; }),
    quick: (cp.mine ? ['Sí, sigue disponible', '¿Te queda bien el sábado?', 'Te paso el punto de encuentro'] : ['¿Sigue disponible?', '¿Último precio?', '¿Dónde se retira?'])
      .map(function (x?: Any) { return chip(x, false, send(x)); }),
    sendDefault: send(cp.mine ? 'Podemos vernos el sábado a la tarde.' : 'Hola, ¿podemos vernos el sábado?')
  };
  a.sellerChat = function () { go('chat', { cpid: 'mesa' }); };

  const savedItems = ALL.filter(function (p?: Any) { return saved[p.id]; }).map(pview);
  const mineItems = ALL.filter(function (p?: Any) { return p.mine; }).map(pview).reverse();

  // publish
  const photos = st.photos || 0;
  const pcat = st.pcat || 'hogar', pcond = st.pcond || 'Usado';
  const pub: Any = {
    canAdd: photos < 6, count: photos + ' de 6 fotos', nextOp: photos ? 1 : 0.45,
    tiles: Array.apply(null, Array(photos)).map(function (_?: Any, i?: Any) { return { t: t, bg: TONES[i % 3], cover: i === 0, label: 'Quitar foto ' + (i + 1), remove: function () { S({ photos: Math.max(0, (cs().photos || 0) - 1) }); } }; }),
    cats: CATS.map(function (c?: Any) { return chip(c[1], c[0] === pcat, function () { S({ pcat: c[0] }); }); }),
    conds: ['Nuevo', 'Usado', 'Para repuesto'].map(function (c?: Any) { return chip(c, c === pcond, function () { S({ pcond: c }); }); }),
    catLabel: catName[pcat], cond: pcond, photosTxt: photos + (photos === 1 ? ' foto' : ' fotos')
  };
  a.addPhoto = function () { S({ photos: Math.min(6, (cs().photos || 0) + 1) }); };
  a.pub1Next = function () { if (!(cs().photos > 0)) { toast('Agregá al menos una foto'); return; } go('pub2'); };
  a.publish = function () {
    const list = (cs().pubs || []).slice(); const id = 'n' + (list.length + 1);
    list.push({ id: id, title: 'Mesa ratona de madera', price: 300000, place: 'Lambaré', km: 0, rating: '4,9', reviews: 6, seller: 'Lucía Giménez', ini: 'LG', since: 'ago. 2026',
      cat: pcat, cond: pcond, tone: 0, mine: true, status: 'ok', isNew: true, kw: 'mesa ratona madera', desc: 'Madera maciza, 90 × 50 cm. Algunas marcas de uso.', attrs: [['Medidas', '90 × 50 cm'], ['Material', 'Madera'], ['Estado', pcond]] });
    replace('pubOk', { pubs: list, lastPub: id, photos: 0 }, ['vender', 'pub1', 'pub2', 'pub3']);
  };
  a.viewLastPub = function () { replace('ficha', { pid: cs().lastPub || 'mesa' }, ['pubOk']); };

  // cart & order (fase 2)
  const cartItems = cart.map(byId);
  const subtotal = cartItems.reduce(function (s0?: Any, p?: Any) { return s0 + p.price; }, 0);
  const entrega = st.entrega || 'retiro';
  const ship = entrega === 'envio' ? 25000 : 0;
  const firstPlace = cartItems.length ? cartItems[0].place : 'Lambaré';
  const ENTREGAS: Any = [['retiro', 'Retiro en ' + firstPlace, 'Coordinás día y hora por el chat', 'Gratis'], ['encuentro', 'Punto de encuentro', 'Un lugar público y concurrido', 'Gratis'], ['envio', 'Envío del vendedor', 'Llega en 24 a 48 h', fmt(25000)]];
  const cartV: Any = {
    items: cartItems.map(function (p?: Any) { return assign(pview(p), { remove: function () { S({ cart: (cs().cart || []).filter(function (x?: Any) { return x !== p.id; }) }); toast('Lo quitaste del carrito'); } }); }),
    has: cart.length > 0, empty: cart.length === 0, count: cart.length, subtotalTxt: fmt(subtotal), shipTxt: ship ? fmt(ship) : 'Gratis', totalTxt: fmt(subtotal + ship),
    payLabel: 'Pagar ' + fmt(subtotal + ship),
    entregas: ENTREGAS.map(function (e?: Any) { return assign({ t: t, label: e[1], sub: e[2], cost: e[3], pick: function () { S({ entrega: e[0] }); } }, radioV(e[0] === entrega)); })
  };
  a.pay = function () {
    const id = Date.now();
    const o: Any = { items: cart.slice(), total: subtotal + ship, entrega: ENTREGAS.filter(function (e?: Any) { return e[0] === entrega; })[0][1] };
    replace('compraOk', { order: o, orderPhase: 'pagado', orderId: id, cart: [], claim: false }, ['carrito', 'confirmar', 'ficha']);
    later(function () { if (cs().orderId === id && cs().orderPhase === 'pagado') S({ orderPhase: 'preparando' }); }, 4000);
    later(function () { if (cs().orderId === id && cs().orderPhase === 'preparando') { S({ orderPhase: 'enCamino' }); toast('Tu compra está en camino'); } }, 10000);
  };
  a.toOrden = function () { replace('orden', {}, ['compraOk']); };
  const oItem = order ? byId(order.items[0]) : PRODUCTS[0];
  const PH: Any = ['pagado', 'preparando', 'enCamino', 'entregado'];
  const phIx = Math.max(0, PH.indexOf(orderPhase || 'pagado'));
  const sellerFirst = oItem.seller.split(' ')[0];
  const OSTEPS: Any = [['Pagado', 'Tu pago está protegido'], ['Preparando', sellerFirst + ' está preparando tu pedido'], ['En camino', 'Coordiná la entrega por el chat'], ['Entregado', 'Liberamos el pago a ' + sellerFirst]];
  const orderV: Any = {
    seller: oItem.seller, title: order ? (order.items.length > 1 ? oItem.title + ' y ' + (order.items.length - 1) + ' más' : oItem.title) : '',
    totalTxt: order ? fmt(order.total) : '', entrega: order ? order.entrega : '', claim: !!st.claim, code: '7392',
    canReceive: orderPhase === 'enCamino' && !st.claim,
    steps: OSTEPS.map(function (x?: Any, i?: Any) {
      const done = i <= phIx; const curr = i === phIx;
      return { t: t, label: x[0], sub: x[1], current: curr ? 'step' : 'false', dotBg: done ? t.brand : t.fill, dotFg: done ? t.onBrand : 'transparent',
        lineBg: i === OSTEPS.length - 1 ? 'transparent' : (i < phIx ? t.brand : t.bDefault), weight: curr ? 500 : 400, color: done ? t.text : t.text2 };
    })
  };
  a.received = function () { S({ orderPhase: 'entregado' }); toast('¡Listo! Liberamos el pago a ' + sellerFirst); };
  a.orderChat = function () { go('chat', { cpid: oItem.id }); };
  const REASONS: Any = ['No llegó', 'Llegó dañado', 'No es lo que se describió', 'Otro motivo'];
  const reason = st.reason == null ? 0 : st.reason;
  const claimV: Any = { reasons: REASONS.map(function (r?: Any, i?: Any) { return assign({ t: t, label: r, pick: function () { S({ reason: i }); } }, radioV(i === reason)); }) };
  a.sendClaim = function () { back(); S({ claim: true }); toast('Recibimos tu reclamo'); };

  // auto
  const mode = st.mode || 'viaje';
  const PLACES: Any = {
    galeria: { name: 'Paseo La Galería', sub: 'Av. Santa Teresa y Aviadores del Chaco', km: 6.2, min: 18, kmReal: '6,4', minReal: 19 },
    santa: { name: 'Av. Santa Teresa 1827', sub: 'Asunción', km: 4.1, min: 12, kmReal: '4,3', minReal: 13 },
    aero: { name: 'Aeropuerto Silvio Pettirossi', sub: 'Luque', km: 14.8, min: 31, kmReal: '15,1', minReal: 33 },
    trabajo: { name: 'Edificio Aymac', sub: 'Villa Morra, Asunción', km: 3.5, min: 11, kmReal: '3,6', minReal: 12 },
    mapa: { name: 'Punto en el mapa', sub: 'Recoleta, Asunción', km: 5.0, min: 15, kmReal: '5,2', minReal: 16 }
  };
  const dest = PLACES[st.dest || 'galeria'];
  function pickPlace(id?: Any) { return function () { go('aPunto', { dest: id }); }; }
  a.placeCasa = pickPlace('santa'); a.placeTrabajo = pickPlace('trabajo'); a.placeMapa = pickPlace('mapa');
  const LEVELS: Any = {
    viaje: [['eco', 'Económico', 1, 'Llega en 3 min'], ['confort', 'Confort', 41500 / 32000, 'Llega en 5 min']],
    moto: [['moto', 'Moto', 0.56, 'Llega en 2 min'], ['motoPlus', 'Moto con casco extra', 0.62, 'Llega en 4 min']],
    envio: [['envMoto', 'Envío en moto', 0.7, 'Retira en 4 min'], ['envAuto', 'Envío en auto', 1, 'Retira en 6 min']]
  };
  function priceOf(f?: Any) { return Math.round(32000 * (dest.km / 6.2) * f / 500) * 500; }
  const levels = LEVELS[mode]; let lvId = st.level || levels[0][0];
  if (!levels.some(function (l?: Any) { return l[0] === lvId; })) lvId = levels[0][0];
  const lv = levels.filter(function (l?: Any) { return l[0] === lvId; })[0];
  const tripPrice = priceOf(lv[2]);
  const apay = st.apay || 'efectivo';
  const auto: Any = {
    modes: [['viaje', 'Viaje'], ['moto', 'Moto'], ['envio', 'Envío']].map(function (x?: Any) { const on = x[0] === mode;
      return { t: t, label: x[1], selected: on ? 'true' : 'false', bg: on ? t.inverse : 'transparent', fg: on ? t.onInverse : t.text2, shadow: 'none', pick: function () { S({ mode: x[0], level: null }); } }; }),
    placeholder: mode === 'envio' ? '¿A dónde lo enviamos?' : '¿A dónde vas?', destTitle: mode === 'envio' ? '¿A dónde lo enviamos?' : '¿A dónde vas?',
    recents: ['galeria', 'santa', 'aero'].map(function (id?: Any) { const p = PLACES[id]; return { t: t, name: p.name, sub: p.sub, km: String(p.km).replace('.', ','), pick: pickPlace(id) }; }),
    destName: dest.name, km: String(dest.km).replace('.', ','), min: dest.min, kmReal: dest.kmReal, minReal: dest.minReal,
    levels: levels.map(function (l?: Any) { return assign({ t: t, label: l[1], priceTxt: fmt(priceOf(l[2])), eta: l[3], pick: function () { S({ level: l[0] }); } }, radioV(l[0] === lvId)); }),
    payLabel: apay === 'efectivo' ? 'Efectivo' : 'Visa •••• 4521', payLow: apay === 'efectivo' ? 'efectivo' : 'tarjeta',
    totalTxt: fmt(tripPrice), cta: mode === 'envio' ? 'Pedir envío' : 'Pedir viaje'
  };
  a.togglePay = function () { S({ apay: apay === 'efectivo' ? 'tarjeta' : 'efectivo' }); };
  function step(id?: Any, from?: Any, to?: Any, ms?: Any) {
    later(function () {
      const x = cs(); if (x.tripId !== id || x.trip !== from) return;
      if (x.sheet === 'sos') { step(id, from, to, 2000); return; }
      const o: Any = { trip: to };
      if (to === 'enCamino') step(id, 'enCamino', 'llego', 7000);
      if (to === 'llego') step(id, 'llego', 'enCurso', 6000);
      if (to === 'enCurso') step(id, 'enCurso', 'fin', 9000);
      if (to === 'fin' && x.screen === 'viaje') o.screen = 'aCalificar';
      S(o);
      if (to === 'fin' && x.screen !== 'viaje') toast('Llegaste a destino. Calificá tu viaje');
    }, ms);
  }
  a.startTrip = function () {
    const id = Date.now();
    replace('viaje', { trip: 'buscando', tripId: id, tripRated: false, stars: 0, rchips: {}, tip: 5000 }, ['aDestino', 'aPunto', 'aConfirmar']);
    step(id, 'buscando', 'enCamino', 3500);
  };
  a.cancelTrip = function () { S({ trip: null, tripId: null }); back(); toast('Cancelaste el pedido. No se te cobró nada'); };
  a.openSos = function () { S({ sheet: 'sos' }); };
  a.sos911 = function () { S({ sheet: null }); toast('Llamando al 911… Avisamos a Soporte'); };
  a.sosSupport = function () { S({ sheet: null }); toast('Avisamos a Soporte. Te escriben por el chat'); };
  const trip_: Any = { active: tripActive, buscando: trip === 'buscando', enCamino: trip === 'enCamino', llego: trip === 'llego', enCurso: trip === 'enCurso',
    vehicle: mode === 'moto' ? 'Honda CG 150 negra' : 'Toyota Vitz blanco' };

  const stars = st.stars || 0; const rchips = st.rchips || {}; const tip = st.tip == null ? 5000 : st.tip;
  const rate: Any = {
    stars: [1, 2, 3, 4, 5].map(function (n?: Any) { return { label: n + (n === 1 ? ' estrella' : ' estrellas'), checked: n === stars ? 'true' : 'false', color: n <= stars ? t.iconBrand : t.bDefault, pick: function () { S({ stars: n }); } }; }),
    chips: ['Manejo seguro', 'Puntual', 'Auto limpio', 'Buena atención'].map(function (x?: Any) { return chip(x, !!rchips[x], function () { const r = copy(cs().rchips || {}); r[x] = !r[x]; S({ rchips: r }); }); }),
    tips: [[3000, 'Gs. 3.000'], [5000, 'Gs. 5.000'], [10000, 'Gs. 10.000'], [0, 'Sin propina']].map(function (x?: Any) { return chip(x[1], x[0] === tip, function () { S({ tip: x[0] }); }); }),
    tipTxt: tip ? fmt(tip) : 'Gs. 0', totalTxt: fmt(tripPrice + tip)
  };
  a.sendRating = function () { if (!(cs().stars > 0)) { toast('Elegí de 1 a 5 estrellas'); return; } root(homeOf(), { tripRated: true }); toast('¡Gracias! Tu calificación cuida a la comunidad'); };

  // socio / conductor
  const dOnline = !!st.dOnline; const dTrips = st.dTrips == null ? 9 : st.dTrips; const dEarn = st.dEarn == null ? 186000 : st.dEarn;
  function scheduleOffer(ms?: Any) {
    const id = Date.now() + Math.random();
    S({ offerId: id });
    later(function () {
      const x = cs(); if (x.offerId !== id || !x.dOnline || x.offer) return;
      if (['dBuscar', 'dPin', 'dViaje', 'dCobro'].indexOf(x.screen) >= 0) return;
      S({ offer: true, offerSecs: 12 }); tick(id);
    }, ms);
  }
  function tick(id?: Any) {
    later(function () {
      const x = cs(); if (x.offerId !== id || !x.offer) return;
      const n = (x.offerSecs || 0) - 1;
      if (n <= 0) { S({ offer: false }); toast('Se venció el pedido. Seguís disponible'); scheduleOffer(6000); return; }
      S({ offerSecs: n }); tick(id);
    }, 1000);
  }
  a.dConnect = function () { S({ dOnline: true }); toast('Te conectaste. Ya podés recibir viajes'); scheduleOffer(4000); };
  a.dDisconnect = function () { S({ dOnline: false, offer: false, offerId: null }); };
  a.offerAccept = function () { S({ offer: false, offerId: null, screen: 'dBuscar', hist: curHist().concat([curScreen()]), sheet: null }); };
  a.offerReject = function () { S({ offer: false }); toast('Listo, seguís disponible'); scheduleOffer(8000); };
  a.dArrived = function () { go('dPin', { pin: '', pinErr: false }); };
  function press(dg?: Any) {
    return function () {
      const p = (cs().pin || '') + dg;
      if (p.length < 4) { S({ pin: p, pinErr: false }); return; }
      if (p === '4827') { replace('dViaje', { pin: '', pinErr: false }); toast('PIN correcto. ¡Buen viaje!'); }
      else { S({ pin: '', pinErr: true }); }
    };
  }
  a.dFinish = function () { replace('dCobro'); };
  a.dCollected = function () { S({ screen: 'dHome', hist: [homeOf('socio')], dTrips: dTrips + 1, dEarn: dEarn + 28160, sheet: null }); toast('Sumaste Gs. 28.160 a tus ganancias'); scheduleOffer(7000); };
  const pin = st.pin || '';
  const d: Any = {
    online: dOnline, offline: !dOnline, trips: dTrips, earnTxt: fmt(dEarn), statusShort: dOnline ? 'Conectado' : 'Desconectado', pinErr: !!st.pinErr,
    pinBoxes: [0, 1, 2, 3].map(function (i?: Any) { return { v: pin[i] ? '•' : '', ring: i === pin.length ? t.focus : t.bDefault }; }),
    keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(function (x?: Any) {
      if (x === '⌫') return { t: t, label: '⌫', aria: 'Borrar', bg: 'transparent', vis: 'visible', press: function () { S({ pin: (cs().pin || '').slice(0, -1) }); } };
      if (x === '') return { t: t, label: '', aria: 'Sin acción', bg: 'transparent', vis: 'hidden', press: function () {} };
      return { t: t, label: x, aria: x, bg: t.fill, vis: 'visible', press: press(x) };
    })
  };
  const offerSecs = st.offerSecs || 12;
  const offer: Any = { show: role === 'socio' && !!st.offer, secs: '0:' + (offerSecs < 10 ? '0' : '') + offerSecs, pct: Math.round(offerSecs / 12 * 100) };
  const jobSt = st.job || 'pending';
  const job: Any = { pending: jobSt === 'pending', accepted: jobSt === 'accepted' };
  a.jobAccept = function () { S({ job: 'accepted' }); toast('Aceptaste el pedido de limpieza'); };
  a.jobReject = function () { S({ job: 'rejected' }); toast('Rechazaste el pedido. No afecta tu calificación'); };
  const socio: Any = { marketTitle: fase2 ? '1 pedido nuevo' : '1 consulta nueva' };

  // activity (cliente) and work (socio)
  const V: Any = { servicios: ['Servicios', 'servicios', t.brand, t.onBrand], auto: ['Auto', 'car', t.inverse, t.brandOnInverse], market: ['Market', 'bag', t.brandSubtle, t.text] };
  const BT: Any = { live: [t.brandSubtle, t.text], ok: [t.brandSubtle, t.success], warn: [t.warnSubtle, t.warning], neutral: [t.fill, t.text2], danger: [t.dangerSubtle, t.danger] };
  function item(v?: Any, title?: Any, sub?: Any, badge?: Any, tone?: Any, when?: Any, open?: Any, group?: Any) {
    return { t: t, v: v, vertical: V[v][0], icon: V[v][1], ibg: V[v][2], ifg: V[v][3], title: title, sub: sub, badge: badge, bbg: BT[tone][0], bfg: BT[tone][1], when: when, open: open, g: group };
  }
  const acts: Any = [];
  if (tripActive) acts.push(item('auto', 'Viaje a ' + dest.name, TRIPTXT[trip][0], 'En curso', 'live', 'Ahora', nav('viaje'), 'En curso'));
  if (svcStatus) acts.push(item('servicios', svc.title, svcSummary + ' · ' + PROS[proIx][0], svc.statusLabel, svcStatus === 'confirmado' ? 'ok' : 'warn', 'Hoy', nav('svcOk'), 'En curso'));
  if (order && orderPhase !== 'entregado') acts.push(item('market', oItem.title, 'Compra protegida · ' + fmt(order.total), st.claim ? 'Reclamo abierto' : OSTEPS[phIx][0], st.claim ? 'warn' : 'live', 'Hoy', nav('orden'), 'En curso'));
  const consult: Any = [['bici', 'Carla Benítez'], ['silla', 'Diego Ortiz'], ['iphone', 'Ana Rolón']];
  Object.keys(msgsAll).forEach(function (pid?: Any) { if (!consult.some(function (c?: Any) { return c[0] === pid; }) && !byId(pid).mine) consult.push([pid, byId(pid).seller]); });
  consult.forEach(function (c?: Any) {
    const th = msgsAll[c[0]] || SEEDS[c[0]] || []; const last = th.length ? (th[th.length - 1].me ? 'Vos: ' : '') + th[th.length - 1].text : '';
    acts.push(item('market', c[1] + ' · ' + byId(c[0]).title, last, byId(c[0]).sold ? 'Vendida' : 'Consulta', byId(c[0]).sold ? 'neutral' : 'live', c[0] === 'bici' ? '15:05' : (c[0] === 'silla' ? 'Ayer' : (c[0] === 'iphone' ? 'Lun' : 'Ahora')), function () { go('chat', { cpid: c[0] }); }, 'Mis consultas'));
  });
  if (trip === 'fin') acts.push(item('auto', 'Viaje a ' + dest.name, auto.payLabel + ' · ' + fmt(tripPrice), st.tripRated ? 'Completado' : 'Calificá', st.tripRated ? 'ok' : 'warn', 'Hoy', st.tripRated ? function () { toast('Te enviamos el recibo por correo'); } : nav('aCalificar'), 'Anteriores'));
  if (order && orderPhase === 'entregado') acts.push(item('market', oItem.title, 'Entregado · ' + fmt(order.total), 'Entregado', 'ok', 'Hoy', nav('orden'), 'Anteriores'));
  acts.push(item('auto', 'Viaje a Aeropuerto Silvio Pettirossi', 'Tarjeta · Gs. 76.500', 'Completado', 'ok', '2 nov.', function () { toast('Te enviamos el recibo por correo'); }, 'Anteriores'));
  acts.push(item('servicios', 'Limpieza del hogar · 4 h', 'María González · Gs. 100.000', 'Completado', 'ok', '28 oct.', startSvc('limpieza'), 'Anteriores'));
  const actFilter = st.actFilter || 'todo';
  const actShown = acts.filter(function (x?: Any) { return actFilter === 'todo' || x.v === actFilter; });
  const FILTERS: Any = [['todo', 'Todo'], ['servicios', 'Servicios'], ['auto', 'Auto'], ['market', 'Market']];
  const act: Any = {
    chips: FILTERS.map(function (f?: Any) { return chip(f[1], f[0] === actFilter, function () { S({ actFilter: f[0] }); }); }),
    groups: ['En curso', 'Mis consultas', 'Anteriores'].map(function (g?: Any) { return { title: g, items: actShown.filter(function (x?: Any) { return x.g === g; }) }; }).filter(function (g?: Any) { return g.items.length; }),
    empty: actShown.length === 0
  };
  const works: Any = [];
  if (jobSt !== 'rejected') works.push(item('servicios', 'Limpieza del hogar · 4 h', 'Mañana 10:00 · Villa Morra', jobSt === 'accepted' ? 'Aceptado' : 'Nuevo pedido', jobSt === 'accepted' ? 'ok' : 'warn', 'Hace 5 min', function () { root('sInicio'); }));
  works.push(item('auto', 'Viajes en Asunción', dOnline ? 'Disponible · ×1,4 en Villa Morra' : 'Conectate para recibir viajes', dOnline ? 'Conectado' : 'Desconectado', dOnline ? 'live' : 'neutral', dTrips + ' hoy', function () { go('dHome'); }));
  works.push(item('market', fase2 ? 'Pedido · Mesa de luz de madera' : 'Andrea · Mesa de luz de madera', fase2 ? 'Gs. 250.000 · Coordiná la entrega' : 'Hola, ¿la mesa de luz sigue disponible?', fase2 ? 'Nuevo pedido' : 'Consulta', 'live', '15:20', function () { go('chat', { cpid: 'mesa' }); }));
  works.push(item('market', 'Cochecito de bebé plegable', 'La foto de portada muestra otro producto', 'Corregir', 'warn', 'Lun', function () { go('misPubs'); }));
  const workFilter = st.workFilter || 'todo';
  const work: Any = {
    chips: FILTERS.map(function (f?: Any) { return chip(f[1], f[0] === workFilter, function () { S({ workFilter: f[0] }); }); }),
    items: works.filter(function (x?: Any) { return workFilter === 'todo' || x.v === workFilter; })
  };

  // notifications (EA4)
  const notifs: Any = [
    { icon: 'success', ibg: t.brandSubtle, ifg: t.success, title: 'Tu publicación ya está activa', body: '«Mesa de luz de madera» ya se ve en la Tienda.', when: 'Ahora', open: function () { go('misPubs'); } },
    { icon: 'chat', ibg: t.fill, ifg: t.text, title: 'Nuevo mensaje sobre «Bicicleta Trek rodado 29»', body: 'Carla: Sí, está disponible. Podemos vernos…', when: '15:05', open: function () { go('chat', { cpid: 'bici' }); } },
    { icon: 'tag', ibg: t.fill, ifg: t.text, title: 'Bajó el precio de algo que guardaste', body: '«Campera de jean talle M» ahora cuesta Gs. 180.000.', when: 'Ayer', open: openProduct('campera') },
    { icon: 'warning', ibg: t.warnSubtle, ifg: t.warning, title: 'No pudimos publicar «Cochecito de bebé plegable»', body: 'Motivo: la foto de portada muestra otro producto. Tocá para corregirla.', when: 'Lun', open: function () { go('misPubs'); } }
  ].map(function (n?: Any) { n.t = t; return n; });

  const perfil: Any = {
    roleLabel: role === 'socio' ? 'Modo socio' : 'Modo cliente',
    pubsSub: mineItems.length + ' publicaciones', savedSub: savedItems.length + ' guardados',
    socio: { checked: role === 'socio' ? 'true' : 'false', sub: role === 'socio' ? 'Ves Trabajo y tus pedidos como prestadora' : 'Ofrecé servicios, vendé o conducí', track: role === 'socio' ? t.focus : t.bDefault, knob: role === 'socio' ? 'flex-end' : 'flex-start',
      toggle: function () { const r = role === 'socio' ? 'cliente' : 'socio'; const o: Any = { role: r, screen: 'perfil', hist: [], offer: false }; if (r === 'cliente') { o.dOnline = false; o.offerId = null; } S(o); toast(r === 'socio' ? 'Pasaste a modo socio' : 'Pasaste a modo cliente'); } },
    dark: { checked: dark ? 'true' : 'false', sub: dark ? 'Activado' : 'Desactivado', track: dark ? t.focus : t.bDefault, knob: dark ? 'flex-end' : 'flex-start', toggle: function () { S({ dark: !dark }); } }
  };

  const gonav: Any = {};
  ['notifs', 'explorar', 'auto', 'tienda', 'svcPros', 'svcConfirm', 'carrito', 'guardados', 'mBuscar', 'misPubs', 'vender', 'pub1', 'pub2', 'pub3', 'confirmar', 'devolucion', 'aDestino', 'aConfirmar', 'viaje']
    .forEach(function (id?: Any) { gonav[id] = nav(id); });
  gonav.notifs = function () { go('notifs', { notifsRead: true }); };

  const home: Any = { thumbs: ['bici', 'nike', 'silla'].map(function (id?: Any) { const p = byId(id); return { t: t, ph: TONES[p.tone], priceTxt: fmt(p.price) }; }) };
  const explore: Any = { chips: [['Limpieza por horas', startSvc('limpieza')], ['Viaje al aeropuerto', pickPlace('aero')], ['Bicicletas', function () { go('mBuscar', { q: 'bicicleta' }); }], ['Heladeras', openProduct('heladera')], ['Niñera', startSvc('ninera')]]
    .map(function (x?: Any) { return chip(x[0], false, x[1]); }) };

  const s: Any = {}; SCREENS.forEach(function (x?: Any) { s[x] = x === screen; });
  const TALL: Any = ['svcOk', 'pubOk', 'compraOk', 'vender', 'confirmar', 'svc', 'svcConfirm', 'carrito', 'ficha', 'dCobro'];
  const MAPS: Any = ['aPunto', 'aConfirmar', 'viaje', 'dHome', 'dBuscar', 'dViaje'];
  const onMap = MAPS.indexOf(screen) >= 0;
  const toastV: Any = { show: !!st.toast, msg: st.toast || '', top: onMap ? '108px' : 'auto', bottom: onMap ? 'auto' : (showTabs ? tabPad + 8 : (TALL.indexOf(screen) >= 0 ? 190 : 120)) + 'px' };
  return {
    screen: screen, role: role, dark: dark, sel: sel, mosaicos: P_.categorias === 'Mosaicos', selector: selector, explorer: explorer, t: t, s: s, a: a, go: gonav, tabs: tabs, tabCols: tabs.length, showTabs: showTabs, tabPad: tabPad, live: live, canBack: hist.length > 0 || !isRoot,
    toast: toastV, notifDot: notifDot, fase2: fase2, fabBottom: showTabs ? tabPad - 8 : 34, sheetSos: st.sheet === 'sos', offer: offer,
    home: home, explore: explore, act: act, perfil: perfil, notifs: notifs, svc: svc, m: m, pv: pv, chat: chat,
    saved: { items: savedItems, empty: savedItems.length === 0 }, mine: { items: mineItems }, pub: pub, cart: cartV, order: orderV, claim: claimV,
    trip: trip_, auto: auto, rate: rate, d: d, job: job, socio: socio, work: work
  };
}
