/**
 * Piezas de Auto v3 que no están en el kit compartido, armadas con los tokens y las medidas del sistema de diseño:
 * pantalla con mapa y hoja, controles sobre el mapa, tarjeta del pedido en vivo, campos de recorrido, barra de acción
 * fija, cifras, panel verde, filas de datos, línea de tiempo, casilla para subir, deslizar para confirmar y teclado.
 */
import { ReactNode, useState } from 'react';
import { useVM } from '../integrada/model';
import { I, IconBtn, Screen, StatusSpace } from '../integrada/kit';
import { Avatar, Plate } from '../integrada/ds';
import { AutoMap, MapVariant } from '../ui/AutoMap';

export const P = 'Poppins, Arial, sans-serif';
export const R = 'Roboto, Arial, sans-serif';

/** Mapa a pantalla completa + cabecera flotante + hoja abajo (receta «pantalla con mapa y hoja»). */
/** `floating` va sobre la hoja, a la derecha (el SOS). */
export function MapScreen({ id, variant, heat, top, children, tabs, floating }: { id: string; variant: MapVariant; heat?: boolean; top?: ReactNode; children: ReactNode; tabs?: boolean; floating?: ReactNode }) {
  const { map } = useVM();
  return (
    <Screen id={id}>
      <AutoMap variant={variant} heat={heat} drop palette={map} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <StatusSpace />
        {top && <div style={{ padding: '8px 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>{top}</div>}
      </div>
      <span style={{ flex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2, flex: 'none' }}>
        {floating && <div style={{ position: 'absolute', right: 20, bottom: 'calc(100% + 16px)' }}>{floating}</div>}
        <MapSheet tabs={tabs}>{children}</MapSheet>
      </div>
    </Screen>
  );
}

/** Hoja sobre el mapa: radio 24, manija de 32 × 4, padding 24, surfaceRaised, elevación 3. */
export function MapSheet({ children, tabs }: { children: ReactNode; tabs?: boolean }) {
  const { t } = useVM();
  return (
    <div style={{ position: 'relative', zIndex: 2, flex: 'none', borderRadius: '24px 24px 0 0', background: t.raised, boxShadow: t.shadow3, padding: `12px 24px ${tabs ? 136 : 34}px`, display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 640, overflowY: 'auto', boxSizing: 'border-box' }}>
      <span aria-hidden="true" style={{ alignSelf: 'center', width: 32, height: 4, borderRadius: 2, background: t.handle, flex: 'none' }} />
      {children}
    </div>
  );
}

/** Control sobre el mapa: círculo o pastilla de 48 en #FFFFFF / #1A1A1A con sombra media. */
export function MapControl({ icon, label, onClick, children }: { icon?: string; label: string; onClick?: () => void; children?: ReactNode }) {
  const { t } = useVM();
  return (
    <button aria-label={children ? undefined : label} onClick={onClick} style={{ flex: 'none', height: 48, minWidth: 48, padding: children ? '0 16px' : 0, borderRadius: 9999, background: t.raised, color: t.text, boxShadow: '0 8px 24px #0000001F', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, font: `500 14px/20px ${R}` }}>
      {icon && <I name={icon} size={24} />}
      {children}
    </button>
  );
}

/** Insignia flotante sobre el mapa («Llega en 3 min · 14:36»). */
export function MapBadge({ children }: { children: ReactNode }) {
  const { t } = useVM();
  return <span style={{ height: 48, padding: '0 16px', borderRadius: 9999, background: t.inverse, color: t.onInverse, display: 'inline-flex', alignItems: 'center', gap: 8, font: `500 14px/20px ${R}`, letterSpacing: 0.1, boxShadow: '0 8px 24px #0000001F' }}>{children}</span>;
}

/** Botón SOS: rojo, nunca verde. */
export function SosButton({ onClick }: { onClick: () => void }) {
  const { t } = useVM();
  return (
    <button aria-label="SOS, pedir ayuda" onClick={onClick} style={{ flex: 'none', height: 48, padding: '0 20px', borderRadius: 9999, background: t.danger, color: t.onDanger, font: `700 16px/24px ${P}`, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px #0000001F' }}>
      <I name="alert" size={20} />SOS
    </button>
  );
}

/** Título de hoja con texto de apoyo. */
export function SheetTitle({ title, sub, size = 22 }: { title: string; sub?: string; size?: 22 | 18 | 16 }) {
  const { t } = useVM();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <h1 style={{ margin: 0, font: `700 ${size}px/${size === 22 ? 30 : size === 18 ? 26 : 24}px ${P}`, letterSpacing: size === 22 ? -0.2 : 0 }}>{title}</h1>
      {sub && <span style={{ font: `400 15px/22px ${R}`, color: t.text2 }}>{sub}</span>}
    </div>
  );
}

/** LiveRequestCard: pedido en vivo de alto contraste (negra; blanca en oscuro). */
export function LiveRequestCard({ title, sub, plate, car, onClick }: { title: string; sub: string; plate?: string; car?: string; onClick?: () => void }) {
  const { t, D } = useVM();
  return (
    <button onClick={onClick} style={{ width: '100%', borderRadius: 16, padding: 16, boxSizing: 'border-box', background: t.inverse, color: t.onInverse, display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar ini={D.driver.ini} size={40} />
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: `700 16px/24px ${P}` }}>{title}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: `400 13px/18px ${R}`, opacity: 0.8 }}><span className="ch-pulse-dot" style={{ width: 8, height: 8, borderRadius: 9999, background: t.brand }} />{sub}</span>
        </span>
        <I name="chevronright" size={20} style={{ color: t.brandOnInverse }} />
      </span>
      {plate && <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Plate>{plate}</Plate><span style={{ font: `400 13px/18px ${R}`, opacity: 0.8 }}>{car}</span></span>}
    </button>
  );
}

/** RouteFields: origen y destino unidos por una línea (destino vacío, con foco o completo). */
export function RouteFields({ from, to, focus }: { from: string; to?: string; focus?: boolean }) {
  const { t } = useVM();
  const row = (label: string, value: ReactNode, dot: ReactNode, active?: boolean) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 52, padding: '0 16px', borderRadius: 12, background: t.field, boxShadow: active ? `inset 0 0 0 2px ${t.focus}` : `inset 0 0 0 1px ${t.bField}` }}>
      {dot}
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <span style={{ font: `500 12px/16px ${R}`, letterSpacing: 0.2, color: t.text2 }}>{label}</span>
        <span style={{ font: `400 15px/22px ${R}`, color: value ? t.text : t.text3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || '¿A dónde vas?'}</span>
      </span>
    </div>
  );
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: 21, top: 34, bottom: 34, width: 2, background: t.bDefault }} />
      {row('Desde', from, <span style={{ width: 12, height: 12, borderRadius: 9999, background: t.brand, flex: 'none', position: 'relative' }} />)}
      {row('Hasta', to, <span style={{ width: 12, height: 12, borderRadius: 2, background: t.text, flex: 'none', position: 'relative' }} />, focus)}
    </div>
  );
}

