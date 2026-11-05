import { CSSProperties, ReactNode, useRef, useState } from 'react';
import { P, R } from '../theme';
import { useApp } from '../store';

import { Icon } from './icon';
import { TopBar } from './nav';

export { Icon } from './icon';
export { BrandPattern } from './pattern';
export { BottomNavBar, Dot, MenuGroup, MenuItem, NAV_META, NavIconButton, navItems, QuickAccess, TopBar } from './nav';
export type { NavBadges, NavKey, QuickTile } from './nav';

/* ---------- Device chrome ---------- */
export function StatusBar() {
  const { t } = useApp();
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 47, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px 0 38px', zIndex: 20, pointerEvents: 'none' }}>
      <span style={{ font: P(15), color: t.text }}>9:41</span>
      <span style={{ width: 25, height: 12, borderRadius: 4, border: `1.5px solid ${t.text}`, boxSizing: 'border-box', padding: 1.5, display: 'flex' }}>
        <span style={{ flex: 1, borderRadius: 2, background: t.text }} />
      </span>
    </div>
  );
}

export function HomeIndicator() {
  const { t } = useApp();
  return <div style={{ position: 'absolute', bottom: 8, left: 128, width: 134, height: 5, borderRadius: 3, background: t.text, zIndex: 40, pointerEvents: 'none' }} />;
}

/* ---------- Buttons ---------- */
type BtnKind = 'primary' | 'secondary' | 'danger' | 'disabled';
export function Button({ kind = 'primary', children, onClick, icon, height = 56, style, label }: { kind?: BtnKind; children: ReactNode; onClick?: () => void; icon?: string; height?: number; style?: CSSProperties; label?: string }) {
  const { t } = useApp();
  // TOKENS.json component.button: primary green with white text; secondary surface with border; no glow
  const bg = kind === 'primary' ? t.green : kind === 'danger' ? t.sosBg : kind === 'secondary' ? t.cardOnBg : t.btn2;
  const fg = kind === 'primary' ? t.onGreen : kind === 'danger' ? t.sosText : kind === 'disabled' ? t.text3 : t.text;
  return (
    <button
      className={`press btn btn-${kind}`}
      disabled={kind === 'disabled'}
      aria-label={label}
      onClick={onClick}
      style={{ height, borderRadius: height / 2, background: bg, color: fg, font: P(16), cursor: kind === 'disabled' ? 'not-allowed' : 'pointer', boxShadow: kind === 'secondary' ? `inset 0 0 0 1px ${t.border}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', ...style }}
    >
      {icon && <Icon name={icon} size={18} color={fg} />}
      {children}
    </button>
  );
}

export function LinkText({ children, onClick, size = 14, style }: { children: ReactNode; onClick?: () => void; size?: number; style?: CSSProperties }) {
  const { t } = useApp();
  return (
    <button onClick={onClick} className="press" style={{ font: R(size, 500), color: t.link, textAlign: 'left', ...style }}>
      {children}
    </button>
  );
}

export function CircleButton({ icon, onClick, size = 48, iconSize = 20, bg, style, label }: { icon: string; onClick?: () => void; size?: number; iconSize?: number; bg?: string; style?: CSSProperties; label?: string }) {
  const { t } = useApp();
  return (
    <button aria-label={label ?? icon} title={label} className="press" onClick={onClick} style={{ width: size, height: size, borderRadius: size / 2, background: bg ?? t.sheet, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', boxShadow: bg ? 'none' : t.name === 'dark' ? '0 4px 14px rgba(0,0,0,.5)' : '0 3px 12px rgba(0,0,0,.14)', ...style }}>
      <Icon name={icon} size={iconSize} />
    </button>
  );
}

/* ---------- Sheet ---------- */
export function Sheet({ children, gap = 16, bottomPad = 42, top, style }: { children: ReactNode; gap?: number; bottomPad?: number; top?: number; style?: CSSProperties }) {
  const { t } = useApp();
  return (
    <div className="sheet-in" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top, background: t.sheet, borderRadius: '24px 24px 0 0', padding: `8px 20px ${bottomPad}px`, display: 'flex', flexDirection: 'column', gap, zIndex: 10, boxShadow: t.name === 'dark' ? '0 -10px 30px rgba(0,0,0,.45)' : '0 -8px 24px rgba(0,0,0,.08)', ...style }}>
      <span style={{ alignSelf: 'center', width: 36, height: 4, borderRadius: 2, background: t.handle, flex: 'none' }} />
      {children}
    </div>
  );
}

export function StepProgress({ step, total, label }: { step: number; total: number; label?: string }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ font: R(13, 500), color: t.text2 }}>{label ?? `Paso ${step} de ${total}`}</span>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${total},1fr)`, gap: 4 }}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} style={{ height: 4, borderRadius: 2, background: i < step ? t.green : t.track, transition: 'background .3s' }} />
        ))}
      </div>
    </div>
  );
}

