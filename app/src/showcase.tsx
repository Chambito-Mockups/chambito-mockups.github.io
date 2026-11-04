import { CSSProperties, ReactNode, useState } from 'react';
import { ThemeScope, useApp } from './store';
import { dark, light, P, R, Theme } from './theme';
import { BottomNavBar, Chip, Icon, NavKey, navItems, Plate, SosButton, VehicleCard } from './ui/kit';
import { MapPinSvg } from './ui/AutoMap';

const pretty = { textWrap: 'pretty' } as CSSProperties;

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: P(28), color: 'var(--fg)' }}>{title}</span>
        <span style={{ font: R(16), color: 'var(--fg2)', maxWidth: 900, ...pretty }}>{subtitle}</span>
      </div>
      {children}
    </div>
  );
}

/* ================= Barra inferior: 3 variants × active/inactive × theme ================= */
function BarSample({ theme, label, items, active }: { theme: Theme; label: string; items: NavKey[]; active: NavKey }) {
  const [cur, setCur] = useState<NavKey>(active);
  return (
    <ThemeScope.Provider value={theme}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ font: R(13, 500), color: 'var(--fg2)' }}>{label}</span>
        <div style={{ width: 390, maxWidth: '100%', height: 104, borderRadius: 24, background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', outline: '1px solid var(--line2)' }}>
          <BottomNavBar items={items} active={cur} onSelect={setCur} style={{ width: 350, maxWidth: 'calc(100% - 40px)' }} />
        </div>
      </div>
    </ThemeScope.Provider>
  );
}

export function BarPage() {
  const col = (theme: Theme, name: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <span style={{ font: P(18), color: 'var(--fg)' }}>{name}</span>
      <BarSample theme={theme} label="4 destinos · Auto activo" items={navItems(true, false)} active="auto" />
      <BarSample theme={theme} label="4 destinos · Auto sin activar" items={navItems(true, false)} active="inicio" />
      <BarSample theme={theme} label="5 destinos (con Equipos) · Auto activo" items={navItems(true, true)} active="auto" />
      <BarSample theme={theme} label="5 destinos (con Equipos) · Auto sin activar" items={navItems(true, true)} active="equipos" />
      <BarSample theme={theme} label="Sin Auto · cuenta común (como hoy)" items={navItems(false, false)} active="inicio" />
      <BarSample theme={theme} label="Sin Auto · con Comercios y Equipos (como hoy)" items={navItems(false, true)} active="inicio" />
    </div>
  );
  return (
    <Section title="Barra inferior" subtitle="Auto es un destino propio, máximo 5. Con acceso a obras o comercios, «Comercios» y «Equipos» se unen en «Equipos» (reusa (tabs)/work.tsx). Donde Auto no está habilitado, la barra queda como hoy. Comercios usa el ícono de etiqueta hasta tener el de tienda. Tocá los destinos para ver cómo se desliza la pastilla.">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
        {col(dark, 'Tema oscuro')}
        {col(light, 'Tema claro')}
      </div>
    </Section>
  );
}

/* ================= Componentes nuevos ================= */
function Card({ title, children, note }: { title: string; children: ReactNode; note?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 390, maxWidth: '100%' }}>
      <span style={{ font: P(16), color: 'var(--fg)' }}>{title}</span>
      {children}
      {note && <span style={{ font: R(13), color: 'var(--fg2)', ...pretty }}>{note}</span>}
    </div>
  );
}
const panel: CSSProperties = { background: 'var(--panel)', borderRadius: 24, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, outline: '1px solid var(--line2)' };

function RouteFieldsDemo() {
  const { t } = useApp();
  const field = (children: ReactNode, focus = false): ReactNode => (
    <div style={{ height: 52, borderRadius: 16, background: t.card, outline: focus ? `2px solid ${t.green}` : 'none', outlineOffset: -2, display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px' }}>{children}</div>
  );
  const sq = <span style={{ width: 12, height: 12, borderRadius: 2, background: t.map.dest, flex: 'none' }} />;
  return (
    <div style={panel}>
      <span style={{ font: R(13, 500), color: t.text2 }}>Destino vacío · con foco · completo</span>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ position: 'absolute', left: 21, top: 30, bottom: 30, width: 2, background: t.dividerStrong }} />
        {field(<><span style={{ width: 12, height: 12, borderRadius: 6, background: t.green, flex: 'none' }} /><span style={{ font: R(15, 500) }}>Tu ubicación</span></>)}
        {field(<>{sq}<span style={{ font: R(15), color: t.text2 }}>¿A dónde vas?</span></>)}
      </div>
      {field(<>{sq}<div style={{ display: 'flex', alignItems: 'center', gap: 1 }}><span style={{ font: R(15, 500) }}>Paseo La Gal</span><span className="blink" style={{ width: 2, height: 18, background: t.green }} /></div></>, true)}
      {field(<>{sq}<span style={{ flex: 1, font: R(15, 500) }}>Paseo La Galería</span><Icon name="close" size={18} color={t.text2} /></>)}
    </div>
  );
}

