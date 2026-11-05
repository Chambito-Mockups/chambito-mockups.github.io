/**
 * «Prototipo Auto» explorer, integrated in the prototype as one more navigation option:
 * - X1  Portada de Servicios with the section selector and «Nuevo: Chambito Auto»
 * - X2  «Elegí qué querés hacer»: Servicios · Chambito Auto · Chambito Market, the current one marked
 * - A11 Actividad with every section together and a filter Todo · Servicios · Auto · Market
 * The bar stays Inicio · Actividad · Perfil in every section, and the app reopens in the last section used.
 */
import { useState } from 'react';
import { Section, useApp } from '../store';
import { P, R } from '../theme';
import { AutoMap } from './AutoMap';
import { CircleButton, HubTopChrome, Icon, Sheet, TopBar } from './kit';
import { MScreen, RoundBtn } from '../market/kit';
import { SECTION_META, SECTIONS } from './section';
import { BottomSheet } from './sheets';
import { Filter, ModuleFilter } from './hub';
import { FloatingNav } from '../screens/common';
import { ServicesActivityRows } from '../screens/passenger';
import { ConsultasList } from '../market/buyer';
import { ServiceSheet } from '../market/entry';

/** Go to a section's home and remember it. */
export function useGoSection() {
  const { go, set, autoRoot, setOverlay } = useApp();
  return (s: Section) => {
    set({ lastSection: s });
    setOverlay(null);
    go(s === 'auto' ? autoRoot() : s === 'market' ? 'M01' : 'inicio', { replace: true });
  };
}

