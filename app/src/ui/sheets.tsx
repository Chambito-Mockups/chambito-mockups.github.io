/** Bottom sheets shared by Auto and Market. */
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useApp } from '../store';
import { P, R } from '../theme';
import { Icon } from './icon';

/** Modal bottom sheet over the phone. Escape and the scrim close it. */
export function BottomSheet({ children, onClose, label, title }: { children: ReactNode; onClose: () => void; label: string; title?: string }) {
  const { t } = useApp();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <>
      <div className="fade-in" data-testid="sheet-scrim" onClick={onClose} style={{ position: 'absolute', inset: 0, background: t.scrimDialog, zIndex: 50 }} />
      <div role="dialog" aria-modal aria-label={label} className="sheet-in scroll" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: t.mBg === '#000000' ? '#1A1A1A' : '#FFFFFF', borderRadius: '24px 24px 0 0', padding: '8px 20px 34px', display: 'flex', flexDirection: 'column', gap: 16, zIndex: 51, maxHeight: '88%', overflowY: 'auto', boxShadow: '0 -10px 30px rgba(0,0,0,.3)' }}>
        <span style={{ alignSelf: 'center', width: 36, height: 4, borderRadius: 2, background: t.handle, flex: 'none' }} />
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ flex: 1, font: P(20) }}>{title}</span>
            <button aria-label="Cerrar" className="press" onClick={onClose} style={{ width: 36, height: 36, borderRadius: 18, background: t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="close" size={16} />
            </button>
          </div>
        )}
        {children}
      </div>
    </>
  );
}

interface Msg { id: number; me: boolean; text: string }

/**
 * Masked in-trip chat: quick replies, free text, and an automatic answer (demo).
 * Used by the passenger (with the driver) and the driver (with the passenger).
 */
export function QuickChatSheet({ name, initials, replies, answer, onClose }: { name: string; initials: string; replies: string[]; answer: (text: string) => string; onClose: () => void }) {
  const { t } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => { list.current?.scrollTo?.({ top: list.current.scrollHeight }); }, [msgs, typing]);
  const send = (s: string) => {
    const v = s.trim();
    if (!v) return;
    setMsgs((m) => [...m, { id: m.length, me: true, text: v }]);
    setText('');
    setTyping(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: m.length, me: false, text: answer(v) }]);
    }, 1100);
  };
  return (
    <BottomSheet onClose={onClose} label={`Chat con ${name}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 44, height: 44, borderRadius: 22, background: t.well, display: 'flex', alignItems: 'center', justifyContent: 'center', font: P(15), flex: 'none' }}>{initials}</span>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ font: P(16) }}>{name}</span>
          <span style={{ font: R(12), color: t.text2 }}>{typing ? 'Escribiendo…' : 'Chat protegido · tu número no se comparte'}</span>
        </div>
        <button aria-label="Cerrar chat" className="press" onClick={onClose} style={{ width: 36, height: 36, borderRadius: 18, background: t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={16} />
        </button>
      </div>
      <div ref={list} role="log" aria-live="polite" className="scroll" style={{ minHeight: 120, maxHeight: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msgs.length === 0 && <span style={{ font: R(14), color: t.text2, textAlign: 'center', padding: '24px 0' }}>Elegí una respuesta rápida o escribí un mensaje.</span>}
        {msgs.map((m) => (
          <span key={m.id} className="pop-in" style={{ alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '80%', background: m.me ? t.greenSoft : t.mChip, borderRadius: m.me ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '8px 12px', font: R(14) }}>{m.text}</span>
        ))}
        {typing && <span aria-label="Escribiendo" style={{ alignSelf: 'flex-start', background: t.mChip, borderRadius: 16, padding: '8px 14px', font: P(14), letterSpacing: 2 }} className="blink">•••</span>}
      </div>
      <div className="scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -20px', padding: '0 20px' }}>
        {replies.map((r) => (
          <button key={r} className="press" onClick={() => send(r)} style={{ flex: 'none', height: 36, borderRadius: 18, padding: '0 14px', background: t.mChip, font: R(14, 500), whiteSpace: 'nowrap' }}>{r}</button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(text); }} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribí un mensaje" aria-label="Mensaje" style={{ flex: 1, height: 44, borderRadius: 22, background: t.mChip, padding: '0 16px', font: R(15), color: t.text }} />
        <button type="submit" aria-label="Enviar" disabled={!text.trim()} className="press" style={{ width: 44, height: 44, borderRadius: 22, background: text.trim() ? t.green : t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: text.trim() ? 'pointer' : 'not-allowed' }}>
          <Icon name="send" size={18} color={text.trim() ? '#000000' : t.text3} />
        </button>
      </form>
    </BottomSheet>
  );
}

/** Simple choice list inside a sheet (payment method, country…). */
export function ChoiceList<T extends string>({ options, value, onChange }: { options: { value: T; label: string; hint?: string; icon?: string }[]; value: T; onChange: (v: T) => void }) {
  const { t } = useApp();
  return (
    <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} role="radio" aria-checked={on} className="press" onClick={() => onChange(o.value)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 16, background: t.mSurface, outline: on ? `2px solid ${t.green}` : 'none', outlineOffset: -2, textAlign: 'left' }}>
            {o.icon && <Icon name={o.icon} size={20} />}
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ font: R(15, 500) }}>{o.label}</span>
              {o.hint && <span style={{ font: R(13), color: t.text2 }}>{o.hint}</span>}
            </span>
            <span style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${on ? t.green : t.dividerStrong}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {on && <span style={{ width: 10, height: 10, borderRadius: 5, background: t.green }} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** On/off row inside a sheet. */
export function SwitchRow({ label, hint, on, onChange }: { label: string; hint?: string; on: boolean; onChange: (v: boolean) => void }) {
  const { t } = useApp();
  return (
    <button role="switch" aria-checked={on} onClick={() => onChange(!on)} className="press" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 16, background: t.mSurface, textAlign: 'left', width: '100%' }}>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={{ font: R(15, 500) }}>{label}</span>
        {hint && <span style={{ font: R(13), color: t.text2 }}>{hint}</span>}
      </span>
      <span style={{ width: 44, height: 26, borderRadius: 13, background: on ? t.green : t.dividerStrong, padding: 3, boxSizing: 'border-box', transition: 'background .15s', flex: 'none' }}>
        <span style={{ display: 'block', width: 20, height: 20, borderRadius: 10, background: on ? '#000000' : '#FFFFFF', transform: `translateX(${on ? 18 : 0}px)`, transition: 'transform .15s' }} />
      </span>
    </button>
  );
}
