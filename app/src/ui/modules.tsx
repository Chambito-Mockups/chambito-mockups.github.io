/**
 * Pieces from the «Cliente y Prestador» mockup that were missing: brand header, back header,
 * online card + stats, availability list, Auto home (route map, place shortcuts), Market home
 * (categories, launch carousel, product cards) and the entry tiles of Inicio.
 */
import { CSSProperties, ReactNode, useState } from 'react';
import { useApp } from '../store';
import { P, R } from '../theme';
import { Icon } from './icon';
import { NavIconButton } from './nav';
import { MODULE_META, ModuleKey } from './home';
import type { Availability } from './hub';

const pretty = { textWrap: 'pretty' } as CSSProperties;
const MODULES: ModuleKey[] = ['servicios', 'auto', 'market'];

/* ---------- Headers ---------- */
/** Official horizontal logo (brand kit) and the bell. Only in Inicio: the logo is not repeated inside. */
export function BrandHeader({ bell, onBell, right }: { bell?: number; onBell?: () => void; right?: ReactNode }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 48 }}>
      <img src={t.name === 'dark' ? './brand/chambito-horizontal-blanco.png' : './brand/chambito-horizontal.png'} alt="Chambito" height={32} style={{ height: 32, width: 'auto', display: 'block' }} />
      <span style={{ flex: 1 }} />
      {right}
      <NavIconButton icon="bell" label="Notificaciones" bg={t.mChip} badge={bell} onClick={onBell} size={40} />
    </div>
  );
}

/** Top bar of a module screen: round back button of 40 and the title in Poppins Bold 18 (appBar). */
export function BackHeader({ title, onBack, right, floating }: { title: string; onBack: () => void; right?: ReactNode; floating?: boolean }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 56, ...(floating ? { position: 'absolute', top: 12, left: 20, right: 20, zIndex: 2 } : {}) }}>
      <NavIconButton icon="arrowLeft" label="Atrás" bg={floating ? t.sheet : t.mChip} size={40} onClick={onBack} />
      <h2 style={{ flex: 1, margin: 0, font: P(18), ...(floating ? { background: t.sheet, borderRadius: 20, height: 40, display: 'flex', alignItems: 'center', padding: '0 16px', boxShadow: t.shadowCard } : {}) }}>{title}</h2>
      {right}
    </div>
  );
}

/** Informative notice: neutral grey (there is no «info» blue nor green for information), radius 12, padding 12. */
export function InfoBanner({ icon = 'info', children }: { icon?: string; children: ReactNode }) {
  const { t } = useApp();
  return (
    <div role="note" style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12, background: t.mChip, padding: 12 }}>
      <Icon name={icon} size={20} color={t.text2} />
      <span style={{ font: R(14), color: t.text, ...pretty }}>{children}</span>
    </div>
  );
}

/** Visual switch from TOKENS selection.*: 52 × 32, white thumb 24; on green 700 (light) / brand green (dark), off border.default. */
export function SwitchTrack({ on }: { on: boolean }) {
  const { t } = useApp();
  return (
    <span aria-hidden style={{ width: 52, height: 32, borderRadius: 16, background: on ? t.switchOn : t.border, position: 'relative', transition: 'background .2s', flex: 'none' }}>
      <span style={{ position: 'absolute', top: 4, left: on ? 24 : 4, width: 24, height: 24, borderRadius: 12, background: '#FFFFFF', transition: 'left .2s' }} />
    </span>
  );
}

/** Status badge: pill of 24 with a dot of 8; «live» pulses (en curso / buscando / en línea). */
export function StatusBadge({ tone = 'live', children }: { tone?: 'live' | 'done' | 'off'; children: ReactNode }) {
  const { t } = useApp();
  const [bg, fg, dot] = tone === 'off' ? [t.mChip, t.text2, t.text3] : [t.greenSoft, t.success, t.green];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 24, borderRadius: 12, padding: '0 10px', background: bg, color: fg, font: R(12, 500), whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>
      <span className={tone === 'live' ? 'blink' : undefined} style={{ width: 8, height: 8, borderRadius: 4, background: dot }} />
      {children}
    </span>
  );
}

