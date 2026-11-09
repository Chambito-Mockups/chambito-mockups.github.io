/**
 * «Auto v3» en el visor: los mockups del lienzo «Chambito Auto v3» navegables, en su propia página (separados de la
 * App integrada), con los colores, la tipografía y los componentes del sistema de diseño. Menú con todas las pantallas
 * y estados del lienzo, anterior / siguiente (← →) y un enlace por pantalla: #autov3/<código>.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { usePersistent } from '../persist';
import { isTyping } from '../shell/controls';
import { Icon } from '../ui/kit';
import { AutoV3Handle, AutoV3Phone } from './AutoV3Phone';
import { Country, V3Screen, V3State } from './model';

export interface V3Entry { key: string; title: string; screen: V3Screen; setup?: Partial<V3State> }
export interface V3Group { title: string; note?: string; entries: V3Entry[] }

const e = (key: string, title: string, screen: V3Screen, setup?: Partial<V3State>): V3Entry => ({ key, title, screen, setup });
const TRIP = { tripActive: true };

/** Todas las pantallas y estados del lienzo, en su orden. */
export const V3_GROUPS: V3Group[] = [
  {
    title: 'Explorador',
    note: 'Auto y Market salen de la barra: queda Inicio · Actividad · Perfil. Se cambia de sección con el selector de la cabecera.',
    entries: [e('X1', 'Portada de Servicios', 'X1'), e('X2', 'Explorador abierto', 'A0', { sheet: 'explorer' }), e('V3', 'Explorador con un viaje en curso', 'A0', { ...TRIP, sheet: 'explorer' }), e('V4', 'Servicios con un viaje en curso', 'X1', TRIP)],
  },
  {
    title: 'Viaje, Moto y Envío',
    note: 'Viven dentro de Chambito Auto: se eligen arriba de la hoja de la portada. Un pedido activo a la vez.',
    entries: [e('V1', 'Portada de Auto · Moto', 'A0', { mode: 'moto' }), e('V2', 'Portada de Auto · Envío', 'A0', { mode: 'envio' })],
  },
  {
    title: 'Pasajero',
    entries: [
      e('A0', 'Portada de Auto', 'A0'), e('A0b', 'Portada con viaje activo', 'A0', TRIP), e('A2', '¿A dónde vas? · paso 1 de 3', 'A2'), e('A3', 'Punto de encuentro · paso 2 de 3', 'A3'),
      e('A4', 'Confirmá tu viaje · paso 3 de 3', 'A4'), e('A5', 'Buscando conductor', 'A5', TRIP), e('A5b', 'Ampliar el radio', 'A5b', TRIP), e('A6', 'Conductor en camino', 'A6', TRIP),
      e('A7', 'Tu conductor llegó', 'A7', TRIP), e('A8', 'Viaje en curso', 'A8', TRIP), e('A8b', 'SOS · confirmación', 'A8', { ...TRIP, sheet: 'sos' }), e('A9', 'Viaje terminado · calificación', 'A9'),
      e('A10', 'Detalles del viaje', 'A6', { ...TRIP, sheet: 'detalles' }), e('A11', 'Actividad', 'A11'),
    ],
  },
  {
    title: 'Estados especiales',
    entries: [e('E1', 'Invitado · precio con sesión', 'A4', { guest: true }), e('E2', 'Ubicación desactivada', 'A0', { locOff: true }), e('E3', 'Sin conexión', 'A0', { offline: true }), e('E4', 'Ya tenés un servicio en curso', 'A0', { serviceActive: true })],
  },
  {
    title: 'Conductor',
    entries: [
      e('D0', 'Sumate como conductor', 'D0'), e('D1', 'Requisitos de conductor', 'D1'), e('D2', 'Revisión y vencimientos', 'D2'), e('D3', 'Modo conductor', 'D3', { online: true }),
      e('D4', 'Oferta de viaje', 'D3', { online: true, sheet: 'offer' }), e('D5', 'Ir a buscar', 'D5'), e('D6', 'PIN de inicio', 'D6'), e('D7', 'En viaje', 'D7'), e('D8', 'Cierre y cobro', 'D8'), e('D9', 'Billetera', 'D9'),
    ],
  },
];
export const V3_ENTRIES = V3_GROUPS.flatMap((g) => g.entries);

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const keyFromHash = () => {
  const h = decodeURIComponent(window.location.hash.slice(1));
  return h.startsWith('autov3/') ? h.slice(7) : null;
};

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

