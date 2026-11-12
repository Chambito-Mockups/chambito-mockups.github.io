/**
 * «Auto v3» en el visor: los mockups del lienzo «Chambito Auto v3» navegables, en su propia página (separados de la
 * App integrada), con los colores, la tipografía y los componentes del sistema de diseño. Menú con todas las pantallas
 * y estados del lienzo, anterior / siguiente (← →) y un enlace por pantalla: #autov3/<código>.
 */
import { RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePersistent } from '../persist';
import { PHONE_QUERY, useIsPhone } from '../shell/device';
import { isTyping } from '../shell/controls';
import { Icon } from '../ui/kit';
import { dark as darkTheme, light as lightTheme } from '../theme';
import { Module, Tour } from '../registry';
import { useBareSize } from '../shell/Phone';
import { PresentBar } from '../shell/Presenter';
import { ScreensSheet } from '../shell/MobileNav';
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
      const top = el.getBoundingClientRect().top;
      const availW = el.clientWidth - 20;
      const availH = window.innerHeight - top - (el.closest('.presenting') ? 120 : 40); // la barra del recorrido va abajo
      if (window.matchMedia?.(PHONE_QUERY).matches) { setScale(Math.min(1.2, el.clientWidth / 390)); return; }
      setScale(Math.max(0.6, Math.min(1.25, availW / 412, availH / 866)));
    };
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fit);
    ro?.observe(el);
    fit();
    window.addEventListener('resize', fit);
    return () => { ro?.disconnect(); window.removeEventListener('resize', fit); };
  }, []);
  const bare = useIsPhone();
  return { box, scale, bare };
}

/** En el celular, Auto v3 se presenta igual que Market v3: pantalla a todo el alto y la barra de abajo. */
export interface V3Present { onModule: (m: Module) => void; onHome: () => void; onExit: () => void }

