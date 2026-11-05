/**
 * «Navegación estable», following the «Cliente y Prestador» mockup:
 * Inicio · Explorar (cliente) / Trabajo (prestador) · Actividad · Perfil.
 * Modules live inside the screens (tiles in Inicio, filters in Explorar/Trabajo/Actividad) and open
 * their own screens (Chambito Auto, Market, Disponibilidad) with a back arrow, so a new module never
 * adds a tab. Each phone is navigable: the bar changes the screen.
 */
import { useState } from 'react';
import { BottomNavBar, MenuGroup, MenuItem, NavKey } from './ui/kit';
import { HomeFrame, ModuleList, SearchBar, SectionTitle, ServiceGrid } from './ui/home';
import { ActivateModuleCard, ActivityItem, ActivityTimeline, Availability, FeedCard, FeedItem, Filter, KIND_MODULE, ModuleFilter, PageTitle, UnifiedSearch } from './ui/hub';
import { AvailabilityList, BackHeader, BrandHeader, CategoryRow, EntryTiles, InfoBanner, InlineBanner, OnlineCard, PlaceShortcuts, ProductCard, PromoCarousel, Rail, RouteMap, StatRow } from './ui/modules';
import { LISTINGS } from './market/data';
import { Photo, useMoney } from './market/kit';
import { P, R } from './theme';
import { useApp } from './store';

export type Side = 'prestador' | 'cliente';
export type BarStyle = 'pill' | 'docked';
type Say = (m: string) => void;
type Sub = null | 'auto' | 'market' | 'disponibilidad';
const byFilter = <T extends { kind: keyof typeof KIND_MODULE }>(list: T[], f: Filter) => (f === 'todo' ? list : list.filter((x) => KIND_MODULE[x.kind] === f));

/* ---------------- Data ---------------- */
const CLIENT_ACTIVITY: ActivityItem[] = [
  { id: 'c1', kind: 'servicios', title: 'Limpieza del hogar', meta: 'En curso · 10:00', when: 'Hoy' },
  { id: 'c2', kind: 'market', title: 'Pedido del Market', meta: 'En camino · llega 15:00', when: 'Hoy' },
  { id: 'c3', kind: 'auto', title: 'Viaje al centro', meta: 'Completado · Gs. 27.000', when: 'Hoy' },
  { id: 'c4', kind: 'servicios', title: 'Plomería', meta: 'Completado · Gs. 120.000', when: 'Ayer' },
  { id: 'c5', kind: 'pago', title: 'Reembolso acreditado', meta: 'Gs. 12.000 · tarjeta', when: 'Ayer' },
];
const PROVIDER_ACTIVITY: ActivityItem[] = [
  { id: 'p1', kind: 'auto', title: 'Viaje completado', meta: 'Gs. 27.000 · 12:40', when: 'Hoy' },
  { id: 'p2', kind: 'servicios', title: 'Limpieza completada', meta: 'Gs. 85.000 · 10:00', when: 'Hoy' },
  { id: 'p3', kind: 'entrega', title: 'Pedido entregado', meta: 'Gs. 18.000 · 09:20', when: 'Hoy' },
  { id: 'p4', kind: 'auto', title: 'Viaje cancelado', meta: 'Por el pasajero · 18:10', when: 'Ayer' },
  { id: 'p5', kind: 'pago', title: 'Pago recibido', meta: 'Gs. 410.000 a tu cuenta', when: 'Ayer' },
  { id: 'p6', kind: 'calificacion', title: 'Nueva calificación', meta: '★ 5 · «Muy prolijo»', when: 'Ayer' },
];
const FEED: FeedItem[] = [
  { id: 'f1', kind: 'servicios', status: 'NUEVO', title: 'Limpieza del hogar', meta: 'A 1,2 km', price: 'Gs. 85.000', ago: 'Hace 2 min' },
  { id: 'f2', kind: 'auto', status: 'DISPONIBLE', title: 'Viaje al centro', meta: 'A 700 m', price: 'Est. Gs. 24.000', ago: 'Hace 5 min' },
  { id: 'f3', kind: 'entrega', status: 'NUEVO', title: 'Entrega de pedido', meta: 'A 2 km', price: 'Gs. 18.000', ago: 'Hace 8 min' },
  { id: 'f4', kind: 'servicios', status: 'NUEVO', title: 'Limpieza profunda', meta: 'A 3,4 km · mañana 9:00', price: 'Gs. 300.000', ago: 'Hace 15 min' },
  { id: 'f5', kind: 'venta', status: 'NUEVO', title: 'Consulta por tu bicicleta', meta: 'Trek rodado 29', price: 'Gs. 1.450.000', ago: 'Hace 20 min' },
  { id: 'f6', kind: 'auto', status: 'DISPONIBLE', title: 'Viaje al aeropuerto', meta: 'A 1,5 km', price: 'Est. Gs. 70.000', ago: 'Hace 22 min' },
];
const PRODUCTS = ['trek', 'nike', 'silla', 'iphone', 'campera'].map((id) => LISTINGS.find((l) => l.id === id)!).filter(Boolean);

