/** Toolbar above the phone (where you are, previous / next, reset) and the design notes beside it. */
import { CSSProperties, ReactNode } from 'react';
import { useApp } from '../store';
import { Entry, GROUPS, MODULES, Module, Version } from '../registry';
import { Icon } from '../ui/kit';
import { GREEN } from './controls';

/* ---------------- Toolbar + notes ---------------- */
/**
 * Two rows: where you are (+ phone theme, reset, present) and the way through the menu: previous and
 * next with the name of the screen they open, and a progress bar of the position in the menu.
 */
export function ScreenToolbar({ module, version, entry, index, total, prevEntry, nextEntry, onPrev, onNext, onReset, onPresent }: {
  module: Module; version?: Version; entry?: Entry; index: number; total: number; prevEntry?: Entry; nextEntry?: Entry;
  onPrev: () => void; onNext: () => void; onReset: () => void; onPresent: () => void;
}) {
  const { settings, set } = useApp();
  const group = entry && GROUPS.find((g) => g.entries.some((e) => e.key === entry.key));
  const pct = index >= 0 && total > 1 ? (index / (total - 1)) * 100 : 0;
  return (
    <div className="toolbar">
      <div className="tool-row">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span className="crumbs">
            {version && <span className="v-chip" style={{ '--v': version.color } as CSSProperties} title={`${version.hint} · ${version.source}`}>{version.id} · {version.label}</span>}
            {MODULES[module].label}{group ? ` › ${group.title}` : ''}
          </span>
          <h1>
            {entry ? <><span className="code-lg">{entry.code}</span> {entry.title}</> : 'Pantalla fuera del índice'}
          </h1>
        </div>
        <div className="tool-actions">
          <div role="radiogroup" aria-label="Tema del teléfono" className="theme-seg" title="Tema del teléfono (T)">
            {(['dark', 'light'] as const).map((v) => (
              <button key={v} role="radio" aria-checked={settings.theme === v} aria-label={v === 'dark' ? 'Teléfono oscuro' : 'Teléfono claro'} className={settings.theme === v ? 'on' : ''} onClick={() => set({ theme: v })}>
                <span aria-hidden>{v === 'dark' ? '☾' : '☀'}</span>
              </button>
            ))}
          </div>
          <button className="ghost-btn" onClick={onReset} title="Volver a cargar esta pantalla con su estado inicial (R)">
            <Icon name="refresh" size={16} color="var(--fg)" />
            <span>Reiniciar</span>
          </button>
          <button className="primary-btn" onClick={onPresent} title="Teléfono a pantalla completa (P)">
            <span aria-hidden style={{ font: '700 12px Poppins, sans-serif' }}>▶</span>
            <span>Presentar</span>
          </button>
        </div>
      </div>
      <div className="tool-steps">
        <button className="step-btn" onClick={onPrev} disabled={!prevEntry} aria-label="Pantalla anterior" title={prevEntry ? `Anterior (←): ${prevEntry.code} · ${prevEntry.title}` : 'Es la primera pantalla'}>
          <Icon name="chevronLeft" size={18} color="var(--fg)" />
          <span className="step-text">{prevEntry ? <><b>{prevEntry.code}</b> {prevEntry.title}</> : 'Inicio del menú'}</span>
        </button>
        <div className="step-progress" aria-hidden={index < 0}>
          {index >= 0 && <span className="pos">{index + 1} de {total}</span>}
          <span className="bar"><span style={{ width: `${pct}%` }} /></span>
        </div>
        <button className="step-btn next" onClick={onNext} disabled={!nextEntry} aria-label="Pantalla siguiente" title={nextEntry ? `Siguiente (→): ${nextEntry.code} · ${nextEntry.title}` : 'Es la última pantalla'}>
          <span className="step-text">{nextEntry ? <><b>{nextEntry.code}</b> {nextEntry.title}</> : 'Fin del menú'}</span>
          <Icon name="chevronRight" size={18} color="var(--fg)" />
        </button>
      </div>
    </div>
  );
}

/** Big arrows on both sides of the phone: the same previous / next, closer to where you look. */
export function SideArrows({ prevEntry, nextEntry, onPrev, onNext }: { prevEntry?: Entry; nextEntry?: Entry; onPrev: () => void; onNext: () => void }) {
  return (
    <>
      <button className="side-arrow left" onClick={onPrev} disabled={!prevEntry} aria-label={prevEntry ? `Ir a la anterior: ${prevEntry.code} ${prevEntry.title}` : 'No hay pantalla anterior'} title={prevEntry ? `${prevEntry.code} · ${prevEntry.title}` : undefined}>
        <Icon name="chevronLeft" size={26} color="var(--fg)" />
      </button>
      <button className="side-arrow right" onClick={onNext} disabled={!nextEntry} aria-label={nextEntry ? `Ir a la siguiente: ${nextEntry.code} ${nextEntry.title}` : 'No hay pantalla siguiente'} title={nextEntry ? `${nextEntry.code} · ${nextEntry.title}` : undefined}>
        <Icon name="chevronRight" size={26} color="var(--fg)" />
      </button>
    </>
  );
}

export function NotesPanel({ entry, module }: { entry?: Entry; module: Module }) {
  const { screen, d, settings } = useApp();
  const pinHint = screen === 'D6' ? `PIN de la demo: ${d.pin}. También podés tipearlo con el teclado.` : null;
  return (
    <aside className="notes" aria-label="Notas de la pantalla">
      {entry ? (
        <>
          <NoteCard icon="edit" title="Qué cambia" accent>{entry.changes}</NoteCard>
          <NoteCard icon="link" title="Qué reutiliza">{entry.uses}</NoteCard>
        </>
      ) : (
        <NoteCard icon="info" title="Fuera del alcance">Esta pantalla no cambia con {MODULES[module].label}; se muestra como referencia.</NoteCard>
      )}
      {pinHint && <NoteCard icon="lock" title="Para probar">{pinHint}</NoteCard>}
      <div className="note-meta">
        <span><Icon name="mapPin" size={14} color="var(--fg3)" /> {settings.country === 'PY' ? 'Paraguay · Gs.' : 'Argentina · $'}</span>
      </div>
    </aside>
  );
}
function NoteCard({ icon, title, children, accent }: { icon: string; title: string; children: ReactNode; accent?: boolean }) {
  return (
    <div className={`note-card${accent ? ' accent' : ''}`}>
      <span className="note-title"><Icon name={icon} size={14} color={accent ? GREEN : 'var(--fg2)'} />{title}</span>
      <p>{children}</p>
    </div>
  );
}
