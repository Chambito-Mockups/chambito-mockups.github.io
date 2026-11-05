/**
 * The three Inicio proposals (Opción 1, 2 y 3) plus the recommended mix, for the client and the
 * provider, built only with ui/home.tsx and the shared BottomNavBar.
 */
import { CSSProperties, ReactNode, useState } from 'react';
import { BarStyle, StablePhone } from './stableNav';
import { ThemeScope } from './store';
import { dark, light, P, R, Theme } from './theme';
import { BottomNavBar, NavKey } from './ui/kit';
import {
  HomeFrame, HomeHeader, LocationPicker, ModuleHero, ModuleKey, ModuleList, ModuleSwitcher, ModuleTiles,
  PromoBanner, ProviderCard, QuickChips, SearchBar, SectionTitle, ServiceGrid,
} from './ui/home';

const pretty = { textWrap: 'pretty' } as CSSProperties;
export type ProposalId = 'estable' | 'mix' | 'op1' | 'op2' | 'op3';
type Side = 'prestador' | 'cliente';

const POPULAR: [string, string][] = [['wrench', 'Plomería'], ['bolt', 'Electricidad'], ['roller', 'Pintura'], ['limpieza', 'Limpieza']];
const PERSON = { name: 'Dario Gimenez', initials: 'DG', verified: true };

/** Bar of each proposal; the tab in Inicio is the active one, except where the design marks another. */
const BARS: Record<ProposalId, Record<Side, { items: NavKey[]; active: NavKey }>> = {
  op1: { prestador: { items: ['inicio', 'modulos', 'actividad', 'perfil'], active: 'inicio' }, cliente: { items: ['inicio', 'modulos', 'actividad', 'perfil'], active: 'inicio' } },
  op2: { prestador: { items: ['inicio', 'comercios', 'actividad', 'perfil'], active: 'inicio' }, cliente: { items: ['inicio', 'comercios', 'actividad', 'perfil'], active: 'inicio' } },
  op3: { prestador: { items: ['inicio', 'trabajo', 'actividad', 'perfil'], active: 'trabajo' }, cliente: { items: ['inicio', 'explorar', 'actividad', 'perfil'], active: 'explorar' } },
  estable: { prestador: { items: ['inicio', 'trabajo', 'actividad', 'perfil'], active: 'inicio' }, cliente: { items: ['inicio', 'explorar', 'actividad', 'perfil'], active: 'inicio' } },
  mix: { prestador: { items: ['inicio', 'trabajo', 'actividad', 'perfil'], active: 'inicio' }, cliente: { items: ['inicio', 'explorar', 'actividad', 'perfil'], active: 'inicio' } },
};

function Bar({ id, side }: { id: ProposalId; side: Side }) {
  const b = BARS[id][side];
  const [cur, setCur] = useState<NavKey>(b.active);
  return <BottomNavBar items={b.items} active={cur} onSelect={setCur} badges={cur === 'actividad' ? undefined : { actividad: side === 'prestador' ? 3 : true }} />;
}

