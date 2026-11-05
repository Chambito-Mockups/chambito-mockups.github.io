/**
 * «Componentes»: the design references (navigation, components, bottom bar) per version, for one app with three modules (Servicios, Auto, Tienda) and two sides
 * (cliente and prestador). Built only with the shared nav components, so what is shown here
 * is what the screens use.
 */
import { CSSProperties, ReactNode, useState } from 'react';
import { ThemeScope, useApp } from './store';
import { dark, light, P, R, Theme } from './theme';
import { ProposalsSection } from './proposals';
import { Module, Version } from './registry';
import { VersionPanel } from './shell/Versions';
import { BarPage, ComponentsPage } from './showcase';
import { BottomNavBar, Icon, MenuGroup, MenuItem, NavBadges, NavIconButton, NavKey, navItems, QuickAccess, QuickTile } from './ui/kit';

const pretty = { textWrap: 'pretty' } as CSSProperties;

type Account = 'cliente' | 'prestador' | 'conductor';
type Stage = 'lanzamiento' | 'crecida';

const ACCOUNTS: { key: Account; label: string; hint: string }[] = [
  { key: 'cliente', label: 'Cliente', hint: 'Pide servicios, viajes y compra' },
  { key: 'prestador', label: 'Prestador', hint: 'Recibe pedidos de su oficio' },
  { key: 'conductor', label: 'Conductor', hint: 'Prestador con el oficio Conductor' },
];
const STAGES: { key: Stage; label: string; hint: string }[] = [
  { key: 'lanzamiento', label: 'Tienda en lanzamiento', hint: 'Tarjeta en Inicio + ícono arriba' },
  { key: 'crecida', label: 'Tienda con uso', hint: 'Pasa a ser pestaña' },
];

/** Tiles of Inicio: the client asks, the provider works. Same component, other content. */
function tilesFor(account: Account, onTap: (m: string) => void): QuickTile[] {
  const tap = (m: string) => () => onTap(m);
  if (account === 'cliente')
    return [
      { key: 'servicios', icon: 'limpieza', label: 'Servicios', hint: 'A domicilio', onClick: tap('Abre el pedido de servicios (flujo actual)') },
      { key: 'auto', icon: 'car', label: 'Viaje', hint: '¿A dónde vas?', status: 'En curso', onClick: tap('Abre Auto en el viaje en curso') },
      { key: 'tienda', icon: 'tag', label: 'Tienda', hint: 'Comprá y vendé', onClick: tap('Abre la Tienda') },
    ];
  const work: QuickTile =
    account === 'conductor'
      ? { key: 'conducir', icon: 'car', label: 'Conducir', hint: 'Disponible', status: 'Activo', onClick: tap('Abre el modo conductor (D3)') }
      : { key: 'trabajos', icon: 'inbox', label: 'Trabajos', hint: '2 pedidos nuevos', onClick: tap('Abre los pedidos de su oficio') };
  return [
    work,
    { key: 'agenda', icon: 'calendar', label: 'Agenda', hint: 'Hoy: 3', onClick: tap('Abre la agenda del día') },
    { key: 'cobros', icon: 'wallet', label: 'Cobros', hint: 'Ganancias', onClick: tap('Abre la billetera (D9)') },
  ];
}

/** Badges only where there is something to do; never on the tab you are in. */
function badgesFor(account: Account, active: NavKey): NavBadges {
  const b: NavBadges = account === 'cliente' ? { actividad: true } : { actividad: 2 };
  if (active in b) delete b[active];
  return b;
}

/** Top of Inicio: search + Tienda icon (launch entry) + profile. */
function TopChrome({ account, stage, onTap }: { account: Account; stage: Stage; onTap: (m: string) => void }) {
  const { t } = useApp();
  const client = account === 'cliente';
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button className="press" onClick={() => onTap(client ? 'Busca en todo Chambito: servicios, lugares y productos' : 'Busca en sus pedidos y clientes')} style={{ flex: 1, height: 48, borderRadius: 24, background: t.sheet, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', font: R(15), color: t.text2, minWidth: 0 }}>
        <Icon name="search" size={18} color={t.text2} />
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client ? '¿Qué necesitás?' : 'Buscá un pedido'}</span>
      </button>
      {stage === 'lanzamiento' && <NavIconButton icon="tag" label="Tienda" bg={t.sheet} size={48} onClick={() => onTap('Abre la Tienda (entrada de lanzamiento)')} />}
      <NavIconButton icon="user" label="Perfil" bg={t.sheet} size={48} onClick={() => onTap('Abre Perfil')} />
    </div>
  );
}