function useSaved() {
  const [saved, setSaved] = useState<Set<string>>(new Set(['nike']));
  return { saved, toggle: (id: string) => setSaved((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; }) };
}

/* ---------------- Cliente ---------------- */
function ClienteInicio({ say, explore, open, toActivity }: { say: Say; explore: (f: Filter) => void; open: (s: Sub) => void; toActivity: () => void }) {
  return (
    <>
      <BrandHeader bell={1} onBell={() => say('Notificaciones')} />
      <h2 style={{ margin: 0, font: P(24) }}>¿Qué necesitás hoy?</h2>
      <UnifiedSearch placeholder="Buscar servicios, viajes o productos" onPick={(h) => (h.kind === 'auto' ? open('auto') : h.kind === 'market' ? open('market') : say(`Abre ${h.title}`))} />
      <EntryTiles items={[
        { key: 'servicios', title: 'Servicios', text: 'Profesionales verificados', onClick: () => explore('servicios') },
        { key: 'auto', title: 'Auto', text: 'Movete de forma segura', onClick: () => open('auto') },
        { key: 'market', title: 'Market', text: 'Comprá y vendé cerca tuyo', tag: 'Nuevo', onClick: () => open('market') },
      ]} />
      <SectionTitle title="Actividad reciente" action="Ver todo" onAction={toActivity} />
      <ModuleList items={[
        { key: 'l', icon: 'home', title: 'Limpieza del hogar', text: 'Mañana, 10:00', onClick: () => say('Abre la solicitud') },
        { key: 'v', icon: 'car', title: 'Viaje al centro', text: 'Ayer, completo', onClick: () => say('Abre el recibo del viaje') },
        { key: 'p', icon: 'cart', title: 'Pedido en camino', text: 'Llega hoy, 15:00', onClick: () => say('Abre el seguimiento del pedido') },
      ]} />
    </>
  );
}

function Products({ say, width }: { say: Say; width?: number }) {
  const money = useMoney();
  const { saved, toggle } = useSaved();
  return (
    <>
      {PRODUCTS.map((l) => (
        <ProductCard key={l.id} width={width} title={l.title} price={money(l.price)} saved={saved.has(l.id)} onSave={() => toggle(l.id)} onOpen={() => say(`Abre ${l.title} (M06)`)}
          photo={<Photo ph={l.ph} cat={l.category} radius={14} iconSize={22} />} />
      ))}
    </>
  );
}

