import { CSSProperties } from 'react';
import { useApp } from '../store';

/* ---------- Icon: Chambito filled set, tinted via CSS mask ---------- */
export function Icon({ name, size = 20, color, style }: { name: string; size?: number; color?: string; style?: CSSProperties }) {
  const { t } = useApp();
  return (
    <span
      aria-hidden
      data-icon={name}
      style={{
        width: size,
        height: size,
        flex: 'none',
        display: 'inline-block',
        background: color ?? t.icon,
        WebkitMask: `url(./ic/${name}.svg) center/contain no-repeat`,
        mask: `url(./ic/${name}.svg) center/contain no-repeat`,
        ...style,
      }}
    />
  );
}