/** Small Inicio built from the shared pieces, for one account, stage and theme. */
function PhoneSample({ theme, account, stage }: { theme: Theme; account: Account; stage: Stage }) {
  const [active, setActive] = useState<NavKey>('inicio');
  const [msg, setMsg] = useState<string | null>(null);
  const items = navItems(true, false, stage === 'crecida');
  const cur = items.includes(active) ? active : 'inicio';
  const client = account === 'cliente';
  return (
    <ThemeScope.Provider value={theme}>
      <div role="group" aria-label={`Inicio de ejemplo, tema ${theme.name === 'dark' ? 'oscuro' : 'claro'}`} style={{ width: 390, maxWidth: '100%', borderRadius: 32, background: theme.bg, color: theme.text, padding: '20px 20px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 14, outline: '1px solid var(--line2)' }}>
        <TopChrome account={account} stage={stage} onTap={setMsg} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: P(20) }}>{client ? 'Hola, Lucía' : 'Hola, Ramón'}</span>
          <span style={{ font: R(14), color: theme.text2 }}>{client ? '¿Qué necesitás hoy?' : account === 'conductor' ? 'Estás recibiendo viajes' : 'Tenés pedidos para revisar'}</span>
        </div>
        <QuickAccess tiles={tilesFor(account, setMsg)} />
        {client && stage === 'lanzamiento' && (
          <button className="press" onClick={() => setMsg('Abre la Tienda desde la tarjeta')} style={{ background: theme.card, borderRadius: 18, padding: 12, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', width: '100%' }}>
            <span style={{ width: 36, height: 36, borderRadius: 18, background: theme.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name="tag" size={18} color={theme.success} /></span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ font: P(15) }}>Chambito Market</span>
              <span style={{ font: R(13), color: theme.text2 }}>Sé de los primeros en vender en tu zona</span>
            </span>
            <Icon name="chevronRight" size={18} color={theme.text2} />
          </button>
        )}
        {!client && (
          <button className="press" onClick={() => setMsg('Cambia a la vista de cliente sin cerrar sesión')} style={{ alignSelf: 'flex-start', height: 36, borderRadius: 18, background: theme.card, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', font: R(13, 500), color: theme.text }}>
            <Icon name="refresh" size={16} color={theme.success} />Pedir como cliente
          </button>
        )}
        <span aria-live="polite" style={{ minHeight: 18, font: R(12), color: theme.text2 }}>{msg ?? 'Tocá cualquier elemento para ver qué abre.'}</span>
        <BottomNavBar items={items} active={cur} onSelect={(k) => { setActive(k); setMsg(`Pestaña ${k}: abre su última pantalla`); }} badges={badgesFor(account, cur)} />
      </div>
    </ThemeScope.Provider>
  );
}

/** Perfil groups: everything that is not daily lives here, per account. */
function ProfileSample({ theme, account }: { theme: Theme; account: Account }) {
  return (
    <ThemeScope.Provider value={theme}>
      <div style={{ width: 390, maxWidth: '100%', borderRadius: 32, background: theme.mBg, color: theme.text, padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 16, outline: '1px solid var(--line2)' }}>
        {account === 'cliente' ? (
          <MenuGroup title="Ganá con Chambito">
            <MenuItem icon="users" label="Ofrecé tu oficio" hint="Limpieza, niñera, enfermería…" accent />
            <MenuItem icon="car" label="Manejá con Chambito" hint="Ganá con tu auto" tag="Nuevo" tagTone="new" last />
          </MenuGroup>
        ) : (
          <MenuGroup title="Mi trabajo">
            {account === 'conductor' && <MenuItem icon="car" label="Modo conductor" hint="Disponible para viajes" tag="Activo" tagTone="new" accent />}
            <MenuItem icon="inbox" label="Mis oficios" hint={account === 'conductor' ? 'Conductor · Limpieza' : 'Limpieza'} accent={account === 'prestador'} />
            <MenuItem icon="shield" label="Mis documentos" hint="Vencimientos y revisión" tag="Vence pronto" tagTone="warn" last />
          </MenuGroup>
        )}
        <MenuGroup title="Tienda">
          <MenuItem icon="plus" label="Vender en la Tienda" hint="Publicar es gratis" accent />
          <MenuItem icon="tag" label="Mis publicaciones" hint="3 activas" last />
        </MenuGroup>
      </div>
    </ThemeScope.Provider>
  );
}

function Choice<T extends string>({ label, options, value, onChange }: { label: string; options: { key: T; label: string; hint: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const on = o.key === value;
        return (
          <button key={o.key} role="radio" aria-checked={on} className="press" onClick={() => onChange(o.key)} title={o.hint}
            style={{ height: 40, borderRadius: 20, padding: '0 16px', font: R(14, 500), background: on ? '#4BAC4F' : 'var(--panel)', color: on ? '#000000' : 'var(--fg)', outline: on ? 'none' : '1px solid var(--line2)' }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Rule({ title, items }: { title: string; items: ReactNode[] }) {
  return (
    <div style={{ background: 'var(--panel)', borderRadius: 24, padding: 20, display: 'flex', flexDirection: 'column', gap: 10, outline: '1px solid var(--line2)', width: 390, maxWidth: '100%', boxSizing: 'border-box' }}>
      <span style={{ font: P(16), color: 'var(--fg)' }}>{title}</span>
      <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, i) => <li key={i} style={{ font: R(14), color: 'var(--fg2)', ...pretty }}>{it}</li>)}
      </ul>
    </div>
  );
}

/* ================= Bar alternatives: client, provider and general ================= */
interface BarOption {
  id: string;
  title: string;
  recommended?: boolean;
  /** follows the brand guide checklist (Navegación: Inicio · Actividad · Perfil) */
  guide?: boolean;
  idea: string;
  cliente: NavKey[];
  prestador: NavKey[];
  pros: string[];
  cons: string[];
  when: string;
}

const OPTIONS: BarOption[] = [
  {
    id: 'rol',
    title: 'A · 2.ª pestaña según la cuenta (Trabajo | Explorar)',
    recommended: true,
    idea: 'De la Opción 3 y del patrón de superapp (Inicio · Servicios · Actividad · Cuenta). Cuatro pestañas fijas; solo la segunda cambia: Trabajo para el prestador, Explorar para el cliente. Servicios, Auto y Market van como accesos en Inicio y como filtros dentro de Explorar, Trabajo y Actividad.',
    cliente: ['inicio', 'explorar', 'actividad', 'perfil'],
    prestador: ['inicio', 'trabajo', 'actividad', 'perfil'],
    pros: ['Cada uno ve para qué entra, en el mismo lugar.', 'Sumar Equipos, Comercios o Envíos no cambia la barra: se agregan como filtro.', 'Solo 4 pestañas: más grandes y fáciles de tocar.'],
    cons: ['Pedir un viaje no tiene pestaña propia: el acceso de Inicio y la búsqueda tienen que ser muy visibles, y el viaje en curso se ve encima de todo.'],
    when: 'Desde el lanzamiento. Es la que recomiendo (ver «Diseños de Inicio» → Recomendada).',
  },
  {
    id: 'explorador',
    title: 'B · Selector de sección (Prototipo Auto)',
    guide: true,
    idea: 'Del «Prototipo Auto». La barra es siempre Inicio · Actividad · Perfil. Cada portada tiene arriba a la izquierda «Servicios ▾», «Auto ▾» o «Market ▾», que abre «Elegí qué querés hacer». La app vuelve a abrir en la última sección usada.',
    cliente: ['inicio', 'actividad', 'perfil'],
    prestador: ['inicio', 'actividad', 'perfil'],
    pros: ['Cumple la guía de marca: la barra de la app actual no cambia.', 'Sumar una sección no toca la barra: es una fila más en el explorador.', 'Cada sección tiene su portada completa (mapa para Servicios y Auto, catálogo para Market).'],
    cons: ['Cambiar de sección son 2 toques (selector y sección).', 'Las otras secciones no se ven desde la portada: el selector tiene que ser muy claro.'],
    when: 'Si se mantiene la navegación de la app actual. Se prueba en el menú Auto → «Explorador · Prototipo Auto» o con «Navegación» en el menú lateral.',
  },
  {
    id: 'modulos-tab',
    title: 'C · Pestaña «Módulos»',
    idea: 'De la Opción 1 de los diseños. Inicio · Módulos · Actividad · Perfil; Módulos abre una grilla con todo lo que ofrece Chambito.',
    cliente: ['inicio', 'modulos', 'actividad', 'perfil'],
    prestador: ['inicio', 'modulos', 'actividad', 'perfil'],
    pros: ['Escala a muchos módulos sin cambiar la barra.'],
    cons: ['Si Inicio ya tiene el selector, «Módulos» repite lo mismo.', '«Módulos» es una palabra interna: el usuario busca «viaje» o «plomero», no «módulo».'],
    when: 'Solo si Inicio no tiene selector de módulos.',
  },
  {
    id: 'unica',
    title: 'D · Una barra, contenido según la cuenta',
    idea: 'Las mismas pestañas para todos. Inicio muestra «qué pedir» al cliente y «qué hacer hoy» al prestador.',
    cliente: ['inicio', 'auto', 'actividad', 'perfil'],
    prestador: ['inicio', 'auto', 'actividad', 'perfil'],
    pros: ['Se aprende una vez: cambiar de rol no mueve nada.', 'Menos pantallas que mantener y probar.', 'Deja lugar para sumar Tienda como 5.ª pestaña.'],
    cons: ['Agenda y Cobros quedan a un toque más (accesos de Inicio).'],
    when: 'Al lanzar, y mientras la mayoría de los prestadores también usen la app como clientes.',
  },
  {
    id: 'modo',
    title: 'E · Barra por modo (cliente | prestador)',
    idea: 'El prestador activa «Modo prestador» y la barra cambia a sus herramientas, como una app de conductor dentro de la misma app.',
    cliente: ['inicio', 'auto', 'tienda', 'actividad', 'perfil'],
    prestador: ['trabajos', 'agenda', 'cobros', 'mensajes', 'perfil'],
    pros: ['Herramientas de trabajo a un toque.', 'El cliente no ve nada del prestador.'],
    cons: ['Dos navegaciones distintas: el que es ambas cosas se pierde.', 'Hay que mostrar siempre en qué modo está.'],
    when: 'Si hay prestadores que trabajan todo el día con la app (muchos pedidos por día).',
  },
  {
    id: 'central',
    title: 'F · Botón central «Pedir»',
    idea: 'Un botón en el medio abre una hoja: Servicio · Viaje · Vender (cliente) o Disponibilidad · Publicar (prestador).',
    cliente: ['inicio', 'actividad', 'pedir', 'mensajes', 'perfil'],
    prestador: ['inicio', 'actividad', 'pedir', 'mensajes', 'perfil'],
    pros: ['Los módulos no compiten por pestañas: sumar uno no cambia la barra.', 'Mensajes unificados con prestador, conductor y vendedor.'],
    cons: ['Pedir un viaje pasa a ser 2 toques.', '«Pedir» es ambiguo si no se ve qué hay dentro.'],
    when: 'Si se suman más módulos (Comercios, delivery) y ya no entran en 5 pestañas.',
  },
  {
    id: 'modulos',
    title: 'G · Una pestaña por módulo',
    idea: 'Cada negocio tiene su pestaña y no hay Inicio general.',
    cliente: ['servicios', 'auto', 'tienda', 'actividad', 'perfil'],
    prestador: ['servicios', 'auto', 'tienda', 'actividad', 'perfil'],
    pros: ['Muy explícito: se ve todo lo que ofrece Chambito.'],
    cons: ['La Tienda ocupa lugar aunque esté vacía.', 'No queda lugar para Equipos ni Mensajes.', 'Sin Inicio no hay dónde mostrar el viaje en curso o los pedidos de hoy.'],
    when: 'Solo si los tres módulos tienen un uso parecido. Hoy no lo recomiendo.',
  },
];

function MiniBar({ theme, items, label }: { theme: Theme; items: NavKey[]; label: string }) {
  const [cur, setCur] = useState<NavKey>(items[0]);
  return (
    <ThemeScope.Provider value={theme}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: R(12, 500), color: 'var(--fg2)' }}>{label}</span>
        <div style={{ background: theme.bg, borderRadius: 20, padding: '14px 12px', outline: '1px solid var(--line2)' }}>
          <BottomNavBar items={items} active={cur} onSelect={setCur} />
        </div>
      </div>
    </ThemeScope.Provider>
  );
}

function OptionCard({ o }: { o: BarOption }) {
  const list = (title: string, items: string[], color: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ font: R(12, 500), color }}>{title}</span>
      <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((x) => <li key={x} style={{ font: R(13), color: 'var(--fg2)', ...pretty }}>{x}</li>)}
      </ul>
    </div>
  );
  return (
    <section aria-label={o.title} style={{ background: 'var(--panel)', borderRadius: 24, padding: 20, display: 'flex', flexDirection: 'column', gap: 14, width: 420, maxWidth: '100%', boxSizing: 'border-box', outline: o.recommended ? '2px solid #4BAC4F' : '1px solid var(--line2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ font: P(16), color: 'var(--fg)', flex: 1 }}>{o.title}</span>
        {o.recommended && <span style={{ font: R(12, 500), color: '#000000', background: '#4BAC4F', borderRadius: 10, padding: '2px 10px' }}>Recomendada</span>}
        {o.guide && <span style={{ font: R(12, 500), color: 'var(--fg)', background: 'var(--panel)', outline: '1px solid #4BAC4F', borderRadius: 10, padding: '2px 10px' }}>Cumple la guía de marca</span>}
      </div>
      <span style={{ font: R(14), color: 'var(--fg2)', ...pretty }}>{o.idea}</span>
      <MiniBar theme={dark} items={o.cliente} label="Cliente" />
      <MiniBar theme={dark} items={o.prestador} label={o.prestador.join() === o.cliente.join() ? 'Prestador (la misma barra)' : 'Prestador (modo prestador)'} />
      {list('A favor', o.pros, '#4BAC4F')}
      {list('En contra', o.cons, '#FF6B6B')}
      <span style={{ font: R(13), color: 'var(--fg)', ...pretty }}><b>Cuándo usarla:</b> {o.when}</span>
    </section>
  );
}

function NavOptions() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <span style={{ font: P(22) }}>Opciones para la barra</span>
      <span style={{ font: R(15), color: 'var(--fg2)', maxWidth: 900, ...pretty }}>
        Siete maneras de ordenar la barra (A, B y C salen de los diseños que compartiste), cada una con cómo la ve el cliente y cómo la ve el prestador. Tocá las pestañas para probarlas.
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
        {OPTIONS.map((o) => <OptionCard key={o.id} o={o} />)}
      </div>
      <div style={{ background: 'var(--panel)', borderRadius: 24, padding: 20, display: 'flex', flexDirection: 'column', gap: 10, outline: '1px solid var(--line2)', maxWidth: 900 }}>
        <span style={{ font: P(16) }}>Mi recomendación</span>
        <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Barra de 4 pestañas fijas (opción A). Prestador: Inicio · Trabajo · Actividad · Perfil. Cliente: Inicio · Explorar · Actividad · Perfil. Mismas posiciones e íconos; solo cambia la 2.ª.',
            'Inicio responde «¿Qué necesitás hoy?»: una búsqueda para los tres módulos, tres accesos (servicio, viaje, productos) y la actividad reciente.',
            'Explorar y Trabajo tienen el filtro «Todo · Servicios · Auto · Market». En Todo, el prestador ve un feed con todas sus oportunidades; cada tarjeta lleva ícono + texto del módulo.',
            'Disponibilidad por módulo (Servicios, Auto, Entregas) con un resumen en Inicio: «Disponible en 2 de 3 módulos».',
            'Actividad única con el mismo filtro y agrupada por día. Perfil único: muestra lo que aplica y ofrece «Activar módulo» para lo demás.',
            'Campana y mensajes en la cabecera, no en la barra. Lo urgente (viaje en curso, oferta entrante) va encima de cualquier pestaña.',
          ].map((x) => <li key={x} style={{ font: R(14), color: 'var(--fg2)', ...pretty }}>{x}</li>)}
        </ol>
      </div>
    </div>
  );
}