/* ---------------- Provider ---------------- */
function Prestador({ id, say }: { id: ProposalId; say: (m: string) => void }) {
  const [mod, setMod] = useState<ModuleKey>('servicios');
  const [on, setOn] = useState(true);
  const opp = (m: ModuleKey) => () => say(`Abre las oportunidades de ${m === 'servicios' ? 'Servicios' : m === 'auto' ? 'Auto' : 'Market'}`);
  const counts = { servicios: 3, auto: 2, market: 5 };

  if (id === 'op3')
    return (
      <>
        <HomeHeader title="Hola, Dario" sub="Prestador en Chambito" bell={2} onBell={() => say('Notificaciones')} onChat={() => say('Mensajes')} />
        <ProviderCard stats={[{ value: '12', label: 'oportunidades', icon: 'inbox' }, { value: '3', label: 'activas', icon: 'clock' }, { value: '97%', label: 'valoración', icon: 'star' }]} available={on} onAvailable={setOn} availableText="Recibís oportunidades en Servicios, Auto y Market." />
        <SectionTitle title="Tus módulos" />
        <ModuleTiles items={[
          { key: 's', icon: 'limpieza', title: 'Servicios', text: 'Ofrecé tus servicios y recibí solicitudes.', onClick: opp('servicios') },
          { key: 'a', icon: 'car', title: 'Auto', text: 'Hacé viajes y generá ingresos.', onClick: opp('auto') },
          { key: 'm', icon: 'shoppingBag', title: 'Market', text: 'Vendé productos y gestioná pedidos.', onClick: opp('market') },
        ]} />
        <SectionTitle title="Oportunidades para vos" />
        <ModuleList items={[
          { key: 's', icon: 'limpieza', title: 'Servicios · 5 nuevas', text: 'Solicitudes cerca de tu zona.', onClick: opp('servicios') },
          { key: 'a', icon: 'car', title: 'Auto · 3 nuevas', text: 'Viajes disponibles ahora.', onClick: opp('auto') },
          { key: 'm', icon: 'shoppingBag', title: 'Market · 4 nuevas', text: 'Pedidos y consultas de clientes.', onClick: opp('market') },
        ]} />
      </>
    );

  if (id === 'mix') {
    const list = {
      servicios: [{ key: '1', icon: 'limpieza', title: 'Limpieza · Villa Morra', text: 'Hoy 15:00 · 3 h · Gs. 180.000' }, { key: '2', icon: 'limpieza', title: 'Limpieza profunda · Recoleta', text: 'Mañana 9:00 · 5 h · Gs. 300.000' }, { key: '3', icon: 'wrench', title: 'Ver las 3 solicitudes', text: 'Ordenadas por cercanía' }],
      auto: [{ key: '1', icon: 'car', title: 'Modo conductor', text: 'Zona de alta demanda a 1,2 km' }, { key: '2', icon: 'wallet', title: 'Ganado hoy', text: 'Gs. 145.000 en 6 viajes' }],
      market: [{ key: '1', icon: 'message', title: '2 consultas sin responder', text: 'Bicicleta Trek rodado 29' }, { key: '2', icon: 'tag', title: 'Mis publicaciones', text: '3 activas · 1 en revisión' }, { key: '3', icon: 'plus', title: 'Publicar un producto', text: 'Publicar es gratis' }],
    }[mod].map((x) => ({ ...x, onClick: () => say(`Abre: ${x.title}`) }));
    return (
      <>
        <HomeHeader title="Hola, Dario" sub="Tenés 3 pedidos para revisar" bell={2} onBell={() => say('Notificaciones')} onChat={() => say('Mensajes')} />
        <ModuleSwitcher value={mod} onChange={setMod} counts={counts} />
        <ProviderCard stats={[{ value: '12', label: 'oportunidades' }, { value: '3', label: 'activas' }, { value: '4,9', label: 'valoración' }]} available={on} onAvailable={setOn} availableText="Te ven los clientes cerca tuyo." />
        <SectionTitle title={mod === 'servicios' ? 'Solicitudes cerca tuyo' : mod === 'auto' ? 'Tus viajes' : 'Tu tienda'} action="Ver todo" onAction={() => say('Abre la lista completa')} />
        <ModuleList items={list} />
      </>
    );
  }

  // op1 / op2: featured provider card, switcher and opportunities per module
  return (
    <>
      <HomeHeader title="Inicio" bell={2} onBell={() => say('Notificaciones')} onChat={() => say('Mensajes')} />
      <ModuleSwitcher value={mod} onChange={setMod} variant={id === 'op2' ? 'tiles' : 'pill'} />
      <ProviderCard person={PERSON} stats={[{ value: '0', label: 'ofertas' }, { value: 'Hace 2 días', label: 'última oferta' }]} available={on} onAvailable={setOn} availableText="Buscando clientes cerca tuyo. Dejá la app abierta para seguir visible." />
      <SectionTitle title="Oportunidades por módulo" caps={id === 'op2'} />
      {id === 'op1' ? (
        <ModuleTiles items={[
          { key: 's', icon: 'limpieza', title: 'Servicios', text: 'Nuevas solicitudes cerca de ti', highlight: true, onClick: opp('servicios') },
          { key: 'a', icon: 'car', title: 'Auto', text: 'Conductores solicitados', onClick: opp('auto') },
          { key: 'm', icon: 'shoppingBag', title: 'Market', text: 'Pedidos y entregas', onClick: opp('market') },
        ]} />
      ) : (
        <ModuleList items={[
          { key: 's', icon: 'limpieza', title: 'Servicios', count: 3, text: 'solicitudes cerca tuyo', onClick: opp('servicios') },
          { key: 'a', icon: 'car', title: 'Auto', count: 2, text: 'viajes disponibles', onClick: opp('auto') },
          { key: 'm', icon: 'shoppingBag', title: 'Market', count: 5, text: 'pedidos / ventas pendientes', onClick: opp('market') },
        ]} />
      )}
    </>
  );
}

