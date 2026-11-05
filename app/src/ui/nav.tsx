/**
 * Navigation and menu components shared by Auto and Market (Tienda), so both modules
 * use the same bars, back buttons, menus and entry tiles.
 */
import { CSSProperties, ReactNode } from 'react';
import { useApp } from '../store';
import { P, R } from '../theme';
import { Icon } from './icon';

/* ================= Bottom navigation (floating pill) ================= */
export type NavKey = 'inicio' | 'auto' | 'tienda' | 'comercios' | 'equipos' | 'actividad' | 'perfil'
  // alternatives shown in «Componentes» (provider mode, central action, one tab per module)
  | 'servicios' | 'trabajos' | 'agenda' | 'cobros' | 'mensajes' | 'pedir'
  // from the three UI proposals: Módulos (Opción 1), Trabajo | Explorar (Opción 3)
  | 'modulos' | 'trabajo' | 'explorar';
export const NAV_META: Record<NavKey, { label: string; icon: string }> = {
  inicio: { label: 'Inicio', icon: 'home' },
  auto: { label: 'Auto', icon: 'car' },
  tienda: { label: 'Tienda', icon: 'tag' },
  comercios: { label: 'Comercios', icon: 'tag' },
  equipos: { label: 'Equipos', icon: 'users' },
  actividad: { label: 'Actividad', icon: 'bell' },
  perfil: { label: 'Perfil', icon: 'user' },
  servicios: { label: 'Servicios', icon: 'limpieza' },
  trabajos: { label: 'Trabajos', icon: 'inbox' },
  agenda: { label: 'Agenda', icon: 'calendar' },
  cobros: { label: 'Cobros', icon: 'wallet' },
  mensajes: { label: 'Mensajes', icon: 'messageCircle' },
  pedir: { label: 'Pedir', icon: 'plus' },
  modulos: { label: 'Módulos', icon: 'layers' },
  trabajo: { label: 'Trabajo', icon: 'inbox' },
  explorar: { label: 'Explorar', icon: 'search' },
};

/**
 * Max 5 destinations. Combination 1 (tab): Inicio · Auto · Tienda · Actividad · Perfil, Equipos moves to Perfil.
 * Combination 2 (card, recommended at launch): Tienda opens from the Inicio card; Auto and Equipos keep their place.
 */
export function navItems(autoEnabled: boolean, teams: boolean, tiendaTab = false): NavKey[] {
  // as today, without Auto nor Tienda tab: Comercios and Equipos stay separate
  if (!autoEnabled && !tiendaTab) return teams ? ['inicio', 'comercios', 'equipos', 'actividad', 'perfil'] : ['inicio', 'actividad', 'perfil'];
  const items: NavKey[] = ['inicio'];
  if (autoEnabled) items.push('auto');
  if (tiendaTab) items.push('tienda');
  if (teams) items.push('equipos');
  items.push('actividad', 'perfil');
  return items.length > 5 ? items.filter((k) => k !== 'equipos') : items; // Equipos moves to Perfil
}

/** `true` shows a dot, a number shows a count. */
export type NavBadges = Partial<Record<NavKey, number | boolean>>;

/**
 * Bottom bar from TOKENS.json (component.bottomNav, v1.15.0 «barra simple»): 72 tall, radius 16,
 * bg.surfaceRaised with outline and elevation, 20 from the sides. Each tab: icon 24 over its name
 * (Roboto Medium 12), 4 apart. Inactive in icon.secondary; active icon and name in icon.brand.
 * No pill and no sliding: the colour changes at once.
 * `docked` is the same bar fixed to the bottom edge (the «Cliente y Prestador» mockup).
 */