/** Barra de acción fija: «Total» a la izquierda y el botón principal a la derecha, o un botón a lo ancho. */
export function StickyActionBar({ total, children }: { total?: string; children: ReactNode }) {
  const { t } = useVM();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 16, boxShadow: `0 -1px 0 ${t.line}` }}>
      {total && (
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ font: `400 13px/18px ${R}`, color: t.text2 }}>Total</span>
          <span style={{ font: `700 18px/26px ${P}` }}>{total}</span>
        </span>
      )}
      <span style={{ flex: 1 }}>{children}</span>
    </div>
  );
}

/** StatStrip: cifras grandes centradas con el rótulo abajo, separadas por línea fina (en blanco sobre verde). */
export function StatStrip({ items, onBrand, compact }: { items: [string, string][]; onBrand?: boolean; compact?: boolean }) {
  const { t } = useVM();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map(([value, label], i) => (
        <span key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, boxShadow: i ? `inset 1px 0 0 ${onBrand ? 'rgba(255,255,255,.35)' : t.line}` : 'none', color: onBrand ? '#FFFFFF' : t.text }}>
          <span style={{ font: compact ? `700 16px/24px ${P}` : `700 22px/30px ${P}`, letterSpacing: compact ? 0 : -0.2, whiteSpace: 'nowrap' }}>{value}</span>
          <span style={{ font: `400 13px/18px ${R}`, opacity: onBrand ? 0.9 : 1, color: onBrand ? undefined : t.text2 }}>{label}</span>
        </span>
      ))}
    </div>
  );
}

/** HeroPanel: bloque verde con kicker y título en blanco y una franja de cifras. Uno por pantalla. */
export function HeroPanel({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  const { t } = useVM();
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 24, padding: 20, background: t.brand, color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#FFFFFF', opacity: 0.2, WebkitMask: 'url(./brand/patronaje.svg) 0 0/228px auto repeat', mask: 'url(./brand/patronaje.svg) 0 0/228px auto repeat' }} />
      <span style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: `500 14px/20px ${R}`, letterSpacing: 0.1 }}>{kicker}</span>
        <span style={{ font: `700 28px/36px ${P}`, letterSpacing: -0.3 }}>{title}</span>
      </span>
      {children && <span style={{ position: 'relative' }}>{children}</span>}
    </div>
  );
}

/** FactList: pares rótulo / valor dentro de una tarjeta, sin íconos. */
export function FactList({ rows, total }: { rows: [ReactNode, ReactNode][]; total?: [ReactNode, ReactNode] }) {
  const { t } = useVM();
  return (
    <div style={{ borderRadius: 16, padding: 16, background: t.cardBg, boxShadow: t.shadow1, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map(([k, v], i) => (
        <span key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, font: `400 15px/22px ${R}` }}><span style={{ color: t.text2 }}>{k}</span><span style={{ textAlign: 'right' }}>{v}</span></span>
      ))}
      {total && (
        <span style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingTop: 10, boxShadow: `inset 0 1px 0 ${t.line}` }}>
          <span style={{ font: `500 15px/22px ${R}` }}>{total[0]}</span><span style={{ font: `700 18px/26px ${P}` }}>{total[1]}</span>
        </span>
      )}
    </div>
  );
}