/* ---------------- Client ---------------- */
function Cliente({ id, say }: { id: ProposalId; say: (m: string) => void }) {
  const [mod, setMod] = useState<ModuleKey>('servicios');
  const header = <HomeHeader title={id === 'op3' || id === 'mix' ? 'Hola, Ana' : 'Inicio'} sub={id === 'op3' || id === 'mix' ? '¿Qué necesitás hoy?' : undefined} bell={1} onBell={() => say('Notificaciones')} onChat={() => say('Mensajes')} />;
  const recent = (
    <>
      <SectionTitle title="Tu actividad reciente" />
      <ModuleList items={[
        { key: 'v', icon: 'car', title: 'Viaje completado', text: 'Ayer · Gs. 26.000', onClick: () => say('Abre el recibo del viaje') },
        { key: 'p', icon: 'shoppingBag', title: 'Pedido entregado', text: 'Mar, 21 ene · Gs. 85.000', onClick: () => say('Abre el pedido') },
      ]} />
    </>
  );

  if (id === 'op2')
    return (
      <>
        {header}
        <ModuleSwitcher value={mod} onChange={setMod} variant="tiles" />
        <ModuleHero green tag="Servicios" title="Solicitá un servicio" text="Encontrá profesionales cerca tuyo." cta="Buscar servicio" icon="limpieza" onClick={() => say('Abre la búsqueda de servicios')} />
        <ModuleHero tag="Auto" title="¿A dónde vas?" text="Solicitá un viaje y llegá fácil y seguro." cta="Ingresar destino" icon="car" onClick={() => say('Abre Auto (A2)')} />
        <ModuleHero tag="Market" title="Explorá el Market" text="Productos y ofertas de tu zona." cta="Ver categorías" icon="shoppingBag" onClick={() => say('Abre la Tienda (M01)')} />
      </>
    );

  if (id === 'op3')
    return (
      <>
        {header}
        <LocationPicker value="Asunción, Paraguay" onClick={() => say('Cambia la ubicación')} />
        <SearchBar placeholder="Buscar servicios, viajes o productos…" onClick={() => say('Búsqueda en los tres módulos')} />
        <ModuleTiles items={[
          { key: 's', icon: 'limpieza', title: 'Pedir un servicio', text: 'Hogar, reparaciones, limpieza y más.', onClick: () => say('Abre Servicios') },
          { key: 'a', icon: 'car', title: 'Pedir un viaje', text: 'Movete de forma segura y rápida.', onClick: () => say('Abre Auto (A2)') },
          { key: 'm', icon: 'shoppingBag', title: 'Comprar productos', text: 'Encontrá lo que necesitás cerca.', onClick: () => say('Abre la Tienda (M01)') },
        ]} />
        <SectionTitle title="Acciones rápidas" />
        <QuickChips items={[{ icon: 'heart', label: 'Favoritos', onClick: () => say('Guardados') }, { icon: 'tag', label: 'Promos', onClick: () => say('Promociones') }, { icon: 'clock', label: 'Historial', onClick: () => say('Historial') }]} />
        {recent}
      </>
    );

  if (id === 'mix') {
    const body: Record<ModuleKey, ReactNode> = {
      servicios: (
        <>
          <SearchBar placeholder="¿Qué servicio necesitás?" onClick={() => say('Busca un oficio')} />
          <SectionTitle title="Servicios populares" action="Ver todos" onAction={() => say('Todos los oficios')} />
          <ServiceGrid items={POPULAR} onPick={(l) => say(`Pide ${l.toLowerCase()} (flujo actual)`)} />
        </>
      ),
      auto: (
        <>
          <SearchBar placeholder="¿A dónde vas?" onClick={() => say('Abre Auto con el destino (A2)')} />
          <ModuleList items={[
            { key: 'c', icon: 'home', title: 'Casa', text: 'Av. España 1240', onClick: () => say('Viaje a Casa') },
            { key: 't', icon: 'flag', title: 'Trabajo', text: 'Paseo La Galería', onClick: () => say('Viaje al Trabajo') },
          ]} />
        </>
      ),
      market: (
        <>
          <SearchBar placeholder="Buscá en la Tienda" onClick={() => say('Abre la búsqueda (M03)')} />
          <ModuleList items={[
            { key: 'v', icon: 'plus', title: 'Sé de los primeros en vender', text: 'Publicar es gratis', onClick: () => say('Abre Vender') },
            { key: 'c', icon: 'tag', title: 'Ver categorías', text: 'Bicis, hogar, electrónica…', onClick: () => say('Abre la Tienda (M01)') },
          ]} />
        </>
      ),
    };
    return (
      <>
        {header}
        <ModuleSwitcher value={mod} onChange={setMod} />
        {body[mod]}
        {recent}
      </>
    );
  }

  // op1
  return (
    <>
      {header}
      <ModuleSwitcher value={mod} onChange={setMod} />
      <SearchBar placeholder="¿Qué servicio necesitás?" onClick={() => say('Busca un oficio')} />
      <PromoBanner title="Solicitá servicios para tu hogar" text="Encontrá profesionales confiables cerca tuyo." icon="home" onClick={() => say('Abre Servicios')} />
      <SectionTitle title="Servicios populares" action="Ver todos" onAction={() => say('Todos los oficios')} />
      <ServiceGrid items={POPULAR} onPick={(l) => say(`Pide ${l.toLowerCase()} (flujo actual)`)} />
      <ModuleList items={[
        { key: 'a', icon: 'car', title: 'Auto', text: 'Solicitá un viaje de forma rápida', onClick: () => say('Abre Auto (A0)') },
        { key: 'm', icon: 'shoppingBag', title: 'Market', text: 'Comprá productos de comercios cercanos', onClick: () => say('Abre la Tienda (M01)') },
      ]} />
    </>
  );
}

