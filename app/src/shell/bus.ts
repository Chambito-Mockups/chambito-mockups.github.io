/**
 * Une las dos versiones principales como una sola app: el selector de secciones de Auto v3
 * abre Market v3 y el de Market v3 abre Auto v3 (o Servicios, que vive en Auto v3).
 */
export type Section = 'servicios' | 'auto' | 'market';

/** true mientras se ve Market v3 como versión principal (no una versión de referencia) */
export const link = { market: false };

export function openSection(s: Section) {
  if (s === 'market') window.dispatchEvent(new CustomEvent('chambito:section', { detail: s }));
  else window.location.hash = `#autov3/${s === 'servicios' ? 'X1' : 'A0'}`;
}