/** StatusTimeline vertical: hecho en verde con ✓, pendiente en gris. */
export function StatusTimeline({ steps }: { steps: [string, string, boolean][] }) {
  const { t } = useVM();
  return (
    <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
      {steps.map(([label, time, done], i) => (
        <li key={label} style={{ display: 'flex', gap: 12, minHeight: 48 }}>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ width: 24, height: 24, borderRadius: 9999, background: done ? t.brand : t.fill, color: done ? t.onBrand : t.text3, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{done && <I name="check" size={16} />}</span>
            {i < steps.length - 1 && <span style={{ flex: 1, width: 2, background: done ? t.brand : t.bDefault }} />}
          </span>
          <span style={{ flex: 1, display: 'flex', justifyContent: 'space-between', font: `${done ? 500 : 400} 15px/22px ${R}`, color: done ? t.text : t.text2 }}><span>{label}</span><span style={{ color: t.text2 }}>{time}</span></span>
        </li>
      ))}
    </ol>
  );
}

/** Fila de conductor o pasajero con avatar, nombre, estado y «Ver detalle». */
export function PersonRow({ ini, name, sub, action }: { ini: string; name: string; sub: ReactNode; action?: ReactNode }) {
  const { t } = useVM();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Avatar ini={ini} size={56} verified />
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: `700 16px/24px ${P}` }}>{name}</span>
        <span style={{ font: `400 13px/18px ${R}`, color: t.text2, display: 'flex', alignItems: 'center', gap: 4 }}>{sub}</span>
      </span>
      {action}
    </div>
  );
}

/** RatingDisplay: estrella de 16 + «4,9». */
export function Rating({ value }: { value: string }) {
  const { t } = useVM();
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: t.text }}><I name="star" size={16} style={{ color: t.iconBrand }} /><b style={{ fontWeight: 500 }}>{value}</b></span>;
}

/** UploadSlot: casilla para subir un documento o una foto, con el estado en texto + ícono. */
export function UploadSlot({ label, done, onClick }: { label: string; done?: boolean; onClick?: () => void }) {
  const { t } = useVM();
  return (
    <button onClick={onClick} style={{ aspectRatio: '1', borderRadius: 12, background: done ? t.brandSubtle : t.cardBg, outline: done ? 'none' : `1.5px dashed ${t.bField}`, outlineOffset: -1.5, color: t.text, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, font: `500 12px/16px ${R}`, letterSpacing: 0.2 }}>
      <I name={done ? 'success' : 'camera'} size={24} style={{ color: done ? t.success : t.text2 }} />
      {label}
      <span style={{ color: done ? t.success : t.text2 }}>{done ? 'Lista' : 'Subir'}</span>
    </button>
  );
}

/** SlideToConfirm: tocar o deslizar la perilla hasta el final confirma (solo para acciones críticas). */
export function SlideToConfirm({ label, onConfirm }: { label: string; onConfirm: () => void }) {
  const { t } = useVM();
  const [x, setX] = useState(0);
  const max = 342 - 64;
  return (
    <div aria-label={label} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onConfirm(); }} onClick={() => { setX(max); setTimeout(onConfirm, 180); }}
      style={{ position: 'relative', height: 64, borderRadius: 9999, background: t.brandSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', font: `700 16px/24px ${P}`, color: t.text }}>
      <span style={{ position: 'absolute', left: 4 + x, top: 4, width: 56, height: 56, borderRadius: 9999, background: t.brand, color: t.onBrand, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'left 180ms cubic-bezier(.2,0,0,1)' }}><I name="chevronright" size={24} /></span>
      {label}
    </div>
  );
}

/** Teclado numérico del PIN: teclas de 64 en áreas táctiles amplias. */
export function Keypad({ onKey, onErase }: { onKey: (d: string) => void; onErase: () => void }) {
  const { t } = useVM();
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {keys.map((k, i) => (
        <button key={i} aria-label={k === '⌫' ? 'Borrar' : k || undefined} disabled={!k} onClick={() => (k === '⌫' ? onErase() : k && onKey(k))}
          style={{ height: 64, borderRadius: 16, background: k && k !== '⌫' ? t.fill : 'transparent', color: t.text, font: `700 22px/1 ${P}`, visibility: k ? 'visible' : 'hidden' }}>{k}</button>
      ))}
    </div>
  );
}

/** Encabezado de pantalla sin mapa: volver + título (app bar de 56). */
export function AppBar({ title, onBack, right }: { title?: string; onBack: () => void; right?: ReactNode }) {
  return (
    <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 8, height: 56, padding: '0 20px' }}>
      <IconBtn icon="chevronleft" label="Volver" onClick={onBack} />
      <h1 style={{ flex: 1, minWidth: 0, margin: 0, font: `700 18px/26px ${P}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
      {right}
    </div>
  );
}

