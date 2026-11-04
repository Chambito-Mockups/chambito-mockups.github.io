import { useEffect, useMemo, useRef, useState } from 'react';
import { AppProvider, Settings, useApp } from './store';
import { ALL_ENTRIES, Entry, MODULE_OF, MODULES, Module, Tour, entriesOf } from './registry';
import { Icon } from './ui/kit';
import { BarPage, ComponentsPage } from './showcase';
import { MarketProvider, useMarket, emptyDraft } from './market/state';
import { FitPhone } from './shell/Phone';
import { GREEN, isTyping } from './shell/controls';
import { TopNav, UiTheme } from './shell/TopNav';
import { usePersistent } from './persist';
import { Page, SideMenu } from './shell/SideMenu';
import { NotesPanel, ScreenToolbar } from './shell/ScreenPanel';
import { PresentBar } from './shell/Presenter';

/* ---------------- Root ---------------- */
const initialKey = () => {
  const h = decodeURIComponent(window.location.hash.slice(1));
  return ALL_ENTRIES.some((e) => e.key === h) ? h : 'A0';
};

export function Shell() {
  const { screen, overlay, go, set, setTrip, resetTrip, setOverlay, settings, showToast } = useApp();
  const [nonce, setNonce] = useState(0); // bumps on «Reiniciar» to remount the screen
  const market = useMarket();
  const [page, setPage] = useState<Page>({ kind: 'screen', key: 'A0' });
  const [module, setModule] = useState<Module>('auto');
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  // page theme (the viewer around the phone), separate from the phone's own theme
  const [ui, setUi] = usePersistent<UiTheme>('ui', () => (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  useEffect(() => { document.documentElement.dataset.ui = ui; }, [ui]);
  const bootKey = useRef(initialKey()).current; // read before the URL is rewritten below
  const lastKey = useRef<Record<Module, string>>({ auto: MODULES.auto.first, market: MODULES.market.first });
  // presentation mode (?presentar opens straight in it) and guided flows
  const [present, setPresent] = useState(() => new URLSearchParams(window.location.search).has('presentar') || window.innerWidth < 600); // phones open on the phone only
  const [tour, setTour] = useState<{ t: Tour; step: number } | null>(null);
  const [playing, setPlaying] = useState(false);
  const simBefore = useRef<boolean | null>(null); // the trip simulation is paused while a flow plays

  // keep the index highlight (and the module) in sync with in-phone navigation
  useEffect(() => {
    if (page.kind !== 'screen') return;
    const ov = overlay === 'cancel' ? null : overlay;
    const fits = (e: Entry) => Object.entries(e.flags ?? {}).every(([k, v]) => settings[k as keyof Settings] === v);
    const same = ALL_ENTRIES.filter((e) => e.screen === screen && (e.overlay ?? null) === ov);
    const inModule = same.filter((e) => MODULE_OF[e.key] === module);
    const pool = inModule.length ? inModule : same;
    const match = pool.find((e) => e.key === page.key) ?? pool.find(fits) ?? pool[0] ?? ALL_ENTRIES.find((e) => e.screen === screen);
    if (match && match.key !== page.key) {
      setPage({ kind: 'screen', key: match.key });
      const m = MODULE_OF[match.key];
      if (m && m !== module) setModule(m);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, overlay]);

  // remember the last screen per module, and keep it in the URL for sharing
  useEffect(() => {
    if (page.kind !== 'screen') return;
    const m = MODULE_OF[page.key];
    if (m) lastKey.current[m] = page.key;
    window.history.replaceState(null, '', `#${page.key}`);
  }, [page]);

  const jump = (e: Entry) => {
    const base = { role: e.role, guest: false, locationOff: false, offline: false, otherService: false, almostEmpty: false, atLimit: false, sellerStatus: 'verificado' as const };
    set({ ...base, ...(e.flags ?? {}) });
    const mk = e.mk ?? {};
    if (mk.listing) market.openListing(mk.listing);
    if (mk.activity) market.setActivityTab(mk.activity);
    if (mk.myTab) market.setMyTab(mk.myTab);
    market.setWelcomed(mk.welcomed ?? true);
    if (mk.draft) market.setDraft({ ...emptyDraft(), title: 'Bicicleta Trek rodado 29', price: '1.450.000', attrs: { Rodado: '29', Talle: 'M', Marca: 'Trek' }, description: 'Poco uso, cambios Shimano de 21 velocidades. Incluye luces.', step: e.key === 'V18' ? 3 : 2, savedAt: Date.now() - 2 * 3600 * 1000, editing: e.key === 'V22' ? 'm1' : undefined, photos: e.key === 'V16' ? [] : [0, 1, 2].map((i) => ({ id: i, state: 'lista' as const, ph: (i % 3) as 0 | 1 | 2 })) });
    if (mk.review !== undefined) market.setLastPublished({ title: 'Bicicleta Trek rodado 29', price: 1450000, review: mk.review });
    resetTrip();
    if (e.phase) setTrip({ phase: e.phase });
    go(e.screen, { replace: true });
    if (e.overlay) setOverlay(e.overlay);
    setPage({ kind: 'screen', key: e.key });
    const m = MODULE_OF[e.key];
    if (m && m !== module) setModule(m);
    setMenuOpen(false);
  };
  const jumpKey = (k: string) => { const e = ALL_ENTRIES.find((x) => x.key === k); if (e) jump(e); };

  // deep link: #A6 opens that screen
  useEffect(() => {
    if (bootKey !== 'A0') jumpKey(bootKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // a link edited or pasted while the prototype is open also jumps there
  const jumpRef = useRef(jumpKey);
  jumpRef.current = jumpKey;
  useEffect(() => {
    const onHash = () => jumpRef.current(decodeURIComponent(window.location.hash.slice(1)));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const switchModule = (m: Module) => {
    if (m === module && page.kind === 'screen') return;
    setModule(m);
    jumpKey(lastKey.current[m]);
  };

  const list = useMemo(() => entriesOf(module), [module]);
  const entry = page.kind === 'screen' ? ALL_ENTRIES.find((e) => e.key === page.key && e.screen === screen) ?? ALL_ENTRIES.find((e) => e.screen === screen) : undefined;
  const index = entry ? list.findIndex((e) => e.key === entry.key) : -1;
  const prev = () => { if (index > 0) jump(list[index - 1]); };
  const next = () => { if (index >= 0 && index < list.length - 1) jump(list[index + 1]); };
  const reset = () => {
    if (!entry) return;
    jump(entry);
    setNonce((n) => n + 1);
    showToast('Pantalla reiniciada');
  };

  const toStep = (i: number) => {
    if (!tour) return;
    const last = tour.t.steps.length - 1;
    const s = Math.max(0, Math.min(last, i));
    setTour({ ...tour, step: s });
    jumpKey(tour.t.steps[s]);
    if (s >= last) setPlaying(false);
  };
  const startTour = (t: Tour) => {
    if (simBefore.current === null) simBefore.current = settings.simulate;
    set({ simulate: false });
    setTour({ t, step: 0 });
    setPlaying(true);
    setPresent(true);
    setMenuOpen(false);
    jumpKey(t.steps[0]);
  };
  const exitPresent = () => {
    setPresent(false);
    setTour(null);
    setPlaying(false);
    if (simBefore.current !== null) { set({ simulate: simBefore.current }); simBefore.current = null; }
  };
  const pPrev = () => (tour ? toStep(tour.step - 1) : prev());
  const pNext = () => (tour ? toStep(tour.step + 1) : next());

  // keyboard: ← → move through the module, / searches, R reloads the screen
  const keyActions = () => ({ prev: pPrev, next: pNext, reset, present, exit: exitPresent, enter: () => setPresent(true), play: () => { if (tour) setPlaying((p) => !p); } });
  const keys = useRef(keyActions());
  keys.current = keyActions();
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      // Escape always leaves the presentation, even from a focused field (unless a sheet is open)
      if (ev.key === 'Escape' && keys.current.present && !document.querySelector('[role="dialog"]')) { keys.current.exit(); return; }
      if (isTyping(document.activeElement)) return;
      if (ev.key === 'ArrowLeft') { ev.preventDefault(); keys.current.prev(); }
      else if (ev.key === 'ArrowRight') { ev.preventDefault(); keys.current.next(); }
      else if (ev.key === '/') { ev.preventDefault(); setMenuOpen(true); searchRef.current?.focus(); }
      else if (ev.key === 'r' || ev.key === 'R') keys.current.reset();
      else if (ev.key === 'p' || ev.key === 'P') (keys.current.present ? keys.current.exit : keys.current.enter)();
      else if (ev.key === ' ' && keys.current.present) { ev.preventDefault(); keys.current.play(); }
      else if (ev.key === 'Escape' && keys.current.present && !document.querySelector('[role="dialog"]')) keys.current.exit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={`shell${menuOpen ? ' menu-open' : ''}${present ? ' presenting' : ''}`}>
      <TopNav module={module} onModule={switchModule} onMenu={() => setMenuOpen((o) => !o)} ui={ui} onUi={setUi} />
      <div className="scrim" onClick={() => setMenuOpen(false)} />
      <SideMenu module={module} page={page} onJump={jump} onPage={(p) => { setPage(p); setMenuOpen(false); }} onModule={switchModule} query={query} setQuery={setQuery} searchRef={searchRef} onStartTour={startTour} />
      <main className="main">
        {page.kind === 'screen' ? (
          <>
            <ScreenToolbar module={module} entry={entry} index={index} total={list.length} onPrev={prev} onNext={next} onReset={reset} onPresent={() => setPresent(true)} />
            <div className="stage">
              <FitPhone nonce={nonce} />
              <NotesPanel entry={entry} module={module} />
            </div>
          </>
        ) : (
          <div className="page">
            <button className="back-link" onClick={() => jumpKey(lastKey.current[module])}>
              <Icon name="arrowLeft" size={16} color={GREEN} /> Volver al prototipo
            </button>
            {page.kind === 'bar' ? <BarPage /> : <ComponentsPage />}
          </div>
        )}
      </main>
      {present && page.kind === 'screen' && (
        <PresentBar module={module} entry={entry} tour={tour?.t ?? null} step={tour?.step ?? 0} playing={playing} index={index} total={list.length}
          onPrev={pPrev} onNext={pNext} onPlay={() => setPlaying((p) => !p)} onExit={exitPresent} onStep={toStep} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MarketProvider>
        <Shell />
      </MarketProvider>
    </AppProvider>
  );
}
