/**
 * Barra superior del visor: marca, tres grupos claramente diferenciados
 * (Chambito Auto, Chambito Market, App Unificada) + utilidad «Sistema de diseño».
 * Cada grupo tiene su color propio para que se note qué módulo está activo.
 */
import { CSSProperties } from 'react';
import { useApp } from '../store';
import { MODULES, Module } from '../registry';
import { Icon } from '../ui/kit';

export type UiTheme = 'dark' | 'light';

/** color del módulo (igual al color de su v1, para que coincida con la version-panel) */
const MODULE_COLOR: Record<Module, string> = {
  auto: '#4BAC4F',
  market: '#F0A500',
};
const UNIFIED_COLOR = '#9B8AFB';

type ModeKind = 'auto' | 'market' | 'unificada';

function ModeTab({
  kind, color, icon, label, active, related, onClick,
}: {
  kind: ModeKind; color: string; icon: string; label: string;
  active: boolean; related?: boolean; onClick: () => void;
}) {
  return (
    <button
      className={`mode-tab${active ? ' on' : ''}${related ? ' related' : ''}`}
      data-mode={kind}
      style={{ '--mode': color } as CSSProperties}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      title={label}
    >
      <span className="mode-icon" aria-hidden>
        <Icon name={icon} size={18} color={active ? '#000000' : color} />
      </span>
      <span className="mode-label">{label}</span>
    </button>
  );
}

export function TopNav({
  module, onModule, onMenu, ui, onUi,
  navOn, onNav, appOn, onApp, v3On, vsOn, onVs,
}: {
  module: Module; onModule: (m: Module) => void; onMenu: () => void;
  ui: UiTheme; onUi: (v: UiTheme) => void;
  navOn?: boolean; onNav?: () => void;
  appOn?: boolean; onApp?: () => void;
  /** Auto v3 (the main Auto) is open */
  v3On?: boolean;
  vsOn?: boolean; onVs?: () => void;
}) {
  const away = navOn || appOn || vsOn;
  const autoActive = !away && (v3On || module === 'auto');
  const marketActive = !away && !v3On && module === 'market';
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

      {/* Tres formas de explorar el prototipo, cada una con su color propio. */}
      <nav className="mode-deck" aria-label="Módulo">
        <ModeTab
          kind="auto"
          color={MODULE_COLOR.auto}
          icon={MODULES.auto.icon}
          label={MODULES.auto.label}
          active={autoActive}
                    onClick={() => onModule('auto')}
        />
        <ModeTab
          kind="market"
          color={MODULE_COLOR.market}
          icon={MODULES.market.icon}
          label={MODULES.market.label}
          active={marketActive}
          onClick={() => onModule('market')}
        />
        {onApp && (
          <ModeTab
            kind="unificada"
            color={UNIFIED_COLOR}
            icon="home"
            label="Unificada"
            active={!!appOn}
            onClick={onApp}
          />
        )}
      </nav>

      {/* Acciones secundarias del módulo activo + utilidad Sistema de diseño. */}
      <nav className="topbar-utils" aria-label="Referencia">
        {onVs && (
          <button
            className={`util-btn${vsOn ? ' on' : ''}`}
            onClick={onVs}
            title="Diferencias entre v1, v2 y v3 de Auto y Market"
          >
            <Icon name="copy" size={14} color={vsOn ? 'var(--fg)' : 'var(--fg2)'} />
            <span>Versiones</span>
          </button>
        )}
        {onNav && (
          <button
            className={`util-btn${navOn ? ' on' : ''}`}
            onClick={onNav}
            title="Colores, tipografía, componentes y patrones del sistema de diseño"
          >
            <Icon name="layers" size={14} color={navOn ? 'var(--fg)' : 'var(--fg2)'} />
            <span>Sistema de diseño</span>
          </button>
        )}
      </nav>

      <div className="top-right">
        <div className="seg seg-sm" role="radiogroup" aria-label="País">
          {([['PY', 'PY', 'Paraguay'], ['AR', 'AR', 'Argentina']] as const).map(([v, l, name]) => (
            <button
              key={v}
              role="radio"
              aria-checked={settings.country === v}
              aria-label={name}
              title={name}
              className={settings.country === v ? 'on' : ''}
              onClick={() => set({ country: v })}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          className="icon-btn"
          onClick={() => onUi(ui === 'dark' ? 'light' : 'dark')}
          aria-label={`Página: cambiar a tema ${ui === 'dark' ? 'claro' : 'oscuro'}`}
          title="Tema de la página (no del teléfono)"
        >
          <span aria-hidden style={{ fontSize: 15, lineHeight: 1 }}>{ui === 'dark' ? '☾' : '☀'}</span>
          <span>Página</span>
        </button>
      </div>
    </header>
  );
}