export function BottomNavBar({ items, active, onSelect, badges, style, variant = 'pill' }: { items: NavKey[]; active: NavKey; onSelect?: (k: NavKey) => void; badges?: NavBadges; style?: CSSProperties; variant?: 'pill' | 'docked' }) {
  const { t } = useApp();
  const docked = variant === 'docked';
  const frame: CSSProperties = docked
    ? { height: 72, background: t.navBg, borderTop: t.navOutline }
    : { height: 72, borderRadius: 16, background: t.navBg, outline: t.navOutline, boxShadow: t.shadowFloat };
  return (
    <nav aria-label="Navegación principal" style={{ ...frame, display: 'grid', gridTemplateColumns: `repeat(${items.length},minmax(0,1fr))`, padding: 8, boxSizing: 'border-box', ...style }}>
      {items.map((k) => {
        const on = k === active;
        const c = on ? t.navActive : t.navInactive;
        const b = badges?.[k];
        const label = NAV_META[k].label;
        return (
          <button
            key={k}
            className="nav-tab"
            aria-current={on ? 'page' : undefined}
            aria-label={b ? `${label}, ${typeof b === 'number' ? `${b} nuevas` : 'con novedades'}` : label}
            onClick={() => onSelect?.(k)}
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, minWidth: 0, minHeight: 48 }}
          >
            <span style={{ position: 'relative', display: 'flex' }}>
              <Icon name={NAV_META[k].icon} size={24} color={c} />
              {!!b && <Dot count={typeof b === 'number' ? b : undefined} ring={t.navBg} />}
            </span>
            <span style={{ font: R(12, 500), color: c, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/** Notification dot or count. `ring` matches the surface behind it. */
export function Dot({ count, ring }: { count?: number; ring?: string }) {
  const { t } = useApp();
  const size = count ? 18 : 10;
  return (
    <span
      aria-hidden
      style={{ position: 'absolute', top: count ? -6 : -2, right: count ? -10 : -3, minWidth: size, height: size, borderRadius: size / 2, padding: count ? '0 5px' : 0, background: t.error, color: t.name === 'dark' ? '#000000' : '#FFFFFF', font: P(11), display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: ring ? `0 0 0 2px ${ring}` : undefined, boxSizing: 'border-box' }}
    >
      {count}
    </span>
  );
}

/* ================= Top bars ================= */
/** Round icon button used in every top bar (back, close, actions). */
export function NavIconButton({ icon, onClick, label, bg, size = 44, iconColor, badge }: { icon: string; onClick?: () => void; label: string; bg?: string; size?: number; iconColor?: string; badge?: number }) {
  const { t } = useApp();
  return (
    <button aria-label={label} title={label} className="press" onClick={onClick} style={{ position: 'relative', width: size, height: size, borderRadius: size / 2, background: bg ?? t.mSurface, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
      <Icon name={icon} size={20} color={iconColor} />
      {!!badge && (
        <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, background: t.green, color: t.onGreen, font: P(12), display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px', boxSizing: 'border-box' }}>{badge}</span>
      )}
    </button>
  );
}

/**
 * One top bar for both modules.
 * - default: 56 tall, in the flow of the screen (Market screens)
 * - `floating`: placed under the status bar over full-bleed content (Auto screens)
 * - `large`: big page title (Tienda, Actividad, Perfil)
 */
export function TopBar({ title, onBack, backIcon = 'arrowLeft', backLabel, right, sub, large, floating, buttonBg }: {
  title?: ReactNode; onBack?: () => void; backIcon?: string; backLabel?: string; right?: ReactNode; sub?: ReactNode; large?: boolean; floating?: boolean; buttonBg?: string;
}) {
  const pos: CSSProperties = floating ? { position: 'absolute', top: 47, left: 0, right: 0, zIndex: 11 } : { flex: 'none' };
  return (
    <div style={{ ...pos, height: large ? 60 : 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px' }}>
      {onBack && <NavIconButton icon={backIcon} label={backLabel ?? (backIcon === 'close' ? 'Cerrar' : 'Atrás')} onClick={onBack} bg={buttonBg} />}
      {title ? (
        <h2 style={{ flex: 1, margin: 0, font: P(large ? 28 : 20), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{title}</h2>
      ) : (
        <span style={{ flex: 1 }} />
      )}
      {sub}
      {right && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{right}</div>}
    </div>
  );
}

/* ================= Menus (grouped lists) ================= */
export function MenuGroup({ title, children, action }: { title?: string; children: ReactNode; action?: ReactNode }) {
  const { t } = useApp();
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
          {title && <h3 style={{ margin: 0, font: R(13, 500), color: t.text2, letterSpacing: 0.2 }}>{title}</h3>}
          {action}
        </div>
      )}
      <div className="menu-group" style={{ background: t.mSurface, borderRadius: 16, boxShadow: t.shadowCard, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>{children}</div>
    </section>
  );
}

export function MenuItem({ icon, label, hint, tag, tagTone = 'neutral', onClick, accent, last }: {
  icon: string; label: string; hint?: string; tag?: string; tagTone?: 'new' | 'neutral' | 'warn'; onClick?: () => void; accent?: boolean; last?: boolean;
}) {
  const { t } = useApp();
  const tagStyle: Record<string, [string, string]> = { new: [t.success, t.greenSoft], neutral: [t.text2, t.mChip], warn: [t.warn, 'rgba(255,181,71,0.16)'] };
  const [tc, tb] = tagStyle[tagTone];
  return (
    <button className="press menu-item" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: hint ? 72 : 56, padding: '8px 16px', width: '100%', textAlign: 'left', position: 'relative' }}>
      <span style={{ width: 40, height: 40, borderRadius: 12, background: accent ? t.greenSoft : t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <Icon name={icon} size={20} color={accent ? t.iconBrand : undefined} />
      </span>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span style={{ font: R(15, 500) }}>{label}</span>
        {hint && <span style={{ font: R(13), color: t.text2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hint}</span>}
      </span>
      {tag && <span style={{ font: R(12, 500), color: tc, background: tb, borderRadius: 12, padding: '2px 8px', whiteSpace: 'nowrap' }}>{tag}</span>}
      <Icon name="chevronRight" size={18} color={t.text3} />
      {!last && <span aria-hidden style={{ position: 'absolute', left: 68, right: 0, bottom: 0, height: 1, background: t.borderSubtle }} />}
    </button>
  );
}

/* ================= Entry tiles (one app, several modules) ================= */
export interface QuickTile {
  key: string;
  icon: string;
  label: string;
  hint: string;
  onClick: () => void;
  /** small status shown on the tile, e.g. "En curso" */
  status?: string;
}

/** Row of big tiles that opens each part of Chambito from Inicio: Servicios, Auto, Tienda. */
export function QuickAccess({ tiles, surface }: { tiles: QuickTile[]; surface?: string }) {
  const { t } = useApp();
  return (
    <div role="list" aria-label="Accesos" style={{ display: 'grid', gridTemplateColumns: `repeat(${tiles.length},minmax(0,1fr))`, gap: 8 }}>
      {tiles.map((q) => (
        <button
          key={q.key}
          role="listitem"
          className="press quick-tile"
          onClick={q.onClick}
          aria-label={`${q.label}: ${q.hint}${q.status ? `, ${q.status}` : ''}`}
          style={{ position: 'relative', minHeight: 84, borderRadius: 16, background: surface ?? t.card, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, textAlign: 'left' }}
        >
          <span style={{ width: 40, height: 40, borderRadius: 12, background: t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={q.icon} size={24} color={t.iconBrand} />
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0, width: '100%' }}>
            <span style={{ font: R(15, 500) }}>{q.label}</span>
            <span style={{ font: R(12), color: t.text2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.hint}</span>
          </span>
          {q.status && (
            <span style={{ position: 'absolute', top: 12, right: 10, display: 'flex', alignItems: 'center', gap: 4, height: 24, boxSizing: 'border-box', font: R(12, 500), color: t.success, background: t.greenSoft, borderRadius: 12, padding: '0 8px' }}>
              <span className="blink" style={{ width: 8, height: 8, borderRadius: 4, background: t.green }} />
              {q.status}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
