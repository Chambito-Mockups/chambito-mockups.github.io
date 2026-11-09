/**
 * Piezas que se repiten en las 38 pantallas de la app integrada: el marco de la pantalla, el encabezado,
 * el cuerpo con scroll, el pie con los botones, los botones (principal, secundario, texto y peligro),
 * el botón redondo de ícono, el chip y el ícono. Los colores salen de `t` (tokens de TOKENS.json v1.27.0).
 */
import { AriaAttributes, CSSProperties, MouseEvent, ReactNode } from 'react';
import { useVM } from './model';

const POPPINS = 'Poppins, Arial, sans-serif';

/** Íconos del kit de marca (máscaras en integrada.css), del color del texto. */
export function I({ name, size = 24, style, label }: { name: string; size?: number; style?: CSSProperties; label?: string }) {
  return (
    <span
      className={`i i-${name}`}
      data-ig-icon={name}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      style={{ width: size, height: size, ...style }}
    />
  );
}

/** Pantalla de 390 × 844. `id` queda en data-screen-label, como en el diseño. */
export function Screen({ id, children }: { id: string; children: ReactNode }) {
  const { t } = useVM();
  return (
    <div data-screen-label={id} style={{ position: 'absolute', left: 0, top: 0, width: 390, height: 844, display: 'flex', flexDirection: 'column', background: t.bg, overflow: 'hidden' }}>
      {children}
    </div>
  );
}

/** Lugar de la barra de estado (47). */
export const StatusSpace = () => <div aria-hidden="true" style={{ flex: 'none', height: 47 }} />;

/** Fila de 56 con el botón de volver, el título y las acciones. */
export const Header = ({ children }: { children: ReactNode }) => (
  <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 8, height: 56, padding: '0 16px' }}>{children}</div>
);

/** Título de la pantalla en el encabezado (h1, una línea). */
export const Title = ({ children }: { children: ReactNode }) => (
  <h1 style={{ flex: 1, minWidth: 0, margin: 0, font: `700 20px/28px ${POPPINS}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{children}</h1>
);

/** Contenido con scroll vertical. */
export const Body = ({ children }: { children: ReactNode }) => (
  <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: '0 16px', boxSizing: 'border-box' }}>{children}</div>
);

/** Pie fijo con la acción principal, sobre una línea. */
export function Footer({ children }: { children: ReactNode }) {
  const { t } = useVM();
  return (
    <div style={{ flex: 'none', padding: '12px 16px 34px', background: t.bg, boxShadow: `0 -1px 0 ${t.line}`, display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
  );
}

/** Encabezado de sección: título a la izquierda y un enlace a la derecha. */
export const SectionHead = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, margin: '0 0 12px' }}>{children}</div>
);

export const H2 = ({ children }: { children: ReactNode }) => <h2 style={{ margin: 0, font: `700 18px/26px ${POPPINS}` }}>{children}</h2>;

export function Divider() {
  const { t } = useVM();
  return <span style={{ display: 'block', height: 1, background: t.line }} />;
}

type BtnKind = 'primary' | 'secondary' | 'ghost' | 'danger';

/** Botón de 52 a lo ancho. Uno solo en verde por pantalla. */
export function Btn({ kind = 'primary', onClick, children, ...aria }: { kind?: BtnKind; onClick?: (e: MouseEvent) => void; children: ReactNode; 'aria-label'?: string; 'aria-disabled'?: AriaAttributes['aria-disabled'] }) {
  const { t } = useVM();
  const look: Record<BtnKind, CSSProperties> = {
    primary: { background: t.brand, color: t.onBrand },
    secondary: { background: 'transparent', color: t.text, boxShadow: `inset 0 0 0 1px ${t.bDefault}` },
    ghost: { color: t.text },
    danger: { background: t.danger, color: t.onDanger },
  };
  return (
    <button
      {...aria}
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, padding: '0 20px', borderRadius: 9999, font: `700 16px/24px ${POPPINS}`, boxSizing: 'border-box', width: '100%', whiteSpace: 'nowrap', ...look[kind] }}
    >
      {children}
    </button>
  );
}

/** Botón de ícono de 44 (redondo o, con `square`, de radio 12). */
export function IconBtn({ icon, label, size = 20, square, onClick, ...aria }: { icon: string; label: string; size?: number; square?: boolean; onClick?: (e: MouseEvent) => void; 'aria-pressed'?: AriaAttributes['aria-pressed']; 'aria-current'?: AriaAttributes['aria-current'] }) {
  const { t } = useVM();
  return (
    <button
      {...aria}
      aria-label={label}
      onClick={onClick}
      style={{ flex: 'none', width: 44, height: 44, borderRadius: square ? 12 : 9999, background: t.fill, color: t.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <I name={icon} size={size} />
    </button>
  );
}

/** Chip de 36. `c` viene de `chip()` del modelo: colores según esté elegido (invertido, nunca verde). */
export function Chip({ c, onClick, children, ...aria }: { c: { bg: string; fg: string }; onClick?: (e: MouseEvent) => void; children: ReactNode; 'aria-pressed'?: AriaAttributes['aria-pressed'] }) {
  return (
    <button
      {...aria}
      onClick={onClick}
      style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 16px', borderRadius: 9999, background: c.bg, color: c.fg, font: '500 14px/20px Roboto, Arial, sans-serif', whiteSpace: 'nowrap' }}
    >
      {children}
    </button>
  );
}