export function LinearProgress({ value, color, height = 4, track }: { value: number; color?: string; height?: number; track?: string }) {
  const { t } = useApp();
  return (
    <div style={{ height, borderRadius: height / 2, background: track ?? t.barTrack, overflow: 'hidden' }}>
      <div style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: '100%', background: color ?? t.green, transition: 'width .6s linear' }} />
    </div>
  );
}

/* ---------- Plate (Mercosur): always white with black text ---------- */
export function Plate({ text, size = 'lg' }: { text: string; size?: 'lg' | 'md' | 'sm' }) {
  const dims = { lg: { w: 164, h: 58, r: 8, band: 10, fs: text.length > 8 ? 24 : 26 }, md: { w: 150, h: 54, r: 8, band: 9, fs: text.length > 8 ? 22 : 24 }, sm: { w: 112, h: 40, r: 6, band: 7, fs: text.length > 8 ? 15 : 17 } }[size];
  return (
    <div style={{ width: dims.w, height: dims.h, borderRadius: dims.r, background: '#FFFFFF', border: '2px solid #000000', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 'none' }}>
      <span style={{ height: dims.band, background: '#000000', flex: 'none' }} />
      <span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', font: P(dims.fs), color: '#000000', letterSpacing: 1, whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  );
}

export function VehicleCard({ plate, make, detail, highlighted }: { plate: string; make: string; detail: string; highlighted?: boolean }) {
  const { t } = useApp();
  return (
    <div style={{ background: highlighted ? t.greenSoft : t.card, borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
      <Plate text={plate} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: P(16) }}>{make}</span>
        <span style={{ font: R(13), color: highlighted ? t.text : t.text2 }}>{detail}</span>
      </div>
    </div>
  );
}

/* ---------- Avatar, badges, chips ---------- */
export function Avatar({ initials, size = 48, bg }: { initials: string; size?: number; bg?: string }) {
  const { t } = useApp();
  return (
    <span style={{ width: size, height: size, borderRadius: size / 2, background: bg ?? t.well, display: 'flex', alignItems: 'center', justifyContent: 'center', font: P(size >= 72 ? 22 : 16), flex: 'none' }}>
      {initials}
    </span>
  );
}

export function IconCircle({ icon, size = 40, iconSize, bg }: { icon: string; size?: number; iconSize?: number; bg?: string }) {
  const { t } = useApp();
  return (
    <span style={{ width: size, height: size, borderRadius: size / 2, background: bg ?? t.chip, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
      <Icon name={icon} size={iconSize ?? Math.round(size / 2)} />
    </span>
  );
}

export function Badge({ children, tone = 'success', outline, size = 12 }: { children: ReactNode; tone?: 'success' | 'warn' | 'error'; outline?: boolean; size?: number }) {
  const { t } = useApp();
  const c = tone === 'success' ? t.success : tone === 'warn' ? t.warn : t.error;
  if (outline) return <span style={{ font: R(size, 500), color: c, border: `1px solid ${c}`, borderRadius: 10, padding: '1px 8px', alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>{children}</span>;
  return <span style={{ font: R(size, 500), color: c, background: t.greenSoft, borderRadius: 10, padding: size > 12 ? '3px 10px' : '2px 8px', alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>{children}</span>;
}

export function Chip({ children, icon, selected, outlined, onClick, iconColor }: { children: ReactNode; icon?: string; selected?: boolean; outlined?: boolean; onClick?: () => void; iconColor?: string }) {
  const { t } = useApp();
  return (
    <button
      className="press"
      onClick={onClick}
      style={{
        height: 36,
        borderRadius: 18,
        background: selected ? t.chipSelBg : t.chip,
        color: selected ? t.chipSelText : t.text,
        outline: outlined ? `2px solid ${t.green}` : 'none',
        outlineOffset: -2,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '0 14px',
        font: R(14, 500),
        flex: 'none',
        transition: 'background .15s, color .15s',
      }}
    >
      {icon && <Icon name={icon} size={16} color={iconColor ?? (selected ? t.chipSelText : t.icon)} />}
      {children}
    </button>
  );
}

export function ListRow({ icon, title, subtitle, trailing, onClick, pad = 8 }: { icon: string; title: string; subtitle?: string; trailing?: ReactNode; onClick?: () => void; pad?: number }) {
  const { t } = useApp();
  return (
    <button className="press" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: `${pad}px 0`, textAlign: 'left', width: '100%' }}>
      <IconCircle icon={icon} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ font: R(15, 500) }}>{title}</span>
        {subtitle && <span style={{ font: R(13), color: t.text2 }}>{subtitle}</span>}
      </div>
      {trailing}
    </button>
  );
}

export function SectionLabel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const { t } = useApp();
  return <span style={{ font: R(14, 500), color: t.text2, ...style }}>{children}</span>;
}

export function StatTile({ label, value, size = 16, onClick }: { label: string; value: string; size?: number; onClick?: () => void }) {
  const { t } = useApp();
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag className={onClick ? 'press' : undefined} onClick={onClick} style={{ background: t.card, borderRadius: size > 16 ? 16 : 12, padding: size > 16 ? 12 : '10px 12px', display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
      <span style={{ font: R(12), color: t.text2 }}>{label}</span>
      <span style={{ font: P(size) }}>{value}</span>
    </Tag>
  );
}

export function Banner({ children, icon = 'warning', tone = 'warn', style }: { children: ReactNode; icon?: string; tone?: 'warn' | 'error'; style?: CSSProperties }) {
  const { t } = useApp();
  const c = tone === 'warn' ? t.warn : t.error;
  return (
    <div style={{ background: t.card, borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 10, ...style }}>
      <Icon name={icon} size={18} color={c} />
      <span style={{ font: R(13, 500), color: c, textWrap: 'pretty' } as CSSProperties}>{children}</span>
    </div>
  );
}

/* ---------- PIN (read-only CodeInput) ---------- */
export function PinBoxes({ pin, size = 'sm' }: { pin: string; size?: 'sm' | 'lg' }) {
  const { t } = useApp();
  const d = size === 'sm' ? { w: 44, h: 56, r: 12, fs: 28, gap: 6 } : { w: 64, h: 76, r: 14, fs: 40, gap: 10 };
  return (
    <div style={{ display: 'flex', gap: d.gap }}>
      {pin.split('').map((c, i) => (
        <span key={i} style={{ width: d.w, height: d.h, borderRadius: d.r, background: t.chip, display: 'flex', alignItems: 'center', justifyContent: 'center', font: P(d.fs) }}>
          {c}
        </span>
      ))}
    </div>
  );
}

/* ---------- Stars (Rating) ---------- */
export function Stars({ value, onChange, size = 44 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', gap: 8 }} role="radiogroup" aria-label="Calificación">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} aria-label={`${n} estrellas`} className="press" onClick={() => onChange?.(n)} style={{ display: 'flex' }}>
          <Icon name="star" size={size} color={n <= value ? t.green : t.dividerStrong} />
        </button>
      ))}
    </div>
  );
}

