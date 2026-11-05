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
/** Logo + «Chambito» and the bell (Inicio of both sides). */
export function BrandHeader({ bell, onBell, right }: { bell?: number; onBell?: () => void; right?: ReactNode }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <img src="./pwa/icon-192.png" alt="" width={30} height={30} style={{ borderRadius: 9 }} />
      <span style={{ flex: 1, font: P(20) }}>Chambito</span>
      {right}
      <NavIconButton icon="bell" label="Notificaciones" bg={t.card} badge={bell} onClick={onBell} size={40} />
    </div>
  );
}

/** Back arrow + title, for screens opened from a tab (Chambito Auto, Market, Disponibilidad). */
export function BackHeader({ title, onBack, right, floating }: { title: string; onBack: () => void; right?: ReactNode; floating?: boolean }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, ...(floating ? { position: 'absolute', top: 18, left: 16, right: 16, zIndex: 2 } : {}) }}>
      <NavIconButton icon="arrowLeft" label="Atrás" bg={floating ? t.sheet : t.card} size={40} onClick={onBack} />
      <h2 style={{ flex: 1, margin: 0, font: P(20), ...(floating ? { background: t.sheet, borderRadius: 20, height: 40, display: 'flex', alignItems: 'center', padding: '0 14px' } : {}) }}>{title}</h2>
      {right}
    </div>
  );
}

/** Soft green note at the top of a settings screen. */
export function InfoBanner({ icon = 'info', children }: { icon?: string; children: ReactNode }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 18, background: t.greenSoft, padding: '14px 16px' }}>
      <Icon name={icon} size={22} color={t.success} />
      <span style={{ font: R(14, 500), color: t.text, ...pretty }}>{children}</span>
    </div>
  );
}

/* ---------- Entry tiles of the client's Inicio ---------- */
export interface EntryTile { key: ModuleKey; title: string; text: string; onClick: () => void; tag?: string }
/** Three soft-green tiles, icon on top and centred text (mockup: Servicios · Auto · Market). */
export function EntryTiles({ items }: { items: EntryTile[] }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length},minmax(0,1fr))`, gap: 8 }}>
      {items.map((it) => (
        <button key={it.key} className="press quick-tile" onClick={it.onClick} aria-label={`${it.title}: ${it.text}${it.tag ? `, ${it.tag}` : ''}`}
          style={{ position: 'relative', minHeight: 112, borderRadius: 18, background: t.greenSoft, padding: '14px 6px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' }}>
          {it.tag && <span style={{ position: 'absolute', top: 6, right: 6, font: R(10, 500), color: '#000000', background: t.green, borderRadius: 7, padding: '1px 6px' }}>{it.tag}</span>}
          <Icon name={MODULE_META[it.key].icon} size={32} color={t.success} />
          <span style={{ font: P(15) }}>{it.title}</span>
          <span style={{ font: R(11), color: t.text2, ...pretty }}>{it.text}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- Provider: online card, stats, availability list ---------- */
/** Green card with the master switch «En línea para recibir oportunidades»; the link opens Disponibilidad. */
export function OnlineCard({ value, onChange, onManage }: { value: Availability; onChange: (v: Availability) => void; onManage: () => void }) {
  const { t } = useApp();
  const n = MODULES.filter((k) => value[k]).length;
  const online = n > 0;
  const all = (v: boolean): Availability => ({ servicios: v, auto: v, market: v });
  return (
    <div style={{ borderRadius: 22, background: online ? t.green : t.card, color: online ? '#000000' : t.text, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6, transition: 'background .2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: P(17) }}>Disponibilidad</span>
          <span style={{ font: R(13) }}>{online ? 'En línea para recibir oportunidades' : 'Fuera de línea · no recibís oportunidades'}</span>
        </span>
        <button role="switch" aria-checked={online} aria-label="En línea" onClick={() => onChange(all(!online))} style={{ width: 52, height: 30, borderRadius: 15, background: online ? 'rgba(255,255,255,.55)' : t.mChip, position: 'relative', flex: 'none' }}>
          <span style={{ position: 'absolute', top: 3, left: online ? 25 : 3, width: 24, height: 24, borderRadius: 12, background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,.25)', transition: 'left .2s' }} />
        </button>
      </div>
      <button onClick={onManage} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 4, font: R(13, 500), color: online ? '#000000' : t.success, textDecoration: 'underline' }}>
        {online ? `En ${n} de 3 módulos · Elegir módulos` : 'Elegir en qué módulos'}
        <Icon name="chevronRight" size={14} color={online ? '#000000' : t.success} />
      </button>
    </div>
  );
}

export function StatRow({ stats }: { stats: { value: string; label: string; icon?: string }[] }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length},minmax(0,1fr))`, gap: 4 }}>
      {stats.map((s) => (
        <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, font: P(22), color: t.success }}>{s.icon && <Icon name={s.icon} size={16} color={t.success} />}{s.value}</span>
          <span style={{ font: R(12), color: t.text2 }}>{s.label}</span>
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
/** One card per module with its own switch (Disponibilidad screen). */
export function AvailabilityList({ value, onChange }: { value: Availability; onChange: (v: Availability) => void }) {
  const { t } = useApp();
  return (
    <div role="group" aria-label="Módulos en los que trabajás" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {MODULES.map((k) => {
        const on = value[k];
        const [title, text] = AVAIL_ROWS[k];
        return (
          <button key={k} role="switch" aria-checked={on} aria-label={title} onClick={() => onChange({ ...value, [k]: !on })} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 18, background: t.card, textAlign: 'left', width: '100%' }}>
            <Icon name={MODULE_META[k].icon} size={22} color={on ? t.success : t.text3} />
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ font: R(15, 500) }}>{title}</span>
              <span style={{ font: R(12), color: t.text2 }}>{text}</span>
            </span>
            <span aria-hidden style={{ width: 48, height: 28, borderRadius: 14, background: on ? t.green : t.mChip, position: 'relative', transition: 'background .2s', flex: 'none' }}>
              <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 22, height: 22, borderRadius: 11, background: '#FFFFFF', transition: 'left .2s' }} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Auto ---------- */
/** Mock street map with the route from the pickup (green pin) to the destination (red pin) and the car. */
export function RouteMap({ height = 250 }: { height?: number }) {
  const { t } = useApp();
  const d = t.name === 'dark';
  const bg = d ? '#1E1F22' : '#EEF0F2';
  const street = d ? '#2E3034' : '#FFFFFF';
  const block = d ? '#26282B' : '#E3E6E9';
  return (
    <svg role="img" aria-label="Mapa con la ruta del viaje" viewBox="0 0 360 250" width="100%" height={height} preserveAspectRatio="xMidYMid slice" style={{ display: 'block', background: bg }}>
      {[[20, 20], [130, 20], [240, 20], [20, 110], [130, 110], [240, 110], [20, 190], [130, 190], [240, 190]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="96" height="70" rx="8" fill={block} />
      ))}
      {[10, 100, 180].map((y) => <rect key={`h${y}`} x="0" y={y} width="360" height="10" fill={street} />)}
      {[10, 120, 230, 340].map((x) => <rect key={`v${x}`} x={x} y="0" width="10" height="250" fill={street} />)}
      <path d="M 70 52 C 90 120, 120 150, 175 158 S 250 175, 300 205" fill="none" stroke={t.green} strokeWidth="5" strokeLinecap="round" />
      {/* pickup */}
      <g transform="translate(70 52)"><circle r="11" fill={t.green} /><circle r="4.5" fill="#FFFFFF" /></g>
      {/* car on the way */}
      <g transform="translate(172 157) rotate(18)"><rect x="-13" y="-7" width="26" height="14" rx="5" fill={d ? '#F5F5F5' : '#111111'} /><rect x="-6" y="-5" width="10" height="10" rx="2" fill={d ? '#BBBBBB' : '#555555'} /></g>
      {/* destination */}
      <g transform="translate(300 205)"><path d="M0 -24 C 9 -24 14 -17 14 -10 C 14 -1 0 10 0 10 C 0 10 -14 -1 -14 -10 C -14 -17 -9 -24 0 -24 Z" fill="#E5484D" /><circle cy="-11" r="4.5" fill="#FFFFFF" /></g>
    </svg>
  );
}

