import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { AppProvider, Settings, useApp } from './store';
import { ALL_ENTRIES, Entry, MODULE_OF, MODULES, Module, Tour, VERSIONS, Version, entriesIn, groupsIn, versionOf } from './registry';
import { Icon } from './ui/kit';
import { IntegrationPage } from './integration';
import { IntegradaPage } from './integrada/IntegradaPage';
import { DesignSystemPage } from './integrada/DesignSystemPage';
import { AutoV3Page } from './autov3/AutoV3Page';
import { AutoV3Sidebar } from './autov3/AutoV3Sidebar';
import { MarketProvider, useMarket, emptyDraft } from './market/state';
import { FitPhone } from './shell/Phone';
import { GREEN, isTyping } from './shell/controls';
import { TopNav, UiTheme } from './shell/TopNav';
import { usePersistent } from './persist';
import { Page, SideMenu } from './shell/SideMenu';
import { NotesPanel, ScreenToolbar, SideArrows } from './shell/ScreenPanel';
import { PresentBar } from './shell/Presenter';
import { useIsPhone } from './shell/device';
import { MobileHome, ScreensSheet } from './shell/MobileNav';
import { VersionsPage } from './shell/VersionsPage';
import { link } from './shell/bus';

/* ---------------- Root ---------------- */
const initialKey = () => {
  const h = decodeURIComponent(window.location.hash.slice(1));
  return ALL_ENTRIES.some((e) => e.key === h) ? h : 'A0';
};

/** #componentes opens «Componentes» (every design reference) */
const NAV_HASH = 'componentes';
/** the old link of the page keeps working */
const isRefHash = (h: string) => h === NAV_HASH || h === 'navegacion';
/** #integrada opens «App integrada» (Servicios, Auto y Market in one app) */
const APP_HASH = 'integrada';
/** #integrada and #integrada/<pantalla> */
const isAppHash = (h: string) => h === APP_HASH || h.startsWith(`${APP_HASH}/`);
/** #sistema and #sistema/<sección> open «Sistema de diseño» (colores, tipografía, componentes…) */
const isSysHash = (h: string) => h === 'sistema' || h.startsWith('sistema/');
/** #autov3 and #autov3/<código> open the navigable mockups of «Chambito Auto v3», a version of its own */
const isV3Hash = (h: string) => h === 'autov3' || h.startsWith('autov3/');
/** #versiones opens «Versiones»: the differences between v1, v2 and v3 of Auto and Market */
const isVsHash = (h: string) => h === 'versiones';
/** the main version of each module: Auto v3 (its own page) and Market v3 (Market as a section, with the selector) */
const MARKET_MAIN = VERSIONS.market.find((v) => v.id === 'v3')!;
const MARKET_FIRST = MARKET_MAIN.first ?? 'MKm';

