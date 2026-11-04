/** Toolbar above the phone (where you are, previous / next, reset) and the design notes beside it. */
import { ReactNode } from 'react';
import { useApp } from '../store';
import { Entry, GROUPS, MODULES, Module } from '../registry';
import { Icon } from '../ui/kit';
import { GREEN } from './controls';

/* ---------------- Toolbar + notes ---------------- */
export function ScreenToolbar({ module, entry, index, total, onPrev, onNext, onReset, onPresent }: { module: Module; entry?: Entry; index: number; total: number; onPrev: () => void; onNext: () => void; onReset: () => void; onPresent: () => void }) {
  const group = entry && GROUPS.find((g) => g.entries.some((e) => e.key === entry.key));
  return (
    <div className="toolbar">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span className="crumbs">{MODULES[module].label}{group ? ` › ${group.title}` : ''}</span>
        <h1>
          {entry ? <><span className="code-lg">{entry.code}</span> {entry.title}</> : 'Pantalla fuera del índice'}
        </h1>
      </div>
      <div className="tool-actions">
        {index >= 0 && <span className="pos">{index + 1} de {total}</span>}
        <button className="nav-btn" onClick={onPrev} disabled={index <= 0} aria-label="Pantalla anterior" title="Anterior (←)">
          <Icon name="chevronRight" size={18} color="var(--fg)" style={{ transform: 'rotate(180deg)' }} />
        </button>
        <button className="nav-btn" onClick={onNext} disabled={index < 0 || index >= total - 1} aria-label="Pantalla siguiente" title="Siguiente (→)">
          <Icon name="chevronRight" size={18} color="var(--fg)" />
        </button>
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
        <span><Icon name="mapPin" size={14} color="var(--fg3)" /> {settings.country === 'PY' ? 'Paraguay · Bancard o efectivo · Gs.' : 'Argentina · Mercado Pago · $'}</span>
        <span><Icon name="info" size={14} color="var(--fg3)" /> Tocá el teléfono: todo es interactivo.</span>
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