/* ---------------- X2 · Explorador ---------------- */
export function ExplorerSheet() {
  const { t, settings, setOverlay, screen } = useApp();
  const goSection = useGoSection();
  // the section you are in: the screen says it, the last one used is the fallback
  const here: Section = screen === 'inicio' ? 'servicios' : screen.startsWith('M') || screen.startsWith('V') ? 'market' : screen.startsWith('A') || screen.startsWith('E') || screen.startsWith('D') ? 'auto' : settings.lastSection;
  const close = () => setOverlay(null);
  return (
    <BottomSheet onClose={close} label="Explorá Chambito">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 4 }}>
          <img src={t.name === 'dark' ? './brand/chambito-horizontal-blanco.png' : './brand/chambito-horizontal.png'} alt="Chambito" style={{ height: 32, width: 'auto', display: 'block', alignSelf: 'flex-start' }} />
          <span style={{ font: R(15), color: t.text2 }}>Elegí qué querés hacer</span>
        </div>
        <button aria-label="Cerrar" className="press" onClick={close} style={{ width: 40, height: 40, borderRadius: 20, background: t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <Icon name="close" size={18} />
        </button>
      </div>
      <div role="list" aria-label="Secciones de Chambito" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SECTIONS.filter((s) => s !== 'auto' || settings.autoEnabled).map((s) => {
          const m = SECTION_META[s];
          const on = s === here;
          return (
            <button
              key={s}
              role="listitem"
              className="press"
              aria-current={on ? 'page' : undefined}
              aria-label={`${m.title}: ${m.hint}${on ? ', estás acá' : m.tag ? `, ${m.tag.toLowerCase()}` : ''}`}
              onClick={() => (on ? close() : goSection(s))}
              style={{ borderRadius: 16, background: t.cardOnBg, boxShadow: on ? `inset 0 0 0 2px ${t.iconBrand}` : t.shadowCard, padding: 16, display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', width: '100%' }}
            >
              <span style={{ width: 52, height: 52, borderRadius: 16, background: on ? t.green : t.well, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                <Icon name={m.icon} size={28} color={on ? t.onGreen : t.icon} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 8, rowGap: 4 }}>
                  <span style={{ font: P(17), whiteSpace: 'nowrap' }}>{m.title}</span>
                  {on ? (
                    <span style={{ font: R(12, 500), color: t.success, background: t.greenSoft, borderRadius: 12, padding: '2px 8px' }}>Estás acá</span>
                  ) : m.tag ? (
                    <span style={{ font: R(12, 500), color: t.success, background: t.greenSoft, borderRadius: 12, padding: '2px 8px' }}>{m.tag}</span>
                  ) : null}
                </span>
                <span style={{ font: R(14), color: t.text2 }}>{m.hint}</span>
              </span>
              {on ? (
                <span aria-hidden style={{ width: 28, height: 28, borderRadius: 14, background: t.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name="check" size={16} color={t.onGreen} /></span>
              ) : (
                <Icon name="chevronRight" size={20} color={t.text2} />
              )}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}

/* ---------------- X1 · Portada de Servicios ---------------- */
const POPULAR: [icon: string, label: string, hint: string][] = [
  ['limpieza', 'Tareas domésticas', 'Hogar y oficinas'],
  ['enfermero', 'Enfermero', 'En tu casa'],
  ['ninera', 'Cuidador de niños', 'Cuidado de chicos'],
];

export function InicioExplorer() {
  const { t, go, settings, showToast } = useApp();
  const goSection = useGoSection();
  const [service, setService] = useState<(typeof POPULAR)[number] | null>(null);
  return (
    <>
      <AutoMap variant="base" drop />
      <HubTopChrome section="servicios" onProfile={() => go('perfil', { replace: true })} />
      <CircleButton icon="crosshair" label="Ir a mi ubicación" onClick={() => showToast('Ubicación actualizada')} style={{ position: 'absolute', right: 20, bottom: settings.autoEnabled ? 452 : 368, zIndex: 11 }} />
      <Sheet bottomPad={112} gap={16}>
        <button className="press" onClick={() => setService(POPULAR[0])} style={{ height: 56, borderRadius: 28, background: t.card, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', textAlign: 'left' }}>
          <Icon name="search" size={22} />
          <span style={{ font: P(18) }}>¿Qué necesitás?</span>
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: R(14, 500), color: t.text2 }}>Servicios populares</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8 }}>
            {POPULAR.map((s) => (
              <button key={s[1]} className="press quick-tile" onClick={() => setService(s)} style={{ background: t.card, borderRadius: 16, padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Icon name={s[0]} size={28} />
                <span style={{ font: R(13, 500), textAlign: 'center' }}>{s[1]}</span>
              </button>
            ))}
          </div>
        </div>
        {settings.autoEnabled && (
          <button className="press" onClick={() => goSection('auto')} style={{ background: t.card, borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', width: '100%' }}>
            <span style={{ width: 44, height: 44, borderRadius: 22, background: t.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name="car" size={24} color={t.onGreen} /></span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ font: P(15) }}>Nuevo: Chambito Auto</span>
              <span style={{ font: R(13), color: t.text2 }}>Pedí un viaje sin salir de Chambito</span>
            </span>
            <Icon name="chevronRight" size={18} color={t.text2} />
          </button>
        )}
      </Sheet>
      <FloatingNav active="inicio" />
      {service && <ServiceSheet service={service} onClose={() => setService(null)} />}
    </>
  );
}

/* ---------------- A11 · Actividad con todas las secciones ---------------- */
export function ExplorerActivity() {
  const { t, go } = useApp();
  const [f, setF] = useState<Filter>('todo');
  return (
    <>
      <MScreen style={{ paddingBottom: 120 }}>
        <TopBar large title="Actividad" right={<RoundBtn icon="bell" label="Notificaciones" badge={2} onClick={() => go('EA4')} />} />
        <div style={{ padding: '4px 20px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ModuleFilter value={f} onChange={setF} label="Filtrar la actividad por sección" />
          {(f === 'todo' || f === 'servicios' || f === 'auto') && <ServicesActivityRows only={f === 'todo' ? undefined : f} />}
          {(f === 'todo' || f === 'market') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ font: P(18) }}>Market · Mis consultas</span>
              <ConsultasList />
            </div>
          )}
          {f === 'market' && <span style={{ font: R(13), color: t.text2 }}>Las compras dentro de la app llegan en la Fase 2.</span>}
        </div>
      </MScreen>
      <FloatingNav active="actividad" band />
    </>
  );
}