export function Shell() {
  const { screen, overlay, go, set, setTrip, resetTrip, setOverlay, settings, showToast } = useApp();
  const [nonce, setNonce] = useState(0); // bumps on «Reiniciar» to remount the screen
  const market = useMarket();
  // without a link, the prototype opens on Auto v3 (the main version)
  const [page, setPage] = useState<Page>(() => (window.location.hash.length > 1 ? { kind: 'screen', key: 'A0' } : { kind: 'autov3' }));
  const [module, setModule] = useState<Module>('auto');
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  // page theme (the viewer around the phone), separate from the phone's own theme
  const [ui, setUi] = usePersistent<UiTheme>('ui', () => (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  useEffect(() => { document.documentElement.dataset.ui = ui; }, [ui]);
  const bootKey = useRef(initialKey()).current; // read before the URL is rewritten below
  const bootHash = useRef(decodeURIComponent(window.location.hash.slice(1))).current;
  const lastKey = useRef<Record<Module, string>>({ auto: MODULES.auto.first, market: MARKET_FIRST });
  // presentation mode (?presentar opens straight in it) and guided flows
  const [present, setPresent] = useState(() => new URLSearchParams(window.location.search).has('presentar') || window.innerWidth < 600); // phones open on the phone only
  const [tour, setTour] = useState<{ t: Tour; step: number } | null>(null);
  // on a phone: a home screen first (unless the link opens a screen), and a sheet to jump to any screen
  const isPhone = useIsPhone();
  const [home, setHome] = useState(() => window.innerWidth <= 600 && ['', 'A0'].includes(decodeURIComponent(window.location.hash.slice(1))));
  const [sheet, setSheet] = useState(false);
  // an earlier version (v1, v2) opened from «Versiones» as a reference
  const [refMode, setRefMode] = useState(false);
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
    // in Market v3 the section explorer belongs to Market: don't move to Auto's reference screens
    if (match && module === 'market' && !refMode && settings.navModel === 'explorer' && MODULE_OF[match.key] !== 'market') return;
    if (match && match.key !== page.key) {
      setPage({ kind: 'screen', key: match.key });
      const m = MODULE_OF[match.key];
      if (m && m !== module) setModule(m);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, overlay]);

  // a link #integrada/<pantalla> must survive the first render, which is still on a screen
  const bootingApp = useRef(((h: string) => !h || isAppHash(h) || isSysHash(h) || isV3Hash(h) || isVsHash(h))(decodeURIComponent(window.location.hash.slice(1))));
  // remember the last screen per module, and keep it in the URL for sharing
  useEffect(() => {
    if (page.kind === 'integrada' || page.kind === 'sistema' || page.kind === 'autov3' || page.kind === 'versiones') bootingApp.current = false;
    if (page.kind === 'versiones') window.history.replaceState(null, '', '#versiones');
    if (bootingApp.current) return;
    if (page.kind === 'integration') window.history.replaceState(null, '', `#${NAV_HASH}`);
    if (page.kind === 'integrada' && !isAppHash(decodeURIComponent(window.location.hash.slice(1)))) window.history.replaceState(null, '', `#${APP_HASH}`); // the page keeps its own #integrada/<pantalla>
    if (page.kind !== 'screen') return;
    const m = MODULE_OF[page.key];
    if (m) lastKey.current[m] = page.key;
    window.history.replaceState(null, '', `#${page.key}`);
  }, [page]);

  const jump = (e: Entry) => {
    const base = { role: e.role, guest: false, locationOff: false, offline: false, otherService: false, almostEmpty: false, atLimit: false, sellerStatus: 'verificado' as const };
    // a Market screen shared by every version opens in Market v3, unless an earlier version is being viewed
    const main = MODULE_OF[e.key] === 'market' && !e.versions && !refMode ? MARKET_MAIN.flags ?? {} : {};
    set({ ...base, ...main, ...(e.flags ?? {}) });
    const mk = e.mk ?? {};
    if (mk.listing) market.openListing(mk.listing);
    if (mk.activity) market.setActivityTab(mk.activity);
    if (mk.myTab) market.setMyTab(mk.myTab);
    market.setWelcomed(mk.welcomed ?? true);
    if (mk.draft) market.setDraft({ ...emptyDraft(), title: 'Bicicleta Trek rodado 29', price: '1.450.000', attrs: { Rodado: '29', Talle: 'M', Marca: 'Trek' }, description: 'Poco uso, cambios Shimano de 21 velocidades. Incluye luces.', step: e.key === 'V18' ? 3 : 2, savedAt: Date.now() - 2 * 3600 * 1000, editing: e.key === 'V22' ? 'm1' : undefined, photos: e.key === 'V16' ? [] : [0, 1, 2].map((i) => ({ id: i, state: 'lista' as const, ph: (i % 3) as 0 | 1 | 2 })) });
    market.setCobros({ feePreview: !!mk.feePreview, ...(mk.sale ? { saleId: mk.sale } : {}) });
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
    if (isRefHash(bootHash)) { setRefVersion(VERSIONS.auto[2]); setPage({ kind: 'integration' }); } // a direct link opens the proposals (v3)
    else if (isAppHash(bootHash)) setPage({ kind: 'integrada' });
    else if (isSysHash(bootHash)) setPage({ kind: 'sistema' });
    else if (isV3Hash(bootHash)) setPage({ kind: 'autov3' });
    else if (isVsHash(bootHash)) setPage({ kind: 'versiones' });
    else if (bootHash && (bootKey !== 'A0' || bootHash === 'A0')) jumpKey(bootKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // a link edited or pasted while the prototype is open also jumps there
  const jumpRef = useRef(jumpKey);
  jumpRef.current = jumpKey;
  useEffect(() => {
    const onHash = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (isRefHash(h)) { setRefVersion(VERSIONS.auto[2]); setPage({ kind: 'integration' }); }
      else if (isAppHash(h)) setPage({ kind: 'integrada' });
      else if (isSysHash(h)) setPage({ kind: 'sistema' });
      else if (isV3Hash(h)) { setModule('auto'); setPage({ kind: 'autov3' }); }
      else if (isVsHash(h)) setPage({ kind: 'versiones' });
      else jumpRef.current(h);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Auto opens Auto v3; Market opens Market v3 (its settings, and its last screen if it belongs to v3)
  const switchModule = (m: Module) => {
    setMenuOpen(false);
    setSheet(false);
    setRefMode(false);
    if (m === 'auto') { setModule('auto'); setPage({ kind: 'autov3' }); if (isPhone) setPresent(true); return; }
    if (m === module && page.kind === 'screen' && versionOf('market', settings).id === 'v3') return;
    setModule('market');
    set(MARKET_MAIN.flags ?? {});
    const last = lastKey.current.market;
    jumpKey(entriesIn('market', 'v3').some((e) => e.key === last) ? last : MARKET_FIRST);
    if (isPhone) setPresent(true);
  };
  // the section selector of Auto v3 opens Market v3
  const switchRef = useRef(switchModule);
  switchRef.current = switchModule;
  useEffect(() => {
    const on = () => switchRef.current('market');
    window.addEventListener('chambito:section', on);
    return () => window.removeEventListener('chambito:section', on);
  }, []);

  // the version (v1, v2…) of the module follows the settings; previous / next walk only its screens
  // in «Componentes» the version is the one you came with (or picked there); on screens it follows the settings
  const [refVersion, setRefVersion] = useState<Version | null>(null);
  const onRefs = page.kind === 'integration';
  const version = (onRefs && refVersion && VERSIONS[module].some((v) => v.id === refVersion.id) ? VERSIONS[module].find((v) => v.id === refVersion.id)! : null) ?? versionOf(module, settings);
  const list = useMemo(() => entriesIn(module, version.id), [module, version.id]);
  // a screen of an earlier version (v1, v2) is a reference: Auto's main version is its own page
  const reference = page.kind === 'screen' && (module === 'auto' || refMode || version.id !== 'v3');
  link.market = page.kind === 'screen' && module === 'market' && !refMode && version.id === 'v3';
  const openVersion = (m: Module, v: Version) => {
    if (v.id === 'v3') { switchModule(m); return; }
    setRefMode(true);
    setModule(m);
    set(v.flags ?? {});
    if (v.first) jumpKey(v.first);
  };
  const chooseVersion = (v: Version) => {
    // inside «Componentes»: apply the version and stay, its references change
    if (onRefs) { set(v.flags ?? {}); setRefVersion(v); return; }
    if (v.page) { setRefVersion(v); setPage({ kind: v.page }); setMenuOpen(false); return; }
    set(v.flags ?? {});
    if (v.first) jumpKey(v.first);
  };
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

  // a step of a guided flow: Auto's flows open Auto v3 (through its link), the others a screen of the index
  const showStep = (t: Tour, key: string) => {
    if (!t.v3) { jumpKey(key); return; }
    setModule('auto');
    setRefMode(false);
    setPage({ kind: 'autov3' });
    window.history.replaceState(null, '', `#autov3/${key}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };
  const toStep = (i: number) => {
    if (!tour) return;
    const last = tour.t.steps.length - 1;
    const s = Math.max(0, Math.min(last, i));
    setTour({ ...tour, step: s });
    showStep(tour.t, tour.t.steps[s]);
    if (s >= last) setPlaying(false);
  };
  const startTour = (t: Tour) => {
    // the trip simulation of the index pauses while a flow plays (Auto v3 pauses its own)
    if (!t.v3) {
      if (simBefore.current === null) simBefore.current = settings.simulate;
      set({ simulate: false });
    }
    setTour({ t, step: 0 });
    setPlaying(true);
    setPresent(true);
    setMenuOpen(false);
    setHome(false);
    setSheet(false);
    showStep(t, t.steps[0]);
  };
  const endTour = () => {
    setTour(null);
    setPlaying(false);
    if (simBefore.current !== null) { set({ simulate: simBefore.current }); simBefore.current = null; }
  };
  const exitPresent = () => {
    setPresent(false);
    setSheet(false);
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
      else if (ev.key === 't' || ev.key === 'T') set({ theme: settingsRef.current.theme === 'dark' ? 'light' : 'dark' });
      else if (ev.key === ' ' && keys.current.present) { ev.preventDefault(); keys.current.play(); }
      else if (ev.key === 'Escape' && keys.current.present && !document.querySelector('[role="dialog"]')) keys.current.exit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (isPhone && home) {
    return (
      <MobileHome
        onModule={(m) => { setHome(false); switchModule(m); }}
        onTour={startTour}
      />
    );
  }

  return (
    <div className={`shell${menuOpen ? ' menu-open' : ''}${present && (page.kind === 'screen' || (page.kind === 'autov3' && (isPhone || !!tour))) ? ' presenting' : ''}${page.kind === 'integrada' || page.kind === 'sistema' ? ' wide' : ''}`}>
      <TopNav module={module} onModule={switchModule} onMenu={() => setMenuOpen((o) => !o)} ui={ui} onUi={setUi} navOn={page.kind === 'integration' || page.kind === 'sistema'} onNav={() => { setPage({ kind: 'sistema' }); setMenuOpen(false); }}
        appOn={page.kind === 'integrada'} onApp={() => { setPage({ kind: 'integrada' }); setMenuOpen(false); }}
        v3On={page.kind === 'autov3'} vsOn={page.kind === 'versiones'} onVs={() => { setPage({ kind: 'versiones' }); setMenuOpen(false); }} />
      <div className="scrim" onClick={() => setMenuOpen(false)} />
      {page.kind === 'autov3' ? (
        <AutoV3Sidebar onStartTour={startTour} />
      ) : (
        <SideMenu module={module} page={page} onJump={jump} onModule={switchModule} query={query} setQuery={setQuery} searchRef={searchRef} onStartTour={startTour} version={version} />
      )}
      <main className="main">
        {page.kind === 'screen' ? (
          <>
            <ScreenToolbar module={module} version={version} entry={entry} index={index} total={list.length} prevEntry={index > 0 ? list[index - 1] : undefined} nextEntry={index >= 0 && index < list.length - 1 ? list[index + 1] : undefined} onPrev={prev} onNext={next} onReset={reset} onPresent={() => setPresent(true)} />
            <div className="stage">
              <aside className="version-panel" aria-label="Versión">
                {reference ? (
                  <div className="ref-note" style={{ '--v': version.color } as CSSProperties}>
                    <span className="vp-top"><span className="vp-id">{version.id}</span><span className="vp-name">{version.label}</span></span>
                    <span className="vp-meta">Versión de referencia</span>
                    <button className="primary-btn" onClick={() => switchModule(module)}>Volver a {MODULES[module].label} v3</button>
                  </div>
                ) : (
                  <button className="vp-extra" style={{ '--v': version.color } as CSSProperties} onClick={() => setPage({ kind: 'versiones' })}>
                    <span className="vp-id">v3</span><span className="vp-name">Ver diferencias con v1 y v2</span><span className="vp-arrow">→</span>
                  </button>
                )}
              </aside>
              <div className="phone-wrap">
                <SideArrows prevEntry={index > 0 ? list[index - 1] : undefined} nextEntry={index >= 0 && index < list.length - 1 ? list[index + 1] : undefined} onPrev={prev} onNext={next} />
                <FitPhone nonce={nonce} gutter={112} />
              </div>
              <NotesPanel entry={entry} module={module} />
            </div>
          </>
        ) : (
          <div className="page">
            <div className="page-topbar">
              {page.kind === 'autov3' ? <span /> : (
                <button className="back-pill" onClick={() => switchModule(module)} title="Volver al prototipo principal">
                  <Icon name="arrowLeft" size={14} color={GREEN} />
                  <span>Volver a Chambito {module === 'auto' ? 'Auto' : 'Market'}</span>
                </button>
              )}
              <span className="page-tag">
                {page.kind === 'autov3' ? 'Chambito Auto · v3'
                  : page.kind === 'versiones' ? 'Versiones'
                  : page.kind === 'integrada' ? 'App Unificada'
                  : page.kind === 'sistema' ? 'Sistema de diseño'
                  : 'Propuestas'}
              </span>
            </div>
            {page.kind === 'autov3' ? (
              <AutoV3Page
                present={isPhone && present ? { onModule: switchModule, onHome: () => { endTour(); setHome(true); }, onExit: exitPresent } : undefined}
                tour={tour?.t.v3 ? { t: tour.t, step: tour.step, playing, onPrev: pPrev, onNext: pNext, onPlay: () => setPlaying((p) => !p), onStep: toStep, onExit: exitPresent, onEnd: endTour } : undefined}
              />
            )
              : page.kind === 'versiones' ? <VersionsPage onOpen={openVersion} />
              : page.kind === 'integrada' ? <IntegradaPage />
              : page.kind === 'sistema' ? <DesignSystemPage onRefs={() => { setRefVersion(versionOf(module, settings)); setPage({ kind: 'integration' }); }} />
              : <IntegrationPage module={module} version={version} onVersion={chooseVersion} />}
          </div>
        )}
      </main>
      {present && page.kind === 'screen' && (
        <PresentBar module={module} entry={entry} tour={tour?.t ?? null} step={tour?.step ?? 0} playing={playing} index={index} total={list.length}
          onPrev={pPrev} onNext={pNext} onPlay={() => setPlaying((p) => !p)} onExit={exitPresent} onStep={toStep}
          onMenu={isPhone ? () => setSheet(true) : undefined} />
      )}
      {isPhone && sheet && present && page.kind === 'screen' && (
        <ScreensSheet
          module={module} current={entry?.key} inTour={!!tour} dark={settings.theme === 'dark'}
          groups={groupsIn(module, version.id).filter((g) => !g.page).map((g) => ({ title: g.title, icon: g.icon, entries: g.entries.filter((e) => !e.versions || e.versions.includes(version.id)) }))}
          onModule={switchModule}
          onPick={(k) => { const e = ALL_ENTRIES.find((x) => x.key === k); if (!e) return; if (tour) { setTour(null); setPlaying(false); } jump(e); setSheet(false); }}
          onHome={() => { setSheet(false); setTour(null); setPlaying(false); setHome(true); }}
          onTheme={() => set({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
          onExit={exitPresent}
          onEndTour={() => { endTour(); setSheet(false); }}
          onClose={() => setSheet(false)}
        />
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
