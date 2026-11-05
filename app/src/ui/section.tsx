/**
 * Section selector from «Prototipo Auto» (explorer): «Servicios ▾» / «Auto ▾» / «Market ▾» at the top of
 * each home. It opens «Elegí qué querés hacer» (overlay `explorer`). The bottom bar never changes.
 */
import { Section, useApp } from '../store';
import { P } from '../theme';
import { Icon } from './icon';

export const SECTION_META: Record<Section, { label: string; title: string; icon: string; hint: string; tag?: string }> = {
  servicios: { label: 'Servicios', title: 'Servicios', icon: 'limpieza', hint: 'Limpieza, enfermería, niñeras y más' },
  auto: { label: 'Auto', title: 'Chambito Auto', icon: 'car', hint: 'Pedí un viaje o manejá con tu auto' },
  market: { label: 'Market', title: 'Chambito Market', icon: 'shoppingBag', hint: 'Comprá y vendé con gente verificada', tag: 'Nuevo' },
};
export const SECTIONS: Section[] = ['servicios', 'auto', 'market'];

/** Pill of 48 with the section icon on green (white, COL-03), its name and a chevron. */
export function SectionSelector({ section }: { section: Section }) {
  const { t, setOverlay } = useApp();
  const m = SECTION_META[section];
  return (
    <button
      className="press"
      aria-label={`Sección: ${m.label}. Cambiar de sección`}
      aria-haspopup="dialog"
      onClick={() => setOverlay('explorer')}
      style={{ height: 48, borderRadius: 24, background: t.sheet, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px 0 8px', flex: 'none', boxShadow: t.shadowCard }}
    >
      <span style={{ width: 32, height: 32, borderRadius: 12, background: t.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <Icon name={m.icon} size={20} color={t.onGreen} />
      </span>
      <span style={{ font: P(16), color: t.text }}>{m.label}</span>
      <Icon name="chevronDown" size={16} color={t.text2} />
    </button>
  );
}