export function PlaceShortcuts({ items }: { items: { icon: string; label: string; onClick?: () => void }[] }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length},minmax(0,1fr))`, gap: 8 }}>
      {items.map((p) => (
        <button key={p.label} className="press quick-tile" onClick={p.onClick} style={{ height: 70, borderRadius: 16, background: t.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Icon name={p.icon} size={22} color={t.success} />
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
    <button className="press" onClick={onClick} style={{ borderRadius: 20, background: t.greenSoft, padding: 14, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%' }}>
      <span aria-hidden style={{ width: 64, height: 52, borderRadius: 14, background: t.card, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={icon} size={34} color={t.success} /></span>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        {eyebrow && <span style={{ font: R(12), color: t.text2 }}>{eyebrow}</span>}
        <span style={{ font: P(16) }}>{title}</span>
        <span style={{ font: R(12), color: t.text2 }}>{text}</span>
      </span>
      <Icon name="chevronRight" size={18} color={t.text} />
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
          <span style={{ width: 56, height: 56, borderRadius: 18, background: t.card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={24} color={t.text} /></span>
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
      <button className="press" onClick={() => onOpen?.(s)} aria-label={`${s.eyebrow}: ${s.title}, ${i + 1} de ${slides.length}`} style={{ height: 112, borderRadius: 20, background: t.green, color: '#000000', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%' }}>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ font: R(13, 500) }}>{s.eyebrow}</span>
          <span style={{ font: P(24), lineHeight: 1.1 }}>{s.title}</span>
        </span>
        <span aria-hidden style={{ width: 76, height: 76, borderRadius: 38, background: 'rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={s.icon} size={40} color="#000000" /></span>
      </button>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {slides.map((x, k) => (
          <button key={x.title} aria-label={`Oferta ${k + 1}`} aria-current={k === i ? 'true' : undefined} onClick={() => setI(k)} style={{ width: k === i ? 18 : 8, height: 8, borderRadius: 4, background: k === i ? t.green : t.mChip, transition: 'width .2s' }} />
        ))}
      </div>
    </div>
  );
}

/** Product with photo, price and a heart to save it. */
export function ProductCard({ photo, title, price, saved, onSave, onOpen, width }: { photo: ReactNode; title: string; price: string; saved: boolean; onSave: () => void; onOpen?: () => void; width?: number }) {
  const { t } = useApp();
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, width, flex: width ? 'none' : undefined }}>
      <button className="press" onClick={onOpen} aria-label={`${title}, ${price}`} style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left', width: '100%' }}>
        {photo}
        <span style={{ font: P(14) }}>{price}</span>
      </button>
      <button aria-label={saved ? `Quitar ${title} de guardados` : `Guardar ${title}`} aria-pressed={saved} onClick={onSave} style={{ position: 'absolute', top: 6, right: 6, width: 30, height: 30, borderRadius: 15, background: t.sheet, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.15)' }}>
        <Icon name="heart" size={15} color={saved ? '#E5484D' : t.text3} />
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
