/**
 * «Sistema de diseño»: todo en un mismo menú. Fundamentos (colores, tipografía, espaciado, radios, elevación,
 * movimiento, íconos), los componentes vivos en claro y oscuro, los patrones y, al final, las referencias anteriores
 * de navegación por versión. Fuente: docs/2026-11-09-BRIEF y SISTEMA-DE-DISENO (TOKENS.json v1.1.0).
 * Los componentes son los mismos que usan las pantallas (kit.tsx, ds.tsx) con los mismos tokens (tokens.ts).
 */
import { CSSProperties, ReactNode, useEffect, useMemo, useState } from 'react';
import { Icon } from '../ui/kit';
import { VMContext, VM } from './model';
import { DARK, LIGHT, Tokens } from './tokens';
import { Btn, CategoryTile, Chip, I, IconBtn, SectionPill } from './kit';
import { Bars } from './chrome';
import {
  Avatar, Badge, Banner, Card, ChatBubble, Checkbox, CountBadge, EmptyState, ListGroup, ListItem, PinBoxes, Plate, ProgressBar, Radio, RatingInput,
  SearchField, SectionLabel, Segmented, SheetFrame, StepProgress, Switch, SystemMessage, TextField, ToastView, VehicleCard,
} from './ds';
import './integrada.css';

/* ---------------- datos del documento ---------------- */

