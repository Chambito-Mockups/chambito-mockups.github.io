/**
 * Componentes del sistema de diseño (docs/2026-11-09-SISTEMA-DE-DISENO, §9 a §18) que no estaban en kit.tsx.
 * Leen los colores de `t` (tokens.ts) por `useVM()`, así funcionan en las pantallas y en la página «Sistema de diseño».
 * Medidas y colores, tal como los pide el documento: se nombran igual que en src/shared/ui/ds de la app.
 */
import { ReactNode } from 'react';
import { useVM } from './model';
import { I } from './kit';

const POPPINS = 'Poppins, Arial, sans-serif';
const ROBOTO = 'Roboto, Arial, sans-serif';

/* ---------------- Contenido ---------------- */

export type BadgeTone = 'live' | 'success' | 'warning' | 'danger' | 'neutral';
/** Insignia de estado: alto 24, píldora, padding 8, Roboto Medium 12. El estado se dice con texto, nunca solo con color. */
export function Badge({ tone = 'neutral', dot, children }: { tone?: BadgeTone; dot?: boolean; children: ReactNode }) {
  const { t } = useVM();
  const look: Record<BadgeTone, [string, string]> = {
    live: [t.brandSubtle, t.text], success: [t.brandSubtle, t.success], warning: [t.warnSubtle, t.warning], danger: [t.dangerSubtle, t.danger], neutral: [t.fill, t.text2],
  };
  const [bg, fg] = look[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 24, padding: '0 8px', borderRadius: 9999, background: bg, color: fg, font: `500 12px/16px ${ROBOTO}`, letterSpacing: 0.2, whiteSpace: 'nowrap' }}>
      {dot && <span aria-hidden="true" className={tone === 'live' ? 'ch-pulse-dot' : undefined} style={{ width: 8, height: 8, borderRadius: 9999, background: tone === 'live' ? t.brand : 'currentColor' }} />}
      {children}
    </span>
  );
}

/** Contador sobre un ícono: mínimo 20, verde con número blanco, «99+» como tope. */
export function CountBadge({ n }: { n: number }) {
  const { t } = useVM();
  return (
    <span style={{ minWidth: 20, height: 20, padding: '0 6px', boxSizing: 'border-box', borderRadius: 9999, background: t.brand, color: t.onBrand, font: `500 12px/20px ${ROBOTO}`, textAlign: 'center', display: 'inline-block' }}>
      {n > 99 ? '99+' : n}
    </span>
  );
}

/** Rótulo de sección: MAYÚSCULAS, Roboto Medium 12/16 en text.secondary, a 8 de su contenido. */
export function SectionLabel({ children }: { children: ReactNode }) {
  const { t } = useVM();
  return <span style={{ display: 'block', margin: '0 0 8px', font: `500 12px/16px ${ROBOTO}`, letterSpacing: 0.2, textTransform: 'uppercase', color: t.text2 }}>{children}</span>;
}

export type CardVariant = 'surface' | 'muted' | 'brand' | 'selected';
/** Tarjeta: radio 16, padding 16, gap 12. Elevación 1 en claro, ninguna en oscuro. «selected» es el único borde de color. */
export function Card({ variant = 'surface', children }: { variant?: CardVariant; children: ReactNode }) {
  const { t } = useVM();
  const bg = variant === 'muted' ? t.fill : variant === 'brand' ? t.brandSubtle : t.cardBg;
  const shadow = variant === 'selected' ? `inset 0 0 0 2px ${t.focus}` : variant === 'surface' ? t.shadow1 : 'none';
  return <div style={{ borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, background: bg, boxShadow: shadow, color: t.text }}>{children}</div>;
}