/** El teléfono sin marco, del alto que haya entre el borde de arriba y la barra (el mismo cálculo que Market). */
function BareV3({ phone, cfg, onPlace }: { phone: RefObject<AutoV3Handle>; cfg: { country: Country; dark: boolean; sim: boolean }; onPlace: (s: V3State) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const { scale, height } = useBareSize(box);
  return (
    <div ref={box} className="bare-phone" style={{ width: '100%', display: 'flex', justifyContent: 'center', background: (cfg.dark ? darkTheme : lightTheme).bg }}>
      <div style={{ width: 390 * scale, height: height * scale, overflow: 'hidden' }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <AutoV3Phone ref={phone} {...cfg} onPlace={onPlace} bare height={height} />
        </div>
      </div>
    </div>
  );
}

/** Un recorrido guiado de Auto que se está reproduciendo (el estado vive en el visor). */
export interface V3Tour {
  t: Tour; step: number; playing: boolean;
  onPrev: () => void; onNext: () => void; onPlay: () => void; onStep: (i: number) => void; onExit: () => void; onEnd: () => void;
}

export function AutoV3Page({ present, tour }: { present?: V3Present; tour?: V3Tour }) {
  const [sheet, setSheet] = useState(false);
  const [cfg, setCfg] = usePersistent<{ country: Country; dark: boolean; sim: boolean }>('autov3', () => ({ country: 'PY', dark: true, sim: true }));
  const set = (o: Partial<typeof cfg>) => setCfg((c) => ({ ...c, ...o }));
  const phone = useRef<AutoV3Handle>(null);
  const [key, setKey] = useState<string>(() => keyFromHash() ?? 'A0');
  const { box, scale, bare } = useFit();

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

  const index = V3_ENTRIES.findIndex((x) => x.key === key);
  const cur = V3_ENTRIES[index];
  const prevE = index > 0 ? V3_ENTRIES[index - 1] : undefined;
  const nextE = index >= 0 && index < V3_ENTRIES.length - 1 ? V3_ENTRIES[index + 1] : undefined;
  const groupOf = (en?: V3Entry) => V3_GROUPS.find((g) => en && g.entries.includes(en));

  const step = useRef({ prevE, nextE, open, touring: !!tour });
  step.current = { prevE, nextE, open, touring: !!tour };
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      // during a guided flow the viewer moves the steps with ← →
      if (ev.metaKey || ev.ctrlKey || ev.altKey || isTyping(document.activeElement) || step.current.touring) return;
      const { prevE: p, nextE: n, open: o } = step.current;
      if (ev.key === 'ArrowLeft' && p) { ev.preventDefault(); o(p); }
      else if (ev.key === 'ArrowRight' && n) { ev.preventDefault(); o(n); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // the same bar as Market; during a guided flow, its steps, dots and play / pause
  const barProps = {
    module: 'auto' as const, entry: cur ? { code: cur.key, title: cur.title } : undefined, index, total: V3_ENTRIES.length,
    ...(tour
      ? { tour: tour.t, step: tour.step, playing: tour.playing, onPrev: tour.onPrev, onNext: tour.onNext, onPlay: tour.onPlay, onStep: tour.onStep, onExit: tour.onExit }
      : { tour: null, step: 0, playing: false, onPrev: () => { if (prevE) open(prevE); }, onNext: () => { if (nextE) open(nextE); }, onPlay: () => {}, onStep: () => {}, onExit: present?.onExit ?? (() => {}) }),
  };
  // the trip simulation pauses while a flow plays, so the screens don't move on their own
  const phoneCfg = { ...cfg, sim: cfg.sim && !tour };

  if (present) {
    return (
      <div className="v3-stage v3-present">
        <div className="phone-wrap">
          <BareV3 phone={phone} cfg={phoneCfg} onPlace={onPlace} />
        </div>
        <PresentBar
          {...barProps}
          onMenu={() => setSheet(true)}
        />
        {sheet && (
          <ScreensSheet
            module="auto" groups={V3_GROUPS.map((g) => ({ title: g.title, entries: g.entries.map((x) => ({ key: x.key, code: x.key, title: x.title })) }))}
            current={key} inTour={!!tour} dark={cfg.dark}
            onModule={(m) => { setSheet(false); if (m !== 'auto') present.onModule(m); }}
            onPick={(k) => { const en = V3_ENTRIES.find((x) => x.key === k); tour?.onEnd(); if (en) open(en); setSheet(false); }}
            onHome={() => { setSheet(false); present.onHome(); }}
            onTheme={() => set({ dark: !cfg.dark })}
            onExit={() => { setSheet(false); present.onExit(); }}
            onEndTour={() => { tour?.onEnd(); setSheet(false); }}
            onClose={() => setSheet(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="v3-stage">
      <div className="v3-bar">
        <button className="nav-btn" aria-label={prevE ? `Anterior: ${prevE.title}` : 'Anterior'} disabled={!prevE} onClick={() => prevE && open(prevE)}><Icon name="chevronLeft" size={18} color="var(--fg)" /></button>
        <div className="v3-bar-title">
          <span className="ig-bar-group">{groupOf(cur)?.title}</span>
          <span><b>{cur?.key} · </b>{cur?.title}</span>
        </div>
        <span className="pos">{index + 1}/{V3_ENTRIES.length}</span>
        <div className="v3-controls">
          <div className="seg seg-sm" role="radiogroup" aria-label="País" title="País">
            {(['PY', 'AR'] as const).map((v) => (
              <button key={v} role="radio" aria-checked={cfg.country === v} className={cfg.country === v ? 'on' : ''} onClick={() => set({ country: v })}>{v}</button>
            ))}
          </div>
          <div className="seg seg-sm" role="radiogroup" aria-label="Tema del teléfono" title="Tema del teléfono">
            {([[false, '☀'], [true, '☾']] as const).map(([v, l]) => (
              <button key={String(v)} role="radio" aria-checked={cfg.dark === v} className={cfg.dark === v ? 'on' : ''} onClick={() => set({ dark: v })}>{l}</button>
            ))}
          </div>
          <button className="icon-btn square" onClick={() => cur && open(cur)} title="Reiniciar la pantalla" aria-label="Reiniciar"><Icon name="refresh" size={14} color="var(--fg)" /></button>
          <button className="toggle v3-sim" role="switch" aria-checked={cfg.sim} onClick={() => set({ sim: !cfg.sim })} title="Simular el viaje y las ofertas">
            <span className={`switch${cfg.sim ? ' on' : ''}`}><span /></span>
            <span style={{ font: '500 12px Roboto, sans-serif', color: 'var(--fg)' }}>Simular</span>
          </button>
        </div>
        <button className="nav-btn" aria-label={nextE ? `Siguiente: ${nextE.title}` : 'Siguiente'} disabled={!nextE} onClick={() => nextE && open(nextE)}><Icon name="chevronRight" size={18} color="var(--fg)" /></button>
      </div>
      <div ref={box} className="ig-phone" style={{ paddingTop: bare ? 0 : 11 * scale }}>
        <div style={{ width: 390 * scale, height: 844 * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 390, height: 844, overflow: 'hidden', ...(bare ? {} : { borderRadius: 44, boxShadow: '0 30px 80px var(--phone-shadow), 0 0 0 10px var(--frame), 0 0 0 11px var(--frame-ring)' }) }}>
            <AutoV3Phone ref={phone} {...phoneCfg} onPlace={onPlace} />
          </div>
        </div>
      </div>
      {tour && <PresentBar {...barProps} />}
      <div className="v3-notes">
        {groupOf(cur)?.note && <p className="v3-note">{groupOf(cur)!.note}</p>}
        <p className="v3-note muted">PIN: <b>{cfg.country === 'PY' ? '4827' : '3156'}</b></p>
      </div>
    </div>
  );
}