/* ---------------- Notes per proposal ---------------- */
export const PROPOSALS: { id: ProposalId; label: string; title: string; idea: string; good: string[]; watch: string[] }[] = [
  {
    id: 'estable', label: 'Recomendada · navegación estable', title: 'Navegación estable (modelo de superapp)',
    idea: 'Cuatro pestañas fijas: Inicio · Explorar (cliente) o Trabajo (prestador) · Actividad · Perfil. Servicios, Auto y Market no son pestañas: en Inicio son tres accesos, y en Explorar, Trabajo y Actividad son filtros «Todo · Servicios · Auto · Market». Es el patrón que describe el texto de referencia sobre Uber (Home · Services · Activity · Account). Tocá la barra: cada teléfono navega sus 4 pantallas.',
    good: [
      'Agregar Equipos, Comercios o Envíos no cambia la barra: se suman como filtro y como acceso.',
      'Una búsqueda para todo: «plomero» da Servicios, «Costanera» da Auto, «ventilador» da Market.',
      'Una sola Actividad con todo (solicitudes, viajes, compras, ventas, pagos) y filtros para ver un módulo.',
      'Prestador: disponibilidad por módulo («Disponible en 2 de 3 módulos») en lugar de un interruptor que prende todo.',
      'Perfil único: muestra solo lo que aplica y ofrece «Activar módulo» para lo demás.',
    ],
    watch: ['El viaje en curso y la oferta entrante tienen que verse encima de cualquier pestaña.', 'Explorar y Trabajo recuerdan el último filtro elegido.', 'Inicio carga solo resúmenes: el mapa se carga al entrar a Auto.'],
  },
  {
    id: 'mix', label: 'Selector en Inicio', title: 'Selector de módulos en Inicio',
    idea: 'El selector de módulos de la Opción 1 arriba de todo y cambiando el contenido de Inicio, con el saludo y la actividad reciente de la Opción 3. La barra queda con 4 pestañas; la segunda cambia según la cuenta.',
    good: ['Los tres módulos se ven sin scrollear: el selector está debajo del saludo.', 'El contenido de abajo es del módulo elegido: poco para leer, nada repetido.', 'El prestador ve primero su disponibilidad y sus pedidos; el contador de cada módulo dice dónde hay trabajo.', 'Barra estable: Inicio · Trabajo/Explorar · Actividad · Perfil.'],
    watch: ['El viaje en curso tiene que mostrarse arriba del selector, en cualquier módulo.', 'Recordar el último módulo elegido al volver a Inicio.'],
  },
  {
    id: 'op1', label: 'Opción 1', title: 'Opción 1 · Selector en píldora + pestaña Módulos',
    idea: 'Selector Servicios · Auto · Market debajo del título. Barra fija de 4: Inicio · Módulos · Actividad · Perfil.',
    good: ['El selector en píldora ocupa poco alto (44 px).', 'Cliente: búsqueda y oficios populares a la vista.'],
    watch: ['«Módulos» en la barra repite lo que ya hace el selector de arriba.', 'El cliente ve Auto y Market dos veces (selector y filas de abajo).'],
  },
  {
    id: 'op2', label: 'Opción 2', title: 'Opción 2 · Selector en tarjetas + banners por módulo',
    idea: 'Selector con ícono sobre el texto y, en el cliente, una tarjeta grande por módulo con su botón. Barra: Inicio · Comercios · Actividad · Perfil.',
    good: ['Muy claro para el que entra por primera vez: un botón por cosa que puede hacer.', 'Prestador: las filas con número (3 solicitudes, 2 viajes, 5 pedidos) se leen rápido.'],
    watch: ['Tres banners grandes empujan todo lo demás hacia abajo: hay que scrollear.', 'El selector y los banners hacen lo mismo.'],
  },
  {
    id: 'op3', label: 'Opción 3', title: 'Opción 3 · Hub por tipo de usuario',
    idea: 'Inicio distinto por cuenta. Cliente: ubicación, búsqueda en todo, 3 acciones, acciones rápidas y actividad reciente. Prestador: números, disponibilidad, módulos y oportunidades. Barra: Inicio · Trabajo (prestador) / Explorar (cliente) · Actividad · Perfil.',
    good: ['Una sola búsqueda para servicios, viajes y productos.', 'La 2.ª pestaña dice para qué entra cada uno: Trabajo o Explorar.'],
    watch: ['El prestador ve los módulos dos veces («Tus módulos» y «Oportunidades»).', 'Sin selector, pasar de un módulo a otro es más lento.'],
  },
];

