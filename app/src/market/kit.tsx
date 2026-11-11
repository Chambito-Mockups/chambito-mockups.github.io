import { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { useApp } from '../store';
import { P, R } from '../theme';
import { Icon, NavIconButton, TopBar } from '../ui/kit';
import { Category, CATEGORY_ICON, Listing, LISTINGS, priceFor, SELLERS, zoneLabel } from './data';
import { useMarket } from './state';
import { BottomSheet } from '../ui/sheets';

export const pretty = { textWrap: 'pretty' } as CSSProperties;
export const clamp2: CSSProperties = { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' };

/** Price in the current country's currency. */
export function useMoney() {
  const { d, settings } = useApp();
  return (gs: number) => d.currency(priceFor(gs, settings.country));
}
export function useZone() {
  const { settings } = useApp();
  return (l: Listing) => zoneLabel(l, settings.country);
}
export const listing = (id: string) => LISTINGS.find((l) => l.id === id) ?? LISTINGS[0];

/** Guest gate: looking is free; consult, save, publish and report ask to log in (M13). */
export function useRequireLogin() {
  const { settings, setOverlay } = useApp();
  const { setPendingAction } = useMarket();
  return (action: () => void, verb = 'consultar') => {
    if (!settings.guest) return action();
    setPendingAction(action, verb);
    setOverlay('guest');
  };
}

/* ---------- Screen shell: Tienda uses a white (light) / black (dark) background ---------- */
export function MScreen({ children, footer, style }: { children: ReactNode; footer?: ReactNode; style?: CSSProperties }) {
  const { t } = useApp();
  return (
    <div style={{ position: 'absolute', inset: 0, background: t.mBg, display: 'flex', flexDirection: 'column', paddingTop: 47 }}>
      <div className="scroll" style={{ flex: 1, overflowY: 'auto', minHeight: 0, ...style }}>{children}</div>
      {footer}
    </div>
  );
}

/** Sticky footer that holds the screen's single primary action. */
export function MFooter({ children, gap = 12 }: { children: ReactNode; gap?: number }) {
  const { t } = useApp();
  return <div style={{ flex: 'none', padding: '12px 20px 34px', background: t.mBg, display: 'flex', flexDirection: 'column', gap, borderTop: `1px solid ${t.name === 'dark' ? '#262626' : '#EBEBEB'}` }}>{children}</div>;
}

/** Market top bar: the shared TopBar in the flow of the screen. */
export function MTopBar({ title, onBack, backIcon = 'arrowLeft', right, sub }: { title?: string; onBack?: () => void; backIcon?: string; right?: ReactNode; sub?: ReactNode }) {
  return <TopBar title={title} onBack={onBack} backIcon={backIcon} right={right} sub={sub} />;
}

/** Round icon button: same component as the Auto top bars. */
export const RoundBtn = NavIconButton;

/* ---------- Photo placeholder (no real photos in the mock) ---------- */
/** Tint per category, so the mock photos read as different products at a glance. */
const CAT_TINT: Record<Category, [string, string]> = {
  Ropa: ['#E8A0BF', '#B5658A'],
  Tecnología: ['#8FB8ED', '#4A78B5'],
  Deportes: ['#9ED89F', '#4BAC4F'],
  Hogar: ['#F2C38B', '#C98A3C'],
  Otros: ['#C7B9E8', '#7E69B5'],
};

/**
 * Photo placeholder (the mock has no real photos). With `cat` it becomes a category
 * illustration: soft gradient in the category's tint and its icon; `ph` varies the angle.
 */
export function Photo({ ph = 0, radius = 16, ratio = 1, height, iconSize = 28, children, dim, style, cat }: { ph?: number; radius?: number; ratio?: number; height?: number; iconSize?: number; children?: ReactNode; dim?: boolean; style?: CSSProperties; cat?: Category }) {
  const { t } = useApp();
  const base: CSSProperties = { position: 'relative', width: '100%', aspectRatio: height ? undefined : String(ratio), height, borderRadius: radius, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', overflow: 'hidden', opacity: dim ? 0.55 : 1 };
  if (!cat)
    return (
      <div style={{ ...base, background: t.ph[ph % 3], ...style }}>
        <Icon name="image" size={iconSize} color={t.phIcon} />
        {children}
      </div>
    );
  const [a, b] = CAT_TINT[cat];
  const angle = [135, 200, 60][ph % 3];
  const dark = t.name === 'dark';
  return (
    <div role="img" aria-label={`Foto de ${cat.toLowerCase()}`} style={{ ...base, background: `linear-gradient(${angle}deg, ${a}${dark ? '55' : '88'}, ${b}${dark ? '33' : '55'}), ${t.ph[ph % 3]}`, ...style }}>
      <span aria-hidden style={{ position: 'absolute', width: '70%', aspectRatio: '1', borderRadius: '50%', background: `${a}${dark ? '22' : '44'}`, right: '-18%', top: '-18%' }} />
      <Icon name={CATEGORY_ICON[cat]} size={Math.round(iconSize * 1.25)} color={dark ? a : b} style={{ position: 'relative', opacity: 0.9 }} />
      {children}
    </div>
  );
}

export function Verified({ size = 12 }: { size?: number }) {
  const { t } = useApp();
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, flex: 'none' }}>
      <Icon name="shield" size={size + 2} color={t.success} />
      <span style={{ font: R(size, 500), color: t.success }}>Verificado</span>
    </span>
  );
}

