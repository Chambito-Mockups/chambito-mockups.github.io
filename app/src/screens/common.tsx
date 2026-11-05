import { useEffect, useState } from 'react';
import { ScreenId, useApp } from '../store';
import { BottomNavBar, Icon, NavKey, navItems } from '../ui/kit';
import { P, R } from '../theme';

/** Runs `fn` after `ms` while the simulation switch is on. */
export function useAutoAdvance(ms: number, fn: () => void, enabled = true) {
  const { settings } = useApp();
  useEffect(() => {
    if (!settings.simulate || !enabled) return;
    const id = window.setTimeout(fn, ms);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.simulate, enabled, ms]);
}

/** Seconds elapsed since mount (ticks every second). */
export function useSeconds() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setS((x) => x + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  return s;
}

export function useTabNav() {
  const { go, autoRoot } = useApp();
  return (k: NavKey) => {
    const map: Record<NavKey, ScreenId> = { inicio: 'inicio', auto: autoRoot(), tienda: 'M01', actividad: 'A11', perfil: 'perfil', equipos: 'equipos', comercios: 'comercios',
      // alternatives only drawn in the reference page; they open the closest existing screen
      servicios: 'inicio', trabajos: 'D3', agenda: 'D3', cobros: 'D9', mensajes: 'A11', pedir: 'inicio',
      modulos: 'inicio', trabajo: 'D3', explorar: 'M03' };
    go(map[k], { replace: true });
  };
}

/** Floating pill BottomNav, 20 from the sides and 28 from the bottom. */
export function FloatingNav({ active, band }: { active: NavKey; band?: boolean }) {
  const { settings, t, trip } = useApp();
  const onSelect = useTabNav();
  // Actividad shows a dot while a trip is active, wherever you are in the app
  const badges = { actividad: trip.phase !== 'none' && active !== 'actividad' };
  return (
    <>
      {/* on scrolling screens, a fade keeps content from showing around the floating bar */}
      {band && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 116, background: `linear-gradient(to bottom, transparent, ${t.mBg} 28%)`, zIndex: 29, pointerEvents: 'none' }} />}
      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 28, zIndex: 30 }}>
        <BottomNavBar items={navItems(settings.autoEnabled, settings.teams, settings.tiendaEntry === 'tab')} active={active} onSelect={onSelect} badges={badges} />
      </div>
    </>
  );
}

/** Screens outside the Auto scope (Inicio, Perfil, Equipos): unchanged in the brief, shown as stubs. */
export function StubScreen({ tab, title, text }: { tab: NavKey; title: string; text: string }) {
  const { t } = useApp();
  return (
    <>
      <div style={{ position: 'absolute', top: 47, left: 0, right: 0, bottom: 0, padding: '12px 20px 0', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <span style={{ font: P(28) }}>{title}</span>
        <div style={{ background: t.cardOnBg, borderRadius: 20, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Icon name="info" size={22} color={t.text2} />
          <span style={{ font: R(15), color: t.text2, textWrap: 'pretty' } as React.CSSProperties}>{text}</span>
        </div>
      </div>
      <FloatingNav active={tab} />
    </>
  );
}
