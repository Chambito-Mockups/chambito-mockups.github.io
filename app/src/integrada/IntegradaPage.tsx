/**
 * «App integrada» en el visor: una sola app con Servicios (base), Auto y Market, navegable de punta a punta.
 * A la izquierda los ajustes de la demo, al centro el teléfono con anterior / siguiente, y a la derecha el menú
 * de pantallas (con búsqueda). Cada pantalla tiene su enlace: #integrada/<clave>.
 * Las pantallas son componentes de src/integrada/screens; las piezas compartidas están en src/integrada/kit.tsx.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { usePersistent } from '../persist';
import { isTyping } from '../shell/controls';
import { Icon } from '../ui/kit';
import { IgPlace, IgScreen, IgSheet, IntegradaHandle, IntegradaPhone } from './IntegradaPhone';
import { IntegradaProps } from './model';

export const SELECTOR = 'Selector de sección';
const NAVS = [SELECTOR, 'Explorar (prototipo)', 'Combinación 1 · Auto y Tienda', 'Combinación 2 · Auto', 'Tienda en la barra'];
const FASES = ['Fase 1 · consulta por chat', 'Fase 2 · compra protegida'];
const INICIOS = ['Inicio (cliente)', 'Tienda', 'Auto', 'Socio · Inicio', 'Conductor'];

export interface IgEntry {
  /** clave única: va en el enlace #integrada/<clave> */
  key: string;
  /** código del diseño, cuando lo tiene (X1, X2, MK…) */
  code?: string;
  title: string;
  screen: IgScreen;
  /** hoja abierta encima de la pantalla */
  sheet?: IgSheet;
  /** navegación que aplica al abrirla (las del selector de sección) */
  nav?: string;
  /** forma de las categorías de la Tienda que aplica al abrirla */
  cats?: IntegradaProps['categorias'];
}
export interface IgGroup { title: string; note?: string; entries: IgEntry[] }

const e = (screen: IgScreen, title: string): IgEntry => ({ key: screen, screen, title });
const S = SELECTOR;

/** El menú: el recorrido con el selector de sección primero y después todas las pantallas por módulo. */
export const IG_GROUPS: IgGroup[] = [
  {
    title: 'Selector de sección',
    note: 'Del Prototipo Auto: cada portada tiene «Servicios ▾ / Auto ▾ / Market ▾» arriba y la barra es siempre Inicio · Actividad · Perfil. Inicio vuelve a la última sección usada.',
    entries: [
      { key: 'X1', code: 'X1', title: 'Portada de Servicios', screen: 'inicio', nav: S },
      { key: 'X2s', code: 'X2', title: 'Explorador desde Servicios', screen: 'inicio', sheet: 'explorer', nav: S },
      { key: 'XA0', code: 'A0', title: 'Portada de Auto con selector', screen: 'auto', nav: S },
      { key: 'X2a', code: 'X2', title: 'Explorador desde Auto', screen: 'auto', sheet: 'explorer', nav: S },
      { key: 'MK', code: 'MK', title: 'Portada de Market con selector', screen: 'tienda', nav: S },
      { key: 'X2m', code: 'X2', title: 'Explorador desde Market', screen: 'tienda', sheet: 'explorer', nav: S },
      { key: 'XA11', code: 'A11', title: 'Actividad con todas las secciones', screen: 'actividad', nav: S },
      { key: 'XP', code: 'P', title: 'Perfil', screen: 'perfil', nav: S },
    ],
  },
  {
    title: 'Servicios · base',
    entries: [
      e('inicio', 'Inicio'), e('explorar', 'Explorar'), e('actividad', 'Actividad'), e('perfil', 'Perfil'), e('notifs', 'Notificaciones'),
      e('svc', 'Pedir un servicio'), e('svcPros', 'Elegir profesional'), e('svcConfirm', 'Confirmar el pedido'), e('svcOk', 'Pedido enviado'),
    ],
  },
  {
    title: 'Market · comprar',
    entries: [
      e('tienda', 'Tienda'), { key: 'tienda-mosaicos', title: 'Tienda con categorías en mosaicos', screen: 'tienda', cats: 'Mosaicos' }, e('mBuscar', 'Buscar'), e('ficha', 'Ficha del producto'), e('chat', 'Consulta'), e('guardados', 'Guardados'),
      e('carrito', 'Carrito (fase 2)'), e('confirmar', 'Confirmar la compra'), e('compraOk', 'Compra hecha'), e('orden', 'Seguimiento de la compra'), e('devolucion', 'Reclamo'),
    ],
  },
  {
    title: 'Market · vender',
    entries: [e('misPubs', 'Mis publicaciones'), e('vender', 'Vender'), e('pub1', 'Publicar · fotos'), e('pub2', 'Publicar · datos'), e('pub3', 'Publicar · revisar'), e('pubOk', 'Publicado')],
  },
  {
    title: 'Auto · cliente',
    entries: [
      e('auto', 'Portada de Auto'), e('aDestino', '¿A dónde vas?'), e('aPunto', 'Punto de encuentro'), e('aConfirmar', 'Confirmá tu viaje'), e('viaje', 'Viaje'),
      { key: 'viaje-sos', title: 'SOS durante el viaje', screen: 'viaje', sheet: 'sos' }, e('aCalificar', 'Calificar'),
    ],
  },
  {
    title: 'Socio y conductor',
    entries: [e('sInicio', 'Inicio del socio'), e('trabajo', 'Trabajo'), e('dHome', 'Conductor'), e('dBuscar', 'Ir a buscar'), e('dPin', 'PIN del pasajero'), e('dViaje', 'Viaje en curso'), e('dCobro', 'Cobro')],
  },
];
export const IG_ENTRIES = IG_GROUPS.flatMap((g) => g.entries);

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const keyFromHash = () => {
  const h = decodeURIComponent(window.location.hash.slice(1));
  return h.startsWith('integrada/') ? h.slice('integrada/'.length) : null;
};

