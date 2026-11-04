/** Presentation mode: phone only, full screen, with a floating bar to move and play guided flows. */
import { useEffect, useRef } from 'react';
import { Entry, MODULES, Module, TOURS, Tour } from '../registry';
import { Icon } from '../ui/kit';

export const TOUR_STEP_MS = 6000;

export function PresentBar({ module, entry, tour, step, playing, index, total, onPrev, onNext, onPlay, onExit, onStep }: {
  module: Module; entry?: Entry; tour: Tour | null; step: number; playing: boolean; index: number; total: number;
  onPrev: () => void; onNext: () => void; onPlay: () => void; onExit: () => void; onStep: (i: number) => void;
}) {
  // autoplay: next step every few seconds; stops on the last one.
  // The callback goes through a ref so re-renders don't restart the timer.
  const nextRef = useRef(onNext);
  nextRef.current = onNext;
  useEffect(() => {
    if (!tour || !playing) return;
    const id = window.setTimeout(() => nextRef.current(), TOUR_STEP_MS);
    return () => window.clearTimeout(id);
  }, [tour, playing, step]);

  const atStart = tour ? step <= 0 : index <= 0;
  const atEnd = tour ? step >= tour.steps.length - 1 : index < 0 || index >= total - 1;
  return (
    <div className="present-bar" role="toolbar" aria-label="Presentación">
      <button className="pb-btn" onClick={onExit} aria-label="Salir de la presentación" title="Salir (Esc)">
        <Icon name="close" size={16} color="var(--fg)" />
      </button>
      <button className="pb-btn" onClick={onPrev} disabled={atStart} aria-label="Pantalla anterior" title="Anterior (←)">
        <Icon name="chevronRight" size={18} color="var(--fg)" style={{ transform: 'rotate(180deg)' }} />
      </button>
      <div className="pb-info">
        <span className="pb-kicker">{tour ? `${tour.title} · ${step + 1} de ${tour.steps.length}` : `${MODULES[module].label} · ${index + 1} de ${total}`}</span>
        <span className="pb-title">{entry ? `${entry.code} · ${entry.title}` : 'Pantalla'}</span>
        {tour && (
          <div className="pb-dots" role="tablist" aria-label="Pasos del recorrido">
            {tour.steps.map((k, i) => (
              <button key={k} role="tab" aria-selected={i === step} aria-label={`Paso ${i + 1}`} className={i === step ? 'on' : i < step ? 'done' : ''} onClick={() => onStep(i)}>
                {i === step && playing && <span className="pb-fill" key={step} style={{ animationDuration: `${TOUR_STEP_MS}ms` }} />}
              </button>
            ))}
          </div>
        )}
      </div>
      {tour && (
        <button className="pb-btn pb-play" onClick={onPlay} aria-label={playing ? 'Pausar' : 'Reproducir'} title={playing ? 'Pausar (espacio)' : 'Reproducir (espacio)'}>
          {playing ? <span style={{ font: '700 13px Poppins, sans-serif', color: '#000000' }}>❚❚</span> : <span style={{ font: '700 14px Poppins, sans-serif', color: '#000000', marginLeft: 2 }}>▶</span>}
        </button>
      )}
      <button className="pb-btn" onClick={onNext} disabled={atEnd} aria-label="Pantalla siguiente" title="Siguiente (→)">
        <Icon name="chevronRight" size={18} color="var(--fg)" />
      </button>
    </div>
  );
}

/** List of guided flows for the current module, shown in the side menu. */
export function TourList({ module, onStart }: { module: Module; onStart: (t: Tour) => void }) {
  const tours = TOURS.filter((t) => t.module === module);
  return (
    <div className="tours">
      <span className="side-label" style={{ padding: '0 10px' }}>Recorridos guiados</span>
      {tours.map((t) => (
        <button key={t.id} className="tour-item" onClick={() => onStart(t)} aria-label={`Presentar: ${t.title}`}>
          <span className="tour-play"><span style={{ color: '#000000', font: '700 11px Poppins, sans-serif', marginLeft: 2 }}>▶</span></span>
          <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ font: '500 13px Roboto, sans-serif', color: 'var(--fg)' }}>{t.title}</span>
            <span style={{ font: '400 12px Roboto, sans-serif', color: 'var(--fg3)' }}>{t.hint} · {t.steps.length} pasos</span>
          </span>
        </button>
      ))}
    </div>
  );
}
