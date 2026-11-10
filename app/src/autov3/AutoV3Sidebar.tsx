/**
 * Sidebar del shell cuando se está viendo «Auto v3 navegable»: reemplaza al SideMenu normal.
 * Muestra el índice del lienzo (V3_GROUPS) con la misma estética que el resto de menús
 * (ej. el Selector de sección de la App Unificada) y navega escribiendo el hash.
 */
import { useEffect, useRef, useState } from 'react';
import { Icon } from '../ui/kit';
import { V3_ENTRIES, V3_GROUPS, V3Entry } from './AutoV3Page';

const MODULE_COLOR = '#4BAC4F';
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function keyFromHash(): string | null {
  const h = decodeURIComponent(window.location.hash.slice(1));
  return h.startsWith('autov3/') ? h.slice('autov3/'.length) : null;
}

export function AutoV3Sidebar() {
  const [query, setQuery] = useState('');
  const [key, setKey] = useState<string>(() => keyFromHash() ?? 'A0');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onHash = () => setKey(keyFromHash() ?? 'A0');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const open = (en: V3Entry) => {
    window.location.hash = `#autov3/${en.key}`;
    setKey(en.key);
  };

  const q = norm(query.trim());
  const groups = V3_GROUPS.map((g) => ({ ...g, entries: q ? g.entries.filter((x) => norm(`${x.key} ${x.title}`).includes(q)) : g.entries })).filter((g) => g.entries.length);
  const hits = groups.reduce((n, g) => n + g.entries.length, 0);

  return (
    <aside className="sidebar sidebar-auto" style={{ '--module-color': MODULE_COLOR } as React.CSSProperties}>
      <div className="side-top">
        <div className="module-intro">
          <span className="module-icon" style={{ background: MODULE_COLOR }}><Icon name="car" size={18} color="#000000" /></span>
          <span style={{ font: '700 15px Poppins, sans-serif', color: 'var(--fg)', flex: 1 }}>Auto v3</span>
          <span className="v-pill" style={{ '--v': MODULE_COLOR } as React.CSSProperties}>v3</span>
        </div>
        <div className="search-wrap">
          <div className={`search${q ? ' has-query' : ''}`}>
            <Icon name="search" size={18} color={q ? 'var(--accent-fg)' : 'var(--fg3)'} />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') { setQuery(''); (e.target as HTMLInputElement).blur(); }
              }}
              placeholder="Buscar pantalla…"
              aria-label="Buscar pantalla en Auto v3"
              autoComplete="off"
              spellCheck={false}
            />
            {query ? (
              <button className="search-clear" aria-label="Borrar búsqueda" onClick={() => { setQuery(''); searchRef.current?.focus(); }}><Icon name="close" size={12} color="var(--fg2)" /></button>
            ) : <kbd title="Atajo: /">/</kbd>}
          </div>
          {q && <div className="search-meta"><span>{hits === 0 ? 'Sin resultados' : `${hits} ${hits === 1 ? 'pantalla' : 'pantallas'}`}</span></div>}
        </div>
      </div>

      <nav aria-label="Pantallas de Auto v3" className="screen-nav">
        {groups.map((g) => (
          <div key={g.title} className="group">
            <div className="group-head"><span style={{ flex: 1 }}>{g.title}</span><span className="count">{g.entries.length}</span></div>
            {g.entries.map((x) => (
              <button key={x.key} className={`side-item${key === x.key ? ' on' : ''}`} aria-current={key === x.key ? 'true' : undefined} onClick={() => open(x)}>
                <span className="code">{x.key}</span>
                <span className="title">{x.title}</span>
              </button>
            ))}
          </div>
        ))}
        {!groups.length && <div className="empty"><Icon name="search" size={28} color="var(--fg4)" /><span>Nada para «{query}».</span></div>}
      </nav>

      <div className="shortcuts" style={{ marginTop: 'auto' }}>
        <span>{V3_ENTRIES.length} pantallas en el lienzo</span>
      </div>
    </aside>
  );
}