/* ---------- Entry tiles of the client's Inicio ---------- */
export interface EntryTile { key: ModuleKey; title: string; text: string; onClick: () => void; tag?: string }
/** Three cards on the surface (green is the signal, not decoration): icon in a 40 box, title and one line. */
export function EntryTiles({ items }: { items: EntryTile[] }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length},minmax(0,1fr))`, gap: 8 }}>
      {items.map((it) => (
        <button key={it.key} className="press quick-tile" onClick={it.onClick} aria-label={`${it.title}: ${it.text}${it.tag ? `, ${it.tag}` : ''}`}
          style={{ position: 'relative', minHeight: 120, borderRadius: 16, background: t.cardOnBg, boxShadow: t.shadowCard, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, textAlign: 'left' }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={MODULE_META[it.key].icon} size={24} color={t.iconBrand} /></span>
          {it.tag && <span style={{ position: 'absolute', top: 12, right: 10, font: R(12, 500), color: t.success, background: t.greenSoft, borderRadius: 12, padding: '2px 8px' }}>{it.tag}</span>}
          <span style={{ font: R(15, 500) }}>{it.title}</span>
          <span style={{ font: R(12), color: t.text2, ...pretty }}>{it.text}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- Provider: availability card, stats, availability list ---------- */
/** Availability on the surface with a live badge and the switch; the link opens Disponibilidad. */
export function OnlineCard({ value, onChange, onManage }: { value: Availability; onChange: (v: Availability) => void; onManage: () => void }) {
  const { t } = useApp();
  const n = MODULES.filter((k) => value[k]).length;
  const online = n > 0;
  const all = (v: boolean): Availability => ({ servicios: v, auto: v, market: v });
  return (
    <div style={{ borderRadius: 16, background: t.cardOnBg, boxShadow: t.shadowCard, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ font: P(16) }}>Disponibilidad</span>
          <StatusBadge tone={online ? 'live' : 'off'}>{online ? 'En línea' : 'Fuera de línea'}</StatusBadge>
        </span>
        <button role="switch" aria-checked={online} aria-label="En línea" onClick={() => onChange(all(!online))} style={{ minWidth: 48, minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <SwitchTrack on={online} />
        </button>
      </div>
      <span style={{ font: R(13), color: t.text2 }}>{online ? 'Recibís oportunidades cerca tuyo.' : 'Fuera de línea · no recibís oportunidades'}</span>
      <button onClick={onManage} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 4, minHeight: 32, font: R(14, 500), color: t.link }}>
        {online ? `En ${n} de 3 módulos · Elegir módulos` : 'Elegir en qué módulos'}
        <Icon name="chevronRight" size={16} color={t.link} />
      </button>
    </div>
  );
}

/** Figures in Poppins Bold (cifra destacada) on the surface; the rating star in the favourite amber. */
export function StatRow({ stats }: { stats: { value: string; label: string; icon?: string }[] }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length},minmax(0,1fr))`, gap: 8 }}>
      {stats.map((s) => (
        <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, borderRadius: 16, background: t.cardOnBg, boxShadow: t.shadowCard, padding: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, font: P(22), color: t.text, fontVariantNumeric: 'tabular-nums' }}>{s.icon && <Icon name={s.icon} size={20} color={t.favorite} />}{s.value}</span>
          <span style={{ font: R(12, 500), color: t.text2 }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

const AVAIL_ROWS: Record<ModuleKey, [title: string, text: string]> = {
  servicios: ['Servicios', 'Recibir solicitudes de tus rubros.'],
  auto: ['Auto', 'Recibir viajes de pasajeros.'],
  market: ['Market (Entregas)', 'Recibir pedidos y entregas.'],
};
/** One grouped list with a switch per module (Disponibilidad screen). */
export function AvailabilityList({ value, onChange }: { value: Availability; onChange: (v: Availability) => void }) {
  const { t } = useApp();
  return (
    <div role="group" aria-label="Módulos en los que trabajás" style={{ display: 'flex', flexDirection: 'column', borderRadius: 16, background: t.cardOnBg, boxShadow: t.shadowCard, overflow: 'hidden' }}>
      {MODULES.map((k, i) => {
        const on = value[k];
        const [title, text] = AVAIL_ROWS[k];
        return (
          <button key={k} role="switch" aria-checked={on} aria-label={title} onClick={() => onChange({ ...value, [k]: !on })} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 72, padding: '12px 16px', textAlign: 'left', width: '100%', borderTop: i ? `1px solid ${t.borderSubtle}` : 'none' }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: on ? t.greenSoft : t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={MODULE_META[k].icon} size={24} color={on ? t.iconBrand : t.text3} /></span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ font: R(15, 500) }}>{title}</span>
              <span style={{ font: R(13), color: t.text2 }}>{text}</span>
            </span>
            <SwitchTrack on={on} />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Auto ---------- */
/** Mock map in the prototype map colours: route in green, pickup = green drop with a white dot (mapPin),
 * destination = the drop in map.dest with a square (as in Auto), and the car. */
const PIN = 'M0,0 C-3,-7 -12,-13 -12,-24 A12,12 0 1 1 12,-24 C12,-13 3,-7 0,0Z';
export function RouteMap({ height = 250 }: { height?: number }) {
  const { t } = useApp();
  const m = t.map;
  return (
    <svg role="img" aria-label="Mapa con la ruta del viaje" viewBox="0 0 360 250" width="100%" height={height} preserveAspectRatio="xMidYMid slice" style={{ display: 'block', background: m.bg }}>
      {[[20, 20], [130, 20], [240, 20], [20, 110], [130, 110], [240, 110], [20, 190], [130, 190], [240, 190]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="96" height="70" rx="8" fill={i === 4 ? m.park : m.bg} />
      ))}
      {[10, 100, 180].map((y) => <rect key={`h${y}`} x="0" y={y} width="360" height="10" fill={y === 100 ? m.avenue : m.street} />)}
      {[10, 120, 230, 340].map((x) => <rect key={`v${x}`} x={x} y="0" width="10" height="250" fill={m.street} />)}
      <path d="M 70 52 C 90 120, 120 150, 175 158 S 250 175, 300 205" fill="none" stroke={t.green} strokeWidth="5" strokeLinecap="round" />
      <g transform="translate(70 56)"><ellipse cx="0" cy="2" rx="8" ry="4" fill="rgba(0,0,0,.5)" /><path d={PIN} fill={t.green} stroke={m.bg} strokeWidth="2" /><circle cx="0" cy="-24" r="4.5" fill="#FFFFFF" /></g>
      <g transform="translate(172 157) rotate(18)"><rect x="-13" y="-7" width="26" height="14" rx="5" fill={m.car} /><rect x="-6" y="-5" width="10" height="10" rx="2" fill={m.bg} /></g>
      <g transform="translate(300 210)"><path d={PIN} fill={m.dest} stroke={m.bg} strokeWidth="2" /><rect x="-4.5" y="-28.5" width="9" height="9" rx="1.5" fill={m.bg} /></g>
    </svg>
  );
}

export function PlaceShortcuts({ items }: { items: { icon: string; label: string; onClick?: () => void }[] }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length},minmax(0,1fr))`, gap: 8 }}>
      {items.map((p) => (
        <button key={p.label} className="press quick-tile" onClick={p.onClick} style={{ height: 70, borderRadius: 16, background: t.cardOnBg, boxShadow: t.shadowCard, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Icon name={p.icon} size={24} color={t.iconBrand} />
          <span style={{ font: R(13, 500) }}>{p.label}</span>
        </button>
      ))}
    </div>
  );
}

/** Soft card that sends to a module (Explorar: «Movete con Chambito Auto»). */
export function InlineBanner({ icon, eyebrow, title, text, onClick }: { icon: string; eyebrow?: string; title: string; text: string; onClick?: () => void }) {
  const { t } = useApp();
  return (
    <button className="press" onClick={onClick} style={{ borderRadius: 16, background: t.cardOnBg, boxShadow: t.shadowCard, padding: 16, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%' }}>
      <span aria-hidden style={{ width: 56, height: 56, borderRadius: 28, background: t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={icon} size={32} color={t.iconBrand} /></span>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        {eyebrow && <span style={{ font: R(12), color: t.text2 }}>{eyebrow}</span>}
        <span style={{ font: P(16) }}>{title}</span>
        <span style={{ font: R(12), color: t.text2 }}>{text}</span>
      </span>
      <Icon name="chevronRight" size={20} color={t.text2} />
    </button>
  );
}

/* ---------- Market ---------- */
export function CategoryRow({ items, onPick }: { items: [icon: string, label: string][]; onPick?: (label: string) => void }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length},minmax(0,1fr))`, gap: 8 }}>
      {items.map(([icon, label]) => (
        <button key={label} className="press" onClick={() => onPick?.(label)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 56, height: 56, borderRadius: 28, background: t.cardOnBg, boxShadow: t.shadowCard, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={24} color={t.text} /></span>
          <span style={{ font: R(12, 500) }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

export interface Slide { eyebrow: string; title: string; icon: string }
/** Launch offers: one slide at a time, dots to move. No autoplay: the user decides. */
export function PromoCarousel({ slides, onOpen }: { slides: Slide[]; onOpen?: (s: Slide) => void }) {
  const { t } = useApp();
  const [i, setI] = useState(0);
  const s = slides[i];
  return (
    <div role="region" aria-roledescription="carrusel" aria-label="Ofertas" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button className="press" onClick={() => onOpen?.(s)} aria-label={`${s.eyebrow}: ${s.title}, ${i + 1} de ${slides.length}`} style={{ height: 112, borderRadius: 16, background: t.green, color: t.onGreen, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%' }}>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ font: R(13, 500) }}>{s.eyebrow}</span>
          <span style={{ font: P(24), lineHeight: 1.1 }}>{s.title}</span>
        </span>
        <span aria-hidden style={{ width: 76, height: 76, borderRadius: 38, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={s.icon} size={32} color={t.onGreen} /></span>
      </button>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {slides.map((x, k) => (
          <button key={x.title} aria-label={`Oferta ${k + 1}`} aria-current={k === i ? 'true' : undefined} onClick={() => setI(k)} style={{ width: k === i ? 18 : 8, height: 8, borderRadius: 4, background: k === i ? t.green : t.mChip, transition: 'width .2s' }} />
        ))}
      </div>
    </div>
  );
}

/** Product with photo, price and the favourite star (TOKENS favorite: amber when marked, grey when not). */
export function ProductCard({ photo, title, price, saved, onSave, onOpen, width }: { photo: ReactNode; title: string; price: string; saved: boolean; onSave: () => void; onOpen?: () => void; width?: number }) {
  const { t } = useApp();
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, width, flex: width ? 'none' : undefined }}>
      <button className="press" onClick={onOpen} aria-label={`${title}, ${price}`} style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left', width: '100%' }}>
        {photo}
        <span style={{ font: P(14) }}>{price}</span>
      </button>
      <button aria-label={saved ? `Quitar ${title} de guardados` : `Guardar ${title}`} aria-pressed={saved} onClick={onSave} style={{ position: 'absolute', top: 4, right: 4, width: 36, height: 36, borderRadius: 18, background: t.sheet, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.15)' }}>
        <Icon name="star" size={20} color={saved ? t.favorite : t.text3} />
      </button>
    </div>
  );
}

/** Horizontal row that scrolls sideways (Explorar: «Ofertas del Market»). */
export function Rail({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div role="group" aria-label={label} className="scroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -16px', padding: '0 16px' }}>
      {children}
    </div>
  );
}
