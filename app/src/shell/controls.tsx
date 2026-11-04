/** Small controls of the prototype viewer (dark UI, independent of the phone theme). */
import { ReactNode } from 'react';
import { Icon } from '../ui/kit';
import { R } from '../theme';

export const GREEN = 'var(--accent-fg)';

/* ---------------- Small controls ---------------- */
export function Segmented<T extends string>({ value, options, onChange, label, hideLabel }: { value: T; options: [T, string][]; onChange: (v: T) => void; label: string; hideLabel?: boolean }) {
  return (
    <div className="field">
      {!hideLabel && <span className="side-label">{label}</span>}
      <div role="radiogroup" aria-label={label} className="seg" style={{ gridTemplateColumns: `repeat(${options.length},1fr)` }}>
        {options.map(([v, l]) => (
          <button key={v} role="radio" aria-checked={value === v} className={value === v ? 'on' : ''} onClick={() => onChange(v)}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Toggle({ on, label, hint, onChange }: { on: boolean; label: string; hint?: string; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={() => onChange(!on)} className="toggle">
      <span className={`switch${on ? ' on' : ''}`}><span /></span>
      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ font: R(13, 500), color: 'var(--fg)' }}>{label}</span>
        {hint && <span style={{ font: R(12), color: 'var(--fg3)' }}>{hint}</span>}
      </span>
    </button>
  );
}

export function Collapsible({ title, badge, open, onToggle, children, icon }: { title: string; badge?: ReactNode; open: boolean; onToggle: () => void; children: ReactNode; icon?: string }) {
  return (
    <div className="side-block">
      <button className="block-head" aria-expanded={open} onClick={onToggle}>
        {icon && <Icon name={icon} size={16} color="var(--fg3)" />}
        <span style={{ flex: 1 }}>{title}</span>
        {badge}
        <Icon name="chevronDown" size={16} color="var(--fg3)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
      </button>
      {open && <div className="block-body">{children}</div>}
    </div>
  );
}

export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const isTyping = (el: Element | null) => !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || (el as HTMLElement).isContentEditable);
