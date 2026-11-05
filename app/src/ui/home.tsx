/**
 * Inicio pieces for one app with three modules (Servicios, Auto, Market), for the client and
 * the provider. Taken from the three UI proposals (Opción 1, 2 y 3) and drawn with the theme
 * tokens, so they work in dark and light.
 *
 * Text on solid green is black (as the active tab): white on #4BAC4F does not reach AA.
 */
import { CSSProperties, ReactNode } from 'react';
import { useApp } from '../store';
import { P, R } from '../theme';
import { Icon } from './icon';
import { NavIconButton } from './nav';

const pretty = { textWrap: 'pretty' } as CSSProperties;

export type ModuleKey = 'servicios' | 'auto' | 'market';
export const MODULE_META: Record<ModuleKey, { label: string; icon: string }> = {
  servicios: { label: 'Servicios', icon: 'wrench' },
  auto: { label: 'Auto', icon: 'car' },
  market: { label: 'Market', icon: 'cart' },
};
const MODULE_KEYS: ModuleKey[] = ['servicios', 'auto', 'market'];

/* ---------- Header: title or greeting + notifications + messages ---------- */
export function HomeHeader({ title, sub, bell, chat, onBell, onChat }: { title: string; sub?: string; bell?: number; chat?: number; onBell?: () => void; onChat?: () => void }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <h2 style={{ margin: 0, font: P(sub ? 24 : 28), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h2>
        {sub && <span style={{ font: R(14), color: t.text2 }}>{sub}</span>}
      </div>
      <NavIconButton icon="bell" label="Notificaciones" bg={t.card} badge={bell} onClick={onBell} />
      <NavIconButton icon="messageCircle" label="Mensajes" bg={t.card} badge={chat} onClick={onChat} />
    </div>
  );
}

/* ---------- Module switcher: the three modules always at the top, one tap away ---------- */
export function ModuleSwitcher({ value, onChange, variant = 'pill', counts }: { value: ModuleKey; onChange: (m: ModuleKey) => void; variant?: 'pill' | 'tiles'; counts?: Partial<Record<ModuleKey, number>> }) {
  const { t } = useApp();
  const pill = variant === 'pill';
  return (
    <div role="tablist" aria-label="Módulos" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: pill ? 4 : 8, padding: pill ? 4 : 0, borderRadius: pill ? 26 : 0, background: pill ? t.card : 'transparent' }}>
      {MODULE_KEYS.map((m) => {
        const on = m === value;
        const c = on ? '#000000' : t.text;
        const n = counts?.[m];
        return (
          <button key={m} role="tab" aria-selected={on} className="press" onClick={() => onChange(m)}
            style={{ position: 'relative', height: pill ? 44 : 64, borderRadius: pill ? 22 : 18, background: on ? t.green : pill ? 'transparent' : t.card, display: 'flex', flexDirection: pill ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: pill ? 6 : 2, transition: 'background .2s' }}>
            <Icon name={MODULE_META[m].icon} size={pill ? 18 : 22} color={c} />
            <span style={{ font: R(pill ? 14 : 13, 500), color: c }}>{MODULE_META[m].label}</span>
            {!!n && <span aria-label={`${n} nuevas`} style={{ position: 'absolute', top: pill ? 4 : 6, right: pill ? 8 : 10, minWidth: 16, height: 16, borderRadius: 8, padding: '0 4px', boxSizing: 'border-box', background: on ? '#000000' : t.green, color: on ? t.green : '#000000', font: P(10), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Search and location ---------- */
export function SearchBar({ placeholder, onClick }: { placeholder: string; onClick?: () => void }) {
  const { t } = useApp();
  return (
    <button className="press" onClick={onClick} style={{ height: 48, borderRadius: 24, background: t.card, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', font: R(15), color: t.text2, width: '100%', textAlign: 'left' }}>
      <Icon name="search" size={18} color={t.text2} />
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{placeholder}</span>
    </button>
  );
}

export function LocationPicker({ value, onClick }: { value: string; onClick?: () => void }) {
  const { t } = useApp();
  return (
    <button className="press" onClick={onClick} aria-label={`Tu ubicación: ${value}`} style={{ height: 52, borderRadius: 18, background: t.card, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', width: '100%', textAlign: 'left' }}>
      <Icon name="mapPin" size={20} color={t.success} />
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={{ font: R(12, 500), color: t.text2 }}>Tu ubicación</span>
        <span style={{ font: R(14, 500) }}>{value}</span>
      </span>
      <Icon name="chevronDown" size={18} color={t.text2} />
    </button>
  );
}

/* ---------- Provider: stats card + availability ---------- */
export interface Stat { value: string; label: string; icon?: string }

/** Green card. With `person` it is the «Prestador destacado» header (Opción 1 y 2); without it, a stats row (Opción 3). */
export function ProviderCard({ person, stats, available = false, onAvailable, availableText = '', footer }: {
  person?: { name: string; initials: string; verified?: boolean }; stats: Stat[]; available?: boolean; onAvailable?: (v: boolean) => void; availableText?: string;
  /** replaces the single switch, e.g. with AvailabilitySummary (one switch per module) */
  footer?: ReactNode;
}) {
  const { t } = useApp();
  return (
    <div style={{ borderRadius: 24, overflow: 'hidden', background: t.card }}>
      <div style={{ background: t.green, color: '#000000', padding: person ? '16px 18px 14px' : '14px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {person && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ font: R(12, 500), opacity: 0.75 }}>Prestador destacado</span>
              <span style={{ font: P(18), ...pretty }}>{person.name}</span>
            </span>
            <span aria-hidden style={{ position: 'relative', width: 64, height: 64, borderRadius: 32, background: '#000000', color: t.green, font: P(22), display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', boxShadow: '0 0 0 3px rgba(255,255,255,.6)' }}>
              {person.initials}
              {person.verified && <span style={{ position: 'absolute', right: -2, bottom: -2, width: 22, height: 22, borderRadius: 11, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={14} color="#2F7A33" /></span>}
            </span>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length},minmax(0,1fr))`, borderTop: person ? '1px solid rgba(0,0,0,.15)' : 'none', paddingTop: person ? 12 : 0 }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, borderLeft: i ? '1px solid rgba(0,0,0,.15)' : 'none', padding: '0 6px', textAlign: 'center' }}>
              {s.icon && <Icon name={s.icon} size={18} color="#000000" />}
              <span style={{ font: P(22) }}>{s.value}</span>
              <span style={{ font: R(12) }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      {footer ?? (onAvailable && <button role="switch" aria-checked={available} onClick={() => onAvailable(!available)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', width: '100%', textAlign: 'left' }}>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: R(15, 500) }}>{available ? 'Disponible para trabajar' : 'No disponible'}</span>
          <span style={{ font: R(13), color: t.text2, ...pretty }}>{available ? availableText : 'No recibís pedidos nuevos.'}</span>
        </span>
        <span aria-hidden style={{ width: 50, height: 30, borderRadius: 15, background: available ? t.green : t.mChip, position: 'relative', transition: 'background .2s', flex: 'none' }}>
          <span style={{ position: 'absolute', top: 3, left: available ? 23 : 3, width: 24, height: 24, borderRadius: 12, background: '#FFFFFF', transition: 'left .2s' }} />
        </span>
      </button>)}
    </div>
  );
}

/* ---------- Sections ---------- */
export function SectionTitle({ title, action, onAction, caps }: { title: string; action?: string; onAction?: () => void; caps?: boolean }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <h3 style={{ margin: 0, font: caps ? R(12, 500) : P(17), letterSpacing: caps ? 0.8 : 0, textTransform: caps ? 'uppercase' : 'none', color: caps ? t.text2 : t.text }}>{title}</h3>
      {action && <button onClick={onAction} style={{ font: R(14, 500), color: t.success, display: 'flex', alignItems: 'center', gap: 2 }}>{action}<Icon name="chevronRight" size={14} color={t.success} /></button>}
    </div>
  );
}

export interface ModuleItem { key: string; icon: string; title: string; text: string; count?: number; highlight?: boolean; onClick?: () => void; /** «Nuevo», «Disponible en tu zona» */ tag?: string }

/** Three tiles side by side: «Oportunidades por módulo», «Tus módulos», «Pedir un servicio / viaje / Comprar». */
export function ModuleTiles({ items }: { items: ModuleItem[] }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length},minmax(0,1fr))`, gap: 8 }}>
      {items.map((it) => (
        <button key={it.key} className="press quick-tile" onClick={it.onClick} aria-label={`${it.title}: ${it.text}${it.tag ? `, ${it.tag}` : ''}`}
          style={{ position: 'relative', minHeight: 132, borderRadius: 18, padding: 12, background: it.highlight ? t.greenSoft : t.card, outline: it.highlight ? `1px solid ${t.green}` : 'none', outlineOffset: -1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, textAlign: 'left' }}>
          <Icon name={it.icon} size={26} color={t.success} />
          {it.tag && <span style={{ position: 'absolute', top: 10, right: 8, font: R(11, 500), color: '#000000', background: t.green, borderRadius: 8, padding: '1px 7px' }}>{it.tag}</span>}
          <span style={{ font: P(15), ...pretty }}>{it.title}</span>
          <span style={{ font: R(12), color: t.text2, flex: 1, ...pretty }}>{it.text}</span>
          <Icon name="chevronRight" size={16} color={t.text2} style={{ alignSelf: 'flex-end' }} />
        </button>
      ))}
    </div>
  );
}

/** Rows with icon, title and text; `count` puts the number in green («3 solicitudes cerca tuyo»). */
export function ModuleList({ items }: { items: ModuleItem[] }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((it) => (
        <button key={it.key} className="press" onClick={it.onClick} style={{ minHeight: 64, borderRadius: 18, padding: '10px 14px', background: t.card, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%' }}>
          <span style={{ width: 42, height: 42, borderRadius: 14, background: t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={it.icon} size={22} color={t.success} /></span>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ font: R(15, 500), display: 'flex', alignItems: 'center', gap: 6 }}>{it.title}{it.tag && <span style={{ font: R(11, 500), color: t.success, background: t.greenSoft, borderRadius: 8, padding: '1px 7px', whiteSpace: 'nowrap' }}>{it.tag}</span>}</span>
            <span style={{ font: R(13), color: t.text2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {it.count !== undefined && <b style={{ color: t.success, fontWeight: 700 }}>{it.count} </b>}{it.text}
            </span>
          </span>
          <Icon name="chevronRight" size={18} color={t.text2} />
        </button>
      ))}
    </div>
  );
}

/** Green banner with a big icon (Opción 1, cliente). */
export function PromoBanner({ title, text, icon, onClick }: { title: string; text: string; icon: string; onClick?: () => void }) {
  const { t } = useApp();
  return (
    <button className="press" onClick={onClick} style={{ borderRadius: 24, background: t.green, color: '#000000', padding: '18px 18px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%' }}>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: P(20), lineHeight: 1.15, ...pretty }}>{title}</span>
        <span style={{ font: R(14), ...pretty }}>{text}</span>
      </span>
      <span aria-hidden style={{ width: 72, height: 72, borderRadius: 22, background: 'rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={icon} size={40} color="#000000" /></span>
    </button>
  );
}

/** Big card per module with tag, title, text and a CTA (Opción 2, cliente). */
export function ModuleHero({ tag, title, text, cta, icon, green, onClick }: { tag: string; title: string; text: string; cta: string; icon: string; green?: boolean; onClick?: () => void }) {
  const { t } = useApp();
  const fg = green ? '#000000' : t.text;
  return (
    <div style={{ borderRadius: 24, background: green ? t.green : t.card, color: fg, padding: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
        <span style={{ font: R(12, 500), borderRadius: 10, padding: '2px 10px', background: green ? 'rgba(0,0,0,.14)' : t.mChip }}>{tag}</span>
        <span style={{ font: P(21), lineHeight: 1.1 }}>{title}</span>
        <span style={{ font: R(13), color: green ? fg : t.text2, ...pretty }}>{text}</span>
        <button className="press" onClick={onClick} style={{ marginTop: 4, height: 36, borderRadius: 18, padding: '0 14px', background: '#FFFFFF', color: '#000000', font: R(14, 500), display: 'flex', alignItems: 'center', gap: 6 }}>{cta}<Icon name="arrowLeft" size={14} color="#000000" style={{ transform: 'rotate(180deg)' }} /></button>
      </div>
      <span aria-hidden style={{ width: 84, height: 84, borderRadius: 42, background: green ? 'rgba(255,255,255,.35)' : t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={icon} size={44} color={green ? '#000000' : t.success} /></span>
    </div>
  );
}

/** Grid of popular trades (Opción 1, cliente). */
export function ServiceGrid({ items, onPick, columns }: { items: [icon: string, label: string][]; onPick?: (label: string) => void; columns?: number }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns ?? items.length},minmax(0,1fr))`, gap: 8 }}>
      {items.map(([icon, label]) => (
        <button key={label} className="press quick-tile" onClick={() => onPick?.(label)} style={{ height: 76, borderRadius: 16, background: t.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Icon name={icon} size={26} color={t.success} />
          <span style={{ font: R(12, 500), whiteSpace: 'nowrap' }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

/** Outlined quick actions (Opción 3, cliente: Favoritos · Promos · Historial). */
export function QuickChips({ items }: { items: { icon: string; label: string; onClick?: () => void }[] }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length},minmax(0,1fr))`, gap: 8 }}>
      {items.map((c) => (
        <button key={c.label} className="press" onClick={c.onClick} style={{ height: 44, borderRadius: 14, background: t.card, outline: `1px solid ${t.greenSoft}`, outlineOffset: -1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, font: R(13, 500) }}>
          <Icon name={c.icon} size={17} color={t.success} />{c.label}
        </button>
      ))}
    </div>
  );
}

/** Phone-sized frame for the reference page: content scrolls inside, the bottom bar stays. */
export function HomeFrame({ children, bar, label, docked, bleed }: {
  children: ReactNode; bar: ReactNode; label: string;
  /** bar fixed at the bottom edge instead of floating */
  docked?: boolean;
  /** content touches the edges (full-bleed map): no side padding or gap */
  bleed?: boolean;
}) {
  const { t } = useApp();
  return (
    <div role="group" aria-label={label} style={{ position: 'relative', width: 360, maxWidth: '100%', height: 740, borderRadius: 36, background: t.bg, color: t.text, overflow: 'hidden', outline: '1px solid var(--line2)', flex: 'none' }}>
      <div className="scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: bleed ? `0 0 ${docked ? 64 : 110}px` : `22px 16px ${docked ? 84 : 110}px`, display: 'flex', flexDirection: 'column', gap: bleed ? 0 : 14, boxSizing: 'border-box' }}>{children}</div>
      {!docked && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 112, background: `linear-gradient(to bottom, transparent, ${t.bg} 30%)`, pointerEvents: 'none' }} />}
      <div style={docked ? { position: 'absolute', left: 0, right: 0, bottom: 0 } : { position: 'absolute', left: 14, right: 14, bottom: 18 }}>{bar}</div>
    </div>
  );
}