const PALETTE: [string, string, string][] = [
  ['Verde Chambito', '#4BAC4F', 'Acción principal, en curso o éxito, navegación activa'],
  ['Negro', '#000000', 'Texto, selección de chips y segmentos, tarjeta inversa'],
  ['Blanco', '#FFFFFF', 'Superficies, texto sobre verde'],
];
const DERIVED: [string, [string, string][]][] = [
  ['Verdes', [['300', '#7CCB7F'], ['600 · presionado', '#3E9642'], ['700 · enlaces y foco', '#2F7A33'], ['800 · texto de éxito', '#24602A']]],
  ['Neutros', [['50', '#F5F5F5'], ['100', '#EBEBEB'], ['200', '#CCCCCC'], ['300', '#B3B3B3'], ['350', '#9E9E9E'], ['400', '#808080'], ['500', '#707070'], ['600', '#5C5C5C'], ['700', '#4D4D4D'], ['800', '#333333'], ['900', '#1A1A1A']]],
  ['Estados', [['Rojo 700 · claro', '#B71C1C'], ['Rojo 300 · oscuro', '#FF6B6B'], ['Ámbar 800 · claro', '#7A4D00'], ['Ámbar 300 · oscuro', '#FFB547'], ['Azul · solo el recibo', '#4CC1FF']]],
];
/** token del documento, clave en tokens.ts, uso */
const SEMANTIC: [string, [string, keyof Tokens, string][]][] = [
  ['Fondos', [
    ['bg.canvas', 'bg', 'Fondo de pantalla'], ['bg.surface', 'cardBg', 'Tarjetas'], ['bg.surfaceRaised', 'raised', 'Hojas y diálogos'], ['bg.muted', 'fill', 'Chips, cajas de ícono, buscadores'],
    ['bg.mutedOnSurface', 'mos', 'Gris dentro de una tarjeta'], ['bg.field', 'field', 'Campos'], ['bg.inverse', 'inverse', 'Tarjeta inversa, selección'], ['bg.brand', 'brand', 'Acción principal'],
    ['bg.brandSubtle', 'brandSubtle', 'Verde al 20 %'], ['bg.overlay', 'scrim', 'Velo de hojas'], ['bg.warningSubtle', 'warnSubtle', 'Aviso'], ['bg.danger', 'danger', 'Destructivo'], ['bg.dangerSubtle', 'dangerSubtle', 'Error suave'],
  ]],
  ['Texto', [
    ['text.primary', 'text', 'Texto principal'], ['text.secondary', 'text2', 'Secundario'], ['text.tertiary', 'text3', 'Terciario, placeholder'], ['text.onBrand', 'onBrand', 'Sobre verde: siempre blanco'],
    ['text.onInverse', 'onInverse', 'Sobre la tarjeta inversa'], ['text.brandOnInverse', 'brandOnInverse', 'Verde sobre inverso'], ['text.link', 'link', 'Enlaces, acción terciaria'],
    ['text.success', 'success', 'Éxito'], ['text.warning', 'warning', 'Aviso'], ['text.danger', 'danger', 'Error'],
  ]],
  ['Íconos y bordes', [
    ['icon.brand', 'iconBrand', 'Ícono de marca, progreso'], ['border.subtle', 'line', 'Divisores'], ['border.default', 'bDefault', 'Botón secundario, apagados'], ['border.field', 'bField', 'Campos'],
    ['border.strong', 'bStrong', 'Casillas'], ['border.focus', 'focus', 'Foco, seleccionado, switch'],
  ]],
];
const TYPE: [string, string, number, number, number, string][] = [
  ['display', 'Poppins Bold', 32, 40, -0.5, '700'], ['titleLg', 'Poppins Bold', 28, 36, -0.3, '700'], ['titleMd', 'Poppins Bold', 22, 30, -0.2, '700'], ['titleSm', 'Poppins Bold', 18, 26, 0, '700'],
  ['subtitle', 'Poppins Bold', 16, 24, 0, '700'], ['button', 'Poppins Bold', 16, 24, 0, '700'], ['buttonSm', 'Poppins Bold', 14, 20, 0, '700'], ['lead', 'Roboto Light', 18, 28, 0, '300'],
  ['bodyLg', 'Roboto Regular', 17, 26, 0, '400'], ['body', 'Roboto Regular', 15, 22, 0, '400'], ['bodyStrong', 'Roboto Medium', 15, 22, 0, '500'], ['label', 'Roboto Medium', 14, 20, 0.1, '500'],
  ['caption', 'Roboto Regular', 13, 18, 0, '400'], ['captionStrong', 'Roboto Medium', 12, 16, 0.2, '500'],
];
const SPACING = [2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64];
const RHYTHM: [string, string][] = [['Margen lateral (teléfono)', '20'], ['Entre secciones', '32'], ['Entre elementos de un grupo', '12'], ['Entre elementos relacionados', '8'], ['Entre líneas de texto', '4']];
const RADII: [number, string][] = [[4, 'Casilla'], [8, ''], [12, 'Campo, banner, caja de ícono'], [16, 'Tarjeta, barra inferior'], [24, 'Hoja, diálogo'], [32, ''], [9999, 'Píldora: botones, chips']];
const ELEVATION: [string, string, string][] = [['0', '—', 'none'], ['1', 'Tarjetas', '0 1px 2px #0000000F, 0 2px 8px #0000000A'], ['2', '—', '0 8px 24px #0000001F'], ['3', 'Hojas, diálogos y barra inferior', '0 16px 48px #0000002E']];
const MOTION: [string, string][] = [['Presión', '100 ms · escala 0,97 y opacidad 0,92'], ['Cambio de estado', '150 ms'], ['Entrar y salir (hojas)', '250 ms'], ['Pantalla', '400 ms'], ['Escalonado de listas', '40 ms'], ['Pulso «en vivo»', '1500 ms'], ['Toast', '4 s visible']];
const CURVES: [string, string][] = [['Estándar', 'cubic-bezier(0.2, 0, 0, 1)'], ['Entrada', 'cubic-bezier(0, 0, 0, 1)'], ['Salida', 'cubic-bezier(0.3, 0, 1, 1)'], ['Resorte', 'damping 20 · stiffness 220 · masa 1']];
const ICONS = ['alert', 'bag', 'bell', 'bookmark', 'bottle', 'broom', 'camera', 'car', 'card', 'chat', 'check', 'chevrondown', 'chevronleft', 'chevronright', 'clock', 'close', 'edit', 'error', 'filter', 'flag', 'gear', 'heart', 'home', 'image', 'inbox', 'info', 'lock', 'mappin', 'minus', 'more', 'navigation', 'nurse', 'phone', 'plus', 'refresh', 'search', 'servicios', 'share', 'shield', 'star', 'success', 'tag', 'trash', 'user', 'users', 'wallet', 'warning'];
const RULES: string[] = [
  'Un solo verde lleno por vista: la acción principal.',
  'Sobre verde, el texto va siempre en blanco. El verde como texto sobre claro es #2F7A33.',
  'Chips, segmentos y radios elegidos van en negro (blanco en oscuro), nunca en verde.',
  'Sin tarjeta dentro de tarjeta. El único borde de color es el de «seleccionada» (verde).',
  'El estado se dice con texto de color o con un Badge, nunca solo con color.',
  'Íconos solo si marcan una acción o un estado; sin contenedores verdes suaves en filas.',
  'Lo destructivo nunca es verde y siempre pide confirmación.',
  'Sin degradados (salvo el velo negro sobre fotos), sin azul de «info», sin naranja #F66902.',
  'Sin botón de llamar, sin precios «desde» y sin listas para elegir prestador: el sistema asigna.',
  'El logo va solo en el splash, la autenticación y la cabecera de Inicio.',
  'Sin spinner a pantalla completa; sin emojis en títulos, botones ni navegación.',
  'Cada pantalla en claro y oscuro, con carga (skeleton), vacío, error y sin conexión.',
];
const VOICE: [string, string][] = [['Bienvenido de vuelta 👋', 'Hola, Ana'], ['Error 500', 'Algo salió mal. Probá de nuevo.'], ['Descarga ahora', 'Descargá ahora'], ['Enviar formulario', 'Confirmar solicitud']];

