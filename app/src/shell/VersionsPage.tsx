/**
 * «Versiones»: lo principal es v3 en Auto y en Market; acá se comparan con las versiones anteriores
 * (v1, v2) y se pueden abrir como referencia.
 */
import { CSSProperties } from 'react';
import { MODULES, Module, VERSIONS, Version, entriesIn } from '../registry';
import { V3_ENTRIES } from '../autov3/AutoV3Page';
import { Icon } from '../ui/kit';

const MODULE_COLOR: Record<Module, string> = { auto: '#4BAC4F', market: '#F0A500' };

/** qué cambia respecto de v3, corto */
const VS_V3: Record<Module, Record<string, string[]>> = {
  auto: {
    v3: ['Selector «Auto ▾» arriba: Servicios · Auto · Market', 'Barra fija: Inicio · Actividad · Perfil', 'Modos Viaje · Moto · Envío y vista conductor'],
    v2: ['El mismo selector, pero sin modos Moto y Envío', 'Auto, Servicios y Market en un solo Inicio'],
    v1: ['Auto es una pestaña propia en la barra', 'Sin selector de secciones'],
  },
  market: {
    v3: ['Market es una sección del selector «Market ▾»', 'Barra fija: Inicio · Actividad · Perfil'],
    v2: ['La Tienda es una pestaña de la barra', 'Barra de 5: Inicio · Auto · Tienda · Actividad · Perfil'],
    v1: ['La Tienda se abre desde una tarjeta en Inicio', 'Se vuelve con la flecha atrás'],
  },
};

export function VersionsPage({ onOpen }: { onOpen: (m: Module, v: Version) => void }) {
  return (
    <div className="vs-page">
      <h1 className="vs-title">Versiones</h1>
      <p className="vs-lead">Lo principal es <b>v3</b>. Las demás quedan como referencia.</p>
      {(['auto', 'market'] as Module[]).map((m) => {
        // v3 primero
        const list = [...VERSIONS[m]].sort((a, b) => (a.id === 'v3' ? -1 : b.id === 'v3' ? 1 : b.id.localeCompare(a.id)));
        return (
          <section key={m} className="vs-module" aria-label={`Versiones de ${MODULES[m].label}`} style={{ '--module-color': MODULE_COLOR[m] } as CSSProperties}>
            <h2 className="vs-module-title">
              <span className="module-icon" style={{ background: MODULE_COLOR[m] }}><Icon name={MODULES[m].icon} size={16} color="#000000" /></span>
              Chambito {MODULES[m].label}
            </h2>
            <div className="vs-cards">
              {list.map((v) => {
                const main = v.id === 'v3';
                const count = m === 'auto' && v.page === 'autov3' ? V3_ENTRIES.length : v.page ? null : entriesIn(m, v.id).length;
                return (
                  <article key={v.id} className={`vs-card${main ? ' main' : ''}`} style={{ '--v': v.color } as CSSProperties}>
                    <header className="vs-card-head">
                      <span className="vp-id">{v.id}</span>
                      <b>{v.label}</b>
                      {main && <span className="vs-main">Principal</span>}
                    </header>
                    <span className="vp-bar" aria-label={`Barra: ${v.bar.join(', ')}`}>
                      {v.bar.map((tab) => <span key={tab} className={tab === 'Inicio' ? 'first' : undefined}>{tab}</span>)}
                    </span>
                    <ul className="vs-diff">
                      {VS_V3[m][v.id]?.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                    <footer className="vs-card-foot">
                      <span>{count === null ? v.source : `${count} pantallas`}</span>
                      <button className={main ? 'primary-btn' : 'ghost-btn'} onClick={() => onOpen(m, v)} aria-label={`${main ? 'Abrir' : 'Ver ejemplo de'} ${MODULES[m].label} ${v.id}`}>
                        {main ? 'Abrir' : 'Ver ejemplo'}
                      </button>
                    </footer>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