function ClienteExplorar({ say, filter, setFilter, open }: { say: Say; filter: Filter; setFilter: (f: Filter) => void; open: (s: Sub) => void }) {
  const rubros: [string, string][] = [['limpieza', 'Limpieza'], ['wrench', 'Plomería'], ['bolt', 'Electricidad'], ['ninera', 'Cuidado'], ['roller', 'Pintura'], ['users', 'Equipos']];
  const show = (m: Filter) => filter === 'todo' || filter === m;
  return (
    <>
      <PageTitle>Explorar</PageTitle>
      <ModuleFilter value={filter} onChange={setFilter} />
      {show('servicios') && (
        <>
          <SectionTitle title={filter === 'todo' ? 'Servicios cerca tuyo' : 'Rubros'} action={filter === 'todo' ? 'Ver todos' : undefined} onAction={() => setFilter('servicios')} />
          <ServiceGrid columns={filter === 'todo' ? 4 : 3} items={filter === 'todo' ? [...rubros.slice(0, 3), ['more', 'Más']] : rubros} onPick={(l) => (l === 'Más' ? setFilter('servicios') : say(`Pide ${l.toLowerCase()} (flujo actual)`))} />
        </>
      )}
      {show('auto') && (
        <>
          <InlineBanner icon="car" eyebrow="Movete con" title="Chambito Auto" text="Viajes rápidos y seguros" onClick={() => open('auto')} />
          {filter === 'auto' && (
            <ModuleList items={[
              { key: 'c', icon: 'home', title: 'Casa', text: 'Av. España 1240', onClick: () => open('auto') },
              { key: 't', icon: 'briefcase', title: 'Trabajo', text: 'Paseo La Galería', onClick: () => open('auto') },
              { key: 'r', icon: 'history', title: 'Costanera de Asunción', text: 'Destino reciente', onClick: () => open('auto') },
            ]} />
          )}
        </>
      )}
      {show('market') && (
        <>
          <SectionTitle title="Ofertas del Market" action="Ver todos" onAction={() => open('market')} />
          {filter === 'market' && <CategoryRow items={[['phone', 'Tecnología'], ['home', 'Hogar'], ['tag', 'Moda'], ['more', 'Más']]} onPick={(c) => say(`Abre la categoría ${c}`)} />}
          <Rail label="Ofertas del Market"><Products say={say} width={104} /></Rail>
        </>
      )}
    </>
  );
}

function AutoHome({ say, back }: { say: Say; back: () => void }) {
  const { t } = useApp();
  return (
    <>
      <div style={{ position: 'relative' }}>
        <BackHeader floating title="Chambito Auto" onBack={back} />
        <RouteMap height={330} />
      </div>
      <div style={{ marginTop: -20, borderRadius: '24px 24px 0 0', padding: '20px 16px 8px', display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', background: t.bg }}>
        <h3 style={{ margin: 0, font: P(20) }}>¿A dónde vas?</h3>
        <SearchBar placeholder="Ingresá tu destino" onClick={() => say('Abre el destino (A2)')} />
        <PlaceShortcuts items={[
          { icon: 'home', label: 'Casa', onClick: () => say('Pide un viaje a Casa') },
          { icon: 'briefcase', label: 'Trabajo', onClick: () => say('Pide un viaje al Trabajo') },
          { icon: 'star', label: 'Favoritos', onClick: () => say('Abre tus lugares favoritos') },
        ]} />
      </div>
    </>
  );
}

function MarketHome({ say, back }: { say: Say; back: () => void }) {
  return (
    <>
      <BackHeader title="Market" onBack={back} />
      <SearchBar placeholder="Buscar productos, marcas o tiendas" onClick={() => say('Abre la búsqueda de la Tienda (M03)')} />
      <CategoryRow items={[['phone', 'Tecnología'], ['home', 'Hogar'], ['tag', 'Moda'], ['more', 'Más']]} onPick={(c) => say(`Abre la categoría ${c}`)} />
      <PromoCarousel
        slides={[
          { eyebrow: 'Ofertas de lanzamiento', title: 'Hasta 30% OFF', icon: 'volumeOn' },
          { eyebrow: 'Disponible en tu zona', title: 'Comprá cerca tuyo', icon: 'mapPin' },
          { eyebrow: 'Vendé gratis', title: 'Publicá en 2 minutos', icon: 'plus' },
        ]}
        onOpen={(s) => say(`Abre: ${s.title}`)}
      />
      <SectionTitle title="Destacados" action="Ver todos" onAction={() => say('Abre la Tienda (M01)')} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 10 }}><Products say={say} /></div>
    </>
  );
}