/** Avatar: círculo; sin foto, iniciales en Poppins Bold sobre verde al 20 %. Verificado: sello verde de 16 con ✓. */
export function Avatar({ ini, size = 40, verified }: { ini: string; size?: 24 | 32 | 40 | 56 | 80; verified?: boolean }) {
  const { t } = useVM();
  return (
    <span aria-hidden="true" style={{ position: 'relative', flex: 'none', width: size, height: size, borderRadius: 9999, background: t.brandSubtle, color: t.text, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', font: `700 ${Math.round(size * 0.36)}px/1 ${POPPINS}` }}>
      {ini}
      {verified && (
        <span style={{ position: 'absolute', right: -2, bottom: -2, width: 16, height: 16, borderRadius: 9999, background: t.brand, color: t.onBrand, boxShadow: `0 0 0 2px ${t.cardBg}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <I name="check" size={10} />
        </span>
      )}
    </span>
  );
}

/** Ítem de lista: alto mínimo 56 (una línea) o 72 (dos), padding 16, gap 12. Título 15, subtítulo 13 en gris. */
export function ListItem({ icon, avatar, title, sub, end, chevron, onClick, divider }: { icon?: string; avatar?: ReactNode; title: ReactNode; sub?: ReactNode; end?: ReactNode; chevron?: boolean; onClick?: () => void; divider?: boolean }) {
  const { t } = useVM();
  const body = (
    <>
      {icon && <span aria-hidden="true" style={{ flex: 'none', width: 40, height: 40, borderRadius: 12, background: t.mos, color: t.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I name={icon} size={24} /></span>}
      {avatar}
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
        <span style={{ font: `500 15px/22px ${ROBOTO}` }}>{title}</span>
        {sub && <span style={{ font: `400 13px/18px ${ROBOTO}`, color: t.text2 }}>{sub}</span>}
      </span>
      {end}
      {chevron && <I name="chevronright" size={20} style={{ color: t.text2 }} />}
    </>
  );
  const style = { display: 'flex', alignItems: 'center', gap: 12, minHeight: sub ? 72 : 56, padding: '0 16px', boxSizing: 'border-box' as const, width: '100%', color: t.text, boxShadow: divider ? `inset 0 -1px 0 ${t.line}` : 'none' };
  return onClick ? <button onClick={onClick} style={style}>{body}</button> : <div style={style}>{body}</div>;
}

/** Grupo de ítems: contenedor blanco de radio 16. */
export function ListGroup({ children }: { children: ReactNode }) {
  const { t } = useVM();
  return <div style={{ borderRadius: 16, background: t.cardBg, boxShadow: t.shadow1, overflow: 'hidden' }}>{children}</div>;
}

/** Barra de progreso: alto 4, píldora; relleno icon.brand sobre muted (dentro de una tarjeta, mutedOnSurface). */
export function ProgressBar({ value, onCard }: { value: number; onCard?: boolean }) {
  const { t } = useVM();
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} style={{ height: 4, borderRadius: 9999, background: onCard ? t.mos : t.fill, overflow: 'hidden' }}>
      <div style={{ width: `${Math.round(value * 100)}%`, height: 4, background: t.iconBrand }} />
    </div>
  );
}

/** «Paso 2 de 3» (caption) + barra en tramos. */
export function StepProgress({ step, total }: { step: number; total: number }) {
  const { t } = useVM();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ font: `400 13px/18px ${ROBOTO}`, color: t.text2 }}>Paso {step} de {total}</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: total }, (_, i) => <span key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < step ? t.iconBrand : t.fill }} />)}
      </div>
    </div>
  );
}

/** Estado vacío o de error: ícono de 32 en círculo gris de 64, título Poppins 16, texto de 2 líneas en 280, un botón. */
export function EmptyState({ icon, title, text, action }: { icon: string; title: string; text: string; action?: ReactNode }) {
  const { t } = useVM();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12, padding: '24px 0' }}>
      <span aria-hidden="true" style={{ width: 64, height: 64, borderRadius: 9999, background: t.fill, color: t.iconBrand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I name={icon} size={32} /></span>
      <span style={{ font: `700 16px/24px ${POPPINS}` }}>{title}</span>
      <span style={{ maxWidth: 280, font: `400 15px/22px ${ROBOTO}`, color: t.text2 }}>{text}</span>
      {action}
    </div>
  );
}

/* ---------------- Formularios y selección ---------------- */

export type FieldState = 'default' | 'focus' | 'error' | 'disabled';
/** Campo de texto: etiqueta Roboto Medium 14 a 8, alto 52, radio 12, padding 16, borde de 1 #808080 (2 con foco o error). */
export function TextField({ label, value, placeholder, state = 'default', help, prefix }: { label: string; value?: string; placeholder?: string; state?: FieldState; help?: string; prefix?: string }) {
  const { t } = useVM();
  const border = state === 'focus' ? `inset 0 0 0 2px ${t.focus}` : state === 'error' ? `inset 0 0 0 2px ${t.danger}` : state === 'disabled' ? 'none' : `inset 0 0 0 1px ${t.bField}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ font: `500 14px/20px ${ROBOTO}`, letterSpacing: 0.1, color: t.text2 }}>{label}</span>
      <div style={{ height: 52, borderRadius: 12, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 8, background: state === 'disabled' ? t.fill : t.field, boxShadow: border, font: `400 15px/22px ${ROBOTO}`, color: value ? t.text : t.text3 }}>
        {prefix && <span style={{ color: t.text2 }}>{prefix}</span>}
        <span style={{ flex: 1 }}>{value || placeholder}</span>
      </div>
      {help && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: `400 13px/18px ${ROBOTO}`, color: state === 'error' ? t.danger : t.text2 }}>
          {state === 'error' && <I name="alert" size={16} />}{help}
        </span>
      )}
    </div>
  );
}

/** Buscador: píldora de 48, lupa de 20 a la izquierda y borrar a la derecha. Los filtros van afuera. */
export function SearchField({ placeholder, value, onClick }: { placeholder: string; value?: string; onClick?: () => void }) {
  const { t } = useVM();
  return (
    <button onClick={onClick} style={{ width: '100%', height: 48, borderRadius: 9999, padding: '0 16px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10, background: t.fill, color: value ? t.text : t.text2, font: `400 15px/22px ${ROBOTO}` }}>
      <I name="search" size={20} />
      <span style={{ flex: 1, textAlign: 'left' }}>{value || placeholder}</span>
      {value && <I name="close" size={16} />}
    </button>
  );
}

/** Switch: 52 × 32, perilla blanca de 24; encendido #2F7A33 / #4BAC4F, apagado #CCCCCC / #4D4D4D. Aplica en el acto. */
export function Switch({ on, onChange, label }: { on: boolean; onChange?: (v: boolean) => void; label: string }) {
  const { t } = useVM();
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange?.(!on)} style={{ flex: 'none', width: 52, height: 32, borderRadius: 9999, background: on ? t.focus : t.bDefault, padding: 4, boxSizing: 'border-box', display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start' }}>
      <span style={{ width: 24, height: 24, borderRadius: 9999, background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
    </button>
  );
}

/** Radio: círculo de 24; elegido con relleno negro y punto blanco (en oscuro, al revés). */
export function Radio({ on }: { on: boolean }) {
  const { t } = useVM();
  return (
    <span aria-hidden="true" style={{ flex: 'none', width: 24, height: 24, borderRadius: 9999, background: on ? t.inverse : 'transparent', boxShadow: `inset 0 0 0 2px ${on ? t.inverse : t.bField}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ width: 10, height: 10, borderRadius: 9999, background: on ? t.onInverse : 'transparent' }} />
    </span>
  );
}

/** Casilla: 24 con radio 4, borde negro / blanco. Elegida: verde con ✓ blanco. */
export function Checkbox({ on }: { on: boolean }) {
  const { t } = useVM();
  return (
    <span aria-hidden="true" style={{ flex: 'none', width: 24, height: 24, borderRadius: 4, background: on ? t.brand : 'transparent', color: t.onBrand, boxShadow: on ? 'none' : `inset 0 0 0 2px ${t.bStrong}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {on && <I name="check" size={16} />}
    </span>
  );
}

/** Estrellas: 5 de 32 en áreas de 48; elegidas en #2F7A33 / #4BAC4F, vacías en #CCCCCC / #4D4D4D. */
export function RatingInput({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  const { t } = useVM();
  return (
    <div role="radiogroup" aria-label="Calificación" style={{ display: 'flex' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} role="radio" aria-checked={n === value} aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`} onClick={() => onChange?.(n)} style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', color: n <= value ? t.iconBrand : t.bDefault }}>
          <I name="star" size={32} />
        </button>
      ))}
    </div>
  );
}

/** Control segmentado: alto 40, riel muted con padding 4; deslizador negro con texto blanco (en oscuro, al revés). */
export function Segmented<T extends string>({ options, value, onChange, label }: { options: { key: T; label: string; icon?: string }[]; value: T; onChange?: (v: T) => void; label: string }) {
  const { t } = useVM();
  return (
    <div role="tablist" aria-label={label} style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`, height: 40, borderRadius: 9999, background: t.fill, padding: 4, boxSizing: 'border-box', gap: 4 }}>
      {options.map((o) => {
        const on = o.key === value;
        return (
          <button key={o.key} role="tab" aria-selected={on} onClick={() => onChange?.(o.key)} style={{ borderRadius: 9999, background: on ? t.inverse : 'transparent', color: on ? t.onInverse : t.text2, font: `500 14px/20px ${ROBOTO}`, letterSpacing: 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {o.icon && <I name={o.icon} size={16} />}{o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Avisos y capas ---------------- */

export type BannerTone = 'neutral' | 'success' | 'warning' | 'danger';
/** Banner: radio 12, padding 12, ícono de estado de 20. «neutral» es el de información: no existe el azul. */
export function Banner({ tone = 'neutral', title, children, action }: { tone?: BannerTone; title?: string; children: ReactNode; action?: ReactNode }) {
  const { t } = useVM();
  const look: Record<BannerTone, [string, string, string]> = {
    neutral: [t.fill, t.text, 'info'], success: [t.brandSubtle, t.success, 'success'], warning: [t.warnSubtle, t.warning, 'warning'], danger: [t.dangerSubtle, t.danger, 'error'],
  };
  const [bg, fg, icon] = look[tone];
  return (
    <div role="status" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 12, borderRadius: 12, background: bg, color: t.text }}>
      <I name={icon} size={20} style={{ color: fg }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {title && <span style={{ font: `500 15px/22px ${ROBOTO}`, color: tone === 'neutral' ? t.text : fg }}>{title}</span>}
        <span style={{ font: `400 13px/18px ${ROBOTO}` }}>{children}</span>
        {action}
      </div>
    </div>
  );
}

/** Toast: 4 s, negro con texto blanco (al revés en oscuro), radio 12, alto mínimo 48, padding 16. */
export function ToastView({ children, action }: { children: ReactNode; action?: string }) {
  const { t } = useVM();
  return (
    <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 48, padding: '12px 16px', boxSizing: 'border-box', borderRadius: 12, background: t.inverse, color: t.onInverse, font: `400 14px/20px ${ROBOTO}`, boxShadow: t.shadow3 }}>
      <I name="success" size={20} style={{ color: t.brandOnInverse }} />
      <span style={{ flex: 1 }}>{children}</span>
      {action && <span style={{ font: `700 14px/20px ${POPPINS}` }}>{action}</span>}
    </div>
  );
}

/** Hoja inferior (sin el velo): radio 24 arriba, manija de 32 × 4, padding 24, surfaceRaised, título Poppins 16 + cerrar. */
export function SheetFrame({ title, children, onClose }: { title: string; children: ReactNode; onClose?: () => void }) {
  const { t } = useVM();
  return (
    <section aria-label={title} style={{ background: t.raised, borderRadius: '24px 24px 0 0', padding: '12px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: t.shadow3, color: t.text }}>
      <span aria-hidden="true" style={{ alignSelf: 'center', width: 32, height: 4, borderRadius: 2, background: t.handle }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ font: `700 16px/24px ${POPPINS}` }}>{title}</span>
        <button aria-label="Cerrar" onClick={onClose} style={{ width: 40, height: 40, borderRadius: 9999, background: t.fill, color: t.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I name="close" size={20} /></button>
      </div>
      {children}
    </section>
  );
}

/* ---------------- Chat ---------------- */

/** Burbuja: saliente negra (verde en oscuro) a la derecha, entrante #EBEBEB / #333333. Radio 16 con la esquina de la cola en 4. */
export function ChatBubble({ me, children, time }: { me?: boolean; children: ReactNode; time?: string }) {
  const { t } = useVM();
  const dark = t.canvas === '#000000';
  return (
    <div style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '78%', padding: '8px 12px', borderRadius: me ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: me ? (dark ? t.brand : '#000000') : t.fill, color: me ? '#FFFFFF' : t.text, font: `400 15px/22px ${ROBOTO}` }}>
      {children}
      {time && <span style={{ display: 'block', textAlign: 'right', font: `400 12px/16px ${ROBOTO}`, opacity: 0.7, marginTop: 2 }}>{time}</span>}
    </div>
  );
}

/** Mensaje de sistema: píldora centrada gris con texto caption gris. */
export function SystemMessage({ children }: { children: ReactNode }) {
  const { t } = useVM();
  return <span style={{ alignSelf: 'center', padding: '4px 12px', borderRadius: 9999, background: t.fill, color: t.text2, font: `400 13px/18px ${ROBOTO}` }}>{children}</span>;
}

/* ---------------- Auto ---------------- */

/** Patente Mercosur: siempre blanca con texto negro (PY «ABCD 123», AR «AB 123 CD»). */
export function Plate({ children, size = 'md' }: { children: string; size?: 'md' | 'lg' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', height: size === 'lg' ? 40 : 28, padding: size === 'lg' ? '0 12px' : '0 8px', borderRadius: 6, background: '#FFFFFF', color: '#000000', boxShadow: 'inset 0 0 0 1.5px #000000', font: `700 ${size === 'lg' ? 20 : 14}px/1 ${POPPINS}`, letterSpacing: 1, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

/** Tarjeta del vehículo: la patente como dato principal, modelo y color. «arrived» la destaca; «compact» va en Actividad. */
export function VehicleCard({ plate, model, detail, variant = 'default' }: { plate: string; model: string; detail?: string; variant?: 'default' | 'arrived' | 'compact' }) {
  const { t } = useVM();
  const arrived = variant === 'arrived';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: variant === 'compact' ? 0 : 16, borderRadius: 16, background: variant === 'compact' ? 'transparent' : arrived ? t.inverse : t.cardBg, color: arrived ? t.onInverse : t.text, boxShadow: variant === 'default' ? t.shadow1 : 'none' }}>
      <span aria-hidden="true" style={{ flex: 'none', width: 40, height: 40, borderRadius: 12, background: arrived ? t.brand : t.mos, color: arrived ? t.onBrand : t.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I name="car" size={24} /></span>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: `500 15px/22px ${ROBOTO}` }}>{model}</span>
        {detail && <span style={{ font: `400 13px/18px ${ROBOTO}`, opacity: arrived ? 0.75 : 1, color: arrived ? undefined : t.text2 }}>{detail}</span>}
      </span>
      <Plate size={variant === 'compact' ? 'md' : 'lg'}>{plate}</Plate>
    </div>
  );
}

/** PIN de inicio en casillas (CodeInput de solo lectura): casillas de 48 × 56. */
export function PinBoxes({ digits, label = 'PIN de inicio' }: { digits: string; label?: string }) {
  const { t } = useVM();
  return (
    <div role="group" aria-label={`${label}: ${digits.split('').join(' ')}`} style={{ display: 'flex', gap: 8 }}>
      {digits.split('').map((d, i) => (
        <span key={i} aria-hidden="true" style={{ width: 48, height: 56, borderRadius: 12, background: t.field, boxShadow: `inset 0 0 0 1px ${t.bField}`, color: t.text, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 22px/1 ${POPPINS}` }}>{d}</span>
      ))}
    </div>
  );
}
