/** Presentation mode: phone only, full screen, with a floating bar to move and play guided flows. */
import { TouchEvent, useEffect, useRef } from 'react';
import { usePersistent } from '../persist';
import { MODULES, Module, TOURS, Tour } from '../registry';
import { Icon } from '../ui/kit';
import { canSpeak, speak, stop } from './narrator';

export const TOUR_STEP_MS = 6000;

export function PresentBar({ module, entry, tour, step, playing, index, total, onPrev, onNext, onPlay, onExit, onStep, onMenu, narration }: {
  module: Module; entry?: { code: string; title: string }; tour: Tour | null; step: number; playing: boolean; index: number; total: number;
  onPrev: () => void; onNext: () => void; onPlay: () => void; onExit: () => void; onStep: (i: number) => void;
  /** on a phone: the first button opens the screens sheet instead of leaving */
  onMenu?: () => void;
  /** what this screen does, read aloud when the 🔊 button is on */
  narration?: string;
}) {
  // narration: the device's Spanish voice reads each screen; in a guided flow, the next step comes when it finishes
  const [narrate, setNarrate] = usePersistent<boolean>('narrar', () => false);
  const voiceOn = narrate && !!narration && canSpeak();
  const flowRef = useRef({ tour, playing });
  flowRef.current = { tour, playing };
  // on a phone a sideways swipe on the bar moves to the previous / next screen; a hint shows until the first swipe
  const [swiped, setSwiped] = usePersistent<boolean>('swiped', () => false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (ev: TouchEvent) => { const t0 = ev.touches[0]; touch.current = { x: t0.clientX, y: t0.clientY }; };
  const onTouchEnd = (ev: TouchEvent) => {
    const s0 = touch.current;
    touch.current = null;
    if (!s0) return;
    const t1 = ev.changedTouches[0];
    const dx = t1.clientX - s0.x, dy = t1.clientY - s0.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    (dx < 0 ? onNext : onPrev)();
    if (!swiped) setSwiped(true);
  };
  // autoplay: next step every few seconds; stops on the last one.
  // The callback goes through a ref so re-renders don't restart the timer.
  const nextRef = useRef(onNext);
  nextRef.current = onNext;
  useEffect(() => {
    if (!tour || !playing || voiceOn) return;
    const id = window.setTimeout(() => nextRef.current(), TOUR_STEP_MS);
    return () => window.clearTimeout(id);
  }, [tour, playing, step, voiceOn]);
  useEffect(() => {
    if (!voiceOn || (tour && !playing)) return; // paused flow: silent
    let id = 0;
    speak(narration!, () => {
      const f = flowRef.current;
      if (f.tour && f.playing) id = window.setTimeout(() => nextRef.current(), 700);
    });
    return () => { window.clearTimeout(id); stop(); };
  }, [voiceOn, narration, playing]);

  const atStart = tour ? step <= 0 : index <= 0;
  const atEnd = tour ? step >= tour.steps.length - 1 : index < 0 || index >= total - 1;
  return (
    <div className="present-bar" role="toolbar" aria-label="Presentación" onTouchStart={onMenu ? onTouchStart : undefined} onTouchEnd={onMenu ? onTouchEnd : undefined}>
      {onMenu ? (
        <button className="pb-btn pb-menu" onClick={onMenu} aria-label="Pantallas" aria-haspopup="dialog">
          <Icon name="menu" size={20} color="var(--fg)" />
        </button>
      ) : (
        <button className="pb-btn" onClick={onExit} aria-label="Salir de la presentación" title="Salir (Esc)">
          <Icon name="close" size={16} color="var(--fg)" />
        </button>
      )}
      <button className="pb-btn" onClick={onPrev} disabled={atStart} aria-label="Pantalla anterior" title="Anterior (←)">
        <Icon name="chevronRight" size={18} color="var(--fg)" style={{ transform: 'rotate(180deg)' }} />
      </button>
      <div className="pb-info">
        <span className="pb-kicker pb-long">{tour ? `${tour.title} · ${step + 1} de ${tour.steps.length}` : `${MODULES[module].label} · ${index + 1} de ${total}`}</span>
        <span className="pb-title pb-long">{entry ? `${entry.code} · ${entry.title}` : 'Pantalla'}</span>
        <span className="pb-title pb-short" aria-hidden="true">{entry ? entry.title : 'Pantalla'}<small>{tour ? `${step + 1}/${tour.steps.length}` : `${index + 1}/${total}`}</small></span>
        {onMenu && !swiped && <span className="pb-hint" aria-hidden="true">‹ deslizá para pasar ›</span>}
        {tour && (
          <div className="pb-dots" role="tablist" aria-label="Pasos del recorrido">
            {tour.steps.map((k, i) => (
              <button key={k} role="tab" aria-selected={i === step} aria-label={`Paso ${i + 1}`} className={i === step ? 'on' : i < step ? 'done' : ''} onClick={() => onStep(i)}>
                {i === step && playing && !voiceOn && <span className="pb-fill" key={step} style={{ animationDuration: `${TOUR_STEP_MS}ms` }} />}
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
      {narration && canSpeak() && (
        <button className={`pb-btn pb-voice${narrate ? ' on' : ''}`} onClick={() => setNarrate((v) => !v)} aria-pressed={narrate} aria-label="Narrar cada pantalla" title={narrate ? 'Silenciar la narración' : 'Escuchar qué hace cada pantalla'}>
          <Icon name={narrate ? 'volumeOn' : 'volumeOff'} size={18} color="var(--fg)" />
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