export function AutoV3Page() {
  const [cfg, setCfg] = usePersistent<{ country: Country; dark: boolean; sim: boolean }>('autov3', () => ({ country: 'PY', dark: true, sim: true }));
  const set = (o: Partial<typeof cfg>) => setCfg((c) => ({ ...c, ...o }));
  const phone = useRef<AutoV3Handle>(null);
  const [key, setKey] = useState<string>(() => keyFromHash() ?? 'A0');
  const [query, setQuery] = useState('');
  const { box, scale } = useFit();

  const open = useCallback((en: V3Entry) => { phone.current?.jump(en.screen, en.setup); setKey(en.key); }, []);
  useEffect(() => {
    const k = keyFromHash();
    open(V3_ENTRIES.find((x) => x.key === k) ?? V3_ENTRIES.find((x) => x.key === 'A0')!);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { window.history.replaceState(null, '', `#autov3/${key}`); }, [key]);
  useEffect(() => {
    const onHash = () => { const k = keyFromHash(); const en = k ? V3_ENTRIES.find((x) => x.key === k) : undefined; if (en) open(en); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [open]);

  // lo que se hace en el teléfono mueve la marca del menú
  const onPlace = useCallback((s: V3State) => {
    setKey((k) => {
      const cur = V3_ENTRIES.find((x) => x.key === k);
      const fits = (x: V3Entry) => x.screen === s.screen && (x.setup?.sheet ?? null) === s.sheet && (x.setup?.mode ?? 'viaje') === s.mode && !!x.setup?.tripActive === s.tripActive;
      if (cur && cur.screen === s.screen && (cur.setup?.sheet ?? null) === s.sheet) return k;
      return (V3_ENTRIES.find(fits) ?? V3_ENTRIES.find((x) => x.screen === s.screen && (x.setup?.sheet ?? null) === s.sheet) ?? cur)?.key ?? k;
    });
  }, []);

  const q = norm(query.trim());
  const groups = useMemo(() => V3_GROUPS.map((g) => ({ ...g, entries: q ? g.entries.filter((x) => norm(`${x.key} ${x.title}`).includes(q)) : g.entries })).filter((g) => g.entries.length), [q]);
  const index = V3_ENTRIES.findIndex((x) => x.key === key);
  const cur = V3_ENTRIES[index];
  const prevE = index > 0 ? V3_ENTRIES[index - 1] : undefined;
  const nextE = index >= 0 && index < V3_ENTRIES.length - 1 ? V3_ENTRIES[index + 1] : undefined;
  const groupOf = (en?: V3Entry) => V3_GROUPS.find((g) => en && g.entries.includes(en));

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
      <aside className="ig-side" aria-label="Ajustes de Auto v3">
        <div className="ig-intro">
          <h1>Chambito Auto v3</h1>
          <p>Los mockups del lienzo «Chambito Auto v3», navegables y con los colores, la tipografía y los componentes del sistema de diseño. Es una versión aparte de la App integrada.</p>
        </div>
        <div className="side-block">
          <div className="block-body" style={{ paddingTop: 14 }}>
            <div className="field">
              <span className="side-label">País</span>
              <div className="seg seg-sm" role="radiogroup" aria-label="País de Auto v3">
                {([['PY', 'Paraguay'], ['AR', 'Argentina']] as const).map(([v, l]) => (
                  <button key={v} role="radio" aria-checked={cfg.country === v} className={cfg.country === v ? 'on' : ''} onClick={() => set({ country: v })}>{l}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <span className="side-label">Tema del teléfono</span>
              <div className="seg seg-sm" role="radiogroup" aria-label="Tema de Auto v3">
                {([[false, 'Claro'], [true, 'Oscuro']] as const).map(([v, l]) => (
                  <button key={l} role="radio" aria-checked={cfg.dark === v} className={cfg.dark === v ? 'on' : ''} onClick={() => set({ dark: v })}>{l}</button>
                ))}
              </div>
            </div>
            <button className="toggle" role="switch" aria-checked={cfg.sim} onClick={() => set({ sim: !cfg.sim })}>
              <span className={`switch${cfg.sim ? ' on' : ''}`}><span /></span>
              <span style={{ font: '500 13px Roboto, sans-serif', color: 'var(--fg)' }}>Simular el viaje y las ofertas</span>
            </button>
            <button className="ghost-btn" style={{ justifyContent: 'center' }} onClick={() => cur && open(cur)}>Reiniciar la pantalla</button>
          </div>
        </div>
        {groupOf(cur)?.note && <p className="ig-hint">{groupOf(cur)!.note}</p>}
        <p className="ig-hint">Con la simulación, el viaje avanza solo desde «Buscando conductor» y, con el conductor conectado, llega una oferta. El PIN es <b>{cfg.country === 'PY' ? '4827' : '3156'}</b>. <kbd>←</kbd> <kbd>→</kbd> recorren el menú.</p>
      </aside>

      <div className="ig-center">
        <div className="ig-bar">
          <button className="nav-btn" aria-label={prevE ? `Anterior: ${prevE.title}` : 'Anterior'} disabled={!prevE} onClick={() => prevE && open(prevE)}><Icon name="chevronLeft" size={18} color="var(--fg)" /></button>
          <div className="ig-bar-title">
            <span className="ig-bar-group">{groupOf(cur)?.title}</span>
            <span><b>{cur?.key} · </b>{cur?.title}</span>
          </div>
          <span className="pos">{index + 1} de {V3_ENTRIES.length}</span>
          <button className="nav-btn" aria-label={nextE ? `Siguiente: ${nextE.title}` : 'Siguiente'} disabled={!nextE} onClick={() => nextE && open(nextE)}><Icon name="chevronRight" size={18} color="var(--fg)" /></button>
        </div>
        <div ref={box} className="ig-phone" style={{ paddingTop: 11 * scale }}>
          <div style={{ width: 390 * scale, height: 844 * scale }}>
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 390, height: 844, borderRadius: 44, overflow: 'hidden', boxShadow: '0 30px 80px var(--phone-shadow), 0 0 0 10px var(--frame), 0 0 0 11px var(--frame-ring)' }}>
              <AutoV3Phone ref={phone} {...cfg} onPlace={onPlace} />
            </div>
          </div>
        </div>
      </div>

      <nav className="ig-index" aria-label="Pantallas de Auto v3">
        <label className="search" style={{ height: 40 }}>
          <Icon name="search" size={16} color="var(--fg3)" />
          <input value={query} onChange={(ev) => setQuery(ev.target.value)} placeholder="Buscar pantalla…" aria-label="Buscar en Auto v3" />
        </label>
        {groups.map((g) => (
          <div key={g.title} className="group">
            <div className="group-head">{g.title}</div>
            {g.entries.map((x) => (
              <button key={x.key} className={`side-item${key === x.key ? ' on' : ''}`} aria-current={key === x.key ? 'page' : undefined} onClick={() => open(x)}>
                <span className="code">{x.key}</span>
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
