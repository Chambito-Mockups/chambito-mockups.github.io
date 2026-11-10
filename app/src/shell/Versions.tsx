/**
 * Version picker next to the phone: one card per version (v1, v2, v3) with its label and bar.
 */
import { CSSProperties } from 'react';
import { MODULES, Module, VERSIONS, Version, entriesIn } from '../registry';

const MODULE_COLOR: Record<Module, string> = { auto: '#4BAC4F', market: '#F0A500' };

/** `compact`: one line per version and only the chosen one opens (used in «Componentes», where space is for content). */
export function VersionPanel({ module, version, onVersion, compact }: {
  module: Module; version: Version; onVersion: (v: Version) => void;
  compact?: boolean;
}) {
  const moduleColor = MODULE_COLOR[module];
  return (
    <section
      className={`version-panel${compact ? ' compact' : ''}`}
      style={{ '--module-color': moduleColor } as CSSProperties}
      aria-label={`Versiones de ${MODULES[module].label}`}
    >
      <div className="vp-head">
        <span className="vp-title">Versiones</span>
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
              title={v.hint}
            >
              <span className="vp-top">
                <span className="vp-id">{v.id}</span>
                <span className="vp-name">{v.label}</span>
                {on && <span className="vp-here">Estás viendo</span>}
              </span>
              {(!compact || on) && (
                <span className="vp-bar" aria-label={`Barra: ${v.bar.join(', ')}`}>
                  {v.bar.map((tab) => <span key={tab} className={tab === 'Inicio' ? 'first' : undefined}>{tab}</span>)}
                </span>
              )}
              {(!compact || on) && <span className="vp-meta">{v.source}{count === null ? '' : ` · ${count} pantallas`}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