export function StarRating({ value, size = 13 }: { value: string; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, flex: 'none' }}>
      <Icon name="star" size={size} />
      <span style={{ font: R(size, 500) }}>{value}</span>
    </span>
  );
}

export function HeartButton({ id, size = 32, onSurface }: { id: string; size?: number; onSurface?: boolean }) {
  const { t, showToast } = useApp();
  const { saved, toggleSaved } = useMarket();
  const gate = useRequireLogin();
  const on = saved.has(id);
  return (
    <button
      aria-label={on ? 'Quitar de Guardados' : 'Guardar'}
      aria-pressed={on}
      className="press"
      onClick={(e) => {
        e.stopPropagation();
        gate(() => showToast(toggleSaved(id) ? 'Guardado en ♥ Guardados' : 'Lo quitaste de Guardados'), 'guardar');
      }}
      style={{ width: size, height: size, borderRadius: size / 2, background: onSurface ? t.mChip : t.mBg === '#000000' ? '#1A1A1A' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}
    >
      <Icon name="heart" size={size > 40 ? 20 : 16} color={on ? t.error : t.text2} />
    </button>
  );
}

/* ---------- ListingCard (grid / rail) ---------- */
export function ListingCard({ l, width, onOpen }: { l: Listing; width?: number; onOpen: (l: Listing) => void }) {
  const { t } = useApp();
  const money = useMoney();
  const zone = useZone();
  const s = SELLERS[l.seller];
  return (
    <div role="link" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen(l)} onClick={() => onOpen(l)} className="press" style={{ display: 'flex', flexDirection: 'column', gap: 6, width, flex: width ? 'none' : undefined, cursor: 'pointer', minWidth: 0 }}>
      <Photo ph={l.ph} cat={l.category} dim={l.status === 'vendida'}>
        <span style={{ position: 'absolute', top: 8, right: 8 }}><HeartButton id={l.id} /></span>
        {l.status === 'vendida' && <SoldStrip small />}
        {l.status !== 'vendida' && l.stock === 0 && <SoldStrip small text="Sin stock" />}
      </Photo>
      <span style={{ font: P(16) }}>{money(l.price)}</span>
      <span style={{ font: R(14), height: 36, ...clamp2 }}>{l.title}</span>
      <span style={{ font: R(13), color: t.text2 }}>{zone(l)}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Verified />
        <StarRating value={s.rating} />
      </div>
    </div>
  );
}

export function SoldStrip({ small, text = 'Vendido' }: { small?: boolean; text?: string }) {
  return (
    <span style={{ position: 'absolute', left: 0, right: 0, top: small ? '42%' : '45%', background: '#000000', color: '#FFFFFF', font: P(small ? 13 : 16), textAlign: 'center', padding: small ? '4px 0' : '8px 0', letterSpacing: 0.5 }}>{text}</span>
  );
}

export function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span style={{ font: P(18) }}>{title}</span>
      {action && <button className="press" onClick={onAction} style={{ font: R(14, 500), color: t.link }}>{action}</button>}
    </div>
  );
}

export function SellerRow({ id, onClick, me }: { id: string; onClick?: () => void; me?: boolean }) {
  const { t } = useApp();
  const s = SELLERS[id];
  return (
    <button className="press" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, background: t.mSurface, textAlign: 'left', width: '100%' }}>
      <span style={{ width: 44, height: 44, borderRadius: 22, background: t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center', font: P(15), flex: 'none' }}>{me ? 'LG' : s.initials}</span>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ font: P(15) }}>{me ? 'Vos' : s.biz}</span>
          <Verified />
        </div>
        {!me && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <StarRating value={s.rating} />
            <span style={{ font: R(13), color: t.text2 }}>({s.reviews}) · {s.name} · Ver negocio</span>
          </div>
        )}
      </div>
      {onClick && <Icon name="chevronRight" size={18} color={t.text2} />}
    </button>
  );
}

/* ---------- Chips, tabs, segmented ---------- */
export function FilterChip({ children, selected, onClick, removable, icon }: { children: ReactNode; selected?: boolean; onClick?: () => void; removable?: boolean; icon?: string }) {
  const { t } = useApp();
  const fg = selected ? t.chipSelText : t.text;
  return (
    <button className="press" aria-pressed={selected} onClick={onClick} style={{ height: 36, borderRadius: 18, padding: '0 14px', background: selected ? t.chipSelBg : t.mSurface, color: fg, font: R(14, 500), display: 'flex', alignItems: 'center', gap: 6, flex: 'none', whiteSpace: 'nowrap' }}>
      {children}
      {icon && <Icon name={icon} size={14} color={fg} />}
      {removable && <Icon name="close" size={12} color={fg} />}
    </button>
  );
}