/* ---------------- Prestador ---------------- */
function PrestadorInicio({ say, work, avail, setAvail, open }: { say: Say; work: (f: Filter) => void; avail: Availability; setAvail: (a: Availability) => void; open: (s: Sub) => void }) {
  const { t } = useApp();
  return (
    <>
      <BrandHeader bell={2} onBell={() => say('Notificaciones')} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <h2 style={{ margin: 0, font: P(24) }}>Hola, Dario 👋</h2>
        <span style={{ font: R(14), color: t.text2 }}>Gestioná tu trabajo y oportunidades.</span>
      </div>
      <OnlineCard value={avail} onChange={setAvail} onManage={() => open('disponibilidad')} />
      <StatRow stats={[{ value: '3', label: 'Oportunidades' }, { value: '1', label: 'Actividad hoy' }, { value: '4,8', label: 'Calificación', icon: 'star' }]} />
      <SectionTitle title="Tus módulos" />
      <ModuleList items={[
        { key: 's', icon: 'wrench', title: 'Servicios', text: avail.servicios ? '3 solicitudes nuevas' : 'Pausado · no recibís solicitudes', onClick: () => work('servicios') },
        { key: 'a', icon: 'car', title: 'Auto', text: avail.auto ? 'Disponible para viajes' : 'Desconectado · no recibís viajes', onClick: () => work('auto') },
        { key: 'm', icon: 'cart', title: 'Market', text: avail.market ? '4 pedidos nuevos' : 'Pausado · no recibís pedidos', onClick: () => work('market') },
      ]} />
    </>
  );
}

function PrestadorTrabajo({ say, filter, setFilter, avail, open }: { say: Say; filter: Filter; setFilter: (f: Filter) => void; avail: Availability; open: (s: Sub) => void }) {
  const list = byFilter(FEED, filter);
  const off = filter !== 'todo' && !avail[filter];
  return (
    <>
      <PageTitle>Trabajo</PageTitle>
      <ModuleFilter value={filter} onChange={setFilter} counts={{ servicios: byFilter(FEED, 'servicios').length, auto: byFilter(FEED, 'auto').length, market: byFilter(FEED, 'market').length }} />
      {off && <ActivateModuleCard icon="info" title="No estás disponible en este módulo" text="Ves las oportunidades, pero no te llegan nuevas." cta="Cambiar" onClick={() => open('disponibilidad')} />}
      {list.map((f) => <FeedCard key={f.id} item={f} onClick={() => say(`Abre: ${f.title}`)} />)}
    </>
  );
}

function Disponibilidad({ back, avail, setAvail }: { back: () => void; avail: Availability; setAvail: (a: Availability) => void }) {
  return (
    <>
      <BackHeader title="Disponibilidad" onBack={back} />
      <InfoBanner icon="bolt">Gestioná en qué módulos querés trabajar.</InfoBanner>
      <AvailabilityList value={avail} onChange={setAvail} />
    </>
  );
}

/* ---------------- Shared: Actividad and Perfil ---------------- */
function Actividad({ side, say, filter, setFilter }: { side: Side; say: Say; filter: Filter; setFilter: (f: Filter) => void }) {
  return (
    <>
      <PageTitle>Actividad</PageTitle>
      <ModuleFilter value={filter} onChange={setFilter} label="Filtrar la actividad" />
      <ActivityTimeline items={byFilter(side === 'cliente' ? CLIENT_ACTIVITY : PROVIDER_ACTIVITY, filter)} onOpen={(a) => say(`Abre: ${a.title}`)} />
    </>
  );
}

