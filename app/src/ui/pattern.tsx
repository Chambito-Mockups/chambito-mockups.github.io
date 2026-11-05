import { CSSProperties } from 'react';
import { useApp } from '../store';
/**
 * Brand pattern (Patronaje.svg from the brand kit) at 4 %: text colour masked by the pattern, so it is
 * black on light and white on dark. Only behind chat, secondary screens and headers, never behind forms or dense lists.
 */
export function BrandPattern({ size = 228, style }: { size?: number; style?: CSSProperties }) {
  const { t } = useApp();
  const mask = `url(./brand/patronaje.svg) 0 0/${size}px auto repeat`;
  return <span aria-hidden data-pattern style={{ position: 'absolute', inset: 0, background: t.text, opacity: 0.04, WebkitMask: mask, mask, pointerEvents: 'none', ...style }} />;
}