/* ---------------- menú ---------------- */

type Key =
  | 'colores' | 'tipografia' | 'espaciado' | 'elevacion' | 'movimiento' | 'iconos'
  | 'botones' | 'chips' | 'insignias' | 'formularios' | 'seleccion' | 'tarjetas' | 'navegacion' | 'capas' | 'chat' | 'auto' | 'market'
  | 'reglas' | 'voz';
const MENU: { group: string; items: [Key, string, string][] }[] = [
  { group: 'Fundamentos', items: [['colores', 'Colores', 'image'], ['tipografia', 'Tipografía', 'edit'], ['espaciado', 'Espaciado y radios', 'layers'], ['elevacion', 'Elevación', 'layers'], ['movimiento', 'Movimiento', 'refresh'], ['iconos', 'Íconos', 'star']] },
  {
    group: 'Componentes',
    items: [
      ['botones', 'Botones', 'plus'], ['chips', 'Chips y segmentado', 'filter'], ['insignias', 'Insignias y avatar', 'shield'], ['formularios', 'Campos y buscador', 'search'],
      ['seleccion', 'Selección', 'check'], ['tarjetas', 'Tarjetas y listas', 'wallet'], ['navegacion', 'Navegación', 'menu'], ['capas', 'Hojas y avisos', 'bell'],
      ['chat', 'Chat', 'messageCircle'], ['auto', 'Auto', 'car'], ['market', 'Market', 'shoppingBag'],
    ],
  },
  { group: 'Patrones', items: [['reglas', 'Reglas y prohibido', 'info'], ['voz', 'Voz y contenido', 'messageCircle']] },
];
const ALL_KEYS = MENU.flatMap((g) => g.items.map(([k]) => k));
const fromHash = (): Key | null => {
  const h = decodeURIComponent(window.location.hash.slice(1));
  const k = h.startsWith('sistema/') ? h.slice(8) : '';
  return (ALL_KEYS as string[]).includes(k) ? (k as Key) : null;
};

/* ---------------- piezas de la página ---------------- */

const noop = () => {};
/** Un «teléfono» de muestra: los componentes leen los tokens de su tema por el mismo contexto que en la app. */
function useSampleVM(dark: boolean): VM {
  return useMemo(() => ({
    t: dark ? DARK : LIGHT, dark,
    selector: { show: true, label: 'Servicios', icon: 'servicios', aria: 'Sección: Servicios. Cambiar de sección' },
    a: { openExplorer: noop },
    showTabs: true, tabCols: 3,
    live: { show: false },
    tabs: [['Inicio', 'home', true], ['Actividad', 'bell', false], ['Perfil', 'user', false]].map(([label, icon, on]) => ({ label, icon, current: on ? 'page' : 'false', fg: on ? (dark ? DARK : LIGHT).link : (dark ? DARK : LIGHT).text2, go: noop })),
  }), [dark]);
}

function Pane({ dark, children, style }: { dark: boolean; children: ReactNode; style?: CSSProperties }) {
  const vm = useSampleVM(dark);
  const t = vm.t as Tokens;
  return (
    <VMContext.Provider value={vm}>
      <div className="ig ds-pane" data-theme={dark ? 'dark' : 'light'} style={{ background: t.bg, color: t.text, ...style }}>
        <span className="ds-pane-tag" style={{ color: t.text2 }}>{dark ? 'Oscuro' : 'Claro'}</span>
        {children}
      </div>
    </VMContext.Provider>
  );
}

/** El mismo contenido en claro y en oscuro, lado a lado. */
function Both({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="ds-both">
      <Pane dark={false} style={style}>{children}</Pane>
      <Pane dark style={style}>{children}</Pane>
    </div>
  );
}

function Block({ title, spec, children }: { title: string; spec?: ReactNode; children: ReactNode }) {
  return (
    <section className="ds-block">
      <div className="ds-block-head">
        <h3>{title}</h3>
        {spec && <p>{spec}</p>}
      </div>
      {children}
    </section>
  );
}

