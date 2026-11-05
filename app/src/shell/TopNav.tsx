/** Viewer top bar: brand, the Auto | Market menu switcher, country, phone theme and page theme. */
import { useApp } from '../store';
import { MODULES, Module } from '../registry';
import { Icon } from '../ui/kit';

/* ---------------- Header ---------------- */
export type UiTheme = 'dark' | 'light';

export function TopNav({ module, onModule, onMenu, ui, onUi, navOn, onNav }: { module: Module; onModule: (m: Module) => void; onMenu: () => void; ui: UiTheme; onUi: (v: UiTheme) => void; navOn?: boolean; onNav?: () => void }) {
  const { settings, set } = useApp();
  return (
    <header className="topbar">
      <button className="menu-btn" aria-label="Abrir el menú de pantallas" onClick={onMenu}>
        <Icon name="menu" size={22} color="var(--fg)" />
      </button>
      <div className="brand">
        <img src="./pwa/icon-192.png" alt="" />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span className="brand-name">Chambito</span>
          <span className="brand-sub">Prototipo navegable</span>
        </div>
      </div>

      <nav className="modules" aria-label="Módulo">
        {(Object.keys(MODULES) as Module[]).map((m) => (
          <button key={m} className={module === m && !navOn ? 'on' : ''} aria-current={module === m && !navOn ? 'page' : undefined} onClick={() => onModule(m)}>
            <Icon name={MODULES[m].icon} size={18} color={module === m && !navOn ? '#000000' : 'var(--fg2)'} />
            <span>{MODULES[m].label}</span>
          </button>
        ))}
      </nav>
      {/* the integrated navigation (Servicios · Auto · Market) one click away from anywhere */}
      {onNav && (
        <nav className="modules" aria-label="Referencia">
          <button className={navOn ? 'on' : ''} aria-current={navOn ? 'page' : undefined} onClick={onNav} title="Diseños de Inicio, opciones de barra y componentes">
            <Icon name="layers" size={18} color={navOn ? '#000000' : 'var(--fg2)'} />
            <span>Navegación</span>
          </button>
        </nav>
      )}

      <div className="top-right">
        <div className="seg seg-sm" role="radiogroup" aria-label="País">
          {([['PY', 'PY', 'Paraguay'], ['AR', 'AR', 'Argentina']] as const).map(([v, l, name]) => (
            <button key={v} role="radio" aria-checked={settings.country === v} aria-label={name} title={name} className={settings.country === v ? 'on' : ''} onClick={() => set({ country: v })}>{l}</button>
          ))}
        </div>
        <button className="icon-btn" onClick={() => set({ theme: settings.theme === 'dark' ? 'light' : 'dark' })} aria-label={`Teléfono: cambiar a tema ${settings.theme === 'dark' ? 'claro' : 'oscuro'}`} title="Tema del teléfono">
          <Icon name="phone" size={15} color="var(--fg2)" />
          <span>{settings.theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
        </button>
        <button className="icon-btn square" onClick={() => onUi(ui === 'dark' ? 'light' : 'dark')} aria-label={`Página: cambiar a tema ${ui === 'dark' ? 'claro' : 'oscuro'}`} title={`Tema de la página: ${ui === 'dark' ? 'oscuro' : 'claro'}`}>
          <span aria-hidden style={{ fontSize: 17, lineHeight: 1 }}>{ui === 'dark' ? '☾' : '☀'}</span>
        </button>
      </div>
    </header>
  );
}
