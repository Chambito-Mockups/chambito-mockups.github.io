/** Viewer side menu: one per module (Auto or Market) with its settings, search and screen index. */
import React, { useEffect, useState } from 'react';
import { Settings, useApp } from '../store';
import { Entry, MODULES, Module, Version, entriesOf, groupsIn } from '../registry';
import { Icon } from '../ui/kit';
import { R } from '../theme';
import { Collapsible, GREEN, Segmented, Toggle, norm } from './controls';
import { TourList } from './Presenter';
import { Tour } from '../registry';
import { clearDemo } from '../persist';

/* ---------------- Sidebar ---------------- */
/** a screen of the prototype, or «Componentes» (every design reference) */
export type Page = { kind: 'screen'; key: string } | { kind: 'integration' } | { kind: 'integrada' } | { kind: 'sistema' } | { kind: 'autov3' };

export function SideMenu({ module, page, onJump, onModule, query, setQuery, searchRef, onStartTour, version }: {
  module: Module; page: Page; onJump: (e: Entry) => void; onModule: (m: Module) => void; version: Version;
  query: string; setQuery: (q: string) => void; searchRef: React.RefObject<HTMLInputElement>; onStartTour: (t: Tour) => void;
}) {
  const { settings, set, go, autoRoot, resetTrip } = useApp();
  const [roleChanged, setRoleChanged] = useState(0);
  const [simOpen, setSimOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [allOpen, setAllOpen] = useState(false);
  useEffect(() => {
    if (roleChanged) go(autoRoot(), { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleChanged]);

  const flag = (k: keyof Settings, label: string, hint?: string) => <Toggle key={k} on={settings[k] as boolean} label={label} hint={hint} onChange={(v) => set({ [k]: v } as Partial<Settings>)} />;
  const autoFlags: [keyof Settings, string, string?][] = [
    ['simulate', 'Viaje en tiempo real', 'Avanza solo entre estados'],
    ['noDrivers', 'Sin conductores cerca', 'Propone ampliar el radio'],
    ['guest', 'Invitado', 'Pide sesión para ver el precio'],
    ['locationOff', 'Ubicación desactivada'],
    ['offline', 'Sin conexión'],
    ['otherService', 'Otro servicio en curso'],
    ['teams', 'Cuenta con Equipos', 'Barra de 5 destinos'],
    ['autoEnabled', 'Auto habilitado en la ciudad'],
  ];
  const marketFlags: [keyof Settings, string, string?][] = [
    ['almostEmpty', 'Tienda casi vacía', 'Pocas publicaciones cerca'],
    ['manualReview', 'Revisión manual al publicar', 'Publicar termina «En revisión»'],
    ['atLimit', '50 publicaciones activas', 'Muestra el límite al publicar'],
    ['guest', 'Invitado', 'Pide ingresar al consultar o guardar'],
    ['teams', 'Cuenta con Equipos', 'Cambia la barra inferior'],
  ];
  const flags = module === 'auto' ? autoFlags : marketFlags;
  const defaults: Partial<Settings> = { simulate: true, autoEnabled: true };
  const changed = flags.filter(([k]) => settings[k] !== (defaults[k] ?? false)).length;

  const q = norm(query.trim());
  const inV = (e: Entry) => !e.versions || e.versions.includes(version.id);
  const match = (e: Entry) => inV(e) && (!q || norm(`${e.code} ${e.title}`).includes(q));
  // only the groups of the chosen version (shared flows are in every version)
  const groups = groupsIn(module, version.id);
  const other: Module = module === 'auto' ? 'market' : 'auto';
  const hits = groups.reduce((n, g) => n + g.entries.filter(match).length, 0);
  const otherHits = q ? entriesOf(other).filter(match).length : 0;
  const results = q ? groups.flatMap((g) => (g.page ? [] : g.entries.filter(match))) : [];
  const [cursor, setCursor] = useState(0);

  return (
    <aside className="sidebar">
      <div className="side-top">
      <div className="module-intro">
        <span className="module-icon"><Icon name={MODULES[module].icon} size={20} color="#000000" /></span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ font: '700 16px Poppins, sans-serif', color: 'var(--fg)' }}>Chambito {MODULES[module].label}</span>
          <span style={{ font: R(12), color: 'var(--fg2)' }}>{MODULES[module].tagline}</span>
        </div>
      </div>

      <span className="v-now" style={{ '--v': version.color } as React.CSSProperties} title="Las versiones se eligen al lado del teléfono">
        <span className="v-chip">{version.id}</span>{version.label}
      </span>
      <div className="search-wrap">
        <div className={`search${q ? ' has-query' : ''}`}>
          <Icon name="search" size={18} color={q ? 'var(--accent-fg)' : 'var(--fg3)'} />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') { setQuery(''); (e.target as HTMLInputElement).blur(); }
              else if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, Math.max(0, results.length - 1))); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); }
              else if (e.key === 'Enter') { const hit = results[cursor] ?? results[0]; if (hit) onJump(hit); }
            }}
            placeholder={`Buscar en ${MODULES[module].label}…`}
            aria-label="Buscar pantalla"
            aria-controls="screen-nav"
            aria-activedescendant={q && results[cursor] ? `opt-${results[cursor].key}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button className="search-clear" aria-label="Borrar búsqueda" onClick={() => { setQuery(''); searchRef.current?.focus(); }}><Icon name="close" size={12} color="var(--fg2)" /></button>
          ) : (
            <kbd title="Atajo: /">/</kbd>
          )}
        </div>
        {q && (
          <div className="search-meta" role="status">
            <span>{hits === 0 ? 'Sin resultados' : `${hits} ${hits === 1 ? 'pantalla' : 'pantallas'}`}</span>
            {hits > 0 && <span className="search-keys"><kbd>↑</kbd><kbd>↓</kbd> elegir · <kbd>↵</kbd> abrir</span>}
          </div>
        )}
      </div>

      </div>

      {!q && (
        <div className="index-head">
          <span className="side-label">Pantallas</span>
          <button className="link-btn" onClick={() => { setAllOpen((v) => !v); setOpenGroups({}); }}>{allOpen ? 'Cerrar grupos' : 'Abrir todos'}</button>
        </div>
      )}
      <nav id="screen-nav" aria-label={`Pantallas de ${MODULES[module].label}`} className="screen-nav">
        {groups.map((g) => {
          if (g.page) return null; // reference pages are listed at the bottom
          const list = g.entries.filter(match);
          if (!list.length) return null;
          const hasCurrent = page.kind === 'screen' && g.entries.some((e) => e.key === page.key);
          // only the group of the current screen opens by default: the index fits without scrolling
          const isOpen = !!q || (openGroups[g.title] ?? (allOpen || hasCurrent));
          return (
            <div key={g.title} className="group">
              <button className="group-head" aria-expanded={isOpen} onClick={() => setOpenGroups((c) => ({ ...c, [g.title]: !isOpen }))}>
                {g.icon && <Icon name={g.icon} size={15} color={hasCurrent ? GREEN : 'var(--fg3)'} />}
                <span style={{ flex: 1 }}>{g.title}</span>
                <span className="count">{list.length}</span>
                <Icon name="chevronDown" size={14} color="var(--fg4)" style={{ transform: isOpen ? 'none' : 'rotate(-90deg)', transition: 'transform .15s' }} />
              </button>
              {isOpen && list.map((e) => {
                const on = page.kind === 'screen' && page.key === e.key;
                const active = !!q && results[cursor]?.key === e.key;
                return (
                  <button key={e.key} id={`opt-${e.key}`} className={`side-item${on ? ' on' : ''}${active ? ' active' : ''}`} aria-current={on ? 'true' : undefined} onClick={() => onJump(e)} onMouseEnter={() => q && setCursor(results.indexOf(e))}>
                    <span className="code"><Highlight text={e.code} q={q} /></span>
                    <span className="title"><Highlight text={e.title} q={q} /></span>
                  </button>
                );
              })}
            </div>
          );
        })}
        {q && hits === 0 && (
          <div className="empty">
            <Icon name="search" size={28} color="var(--fg4)" />
            <span>Nada en {MODULES[module].label} para «{query}».</span>
            {otherHits > 0 && <button onClick={() => onModule(other)}>Ver {otherHits} en {MODULES[other].label} →</button>}
          </div>
        )}
        {q && hits > 0 && otherHits > 0 && (
          <button className="other-hits" onClick={() => onModule(other)}>También {otherHits} en {MODULES[other].label} →</button>
        )}
      </nav>

      {/* who is using the app */}
      <div className="side-block">
        <div className="block-body" style={{ paddingTop: 14 }}>
          {module === 'auto' ? (
            <Segmented
              label="Ver la app como"
              value={settings.role}
              options={[['pasajero', 'Pasajero'], ['prestador', 'Nuevo'], ['conductor', 'Conductor']]}
              onChange={(v) => { set({ role: v }); resetTrip(); setRoleChanged((n) => n + 1); }}
            />
          ) : (
            <>
              <div className="field">
                <span className="side-label">Cuenta de vendedor</span>
                <select className="side-select" value={settings.sellerStatus} onChange={(e) => set({ sellerStatus: e.target.value as Settings['sellerStatus'] })} aria-label="Cuenta de vendedor">
                  <option value="verificado">Identidad verificada</option>
                  <option value="sin-verificar">Sin verificar</option>
                  <option value="en-revision">En revisión</option>
                  <option value="suspendido">Suspendida</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      <Collapsible title="Simular situaciones" icon="settings" open={simOpen} onToggle={() => setSimOpen((o) => !o)} badge={changed > 0 && <span className="pill">{changed} activa{changed > 1 ? 's' : ''}</span>}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>{flags.map(([k, l, h]) => flag(k, l, h))}</div>
      </Collapsible>

      {!q && <TourList module={module} onStart={onStartTour} />}



      {/* design references live in «Componentes» (top bar) */}
      <button
        className="reset-demo"
        onClick={() => { if (window.confirm('¿Borrar lo que guardaste en la demo (guardados, publicaciones, ajustes)?')) { clearDemo(); window.location.reload(); } }}
      >
        <Icon name="refresh" size={14} color="var(--fg3)" /> Restablecer demo
      </button>

      <div className="shortcuts">
        <span><kbd>←</kbd><kbd>→</kbd> anterior / siguiente</span>
        <span><kbd>/</kbd> buscar · <kbd>R</kbd> reiniciar · <kbd>P</kbd> presentar · <kbd>T</kbd> tema del teléfono</span>
      </div>
    </aside>
  );
}

/** Marks the part of `text` that matches the (normalized) query, ignoring accents and case. */
function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const chars = [...text];
  const flat = chars.map((c) => norm(c)).join('');
  const at = flat.indexOf(q);
  if (at < 0) return <>{text}</>;
  // map positions in the normalized string back to the original characters
  let pos = 0, from = -1, to = chars.length;
  for (let i = 0; i < chars.length; i++) {
    if (from < 0 && pos >= at) from = i;
    pos += norm(chars[i]).length;
    if (pos >= at + q.length) { to = i + 1; break; }
  }
  if (from < 0) return <>{text}</>;
  return <>{chars.slice(0, from).join('')}<mark>{chars.slice(from, to).join('')}</mark>{chars.slice(to).join('')}</>;
}
