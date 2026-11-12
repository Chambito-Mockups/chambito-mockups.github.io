/** On a phone: a simple home screen (Auto · Market · guided tours) and a sheet to jump to any screen. */
import { CSSProperties, useEffect, useState } from 'react';
import { MODULES, Module, TOURS, Tour } from '../registry';
import { Icon } from '../ui/kit';
import { norm } from './controls';

const MODULE_COLOR: Record<Module, string> = { auto: '#4BAC4F', market: '#F0A500' };
const HINT: Record<Module, string> = { auto: 'Pedir un viaje o manejar', market: 'Comprar y vender' };

/* ---------------- Home ---------------- */
export function MobileHome({ onModule, onTour }: { onModule: (m: Module) => void; onTour: (t: Tour) => void }) {
  const [tours, setTours] = useState(false);
  return (
    <main className="m-home">
      <header className="m-home-head">
        <img src="./pwa/icon-192.png" alt="" />
        <div>
          <span className="m-home-name">Chambito</span>
          <span className="m-home-sub">Prototipo</span>
        </div>
      </header>
      <h1 className="m-home-title">¿Qué querés ver?</h1>
      {(['auto', 'market'] as Module[]).map((m) => (
        <button key={m} className="m-card" style={{ '--m': MODULE_COLOR[m] } as CSSProperties} onClick={() => onModule(m)}>
          <span className="m-card-icon"><Icon name={MODULES[m].icon} size={24} color="#000000" /></span>
          <span className="m-card-text">
            <b>Chambito {MODULES[m].label}</b>
            <span>{HINT[m]}</span>
          </span>
          <Icon name="chevronRight" size={20} color="var(--fg3)" />
        </button>
      ))}
      <button className="m-card" aria-expanded={tours} onClick={() => setTours((o) => !o)}>
        <span className="m-card-icon m-play">▶</span>
        <span className="m-card-text">
          <b>Recorridos guiados</b>
          <span>Se pasan solos</span>
        </span>
        <Icon name="chevronDown" size={20} color="var(--fg3)" style={{ transform: tours ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
      </button>
      {tours && (
        <div className="m-tours">
          {TOURS.map((t) => (
            <button key={t.id} className="m-tour" onClick={() => onTour(t)} aria-label={`Presentar: ${t.title}`}>
              <span className="m-tour-dot" style={{ background: MODULE_COLOR[t.module] }} />
              <span className="m-tour-title">{t.title}</span>
              <span className="m-tour-n">{t.steps.length} pasos</span>
            </button>
          ))}
        </div>
      )}
      <p className="m-home-foot">En la computadora hay más opciones.</p>
    </main>
  );
}

/* ---------------- Screens sheet ---------------- */
/** a group of screens in the sheet: Market v3 (registry) or Auto v3 (its own list) */
export interface SheetGroup { title: string; icon?: string; entries: { key: string; code?: string; title: string }[] }

export function ScreensSheet({ module, groups: all, current, inTour, dark, onModule, onPick, onHome, onTheme, onExit, onEndTour, onClose }: {
  module: Module; groups: SheetGroup[]; current?: string; inTour: boolean; dark: boolean;
  onModule: (m: Module) => void; onPick: (key: string) => void; onHome: () => void; onTheme: () => void; onExit: () => void; onEndTour: () => void; onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [drag, setDrag] = useState<{ y0: number; dy: number } | null>(null);
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') { ev.stopPropagation(); onClose(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  const q = norm(query.trim());
  const groups = all
    .map((g) => ({ ...g, list: g.entries.filter((e) => !q || norm(`${e.code ?? ''} ${e.title}`).includes(q)) }))
    .filter((g) => g.list.length);

  return (
    <>
      <div className="m-scrim" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pantallas"
        className="m-sheet"
        style={drag && drag.dy > 0 ? { transform: `translateY(${drag.dy}px)`, transition: 'none' } : undefined}
      >
        {/* dragging the handle down closes the sheet */}
        <div
          className="m-handle-zone"
          onTouchStart={(ev) => setDrag({ y0: ev.touches[0].clientY, dy: 0 })}
          onTouchMove={(ev) => drag && setDrag({ ...drag, dy: ev.touches[0].clientY - drag.y0 })}
          onTouchEnd={() => { if (drag && drag.dy > 80) onClose(); setDrag(null); }}
        >
          <span className="m-handle" />
        </div>
        <div className="m-sheet-head">
          <div className="seg m-seg" role="radiogroup" aria-label="Módulo">
            {(['auto', 'market'] as Module[]).map((m) => (
              <button key={m} role="radio" aria-checked={module === m} className={module === m ? 'on' : ''} onClick={() => onModule(m)}>
                <Icon name={MODULES[m].icon} size={15} color={module === m ? MODULE_COLOR[m] : 'var(--fg3)'} />
                {MODULES[m].label}
              </button>
            ))}
          </div>
          <button className="m-close" aria-label="Cerrar" onClick={onClose}><Icon name="close" size={16} color="var(--fg)" /></button>
        </div>
        <label className="search m-search">
          <Icon name="search" size={18} color="var(--fg3)" />
          <input value={query} onChange={(ev) => setQuery(ev.target.value)} placeholder="Buscar pantalla" aria-label="Buscar pantalla" autoComplete="off" />
        </label>

        <div className="m-sheet-body">
          {inTour && (
            <button className="m-end-tour" onClick={onEndTour}>Terminar recorrido</button>
          )}
          {groups.map((g) => {
            const here = g.entries.some((e) => e.key === current);
            const isOpen = !!q || (open[g.title] ?? here);
            return (
              <div key={g.title} className="m-group">
                <button className="m-group-head" aria-expanded={isOpen} onClick={() => setOpen((c) => ({ ...c, [g.title]: !isOpen }))}>
                  {g.icon && <Icon name={g.icon} size={16} color={here ? 'var(--accent-fg)' : 'var(--fg3)'} />}
                  <span className="m-group-title">{g.title}</span>
                  <span className="m-count">{g.list.length}</span>
                  <Icon name="chevronDown" size={16} color="var(--fg3)" style={{ transform: isOpen ? 'none' : 'rotate(-90deg)', transition: 'transform .15s' }} />
                </button>
                {isOpen && g.list.map((e) => (
                  <button key={e.key} className={`m-item${e.key === current ? ' on' : ''}`} aria-current={e.key === current ? 'true' : undefined} onClick={() => onPick(e.key)}>
                    <span className="m-item-title">{e.title}</span>
                    {e.code && <span className="m-item-code">{e.code}</span>}
                  </button>
                ))}
              </div>
            );
          })}
          {!groups.length && <p className="m-empty">Nada con «{query}».</p>}
        </div>

        <div className="m-sheet-foot">
          <button onClick={onHome}><Icon name="home" size={18} color="var(--fg)" /><span>Inicio</span></button>
          <button onClick={onTheme}><Icon name={dark ? 'sun' : 'moon'} size={18} color="var(--fg)" /><span>{dark ? 'Claro' : 'Oscuro'}</span></button>
          <button onClick={onExit}><Icon name="layers" size={18} color="var(--fg)" /><span>Vista completa</span></button>
        </div>
      </div>
    </>
  );
}