/* ---------- SOS button ---------- */
export function SosButton({ onClick, sent, style }: { onClick?: () => void; sent?: boolean; style?: CSSProperties }) {
  const { t } = useApp();
  const [down, setDown] = useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        background: sent ? t.card : t.sosBg,
        color: sent ? t.error : t.sosText,
        font: P(15),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: down ? '4px solid rgba(255,107,107,0.35)' : 'none',
        ...style,
      }}
    >
      SOS
    </button>
  );
}

/* ---------- Slide to confirm ---------- */
export function SlideToConfirm({ label, onConfirm }: { label: string; onConfirm: () => void }) {
  const { t } = useApp();
  const track = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [drag, setDrag] = useState<null | number>(null);
  const max = () => (track.current ? track.current.clientWidth - 60 : 280);
  return (
    <div ref={track} style={{ position: 'relative', height: 60, borderRadius: 30, background: t.card, display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none', userSelect: 'none' }}>
      <span style={{ font: P(16), opacity: 1 - x / max() }}>{label}</span>
      <span
        role="button"
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onConfirm()}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          setDrag(e.clientX - x);
        }}
        onPointerMove={(e) => {
          if (drag === null) return;
          setX(Math.max(0, Math.min(max(), e.clientX - drag)));
        }}
        onPointerUp={() => {
          if (x > max() * 0.85) {
            setX(max());
            onConfirm();
          } else setX(0);
          setDrag(null);
        }}
        style={{ position: 'absolute', left: 4 + x, top: 4, width: 52, height: 52, borderRadius: 26, background: t.green, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab', transition: drag === null ? 'left .25s' : 'none' }}
      >
        <Icon name="chevronRight" size={22} color={t.onGreen} />
      </span>
    </div>
  );
}

/* ---------- Top chrome ---------- */
export function HubTopChrome({ onSearch, onProfile }: { onSearch?: () => void; onProfile?: () => void }) {
  const { t } = useApp();
  return (
    <div style={{ position: 'absolute', top: 55, left: 20, right: 20, display: 'flex', gap: 8, zIndex: 11 }}>
      <button className="press" onClick={onSearch} aria-label="Buscá tu lugar" style={{ flex: 1, height: 48, borderRadius: 24, background: t.sheet, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', font: R(15), color: t.text2, boxShadow: t.name === 'dark' ? '0 4px 14px rgba(0,0,0,.5)' : '0 3px 12px rgba(0,0,0,.14)' }}>
        <Icon name="search" size={18} color={t.text2} />
        Buscá tu lugar
      </button>
      <CircleButton icon="user" onClick={onProfile} label="Perfil" />
    </div>
  );
}

export function TrackingTopChrome({ label, onBack, onChat }: { label: string; onBack?: () => void; onChat?: () => void }) {
  const { t } = useApp();
  return (
    <div style={{ position: 'absolute', top: 55, left: 20, right: 20, display: 'flex', gap: 8, alignItems: 'center', zIndex: 11 }}>
      <CircleButton icon="arrowLeft" onClick={onBack} label="Atrás" />
      <span style={{ flex: 1, height: 48, borderRadius: 24, background: t.sheet, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, font: R(15, 500) }}>
        <span className="blink" style={{ width: 8, height: 8, borderRadius: 4, background: t.green }} />
        {label}
      </span>
      <CircleButton icon="messageCircle" onClick={onChat} label="Chat" />
    </div>
  );
}

/** Auto top bar: the shared TopBar, floating under the status bar. */
export function AppBar({ title, onBack, right }: { title?: string; onBack?: () => void; right?: ReactNode }) {
  const { t } = useApp();
  return <TopBar floating title={title} onBack={onBack} right={right} buttonBg={t.btn2} />;
}

export function LocationFab({ onClick }: { onClick?: () => void }) {
  const { t } = useApp();
  return (
    <button aria-label="Mi ubicación" className="press" onClick={onClick} style={{ position: 'absolute', top: -60, right: 20, width: 48, height: 48, borderRadius: 24, background: t.sheet, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="crosshair" size={22} />
    </button>
  );
}

/* Origin dot → destination square, used in trip summaries */
export function RouteSummary({ from, to, meta, gap = 8 }: { from: string; to: string; meta?: string; gap?: number }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: t.green, flex: 'none' }} />
        <span style={{ flex: 1, font: R(15, 500) }}>{from}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 10, height: 10, borderRadius: 2, background: t.map.dest, flex: 'none' }} />
        <span style={{ flex: 1, font: R(15, 500) }}>{to}</span>
        {meta && <span style={{ font: R(13), color: t.text2 }}>{meta}</span>}
      </div>
    </div>
  );
}

export function Row({ label, value, labelColor, valueColor, strong }: { label: string; value: string; labelColor?: string; valueColor?: string; strong?: boolean }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <span style={{ flex: 1, minWidth: 0, font: strong ? R(15, 500) : R(14), color: labelColor ?? (strong ? t.text : t.text2) }}>{label}</span>
      <span style={{ font: strong ? P(22) : R(14, 500), color: valueColor ?? t.text, whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}