/** Prestador and Cliente side by side for one proposal, in one theme. */
export function ProposalPhones({ id, theme, bar = 'docked' }: { id: ProposalId; theme: Theme; bar?: BarStyle }) {
  const [msg, setMsg] = useState<Record<Side, string | null>>({ prestador: null, cliente: null });
  const phone = (side: Side) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      {id === 'estable' ? (
        <StablePhone side={side} bar={bar} say={(m) => setMsg((s) => ({ ...s, [side]: m }))} />
      ) : (
        <HomeFrame label={`${side === 'cliente' ? 'Cliente' : 'Prestador'}, ${id}`} bar={<Bar id={id} side={side} />}>
          {side === 'cliente' ? <Cliente id={id} say={(m) => setMsg((s) => ({ ...s, cliente: m }))} /> : <Prestador id={id} say={(m) => setMsg((s) => ({ ...s, prestador: m }))} />}
        </HomeFrame>
      )}
      <span style={{ font: P(14), color: '#000000', background: '#4BAC4F', borderRadius: 14, padding: '4px 16px', letterSpacing: 1 }}>{side.toUpperCase()}</span>
      <span aria-live="polite" style={{ minHeight: 18, font: R(12), color: 'var(--fg2)', maxWidth: 340, textAlign: 'center' }}>{msg[side] ?? 'Tocá cualquier elemento para ver qué abre.'}</span>
    </div>
  );
  return (
    <ThemeScope.Provider value={theme}>
      {phone('prestador')}
      {phone('cliente')}
    </ThemeScope.Provider>
  );
}