function Perfil({ side, say, open }: { side: Side; say: Say; open: (s: Sub) => void }) {
  const s = (m: string) => () => say(m);
  return (
    <>
      <PageTitle>Perfil</PageTitle>
      <MenuGroup title="Mi cuenta">
        <MenuItem icon="user" label="Datos personales" onClick={s('Datos personales')} />
        <MenuItem icon="shield" label="Identidad" hint="Verificada" onClick={s('Identidad')} />
        <MenuItem icon="creditCard" label="Métodos de pago" onClick={s('Métodos de pago')} />
        <MenuItem icon="mapPin" label="Direcciones" last onClick={s('Direcciones')} />
      </MenuGroup>
      {side === 'prestador' ? (
        <MenuGroup title="Mis actividades">
          <MenuItem icon="bolt" label="Disponibilidad" hint="Elegí en qué módulos trabajás" accent onClick={() => open('disponibilidad')} />
          <MenuItem icon="wrench" label="Profesiones y rubros" hint="Limpieza" onClick={s('Rubros')} />
          <MenuItem icon="car" label="Datos del vehículo" hint="Toyota Vitz · ABCD 123" onClick={s('Vehículo (D2)')} />
          <MenuItem icon="tag" label="Productos publicados" hint="3 activos" last onClick={s('Mis publicaciones (V21)')} />
        </MenuGroup>
      ) : (
        <MenuGroup title="Mis actividades">
          <MenuItem icon="tag" label="Productos publicados" hint="1 activo" last onClick={s('Mis publicaciones (V21)')} />
        </MenuGroup>
      )}
      {/* only what does not apply yet, as an offer to activate it */}
      {side === 'cliente' ? (
        <>
          <ActivateModuleCard icon="car" title="Chambito Auto" text="Conducí y recibí oportunidades de viaje." onClick={s('Abre «Sumate como conductor» (D0)')} />
          <ActivateModuleCard icon="wrench" title="Ofrecé tu oficio" text="Recibí solicitudes de clientes cerca tuyo." onClick={s('Abre el alta de prestador')} />
        </>
      ) : (
        <ActivateModuleCard icon="cart" title="Mi comercio" tag="Nuevo" text="Vendé con tu comercio en el Market." onClick={s('Abre el alta de comercio')} />
      )}
      <MenuGroup title="Configuración">
        <MenuItem icon="bell" label="Notificaciones" onClick={s('Notificaciones')} />
        <MenuItem icon="lock" label="Privacidad" onClick={s('Privacidad')} />
        <MenuItem icon="messageCircle" label="Ayuda" last onClick={s('Ayuda')} />
      </MenuGroup>
    </>
  );
}

/* ---------------- Phone ---------------- */
export function StablePhone({ side, say, bar = 'docked' }: { side: Side; say: Say; bar?: BarStyle }) {
  const second: NavKey = side === 'cliente' ? 'explorar' : 'trabajo';
  const items: NavKey[] = ['inicio', second, 'actividad', 'perfil'];
  const [tab, setTabState] = useState<NavKey>('inicio');
  const [sub, setSub] = useState<Sub>(null); // module screen opened over the tab, with a back arrow
  const [filter, setFilter] = useState<Filter>('todo'); // Explorar / Trabajo
  const [actFilter, setActFilter] = useState<Filter>('todo');
  const [avail, setAvail] = useState<Availability>({ servicios: true, auto: false, market: true });
  const setTab = (k: NavKey) => { setSub(null); setTabState(k); };
  const toSecond = (f: Filter) => { setFilter(f); setTab(second); };
  const back = () => setSub(null);

  const screen =
    sub === 'auto' ? <AutoHome say={say} back={back} />
    : sub === 'market' ? <MarketHome say={say} back={back} />
    : sub === 'disponibilidad' ? <Disponibilidad back={back} avail={avail} setAvail={setAvail} />
    : tab === 'inicio' ? (side === 'cliente'
      ? <ClienteInicio say={say} explore={toSecond} open={setSub} toActivity={() => setTab('actividad')} />
      : <PrestadorInicio say={say} work={toSecond} avail={avail} setAvail={setAvail} open={setSub} />)
    : tab === second ? (side === 'cliente'
      ? <ClienteExplorar say={say} filter={filter} setFilter={setFilter} open={setSub} />
      : <PrestadorTrabajo say={say} filter={filter} setFilter={setFilter} avail={avail} open={setSub} />)
    : tab === 'actividad' ? <Actividad side={side} say={say} filter={actFilter} setFilter={setActFilter} />
    : <Perfil side={side} say={say} open={setSub} />;

  return (
    <HomeFrame
      key={`${tab}-${sub}` /* a new screen starts at the top */}
      label={`${side === 'cliente' ? 'Cliente' : 'Prestador'}, estable`}
      docked={bar === 'docked'}
      bleed={sub === 'auto'}
      bar={<BottomNavBar variant={bar} items={items} active={tab} onSelect={setTab} badges={tab === 'actividad' ? undefined : { actividad: side === 'prestador' ? 3 : 1 }} />}
    >
      {screen}
    </HomeFrame>
  );
}