export function ComponentsPage() {
  const [tip, setTip] = useState<number | 'otro'>(5000);
  const [heat, setHeat] = useState(true);
  return (
    <Section title="Componentes nuevos" subtitle="Solo lo que no existe en src/shared/ui/ds, con sus estados.">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start', color: 'var(--fg)' }}>
        <ThemeScope.Provider value={dark}>
          <Card title="Ícono de Auto" note="Propuesta en el estilo del set: de relleno, en 24 × 24, con cuerpo, parabrisas calado y faros. Tamaños 48, 32 y 24 (activo en la barra). Hay que validarlo con quien diseñó el set.">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: '#000000', borderRadius: 24, padding: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 18, outline: '1px solid #333333' }}>
                <Icon name="car" size={48} color="#FFFFFF" /><Icon name="car" size={32} color="#FFFFFF" /><Icon name="car" size={24} color="#4BAC4F" />
              </div>
              <div style={{ background: '#F5F5F5', borderRadius: 24, padding: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 18 }}>
                <Icon name="car" size={48} color="#000000" /><Icon name="car" size={32} color="#000000" /><Icon name="car" size={24} color="#2F7A33" />
              </div>
            </div>
          </Card>

          <Card title="VehicleCard" note="La patente siempre es blanca con texto negro (formato Mercosur: PY «ABCD 123», AR «AB 123 CD»).">
            <div style={panel}>
              <span style={{ font: R(13, 500), color: 'var(--fg2)' }}>En camino</span>
              <VehicleCard plate="ABCD 123" make="Toyota Vitz" detail="Blanco · 2019" />
              <span style={{ font: R(13, 500), color: 'var(--fg2)' }}>Llegó (destacado)</span>
              <VehicleCard plate="ABCD 123" make="Toyota Vitz" detail="Blanco · 2019" highlighted />
              <span style={{ font: R(13, 500), color: 'var(--fg2)' }}>Compacto (en curso, Actividad)</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Plate text="ABCD 123" size="sm" />
                <span style={{ font: R(14, 500) }}>Toyota Vitz blanco</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Plate text="AB 123 CD" size="sm" />
                <span style={{ font: R(14, 500) }}>Fiat Cronos gris</span>
              </div>
            </div>
          </Card>

          <Card title="RouteFields · origen y destino unidos">
            <RouteFieldsDemo />
          </Card>
        </ThemeScope.Provider>

        <Card title="MapPin · destino (variante nueva)" note="Misma silueta que el pin del pedido. El destino se distingue por el color (blanco o negro según el tema) y el cuadrado en lugar del punto.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[dark, light].map((th) => (
              <ThemeScope.Provider key={th.name} value={th}>
                <div style={{ background: th.map.bg, borderRadius: 24, padding: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 28, height: 120, boxSizing: 'border-box', outline: th.name === 'dark' ? '1px solid #333333' : 'none' }}>
                  {(['origin', 'dest'] as const).map((k) => (
                    <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <MapPinSvg kind={k} stroke={th.map.bg} />
                      <span style={{ font: R(12), color: th.text2 }}>{k === 'origin' ? 'Origen' : 'Destino'}</span>
                    </div>
                  ))}
                </div>
              </ThemeScope.Provider>
            ))}
          </div>
        </Card>

        <Card title="SosButton">
          <div style={{ ...panel, flexDirection: 'row', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <ThemeScope.Provider value={dark}>
              {[
                ['Reposo', <SosButton key="a" />],
                ['Presionado', <SosButton key="b" style={{ outline: '4px solid rgba(255,107,107,0.35)' }} />],
                ['Alerta enviada', <SosButton key="c" sent />],
              ].map(([l, el]) => (
                <div key={l as string} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  {el}
                  <span style={{ font: R(12), color: 'var(--fg2)' }}>{l}</span>
                </div>
              ))}
            </ThemeScope.Provider>
            <ThemeScope.Provider value={light}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: '#F5F5F5', borderRadius: 16, padding: 8 }}>
                <SosButton />
                <span style={{ font: R(12), color: '#5C5C5C' }}>Claro</span>
              </div>
            </ThemeScope.Provider>
          </div>
        </Card>

        <ThemeScope.Provider value={dark}>
          <Card title="TipChips" note="Reposo · elegido (blanco) · «Otro» con monto propio (borde verde). Montos por país.">
            <div style={panel}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[3000, 5000, 10000].map((a) => (
                  <Chip key={a} selected={tip === a} onClick={() => setTip(a)}>Gs. {a.toLocaleString('es-PY')}</Chip>
                ))}
                <Chip selected={false} outlined={tip === 'otro'} onClick={() => setTip('otro')}>Otro</Chip>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Chip>$ 500</Chip><Chip>$ 1.000</Chip><Chip>$ 2.000</Chip><Chip outlined>$ 1.500</Chip>
              </div>
            </div>
          </Card>

          <Card title="DemandLayer · capa de zonas" note="Sale de hot_zone_rules. Solo se ve en el Inicio del conductor y se prende o apaga con el Chip.">
            <div style={panel}>
              {[
                ['Alta', '×1,4 o más', 'rgba(75,172,79,0.2)', 'rgba(75,172,79,0.6)'],
                ['Media', '×1,1 a ×1,3', 'rgba(75,172,79,0.12)', 'rgba(75,172,79,0.4)'],
              ].map(([l, m, bg, bd]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: heat ? 1 : 0.35, transition: 'opacity .2s' }}>
                  <span style={{ width: 44, height: 28, borderRadius: 6, background: bg, border: `1.5px solid ${bd}`, boxSizing: 'border-box' }} />
                  <span style={{ flex: 1, font: R(14, 500) }}>{l}</span>
                  <span style={{ font: P(14), color: '#7CCB7F' }}>{m}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button className="press" onClick={() => setHeat(true)} style={{ height: 36, borderRadius: 18, background: '#333333', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', font: R(13, 500), color: '#FFFFFF' }}>
                  <Icon name="success" size={16} color="#4BAC4F" />Zonas con demanda
                </button>
                <button className="press" onClick={() => setHeat(false)} style={{ height: 36, borderRadius: 18, background: '#333333', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', font: R(13, 500), color: '#B3B3B3' }}>
                  <span style={{ width: 16, height: 16, borderRadius: 8, border: '2px solid #808080', boxSizing: 'border-box' }} />Apagada
                </button>
              </div>
            </div>
          </Card>
        </ThemeScope.Provider>
      </div>
    </Section>
  );
}