export function ProposalsSection() {
  const [id, setId] = useState<ProposalId>('estable');
  const [th, setTh] = useState<'dark' | 'light'>('light'); // the «Cliente y Prestador» mockup is light
  const [bar, setBar] = useState<BarStyle>('docked');
  const p = PROPOSALS.find((x) => x.id === id)!;
  const chip = (on: boolean): CSSProperties => ({ height: 36, borderRadius: 18, padding: '0 14px', font: R(14, 500), background: on ? '#4BAC4F' : 'var(--panel)', color: on ? '#000000' : 'var(--fg)', outline: on ? 'none' : '1px solid var(--line2)' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <div role="radiogroup" aria-label="Propuesta" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PROPOSALS.map((x) => <button key={x.id} role="radio" aria-checked={x.id === id} className="press" onClick={() => setId(x.id)} style={chip(x.id === id)}>{x.label}</button>)}
        </div>
        <span style={{ flex: 1 }} />
        {id === 'estable' && (
          <div role="radiogroup" aria-label="Barra" style={{ display: 'flex', gap: 8 }}>
            {(['docked', 'pill'] as const).map((v) => <button key={v} role="radio" aria-checked={bar === v} className="press" onClick={() => setBar(v)} style={chip(bar === v)} title={v === 'docked' ? 'Como el mockup: fija al borde de abajo' : 'Como TOKENS.json: isla flotante de 72, radio 16'}>{v === 'docked' ? 'Barra fija' : 'Barra flotante'}</button>)}
          </div>
        )}
        <div role="radiogroup" aria-label="Tema de los teléfonos" style={{ display: 'flex', gap: 8 }}>
          {(['dark', 'light'] as const).map((v) => <button key={v} role="radio" aria-checked={th === v} className="press" onClick={() => setTh(v)} style={chip(th === v)}>{v === 'dark' ? 'Oscuro' : 'Claro'}</button>)}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
        <ProposalPhones key={`${id}-${th}-${bar}`} id={id} bar={bar} theme={th === 'dark' ? dark : light} />
        <aside style={{ flex: '1 1 260px', maxWidth: 380, background: 'var(--panel)', borderRadius: 24, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, outline: id === 'estable' ? '2px solid #4BAC4F' : '1px solid var(--line2)' }}>
          <span style={{ font: P(17), color: 'var(--fg)' }}>{p.title}</span>
          <span style={{ font: R(14), color: 'var(--fg2)', ...pretty }}>{p.idea}</span>
          <span style={{ font: R(12, 500), color: '#4BAC4F' }}>A favor</span>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>{p.good.map((g) => <li key={g} style={{ font: R(13), color: 'var(--fg2)', ...pretty }}>{g}</li>)}</ul>
          <span style={{ font: R(12, 500), color: '#FF6B6B' }}>{id === 'estable' ? 'A cuidar' : 'En contra'}</span>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>{p.watch.map((g) => <li key={g} style={{ font: R(13), color: 'var(--fg2)', ...pretty }}>{g}</li>)}</ul>
        </aside>
      </div>
    </div>
  );
}