const Row = ({ children, wrap = true, gap = 12 }: { children: ReactNode; wrap?: boolean; gap?: number }) => (
  <div style={{ display: 'flex', flexWrap: wrap ? 'wrap' : 'nowrap', gap, alignItems: 'center' }}>{children}</div>
);
const Col = ({ children, gap = 12 }: { children: ReactNode; gap?: number }) => <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>;
const Swatch = ({ hex, size = 40 }: { hex: string; size?: number }) => <span className="ds-swatch" style={{ width: size, height: size, background: hex }} />;

/* ---------------- secciones ---------------- */

function Colores() {
  return (
    <>
      <Block title="Paleta de marca" spec="Opacidades de marca: 100 %, 50 % y 20 % (verde al 20 % = #4BAC4F33). Dosis de verde: como máximo el 10 % de la pantalla.">
        <div className="ds-grid">
          {PALETTE.map(([name, hex, use]) => (
            <div key={hex} className="ds-color-card">
              <span className="ds-color-big" style={{ background: hex }} />
              <b>{name}</b><code>{hex}</code><span>{use}</span>
            </div>
          ))}
        </div>
      </Block>
      <Block title="Derivados" spec="Solo para estados y accesibilidad.">
        <Col gap={16}>
          {DERIVED.map(([g, list]) => (
            <div key={g}>
              <span className="ds-sub">{g}</span>
              <div className="ds-chips">
                {list.map(([n, hex]) => <span key={hex} className="ds-chip"><Swatch hex={hex} size={24} /><b>{n}</b><code>{hex}</code></span>)}
              </div>
            </div>
          ))}
        </Col>
      </Block>
      {SEMANTIC.map(([g, rows]) => (
        <Block key={g} title={`Tokens · ${g.toLowerCase()}`} spec="Claro y oscuro. Son los valores que usan las pantallas de la App integrada.">
          <table className="ds-table">
            <thead><tr><th>Token</th><th>Claro</th><th>Oscuro</th><th>Uso</th></tr></thead>
            <tbody>
              {rows.map(([name, key, use]) => (
                <tr key={name}>
                  <td><code>{name}</code></td>
                  <td><span className="ds-cell"><Swatch hex={String(LIGHT[key])} size={22} />{String(LIGHT[key])}</span></td>
                  <td><span className="ds-cell"><Swatch hex={String(DARK[key])} size={22} />{String(DARK[key])}</span></td>
                  <td>{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Block>
      ))}
    </>
  );
}

function Tipografia() {
  return (
    <Block title="Escala tipográfica" spec="Poppins Bold para títulos y botones; Roboto Light, Regular y Medium para lectura, etiquetas y campos. Nada por debajo de 12.">
      <Both>
        <Col gap={14}>
          {TYPE.map(([name, fam, size, lh, ls, w]) => (
            <div key={name} className="ds-type-row">
              <span style={{ font: `${w} ${size}px/${lh}px ${fam.startsWith('Poppins') ? 'Poppins' : 'Roboto'}, Arial, sans-serif`, letterSpacing: ls }}>Pedí un viaje</span>
              <span className="ds-type-spec">{name} · {fam} {size}/{lh}{ls ? ` · ${String(ls).replace('.', ',')}` : ''}</span>
            </div>
          ))}
        </Col>
      </Both>
    </Block>
  );
}

function Espaciado() {
  return (
    <>
      <Block title="Espaciado" spec="Escala en px. La grilla del teléfono es de 4 columnas con gutter de 12.">
        <Col gap={8}>
          {SPACING.map((n) => <span key={n} className="ds-space"><span style={{ width: n * 4 }} /><code>{n}</code></span>)}
        </Col>
      </Block>
      <Block title="Ritmo de la pantalla">
        <table className="ds-table"><tbody>{RHYTHM.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>
      </Block>
      <Block title="Radios" spec="Controles de 36 / 48 / 56, campo de 52, área táctil mínima de 48. Bordes de 1 px (finos) y 2 px (activo o seleccionado).">
        <div className="ds-grid">
          {RADII.map(([r, use]) => (
            <div key={r} className="ds-radius"><span style={{ borderRadius: r }} /><code>{r === 9999 ? 'píldora' : r}</code>{use && <small>{use}</small>}</div>
          ))}
        </div>
      </Block>
    </>
  );
}

function Elevacion() {
  return (
    <Block title="Elevación" spec="En oscuro las tarjetas no llevan sombra.">
      <Pane dark={false}>
        <div className="ds-grid">
          {ELEVATION.map(([lvl, use, sh]) => (
            <div key={lvl} className="ds-elev" style={{ boxShadow: sh }}><b>Nivel {lvl}</b><small>{use}</small><code>{sh}</code></div>
          ))}
        </div>
      </Pane>
    </Block>
  );
}

function Movimiento() {
  return (
    <>
      <Block title="Duraciones" spec="Respeta «reducir movimiento». Probá el botón: la presión es la del sistema.">
        <table className="ds-table"><tbody>{MOTION.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table>
      </Block>
      <Block title="Curvas">
        <table className="ds-table"><tbody>{CURVES.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>
      </Block>
      <Block title="Presión y pulso en vivo">
        <Both><Row><div style={{ width: 220 }}><Btn>Mantené presionado</Btn></div><Badge tone="live" dot>Buscando conductor</Badge></Row></Both>
      </Block>
    </>
  );
}

function Iconos() {
  return (
    <Block title="Íconos del kit de marca" spec="Tamaños 16 / 20 / 24 / 32. Trazo de relleno, siempre con texto al lado. Del color del texto.">
      <Both>
        <div className="ds-icons">{ICONS.map((n) => <span key={n}><I name={n} size={24} /><small>{n}</small></span>)}</div>
      </Both>
    </Block>
  );
}

function Botones() {
  return (
    <>
      <Block title="Botón · Button" spec="Píldora, Poppins Bold 16 (14 en sm), ícono de 20 a 8 del texto. sm 36 · md 48 · lg 56; la acción principal de la pantalla u hoja es de 52 a lo ancho. Una sola verde por vista.">
        <Both>
          <Col>
            <Btn>Pedir viaje</Btn>
            <Btn kind="secondary">Pedir para otro día</Btn>
            <Row><Btn kind="tertiary">Ver detalle</Btn><Btn kind="ghost">Ahora no</Btn></Row>
            <Btn kind="danger">Cancelar viaje</Btn>
          </Col>
        </Both>
      </Block>
      <Block title="Botón de ícono · IconButton" spec="Área táctil 48, ícono 24. neutral (gris) para volver y la barra superior.">
        <Both><Row><IconBtn icon="chevronleft" label="Volver" /><IconBtn icon="bell" label="Notificaciones" /><IconBtn icon="heart" label="Guardados" square /><IconBtn icon="share" label="Compartir" /></Row></Both>
      </Block>
    </>
  );
}

function Chips() {
  const [cat, setCat] = useState('viaje');
  const [on, setOn] = useState(true);
  const c = (sel: boolean, t: Tokens) => ({ bg: sel ? t.inverse : t.fill, fg: sel ? t.onInverse : t.text });
  return (
    <>
      <Block title="Chip" spec="Alto 36, píldora, padding 16, Roboto Medium 14. Elegido en negro con texto blanco y ✓ (en oscuro, al revés). No sirve para estados.">
        <div className="ds-both">
          {[false, true].map((d) => {
            const t = d ? DARK : LIGHT;
            return (
              <Pane key={String(d)} dark={d}>
                <Row gap={8}>
                  <Chip c={c(on, t)} aria-pressed={on ? 'true' : 'false'} onClick={() => setOn(!on)}>{on && <I name="check" size={16} />}Puntual</Chip>
                  <Chip c={c(false, t)}>Auto limpio</Chip>
                  <Chip c={c(false, t)}>Buena atención</Chip>
                </Row>
              </Pane>
            );
          })}
        </div>
      </Block>
      <Block title="Control segmentado · SegmentedControl" spec="Alto 40, riel gris con padding 4; el deslizador es negro con texto blanco. De 2 a 4 vistas de los mismos datos.">
        <Both><Segmented label="Tipo de pedido" value={cat} onChange={setCat} options={[{ key: 'viaje', label: 'Viaje', icon: 'car' }, { key: 'moto', label: 'Moto' }, { key: 'envio', label: 'Envío', icon: 'bag' }]} /></Both>
      </Block>
    </>
  );
}

function Insignias() {
  return (
    <>
      <Block title="Insignia de estado · Badge" spec="Alto 24, píldora, padding 8, Roboto Medium 12. live late; los demás sin punto.">
        <Both><Row gap={8}><Badge tone="live" dot>En curso</Badge><Badge tone="success">Completado</Badge><Badge tone="warning">Pendiente de pago</Badge><Badge tone="danger">Cancelado</Badge><Badge tone="neutral">Borrador</Badge></Row></Both>
      </Block>
      <Block title="Contador · CountBadge" spec="Mínimo 20, verde con número blanco, «99+» como tope.">
        <Both><Row><CountBadge n={2} /><CountBadge n={18} /><CountBadge n={120} /></Row></Both>
      </Block>
      <Block title="Avatar" spec="24 / 32 / 40 / 56 / 80. Sin foto: iniciales en Poppins Bold sobre verde al 20 %. Verificado: sello de 16.">
        <Both><Row><Avatar ini="MR" size={24} /><Avatar ini="MR" size={32} /><Avatar ini="MR" size={40} verified /><Avatar ini="MR" size={56} verified /><Avatar ini="MR" size={80} /></Row></Both>
      </Block>
    </>
  );
}

function Formularios() {
  return (
    <>
      <Block title="Campo de texto · Input" spec="Etiqueta siempre visible (Roboto Medium 14) a 8 del campo; alto 52, radio 12, padding 16, borde de 1 #808080. Foco y error en 2. Ayuda y error en 13/18.">
        <Both>
          <Col gap={16}>
            <TextField label="Referencia (opcional)" placeholder="Portón negro, farmacia…" />
            <TextField label="Teléfono" prefix="+595" value="981 123 456" state="focus" />
            <TextField label="Patente" value="ABC 12" state="error" help="Revisá la patente: son 4 letras y 3 números." />
            <TextField label="País" value="Paraguay" state="disabled" />
          </Col>
        </Both>
      </Block>
      <Block title="Buscador · SearchField" spec="Píldora de 48, lupa de 20 y borrar a la derecha. El botón de filtros va afuera.">
        <Both><Col><SearchField placeholder="¿A dónde vas?" /><SearchField placeholder="Buscá en Chambito Market" value="bicicleta" /></Col></Both>
      </Block>
    </>
  );
}

function Seleccion() {
  const [sw, setSw] = useState(true);
  const [stars, setStars] = useState(4);
  return (
    <Block title="Switch, radio, casilla y estrellas" spec="Switch 52 × 32 (encendido #2F7A33 / #4BAC4F). Radio de 24: elegido negro con punto blanco. Casilla de 24: elegida verde con ✓. Estrellas de 32 en áreas de 48.">
      <Both>
        <Col gap={16}>
          <Row><Switch on={sw} onChange={setSw} label="Modo oscuro" /><Switch on={!sw} onChange={(v) => setSw(!v)} label="Notificaciones" /></Row>
          <Row><Radio on /><Radio on={false} /><Checkbox on /><Checkbox on={false} /></Row>
          <RatingInput value={stars} onChange={setStars} />
        </Col>
      </Both>
    </Block>
  );
}

function Tarjetas() {
  return (
    <>
      <Block title="Tarjeta · Card" spec="Radio 16, padding 16, gap 12. Variantes surface, muted, brand y selected (único borde de color). Sin tarjeta dentro de tarjeta.">
        <Both>
          <div className="ds-2col">
            <Card><b>surface</b><span>La de siempre</span></Card>
            <Card variant="muted"><b>muted</b><span>Plana gris</span></Card>
            <Card variant="brand"><b>brand</b><span>Verde suave</span></Card>
            <Card variant="selected"><b>selected</b><span>Borde de 2</span></Card>
          </div>
        </Both>
      </Block>
      <Block title="Ítem de lista · ListItem / ListGroup" spec="Alto 56 o 72, padding 16, gap 12. Rótulo de sección en mayúsculas a 8 del grupo.">
        <Both>
          <div>
            <SectionLabel>Tu cuenta</SectionLabel>
            <ListGroup>
              <ListItem icon="wallet" title="Billetera" sub="Gs. 186.000 esta semana" chevron divider onClick={noop} />
              <ListItem icon="shield" title="Documentos" end={<Badge tone="warning">Por vencer</Badge>} divider />
              <ListItem avatar={<Avatar ini="LG" verified />} title="Lucía Giménez" sub="Cliente desde 2024" chevron onClick={noop} />
            </ListGroup>
          </div>
        </Both>
      </Block>
      <Block title="Progreso, vacío y error">
        <Both>
          <Col gap={16}>
            <StepProgress step={2} total={3} />
            <ProgressBar value={0.6} />
            <EmptyState icon="inbox" title="Todavía no hay viajes" text="Cuando pidas uno, lo vas a ver acá con su recibo." action={<div style={{ width: 200 }}><Btn kind="secondary">Pedir un viaje</Btn></div>} />
          </Col>
        </Both>
      </Block>
    </>
  );
}

function Navegacion() {
  return (
    <>
      <Block title="Barra inferior · BottomNav" spec="Flotante: alto 72, radio 16, margen 20 a los lados y 12 sobre la barra de gestos. Íconos de 24 y Roboto Medium 12. Activa en #2F7A33 / #7CCB7F, sin píldora. Máximo 5 destinos.">
        <Both style={{ position: 'relative', height: 150, overflow: 'hidden' }}><Bars /></Both>
      </Block>
      <Block title="Selector de sección · SectionSwitcher" spec="Píldora de 48 con el ícono de la sección en verde. Abre «Elegí qué querés hacer».">
        <Both><Row><SectionPill /></Row></Both>
      </Block>
      <Block title="Barra superior · AppBar" spec="Alto 56, fondo de la pantalla, título Poppins Bold 18 (en raíz, título grande 22 o 28 debajo). Volver a la izquierda; hasta 2 acciones a la derecha.">
        <Both>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 56 }}>
            <IconBtn icon="chevronleft" label="Volver" />
            <span style={{ flex: 1, font: '700 18px/26px Poppins, Arial, sans-serif' }}>Detalles del viaje</span>
            <IconBtn icon="share" label="Compartir" />
          </div>
        </Both>
      </Block>
    </>
  );
}

function Capas() {
  return (
    <>
      <Block title="Hoja inferior · Sheet" spec="Radio 24 arriba, manija de 32 × 4, padding 24, fondo #FFFFFF / #1A1A1A, velo negro al 50 %. Título Poppins 16 + cerrar; acciones al pie.">
        <Both style={{ paddingBottom: 0 }}>
          <SheetFrame title="¿Necesitás ayuda?">
            <span style={{ font: '400 15px/22px Roboto, Arial, sans-serif' }}>Llamamos al 911 y avisamos a Soporte con tu ubicación.</span>
            <Btn kind="danger">Llamar al 911</Btn>
            <Btn kind="secondary">Solo avisar a Soporte</Btn>
          </SheetFrame>
        </Both>
      </Block>
      <Block title="Banner" spec="Radio 12, padding 12, ícono de 20. neutral es el de información: no existe el azul.">
        <Both>
          <Col>
            <Banner>Coordiná todo por el chat. Nunca pagues por adelantado.</Banner>
            <Banner tone="success" title="Devolución en camino">Te devolvemos Gs. 32.000 en 48 h.</Banner>
            <Banner tone="warning" title="Tu seguro vence en 12 días">Subí la póliza nueva antes del 16/11.</Banner>
            <Banner tone="danger">No pudimos cobrar con la tarjeta. Probá con otra.</Banner>
          </Col>
        </Both>
      </Block>
      <Block title="Toast" spec="4 s, negro con texto blanco (al revés en oscuro), radio 12, alto mínimo 48. Acción opcional «Deshacer».">
        <Both><Col><ToastView>Lo guardaste en Guardados</ToastView><ToastView action="Deshacer">Quitaste la publicación</ToastView></Col></Both>
      </Block>
    </>
  );
}

function Chat() {
  return (
    <Block title="Chat" spec="Fondo canvas + patrón al 4 %. Saliente negra (verde en oscuro) a la derecha; entrante gris a la izquierda. Ancho máximo 78 %, padding 12/8, Roboto 15.">
      <Both>
        <Col gap={8}>
          <SystemMessage>Lucía inició el viaje</SystemMessage>
          <ChatBubble me time="15:04">¿Sigue disponible?</ChatBubble>
          <ChatBubble time="15:05">Sí, está disponible. Podemos vernos en Lambaré.</ChatBubble>
        </Col>
      </Both>
    </Block>
  );
}

function Auto() {
  return (
    <>
      <Block title="Tarjeta del vehículo · VehicleCard" spec="La patente es el dato principal. Variantes: en camino, llegó (destacada en inverso) y compacta (Actividad).">
        <Both>
          <Col>
            <VehicleCard plate="ABCD 123" model="Toyota Vitz" detail="Blanco · 2019" />
            <VehicleCard plate="ABCD 123" model="Toyota Vitz" detail="Blanco · 2019" variant="arrived" />
            <VehicleCard plate="ABCD 123" model="Toyota Vitz blanco" variant="compact" />
          </Col>
        </Both>
      </Block>
      <Block title="Patente y PIN" spec="Patente Mercosur siempre blanca con texto negro (PY «ABCD 123», AR «AB 123 CD»). PIN en casillas de 48 × 56.">
        <Both><Col><Row><Plate>ABCD 123</Plate><Plate>AB 123 CD</Plate></Row><PinBoxes digits="4827" /></Col></Both>
      </Block>
    </>
  );
}

function Market() {
  const [sel, setSel] = useState('hogar');
  const cats: [string, string, string][] = [['ropa', 'Ropa', 'tag'], ['tecnologia', 'Tecnología', 'phone'], ['hogar', 'Hogar', 'home'], ['otros', 'Otros', 'more']];
  return (
    <Block title="Categoría · CategoryTile" spec="Horizontal: círculo de 40 con ícono + nombre en 2 líneas. Dos por fila. Elegida: la tarjeta entera en negro (blanca en oscuro).">
      <Both>
        <div className="ds-2col">
          {cats.map(([k, label, icon]) => <CategoryTile key={k} c={{ on: sel === k, label, icon, pressed: String(sel === k), pick: () => setSel(k) }} />)}
        </div>
      </Both>
    </Block>
  );
}

function Reglas() {
  return (
    <Block title="Antes de dibujar" spec="Orden de decisión: usar un componente de esta página; si no hay, componerlo con varios; solo como último recurso proponer uno nuevo y marcarlo como tal.">
      <ol className="ds-rules">{RULES.map((r) => <li key={r}>{r}</li>)}</ol>
    </Block>
  );
}

function Voz() {
  return (
    <>
      <Block title="Voz" spec="Voseo e imperativo voseante («Solicitá», «Confirmá»). Títulos de 4 palabras como máximo y frases de 12. Los errores dicen qué pasó y qué hacer.">
        <table className="ds-table"><thead><tr><th>Evitar</th><th>Usar</th></tr></thead><tbody>{VOICE.map(([a, b]) => <tr key={a}><td>{a}</td><td><b>{b}</b></td></tr>)}</tbody></table>
      </Block>
      <Block title="Formatos">
        <table className="ds-table"><tbody>
          <tr><td>Paraguay</td><td><code>Gs. 150.000</code> (sin decimales)</td></tr>
          <tr><td>Argentina</td><td><code>$ 15.000</code></td></tr>
          <tr><td>Brasil</td><td><code>R$ 150,00</code></td></tr>
          <tr><td>Fecha y hora</td><td><code>22/05/2026 · 15:45</code> (24 h)</td></tr>
        </tbody></table>
      </Block>
    </>
  );
}

const SECTIONS: Record<Key, () => JSX.Element> = {
  colores: Colores, tipografia: Tipografia, espaciado: Espaciado, elevacion: Elevacion, movimiento: Movimiento, iconos: Iconos,
  botones: Botones, chips: Chips, insignias: Insignias, formularios: Formularios, seleccion: Seleccion, tarjetas: Tarjetas, navegacion: Navegacion, capas: Capas, chat: Chat, auto: Auto, market: Market,
  reglas: Reglas, voz: Voz,
};

/* ---------------- página ---------------- */

export function DesignSystemPage({ onRefs }: { onRefs: () => void }) {
  const [key, setKey] = useState<Key>(() => fromHash() ?? 'colores');
  useEffect(() => { window.history.replaceState(null, '', `#sistema/${key}`); }, [key]);
  useEffect(() => {
    const onHash = () => { const k = fromHash(); if (k) setKey(k); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const here = MENU.flatMap((g) => g.items.map(([k, label]) => ({ key: k, label, group: g.group }))).find((i) => i.key === key)!;
  const Section = SECTIONS[key];
  return (
    <div className="ref-layout">
      <aside className="ref-rail">
        <div role="tablist" aria-orientation="vertical" aria-label="Sistema de diseño" className="ref-toc">
          <span className="vp-title">Sistema de diseño</span>
          {MENU.map((g) => (
            <div key={g.group} className="toc-group">
              <span className="toc-head">{g.group}</span>
              {g.items.map(([k, label, icon]) => {
                const on = k === key;
                return (
                  <button key={k} role="tab" aria-selected={on} className={`toc-item${on ? ' on' : ''}`} onClick={() => setKey(k)}>
                    <Icon name={icon} size={16} color={on ? 'var(--accent-fg)' : 'var(--fg3)'} />
                    {label}
                  </button>
                );
              })}
            </div>
          ))}
          <div className="toc-group">
            <span className="toc-head">Referencias anteriores</span>
            <button className="toc-item" onClick={onRefs}>
              <Icon name="layers" size={16} color="var(--fg3)" />
              Navegación por versión
            </button>
          </div>
        </div>
      </aside>
      <div className="ds-content">
        <div className="ref-head">
          <span className="crumbs">Sistema de diseño · {here.group} · brief y sistema del 09/11/2026 (TOKENS.json v1.1.0)</span>
          <h2>{here.label}</h2>
        </div>
        <Section />
      </div>
    </div>
  );
}