export function UnderlineTabs<T extends string>({ tabs, value, onChange, counts }: { tabs: T[]; value: T; onChange: (v: T) => void; counts?: Partial<Record<T, number>> }) {
  const { t } = useApp();
  return (
    <div role="tablist" className="scroll" style={{ display: 'flex', borderBottom: `1px solid ${t.name === 'dark' ? '#333333' : '#E0E0E0'}`, overflowX: 'auto', flex: 'none' }}>
      {tabs.map((k) => {
        const on = k === value;
        return (
          <button key={k} role="tab" aria-selected={on} onClick={() => onChange(k)} style={{ flex: tabs.length <= 2 ? 1 : 'none', padding: '12px 10px', textAlign: 'center', font: R(15, 500), color: on ? t.text : t.text2, borderBottom: `2px solid ${on ? t.green : 'transparent'}`, marginBottom: -1, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {k}
            {counts && counts[k] !== undefined && <span style={{ font: R(12, 500), color: on ? t.text : t.text2, background: t.mChip, borderRadius: 9, padding: '1px 7px' }}>{counts[k]}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) {
  const { t } = useApp();
  return (
    <div role="radiogroup" style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length},1fr)`, background: t.mChip, borderRadius: 20, padding: 4, gap: 4 }}>
      {options.map((o) => (
        <button key={o} role="radio" aria-checked={o === value} onClick={() => onChange(o)} style={{ height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', font: R(14, 500), background: o === value ? t.chipSelBg : 'transparent', color: o === value ? t.chipSelText : t.text2, transition: 'background .15s' }}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function StatusTag({ status }: { status: string }) {
  const { t } = useApp();
  const map: Record<string, [string, string]> = {
    Activa: [t.success, t.greenSoft],
    Pausada: [t.text2, t.mChip],
    'En revisión': [t.warn, 'rgba(255,181,71,0.16)'],
    Vendida: [t.chipSelText, t.chipSelBg],
    Rechazada: [t.error, t.name === 'dark' ? 'rgba(255,107,107,0.16)' : 'rgba(183,28,28,0.08)'],
    'Bajó de precio': [t.success, t.greenSoft],
    'Sin stock': [t.warn, 'rgba(255,181,71,0.16)'],
  };
  const [c, bg] = map[status] ?? [t.text2, t.mChip];
  return <span style={{ font: R(12, 500), color: c, background: bg, borderRadius: 10, padding: '2px 8px', alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>{status}</span>;
}

/* ---------- Skeletons (never a full-screen spinner) ---------- */
export function Skel({ w = '100%', h, r = 8, style }: { w?: number | string; h: number | string; r?: number; style?: CSSProperties }) {
  const { t } = useApp();
  return <span className="skel" style={{ display: 'block', width: w, height: h, borderRadius: r, background: t.mSurface, ...style }} />;
}

/** Shows `loading` for a short moment on mount, like a first fetch. */
export function useFirstLoad(ms = 650) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(id);
  }, [ms]);
  return loading;
}

/* ---------- Empty / info states ---------- */
export function EmptyBlock({ icon, title, text, children, tone }: { icon: string; title: string; text: string; children?: ReactNode; tone?: 'error' }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center', padding: '24px 8px' }}>
      <span style={{ width: 72, height: 72, borderRadius: 36, background: t.mSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={32} color={tone === 'error' ? t.error : t.icon} />
      </span>
      <span style={{ font: P(22), ...pretty }}>{title}</span>
      <span style={{ font: R(15), color: t.text2, maxWidth: 320, ...pretty }}>{text}</span>
      {children && <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>{children}</div>}
    </div>
  );
}

/* ---------- Bottom sheet overlay ---------- */
/** Market bottom sheet: the shared BottomSheet (Escape and the scrim close it). */
export const MSheet = BottomSheet;

export function InfoNote({ icon = 'info', children, tone = 'neutral' }: { icon?: string; children: ReactNode; tone?: 'neutral' | 'warn' | 'error' }) {
  const { t } = useApp();
  const c = tone === 'warn' ? t.warn : tone === 'error' ? t.error : t.text2;
  const bg = tone === 'error' ? (t.name === 'dark' ? 'rgba(255,107,107,0.12)' : 'rgba(183,28,28,0.08)') : tone === 'warn' ? 'rgba(255,181,71,0.14)' : t.mSurface;
  return (
    <div style={{ background: bg, borderRadius: 12, padding: 12, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <Icon name={icon} size={18} color={c} />
      <span style={{ font: R(14), color: tone === 'neutral' ? t.text2 : t.text, ...pretty }}>{children}</span>
    </div>
  );
}