/* ================= Arquitectura: what lives where ================= */
const TREE: [string, string, string[][]][] = [
  ['Inicio', 'home', [['Búsqueda unificada'], ['Accesos: Servicios · Auto · Market'], ['Actividad reciente (cliente) · Oportunidades y disponibilidad (prestador)']]],
  ['Explorar / Trabajo', 'search', [['Todo'], ['Servicios', 'Rubros, profesionales cerca'], ['Auto', '¿A dónde vas?, Casa, Trabajo, recientes'], ['Market', 'Productos, categorías, comercios, ofertas']]],
  ['Actividad', 'bell', [['Solicitudes'], ['Viajes'], ['Compras'], ['Ventas'], ['Pagos']]],
  ['Perfil', 'user', [['Mi cuenta', 'Datos, identidad, pagos, direcciones'], ['Mis actividades', 'Rubros, vehículo, comercio, publicaciones'], ['Activar módulo', 'Lo que todavía no usa'], ['Configuración', 'Notificaciones, privacidad, ayuda']]],
];

function Architecture() {
  const box = { background: 'var(--panel)', borderRadius: 20, padding: 16, outline: '1px solid var(--line2)' } as CSSProperties;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <span style={{ font: R(15), color: 'var(--fg2)', maxWidth: 900, ...pretty }}>
        Cuatro destinos fijos. Los módulos viven <b>dentro</b> de cada uno, así que sumar uno nuevo no cambia la barra.
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12, maxWidth: 1240 }}>
        {TREE.map(([title, icon, rows]) => (
          <section key={title} aria-label={title} style={{ ...box, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, font: P(17) }}>
              <span style={{ width: 32, height: 32, borderRadius: 10, background: '#4BAC4F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={18} color="#000000" /></span>
              {title}
            </span>
            <ul style={{ margin: 0, padding: '0 0 0 14px', borderLeft: '2px solid var(--line2)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rows.map(([name, hint]) => (
                <li key={name} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ font: R(14, 500), color: 'var(--fg)' }}>{name}</span>
                  {hint && <span style={{ font: R(12), color: 'var(--fg2)' }}>{hint}</span>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 12, maxWidth: 1240 }}>
        {([['Cliente', ['inicio', 'explorar', 'actividad', 'perfil']], ['Prestador', ['inicio', 'trabajo', 'actividad', 'perfil']]] as [string, NavKey[]][]).map(([who, items]) => (
          <div key={who} style={{ ...box, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <MiniBar theme={dark} items={items} label={`${who} · solo cambia la 2.ª pestaña`} />
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCKUP_COMPONENTS: [string, string, string][] = [
  ['BrandHeader · BackHeader', 'ui/modules.tsx', 'Logo «Chambito» con la campana en Inicio; flecha y título en las pantallas de módulo (Chambito Auto, Market, Disponibilidad).'],
  ['EntryTiles', 'ui/modules.tsx', 'Servicios · Auto · Market en verde suave, ícono arriba y texto centrado. Servicios abre Explorar filtrado; Auto y Market abren su pantalla.'],
  ['OnlineCard · StatRow · StatusBadge', 'ui/modules.tsx', 'Disponibilidad en superficie con la insignia «En línea» (verde 20 % con punto que late), el interruptor general y el enlace «Elegir módulos»; debajo, 3 · 1 · ★ 4,8.'],
  ['AvailabilityList · InfoBanner', 'ui/modules.tsx', 'Pantalla Disponibilidad: una tarjeta con interruptor por módulo (Servicios, Auto, Market Entregas) y la nota de arriba.'],
  ['RouteMap · PlaceShortcuts', 'ui/modules.tsx', 'Chambito Auto: mapa con la ruta, «¿A dónde vas?» y los atajos Casa · Trabajo · Favoritos.'],
  ['InlineBanner', 'ui/modules.tsx', 'Tarjeta suave que lleva a un módulo: «Movete con Chambito Auto · Viajes rápidos y seguros».'],
  ['CategoryRow · PromoCarousel', 'ui/modules.tsx', 'Market: Tecnología · Hogar · Moda · Más y el carrusel «Ofertas de lanzamiento» con puntos (sin avance automático).'],
  ['ProductCard · Rail', 'ui/modules.tsx', 'Producto con foto, precio y corazón para guardar; fila horizontal para «Ofertas del Market».'],
  ['FeedCard (nueva versión)', 'ui/hub.tsx', 'Etiqueta «Servicio» / «Market · Entrega», «Hace 2 min», ícono, distancia y precio, y la flecha verde para abrir.'],
  ['BottomNavBar variant="docked"', 'ui/nav.tsx', 'La misma barra de TOKENS.json pero fija al borde de abajo, como en el mockup. La flotante (isla de 72, radio 16) es la predeterminada.'],
];

/* ---------- contrast (WCAG) to check the mockup palette ---------- */
const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

const PALETTE: [name: string, mockup: string, ours: string, use: string][] = [
  ['Primario', '#22A652', '#4BAC4F', 'Botones, pestaña activa, interruptores'],
  ['Secundario', '#E8F8EE', '#DBEEDC', 'Fondos suaves (tarjetas de módulo, etiquetas)'],
  ['Texto', '#0F172A', '#000000', 'Títulos y texto principal'],
  ['Texto secundario', '#6B7280', '#5C5C5C', 'Descripciones, horas, montos chicos'],
  ['Superficie', '#F3F4F6', '#F5F5F5', 'Tarjetas sobre el fondo blanco'],
];

function Palette() {
  const sw = (hex: string) => <span style={{ width: 40, height: 40, borderRadius: 12, background: hex, outline: '1px solid var(--line2)', flex: 'none' }} />;
  const verdict = (r: number) => (r >= 4.5 ? ['AA texto', '#4BAC4F'] : r >= 3 ? ['Solo íconos o texto grande', '#FFB547'] : ['No apto para texto', '#FF6B6B']);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ font: P(18) }}>Paleta del mockup vs. el prototipo</span>
      <span style={{ font: R(14), color: 'var(--fg2)', maxWidth: 900, ...pretty }}>
        El contraste se calcula sobre blanco. Decidido por la guía de marca (05/11/2026) y TOKENS.json: el prototipo usa la paleta del manual (#4BAC4F), no la del mockup; los verdes de Figma están descartados. Texto sobre verde en blanco y en negrita; enlaces en #2F7A33 (claro) / #7CCB7F (oscuro) y éxito en #24602A.
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 10, maxWidth: 1240 }}>
        {PALETTE.map(([name, mock, ours, use]) => {
          const r = contrast(mock, '#FFFFFF');
          const [v, c] = verdict(r);
          return (
            <div key={name} style={{ background: 'var(--panel)', borderRadius: 18, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, outline: '1px solid var(--line2)' }}>
              <span style={{ font: P(15) }}>{name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {sw(mock)}
                <span style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <code style={{ font: R(13, 500) }}>{mock}</code>
                  <span style={{ font: R(12), color: 'var(--fg2)' }}>mockup</span>
                </span>
                {sw(ours)}
                <span style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <code style={{ font: R(13, 500) }}>{ours}</code>
                  <span style={{ font: R(12), color: 'var(--fg2)' }}>prototipo</span>
                </span>
              </div>
              <span style={{ font: R(12), color: 'var(--fg2)' }}>{use}</span>
              {name !== 'Secundario' && name !== 'Superficie' && <span style={{ font: R(12, 500), color: c }}>{r.toFixed(1).replace('.', ',')}:1 sobre blanco · {v}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- the mockup's two navigation variants ---------- */
function NavVariants() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ font: P(18) }}>Variantes de navegación (del mockup)</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 12, maxWidth: 1240 }}>
        <section aria-label="Opción recomendada (4 pestañas)" style={{ background: 'var(--panel)', borderRadius: 20, padding: 16, outline: '2px solid #4BAC4F', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ font: P(15) }}>✓ Recomendada · 4 pestañas</span>
          <MiniBar theme={light} items={['inicio', 'explorar', 'actividad', 'perfil']} label="Cliente" />
          <MiniBar theme={light} items={['inicio', 'trabajo', 'actividad', 'perfil']} label="Prestador" />
          <span style={{ font: R(13), color: 'var(--fg2)', ...pretty }}>Los módulos se suman como filtro y como acceso. Actividad junta todo el historial.</span>
        </section>
        <section aria-label="Opción alterna (5 pestañas)" style={{ background: 'var(--panel)', borderRadius: 20, padding: 16, outline: '1px solid var(--line2)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ font: P(15) }}>Alterna · 5 pestañas</span>
          <MiniBar theme={light} items={['inicio', 'servicios', 'auto', 'tienda', 'perfil']} label="Cliente y prestador" />
          <span style={{ font: R(13), color: 'var(--fg2)', ...pretty }}>
            Cada módulo a un toque, pero no queda lugar para Actividad (el historial pasa a Perfil) ni para un módulo más. El prestador no tiene dónde ver su feed de Trabajo.
          </span>
        </section>
      </div>
    </div>
  );
}

const COMPONENTS: [string, string, string][] = [
  ['BottomNavBar', 'ui/nav.tsx', 'Isla flotante de 72, radio 16, con borde (TOKENS bottomNav). Ícono 24 y nombre siempre visibles; la activa en verde (#2F7A33 / #7CCB7F), sin pastilla. Máximo 5 destinos.'],
  ['navItems()', 'ui/nav.tsx', 'Decide los destinos según Auto habilitado, Equipos y si la Tienda es pestaña. Si pasan de 5, Equipos va a Perfil.'],
  ['Dot / NavBadges', 'ui/nav.tsx', 'Punto o número. Solo en Actividad (viaje en curso, pedidos nuevos); nunca en la pestaña activa.'],
  ['TopBar · HubTopChrome', 'ui/nav.tsx · ui/kit.tsx', 'Búsqueda + accesos. En lanzamiento suma el ícono de Tienda junto a Perfil.'],
  ['NavIconButton', 'ui/nav.tsx', 'Botón redondo de 44–48 px con badge opcional: atrás, Tienda, Perfil, chat.'],
  ['QuickAccess', 'ui/nav.tsx', 'Fila de accesos de Inicio. Cliente: Servicios · Viaje · Tienda. Prestador: Trabajos · Agenda · Cobros.'],
  ['MenuGroup / MenuItem', 'ui/nav.tsx', 'Perfil agrupado por módulo. Lo que no es diario (documentos, oficios, publicaciones) vive acá.'],
];

const HOME_COMPONENTS: [string, string, string][] = [
  ['HomeHeader', 'ui/home.tsx', 'Título o saludo, con campana y mensajes con contador. Opciones 1, 2 y 3.'],
  ['ModuleSwitcher', 'ui/home.tsx', 'Servicios · Auto · Market siempre arriba. Variante «pill» (Opción 1) o «tiles» (Opción 2); contador por módulo.'],
  ['ProviderCard', 'ui/home.tsx', 'Tarjeta del prestador de las Opciones 1 a 3: cabecera verde con texto blanco (destacado o números) y el interruptor de disponibilidad.'],
  ['ModuleTiles', 'ui/home.tsx', 'Tres tarjetas lado a lado: «Oportunidades por módulo», «Tus módulos», «Pedir un servicio / viaje / Comprar».'],
  ['ModuleList', 'ui/home.tsx', 'Filas con ícono y número en verde: «3 solicitudes cerca tuyo», actividad reciente, lugares guardados.'],
  ['SearchBar · LocationPicker', 'ui/home.tsx', 'Búsqueda (de un módulo o de los tres) y ubicación actual del cliente.'],
  ['PromoBanner · ModuleHero', 'ui/home.tsx', 'Banner verde (Opción 1) y tarjeta grande por módulo con botón (Opción 2).'],
  ['ServiceGrid · QuickChips', 'ui/home.tsx', 'Oficios populares (Plomería, Electricidad, Pintura, Limpieza) y acciones rápidas (Favoritos, Promos, Historial).'],
];

const HUB_COMPONENTS: [string, string, string][] = [
  ['UnifiedSearch', 'ui/hub.tsx', 'Una búsqueda para los tres módulos, con resultados agrupados: «plomero» → Servicios, «Costanera» → Auto, «ventilador» → Market.'],
  ['ModuleFilter', 'ui/hub.tsx', '«Todo · Servicios · Auto · Market» con contador opcional. Solo dentro de Explorar, Trabajo y Actividad.'],
  ['FeedCard', 'ui/hub.tsx', 'Oportunidad del prestador: «NUEVO · SERVICIO», título, distancia y precio. El módulo va con ícono + texto.'],
  ['ModuleTag', 'ui/hub.tsx', 'Etiqueta de módulo o tipo (Servicio, Auto, Entrega, Venta, Pago) que no depende solo del color.'],
  ['ActivityTimeline', 'ui/hub.tsx', 'Actividad de todos los módulos en una línea de tiempo agrupada por día (Próximo, Hoy, Ayer).'],
  ['AvailabilitySummary · AvailabilityPanel', 'ui/hub.tsx', '«Disponible en 2 de 3 módulos» que abre un interruptor por módulo: Servicios, Auto, Entregas del Market.'],
  ['ActivateModuleCard', 'ui/hub.tsx', 'En Perfil, para lo que todavía no usa: «Chambito Auto · Conducí y recibí oportunidades de viaje [Activar módulo]».'],
  ['PageTitle', 'ui/hub.tsx', 'Título grande de Explorar, Trabajo, Actividad y Perfil.'],
];

type Tab = 'disenos' | 'opciones' | 'arquitectura' | 'probalo' | 'reglas';
export type RefSection = 'nav' | 'comp' | 'barra';
const TAB_ICON: Record<Tab, string> = { disenos: 'home', opciones: 'menu', arquitectura: 'layers', probalo: 'phone', reglas: 'success' };
const TABS: [Tab, string][] = [['disenos', 'Diseños de Inicio'], ['opciones', 'Opciones de barra'], ['arquitectura', 'Arquitectura'], ['probalo', 'Probalo'], ['reglas', 'Reglas']];

const REF_TABS: Record<Version['refs'], Tab[]> = {
  tabs: ['opciones', 'probalo', 'reglas'],
  explorer: ['opciones', 'reglas'],
  estable: ['disenos', 'opciones', 'arquitectura', 'reglas'],
};
const EXPLORER_COMPONENTS: [string, string, string][] = [
  ['SectionSelector', 'ui/section.tsx', '«Servicios ▾» / «Auto ▾» / «Market ▾»: píldora de 48 con el ícono de la sección en verde (blanco encima) y el chevron.'],
  ['ExplorerSheet', 'ui/explorer.tsx', '«Elegí qué querés hacer»: logo oficial y una fila por sección; la actual con «Estás acá», borde verde y check; Market con «Nuevo».'],
  ['InicioExplorer (X1)', 'ui/explorer.tsx', 'Portada de Servicios: mapa, selector arriba, «¿Qué necesitás?», servicios populares y la tarjeta «Nuevo: Chambito Auto».'],
  ['HubTopChrome (modo selector)', 'ui/kit.tsx', 'En la portada de Auto, sin ubicación o con un servicio en curso, el selector reemplaza al buscador de arriba.'],
  ['ExplorerActivity (A11)', 'ui/explorer.tsx', 'Actividad con todas las secciones y el filtro Todo · Servicios · Auto · Market.'],
  ['useGoSection', 'ui/explorer.tsx', 'Va a la portada de una sección y la recuerda: Inicio y la próxima apertura vuelven ahí.'],
];

/** The fixed bar of the explorer, in both themes. */
function ExplorerBar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 900 }}>
      <span style={{ font: P(22) }}>Barra inferior del selector de sección</span>
      <span style={{ font: R(15), color: 'var(--fg2)', ...pretty }}>
        La misma en todas las secciones: Inicio · Actividad · Perfil. Inicio abre la portada de la última sección usada; cambiar de sección es tarea del selector de arriba, no de la barra.
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 12 }}>
        <MiniBar theme={dark} items={['inicio', 'actividad', 'perfil']} label="Tema oscuro" />
        <MiniBar theme={light} items={['inicio', 'actividad', 'perfil']} label="Tema claro" />
      </div>
    </div>
  );
}

export function IntegrationPage({ module = 'auto', version, onVersion, initial = 'nav' }: { module?: Module; version?: Version; onVersion?: (v: Version) => void; initial?: RefSection }) {
  const [section, setSection] = useState<RefSection>(initial);
  const [tabPick, setTab] = useState<Tab>('disenos');
  const kind: Version['refs'] = version?.refs ?? 'estable';
  const tabs = REF_TABS[kind];
  const tab: Tab = tabs.includes(tabPick) ? tabPick : tabs[0];
  const [account, setAccount] = useState<Account>('cliente');
  const [stage, setStage] = useState<Stage>('lanzamiento');
  // one list for the whole page: what this version brings, one click each (no tabs above tabs)
  const items: { key: string; section: RefSection; tab?: Tab; label: string; icon: string; group: string }[] = [
    ...TABS.filter(([k]) => tabs.includes(k)).map(([k, label]) => ({ key: k, section: 'nav' as const, tab: k, label, icon: TAB_ICON[k], group: 'Navegación' })),
    { key: 'comp', section: 'comp', label: 'Componentes', icon: 'layers', group: 'Piezas' },
    { key: 'barra', section: 'barra', label: 'Barra inferior', icon: 'menu', group: 'Piezas' },
  ];
  const current = section === 'nav' ? tab : section;
  const here = items.find((i) => i.key === current) ?? items[0];
  return (
    <div className="ref-layout">
    <aside className="ref-rail">
      {version && onVersion && <VersionPanel module={module} version={version} onVersion={onVersion} compact />}
      <div role="tablist" aria-orientation="vertical" aria-label="En esta versión" className="ref-toc">
        <span className="vp-title">En esta versión</span>
        {['Navegación', 'Piezas'].map((g) => (
          <div key={g} className="toc-group">
            <span className="toc-head">{g}</span>
            {items.filter((i) => i.group === g).map((i) => {
              const on = i.key === here.key;
              return (
                <button key={i.key} role="tab" aria-selected={on} className={`toc-item${on ? ' on' : ''}`} onClick={() => { setSection(i.section); if (i.tab) setTab(i.tab); }}>
                  <Icon name={i.icon} size={16} color={on ? 'var(--accent-fg)' : 'var(--fg3)'} />
                  {i.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: 'var(--fg)', minWidth: 0 }}>
      <div className="ref-head">
        <span className="crumbs">Componentes{version ? ` · ${version.id} ${version.label}` : ''}</span>
        <h2>{here.label}</h2>
      </div>

      {section === 'nav' && tab === 'disenos' && <ProposalsSection />}

      {section === 'nav' && tab === 'opciones' && <NavOptions />}

      {section === 'nav' && tab === 'arquitectura' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Architecture />
        </div>
      )}

      {section === 'comp' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {((kind === 'tabs'
            ? [['Barra y navegación', COMPONENTS]]
            : kind === 'explorer'
              ? [['Selector de sección (Prototipo Auto)', EXPLORER_COMPONENTS]]
              : [['Del mockup «Cliente y Prestador»', MOCKUP_COMPONENTS], ['Navegación estable', HUB_COMPONENTS], ['Inicio (de los diseños propuestos)', HOME_COMPONENTS]]
          ) as [string, [string, string, string][]][]).map(([title, list]) => (
            <div key={title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ font: P(18) }}>{title}</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 10, maxWidth: 1240 }}>
                {list.map(([name, file, text]) => (
                  <div key={name} style={{ background: 'var(--panel)', borderRadius: 18, padding: 14, display: 'flex', flexDirection: 'column', gap: 4, outline: '1px solid var(--line2)' }}>
                    <span style={{ font: P(15) }}>{name}</span>
                    <code style={{ font: R(12), color: '#4BAC4F' }}>src/{file}</code>
                    <span style={{ font: R(13), color: 'var(--fg2)', ...pretty }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Palette />
          {/* the pieces the Auto v3 design adds (VehicleCard, SOS, tips, demand layer…) */}
          {kind === 'tabs' && <ComponentsPage />}
        </div>
      )}

      {section === 'barra' && (kind === 'tabs' ? <BarPage /> : kind === 'explorer' ? <ExplorerBar /> : <NavVariants />)}

      {section === 'nav' && tab === 'probalo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <Choice label="Cuenta" options={ACCOUNTS} value={account} onChange={setAccount} />
            <Choice label="Etapa de la Tienda" options={STAGES} value={stage} onChange={setStage} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
            {[dark, light].map((th) => (
              <div key={th.name} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ font: P(16) }}>Inicio · {th.name === 'dark' ? 'tema oscuro' : 'tema claro'}</span>
                <PhoneSample key={`${account}-${stage}`} theme={th} account={account} stage={stage} />
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ font: P(16) }}>Perfil · grupos por módulo</span>
              <ProfileSample theme={dark} account={account} />
            </div>
          </div>
        </div>
      )}

      {section === 'nav' && tab === 'reglas' && (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
        <Rule title="Usabilidad" items={[
          'Máximo 5 pestañas, siempre en el mismo orden: Inicio · Auto · (Tienda) · Actividad · Perfil.',
          'Una sola Actividad con selector Servicios | Viajes | Tienda: el usuario no busca «dónde quedó» su pedido.',
          'Cada pestaña recuerda su última pantalla; tocar la pestaña activa vuelve a su raíz.',
          'Prestador y cliente comparten barra: «Pedir como cliente» cambia la vista sin cerrar sesión.',
          'Lo urgente (viaje en curso, oferta entrante) se muestra encima de cualquier pantalla, no en una pestaña.',
        ]} />
        <Rule title="Tienda en etapa inicial" items={[
          'No ocupa pestaña al principio: tarjeta en Inicio + ícono junto a Perfil. Si está casi vacía, la tarjeta invita a vender.',
          'Pasa a pestaña cuando se use seguido (por ejemplo, más del 15 % de las sesiones semanales entran a la Tienda).',
          'Al pasar a pestaña, Equipos se muda a Perfil para no superar 5 destinos (lo hace navItems()).',
          'Vender se ofrece en Perfil para todos: el prestador ya está verificado y publica sin otro registro.',
        ]} />
        <Rule title="Rendimiento" items={[
          'Inicio solo carga resúmenes: cantidades, la próxima actividad y tres recomendaciones. Ni el mapa, ni el catálogo, ni todas las oportunidades.',
          'Auto carga el mapa al abrir Auto (React.lazy por módulo); no se inicializa mientras el usuario mira Servicios.',
          'Market carga primero texto y miniaturas comprimidas; las imágenes completas después (loading="lazy").',
          'Cada módulo conserva su estado: al volver a Market, se abre la categoría o el producto donde estaba.',
          'Componentes compartidos (tarjetas, estados, buscador, chat, pagos, perfiles): menos código para cargar y mantener.',
          'Contadores y badges con un solo pedido liviano, no con las listas completas de cada módulo.',
        ]} />
        <Rule title="Activación gradual" items={[
          'Market aparece con la etiqueta «Nuevo» o «Disponible en tu zona», sin todas las herramientas de un marketplace grande el primer día.',
          'Un módulo que el usuario no usa no se ve en la barra: aparece en Perfil como «Activar módulo».',
          'Cada módulo nuevo suma un filtro y un acceso, nunca una pestaña.',
        ]} />
        <Rule title="Patrón de referencia" items={[
          'Según el texto de referencia, Uber organiza Viajes, Eats y Supermercado con 4 pestañas fijas (Home · Services · Activity · Account), sin una pestaña por producto.',
          'Inicio personalizado, un catálogo central de servicios, un historial unificado y una cuenta compartida.',
          'Un sistema de diseño común con tarjetas modulares para sumar funciones sin interfaces nuevas.',
          'Fuente: el análisis que compartiste (enlaces a uber.com y base.uber.com); conviene revisarlos antes de citarlos.',
        ]} />
        <Rule title="Simplicidad" items={[
          'Un solo kit de navegación (ui/nav.tsx) para los tres módulos: mismas barras, botones y menús.',
          'Una regla de color (guía de marca): el verde es la señal, no decora. Un solo botón verde por pantalla, texto blanco sobre verde, selección en negro/blanco y la pestaña activa en verde sin pastilla.',
          'El rol no se elige al entrar: todos son clientes; prestar o manejar se activa desde Perfil.',
        ]} />
      </div>
      )}
    </div>
    </div>
  );
}
