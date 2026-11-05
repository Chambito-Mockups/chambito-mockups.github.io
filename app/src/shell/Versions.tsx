/**
 * Version picker next to the phone: one big card per version (v1, v2, v3) with its bar, where it comes
 * from and how many screens it has. Choosing one applies its settings and opens its first screen.
 */
import { CSSProperties } from 'react';
import { MODULES, Module, VERSIONS, Version, entriesIn } from '../registry';

/** `compact`: one line per version and only the chosen one opens (used in «Componentes», where space is for content). */
export function VersionPanel({ module, version, onVersion, compact }: { module: Module; version: Version; onVersion: (v: Version) => void; compact?: boolean }) {
  return (
    <section className={`version-panel${compact ? ' compact' : ''}`} aria-label={`Versiones de ${MODULES[module].label}`}>
      <div className="vp-head">
        <span className="vp-title">Versiones de {MODULES[module].label}</span>
        <span className="vp-help">{compact ? 'Cada una trae sus referencias' : 'Elegí una para ver solo sus pantallas'}</span>
      </div>
      <div role="radiogroup" aria-label={`Versión de ${MODULES[module].label}`} className="vp-list">
        {VERSIONS[module].map((v) => {
          const on = v.id === version.id;
          const count = v.page ? null : entriesIn(module, v.id).length;
          return (
            <button
              key={v.id}
              role="radio"
              aria-checked={on}
              aria-label={`${v.id} · ${v.label}`}
              className={`vp-card${on ? ' on' : ''}`}
              style={{ '--v': v.color } as CSSProperties}
              onClick={() => onVersion(v)}
            >
              <span className="vp-top">
                <span className="vp-id">{v.id}</span>
                <span className="vp-name">{v.label}</span>
                {on && <span className="vp-here">Estás viendo</span>}
              </span>
              {(!compact || on) && (
                <>
                  <span className="vp-what">{v.what}</span>
                  <span className="vp-bar" aria-label={`Barra: ${v.bar.join(', ')}`}>
                    {v.bar.map((tab) => <span key={tab} className={tab === 'Inicio' ? 'first' : undefined}>{tab}</span>)}
                  </span>
                </>
              )}
              <span className="vp-meta">{v.source}{compact ? '' : ` · ${count === null ? 'página de propuestas' : `${count} pantallas`}`}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