/** Escala el teléfono (390 × 844 más el marco) para que entre en el alto de la ventana. */
function useFit() {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      setScale(Math.max(0.5, Math.min(1.1, (el.clientWidth - 30) / 412, (window.innerHeight - Math.min(top, 240) - 40) / 866)));
    };
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fit);
    ro?.observe(el);
    fit();
    window.addEventListener('resize', fit);
    return () => { ro?.disconnect(); window.removeEventListener('resize', fit); };
  }, []);
  return { box, scale };
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="field">
      <span className="side-label">{label}</span>
      <select className="side-select" value={value} onChange={(ev) => onChange(ev.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

export function IntegradaPage() {
  const [cfg, setCfg] = usePersistent<Required<IntegradaProps>>('integrada', () => ({
    navegacion: SELECTOR, faseMarket: FASES[0], pantallaInicial: INICIOS[0], dark: false, categorias: 'Círculos',
  }));
  const set = (o: Partial<IntegradaProps>) => setCfg((c) => ({ ...c, ...o }));
  const phone = useRef<IntegradaHandle>(null);
  const [key, setKey] = useState<string>(() => keyFromHash() ?? (cfg.navegacion === SELECTOR ? 'X1' : 'inicio'));
  const [query, setQuery] = useState('');
  const { box, scale } = useFit();
  const navRef = useRef(cfg.navegacion);
  navRef.current = cfg.navegacion;

  const open = useCallback((en: IgEntry) => {
    if (en.nav) setCfg((c) => ({ ...c, navegacion: en.nav! }));
    if (en.cats) setCfg((c) => ({ ...c, categorias: en.cats! }));
    phone.current?.jump(en.screen, en.sheet);
    setKey(en.key);
  }, [setCfg]);

  // a link #integrada/<clave> opens that screen
  useEffect(() => {
    const k = keyFromHash();
    const en = k ? IG_ENTRIES.find((x) => x.key === k) : undefined;
    if (en) open(en);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { window.history.replaceState(null, '', `#integrada/${key}`); }, [key]);
  // a link pasted while the page is open also jumps there
  useEffect(() => {
    const onHash = () => {
      const k = keyFromHash();
      const en = k ? IG_ENTRIES.find((x) => x.key === k) : undefined;
      if (en) open(en);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [open]);

  // what you do inside the phone moves the mark in the menu
  const onPlace = useCallback((p: IgPlace) => {
    setKey((k) => {
      const same = (x: IgEntry) => x.screen === p.screen && (x.sheet ?? null) === p.sheet;
      const cur = IG_ENTRIES.find((x) => x.key === k);
      if (cur && same(cur)) return k;
      const pool = IG_ENTRIES.filter(same);
      const sel = navRef.current === SELECTOR;
      return (pool.find((x) => (x.nav === SELECTOR) === sel) ?? pool[0] ?? IG_ENTRIES.find((x) => x.screen === p.screen) ?? cur)?.key ?? k;
    });
  }, []);

  const q = norm(query.trim());
  const groups = useMemo(
    () => IG_GROUPS.map((g) => ({ ...g, entries: q ? g.entries.filter((x) => norm(`${x.code ?? ''} ${x.title}`).includes(q)) : g.entries })).filter((g) => g.entries.length),
    [q],
  );
  const index = IG_ENTRIES.findIndex((x) => x.key === key);
  const cur = IG_ENTRIES[index];
  const prevE = index > 0 ? IG_ENTRIES[index - 1] : undefined;
  const nextE = index >= 0 && index < IG_ENTRIES.length - 1 ? IG_ENTRIES[index + 1] : undefined;
  const groupOf = (en?: IgEntry) => IG_GROUPS.find((g) => en && g.entries.includes(en));

  // ← → move through the menu (while not typing)
  const step = useRef({ prevE, nextE, open });
  step.current = { prevE, nextE, open };
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.metaKey || ev.ctrlKey || ev.altKey || isTyping(document.activeElement)) return;
      const { prevE: p, nextE: n, open: o } = step.current;
      if (ev.key === 'ArrowLeft' && p) { ev.preventDefault(); o(p); }
      else if (ev.key === 'ArrowRight' && n) { ev.preventDefault(); o(n); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="ig-stage">
      <aside className="ig-side" aria-label="Ajustes de la app integrada">
        <div className="ig-intro">
          <h1>App integrada</h1>
          <p>Una sola app con Servicios, Auto y Market, con datos de prueba y sin backend. Por defecto navega con el selector de sección del Prototipo Auto. Colores, tipografía y componentes del brief de diseño del 09/11/2026.</p>
        </div>
        <div className="side-block">
          <div className="block-body" style={{ paddingTop: 14 }}>
            <Select label="Barra de navegación" value={cfg.navegacion} options={NAVS} onChange={(v) => set({ navegacion: v })} />
            <Select label="Chambito Market" value={cfg.faseMarket} options={FASES} onChange={(v) => set({ faseMarket: v })} />
            <Select label="Empezar en" value={cfg.pantallaInicial} options={INICIOS} onChange={(v) => set({ pantallaInicial: v })} />
            <div className="field">
              <span className="side-label">Tema del teléfono</span>
              <div className="seg seg-sm" role="radiogroup" aria-label="Tema del teléfono">
                {([[false, 'Claro'], [true, 'Oscuro']] as const).map(([v, l]) => (
                  <button key={l} role="radio" aria-checked={cfg.dark === v} className={cfg.dark === v ? 'on' : ''} onClick={() => set({ dark: v })}>{l}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <span className="side-label">Categorías de la Tienda</span>
              <div className="seg seg-sm" role="radiogroup" aria-label="Categorías de la Tienda">
                {(['Círculos', 'Mosaicos'] as const).map((v) => (
                  <button key={v} role="radio" aria-checked={(cfg.categorias ?? 'Círculos') === v} className={(cfg.categorias ?? 'Círculos') === v ? 'on' : ''} onClick={() => set({ categorias: v })}>{v}</button>
                ))}
              </div>
            </div>
            <button className="ghost-btn" style={{ justifyContent: 'center' }} onClick={() => phone.current?.reset()}>Reiniciar la demo</button>
          </div>
        </div>
        {groupOf(cur)?.note && <p className="ig-hint">{groupOf(cur)!.note}</p>}
        <p className="ig-hint">El PIN del pasajero para el conductor es <b>4827</b>. El viaje, la oferta al conductor y la compra protegida avanzan solos. <kbd>←</kbd> <kbd>→</kbd> recorren el menú.</p>
      </aside>

      <div className="ig-center">
        <div className="ig-bar">
          <button className="nav-btn" aria-label={prevE ? `Anterior: ${prevE.title}` : 'Anterior'} disabled={!prevE} onClick={() => prevE && open(prevE)}>
            <Icon name="chevronLeft" size={18} color="var(--fg)" />
          </button>
          <div className="ig-bar-title">
            <span className="ig-bar-group">{groupOf(cur)?.title}</span>
            <span>{cur?.code && <b>{cur.code} · </b>}{cur?.title}</span>
          </div>
          <span className="pos">{index + 1} de {IG_ENTRIES.length}</span>
          <button className="nav-btn" aria-label={nextE ? `Siguiente: ${nextE.title}` : 'Siguiente'} disabled={!nextE} onClick={() => nextE && open(nextE)}>
            <Icon name="chevronRight" size={18} color="var(--fg)" />
          </button>
        </div>
        <div ref={box} className="ig-phone" style={{ paddingTop: 11 * scale }}>
          <div style={{ width: 390 * scale, height: 844 * scale }}>
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 390, height: 844, borderRadius: 44, overflow: 'hidden', boxShadow: '0 30px 80px var(--phone-shadow), 0 0 0 10px var(--frame), 0 0 0 11px var(--frame-ring)' }}>
              <IntegradaPhone ref={phone} {...cfg} onPlace={onPlace} />
            </div>
          </div>
        </div>
      </div>

      <nav className="ig-index" aria-label="Pantallas de la app integrada">
        <label className="search" style={{ height: 40 }}>
          <Icon name="search" size={16} color="var(--fg3)" />
          <input value={query} onChange={(ev) => setQuery(ev.target.value)} placeholder="Buscar pantalla…" aria-label="Buscar en la app integrada" />
        </label>
        {groups.map((g) => (
          <div key={g.title} className="group">
            <div className="group-head">{g.title}</div>
            {g.entries.map((x) => (
              <button key={x.key} className={`side-item${key === x.key ? ' on' : ''}`} aria-current={key === x.key ? 'page' : undefined} onClick={() => open(x)}>
                {x.code && <span className="code">{x.code}</span>}
                <span className="title">{x.title}</span>
              </button>
            ))}
          </div>
        ))}
        {!groups.length && <p className="ig-hint">No hay pantallas con «{query}».</p>}
      </nav>
    </div>
  );
}
