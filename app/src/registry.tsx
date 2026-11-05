import { ComponentType } from 'react';
import { Overlay, Role, ScreenId, Settings, TripPhase } from './store';
import { A0, A0b, A2, A3, A4, A5, A5b, A6, A7, A8, A9 } from './screens/passenger';
import { E1, E2, E3, E4 } from './screens/special';
import { D0, D1, D2, D3, D5, D6, D7, D8, D9 } from './screens/driver';
import { StubScreen } from './screens/common';
import { M01, M03, M04, M05, M06, M09, M10, M11 } from './market/buyer';
import { V14, V15, V16, V17, V18, V19, V21, V22 } from './market/seller';
import { Actividad, EA4, Inicio, Perfil } from './market/entry';
import { MyStatus } from './market/data';
import { useApp } from './store';
import { ExplorerActivity, InicioExplorer } from './ui/explorer';

/** Inicio and Actividad follow the navigation chosen in the side menu (tabs or the «Prototipo Auto» explorer). */
const InicioScreen = () => (useApp().settings.navModel === 'explorer' ? <InicioExplorer /> : <Inicio />);
const ActividadScreen = () => (useApp().settings.navModel === 'explorer' ? <ExplorerActivity /> : <Actividad />);

export const SCREENS: Record<ScreenId, ComponentType> = {
  A0, A0b, A2, A3, A4, A5, A5b, A6, A7, A8, A9, A11: ActividadScreen,
  M01, M03, M04, M05, M06, M09, M10, M11, EA4,
  V14, V15, V16, V17, V18, V19, V21, V22,
  inicio: InicioScreen,
  perfil: Perfil,
  E1, E2, E3, E4,
  D0, D1, D2, D3, D5, D6, D7, D8, D9,
  equipos: () => <StubScreen tab="equipos" title="Equipos" text="Con acceso a obras o comercios, «Comercios» y «Equipos» se unen en «Equipos», que adentro deja elegir entre Obras y Comercios (reusa (tabs)/work.tsx)." />,
  comercios: () => <StubScreen tab="comercios" title="Comercios" text="Sin Auto habilitado, la barra queda como hoy, con Comercios y Equipos por separado." />,
};

export interface Entry {
  key: string; // unique key in the index (A8b and A10 are overlays on A8, D4 on D3)
  code: string;
  title: string;
  screen: ScreenId;
  overlay?: Overlay;
  role: Role;
  phase?: TripPhase;
  flags?: Partial<Settings>;
  uses: string;
  changes: string;
  /** Market state to prepare when jumping from the index */
  mk?: { listing?: string; activity?: 'Servicios' | 'Tienda'; myTab?: MyStatus; draft?: boolean; welcomed?: boolean; review?: boolean };
  /** versions that show this entry (default: the group's, or every version) */
  versions?: string[];
}

export type Module = 'auto' | 'market';

export interface Group {
  title: string;
  module: Module;
  /** icon from public/ic, used in the sidebar */
  icon?: string;
  subtitle?: string;
  entries: Entry[];
  page?: 'integration';
  note?: string;
  /** versions that show this group (default: every version, the flow is the same) */
  versions?: string[];
}

const P: Role = 'pasajero';
export const GROUPS: Group[] = [
  {
    title: 'Cliente · pedir un viaje',
    module: 'auto',
    icon: 'user',
    entries: [
      { key: 'A0', code: 'A0', title: 'Portada de Auto', screen: 'A0', role: P, uses: 'HubMapLayer, HubTopChrome y HubLocationFab de Inicio, Sheet, SearchField, Chip (Mis lugares), ListItem y BottomNav.', changes: 'Pestaña nueva. La hoja arranca baja con el campo grande «¿A dónde vas?». Al tocarlo pasa al paso 1 de 3.' },
      { key: 'A0b', code: 'A0b', title: 'Portada con viaje activo', screen: 'A0b', role: P, phase: 'assigned', uses: 'LiveRequestCard, la misma que hoy en Inicio para un pedido activo.', changes: 'En lugar de la portada aparece la tarjeta del viaje con la patente. Al tocarla abre el seguimiento.' },
      { key: 'A2', code: 'A2', title: '¿A dónde vas? · paso 1 de 3', screen: 'A2', role: P, uses: 'Sheet, Progress, SearchField, Chip (Mis lugares), ListItem.', changes: 'Nuevo: campos origen y destino unidos por una línea. El mapa muestra el MapPin del origen.' },
      { key: 'A3', code: 'A3', title: 'Punto de encuentro · paso 2 de 3', screen: 'A3', role: P, uses: 'El paso 1 actual: pin fijo al centro, MapControl de GPS y StickyActionBar.', changes: 'La tarjeta flotante muestra la dirección en vez del título. Se suma la referencia opcional. Arrastrá el mapa para mover el punto.' },
      { key: 'A4', code: 'A4', title: 'Confirmá tu viaje · paso 3 de 3', screen: 'A4', role: P, uses: 'HubQuoteSheetStep, QuoteLevelCards, Banner, selector de pago y StickyActionBar con el total.', changes: '«Tu pedido» pasa a «Tu viaje», los niveles pasan a Económico y Confort, y el botón dice «Pedir viaje». El mapa muestra la ruta en verde.' },
      { key: 'A5', code: 'A5', title: 'Buscando conductor', screen: 'A5', role: P, phase: 'searching', uses: 'HubSearchingSheetStep tal cual, con LiveRequestCard.', changes: '«Profesional» pasa a «conductor» y la tarjeta resume categoría, destino y precio.' },
      { key: 'A5b', code: 'A5b', title: 'Ampliar el radio', screen: 'A5b', role: P, phase: 'searching', uses: 'features/radius-expansion, sin cambios de forma.', changes: 'Solo los textos de conductor.' },
      { key: 'A6', code: 'A6', title: 'Seguimiento · conductor en camino', screen: 'A6', role: P, phase: 'assigned', uses: 'RequestTrackingScreen: controles flotantes, insignia de trayecto, hoja mínima con Avatar y «Ver detalle», CodeInput de solo lectura para el PIN.', changes: 'Nuevo: tarjeta de vehículo con la patente como dato principal, y «Compartir viaje».' },
      { key: 'A7', code: 'A7', title: 'Tu conductor llegó', screen: 'A7', role: P, phase: 'arrived', uses: 'StatusCard destacada y el tratamiento actual del PIN.', changes: 'Estado nuevo «Conductor llegó». La insignia cuenta la espera sin cargo, y se suma la llamada enmascarada.' },
      { key: 'A8', code: 'A8', title: 'Viaje en curso', screen: 'A8', role: P, phase: 'ontrip', uses: 'La misma hoja mínima del seguimiento con «Servicio en curso» y Progress.', changes: 'Nuevo: MapPin de destino, ruta hasta el destino y botón SOS flotante sobre la hoja.' },
      { key: 'A8b', code: 'A8b', title: 'SOS · Dialog de confirmación', screen: 'A8', overlay: 'sos', role: P, phase: 'ontrip', uses: 'Dialog actual.', changes: 'Acción destructiva en rojo de error, no en verde. Aviso a Soporte con la ubicación y la patente.' },
      { key: 'A9', code: 'A9', title: 'Viaje terminado · calificación', screen: 'A9', role: P, phase: 'ontrip', uses: 'El cierre actual con Rating y motivos (Chip) y el recibo con el mismo formato.', changes: 'Nuevo: chips de propina con montos por país. Con 1 o 2 estrellas, los motivos pasan a ser obligatorios.' },
      { key: 'A10', code: 'A10', title: 'Detalles del pedido · modal', screen: 'A8', overlay: 'details', role: P, phase: 'ontrip', uses: 'El modal actual «Detalles del pedido» con StatTile, FactList y StatusTimeline.', changes: 'La dirección pasa a recorrido y se suma la tarifa desglosada (banderazo, km, minutos, demanda).' },
      { key: 'A11', code: 'A11', title: 'Actividad', screen: 'A11', role: P, phase: 'assigned', mk: { activity: 'Servicios' }, uses: '(tabs)/activity con ActiveRequestCard y RequestHistoryCard, mezclado con los demás servicios.', changes: 'Ícono de auto y título «Origen → Destino».' },
    ],
  },
  {
    title: 'Estados especiales',
    module: 'auto',
    icon: 'alert',
    entries: [
      { key: 'E1', code: 'E1', title: 'Invitado · precio con sesión', screen: 'E1', role: P, flags: { guest: true }, uses: 'La hoja de inicio de sesión actual (acá va como referencia hasta tener la captura).', changes: 'El invitado arma el recorrido y ve la ruta, pero no el precio. Al volver, sigue en el paso 3 de 3.' },
      { key: 'E2', code: 'E2', title: 'Ubicación desactivada', screen: 'E2', role: P, flags: { locationOff: true }, uses: 'EmptyState dentro de la Sheet.', changes: 'El acceso alternativo es escribir el origen a mano.' },
      { key: 'E3', code: 'E3', title: 'Sin conexión', screen: 'E3', role: P, flags: { offline: true }, uses: 'Banner arriba y EmptyState en la hoja.', changes: 'Mensaje de viaje activo para tranquilizar al pasajero.' },
      { key: 'E4', code: 'E4', title: 'Ya tenés un servicio en curso', screen: 'E4', role: P, flags: { otherService: true }, uses: 'ActiveRequestCard y el texto de la regla actual de un servicio a la vez.', changes: 'La portada se bloquea y lleva al servicio activo.' },
    ],
  },
  {
    title: 'Conductor · manejar y cobrar',
    module: 'auto',
    icon: 'car',
    entries: [
      { key: 'D0', code: 'D0', title: 'Sumate como conductor', screen: 'D0', role: 'prestador', uses: 'HeroPanel y ListItem. «Empezar» abre add-profession con el rubro Conductor.', changes: 'La pestaña también recluta conductores. La cifra de ganancia es un ejemplo a definir.' },
      { key: 'D1', code: 'D1', title: 'Agregar profesión · requisitos', screen: 'D1', role: 'prestador', uses: 'add-profession y professional-license: lista de requisitos con UploadSlot, igual que la matrícula.', changes: '5 requisitos de vehículo. El botón se habilita cuando están todos (tocá los espacios para simular la carga).' },
      { key: 'D2', code: 'D2', title: 'Revisión y vencimientos', screen: 'D2', role: 'conductor', uses: 'Badge con los estados actuales y Banner de advertencia.', changes: 'Nuevo: aviso de documento por vencer, con fecha y acción.' },
      { key: 'D3', code: 'D3', title: 'Modo conductor', screen: 'D3', role: 'conductor', uses: 'El bloque «Tu estado» con el interruptor, StatStrip y el mapa del hub.', changes: 'El modo conductor vive en la pestaña Auto, con la capa de zonas con demanda. Con «Disponible» prendido entra una oferta a los pocos segundos.' },
      { key: 'D4', code: 'D4', title: 'IncomingOfferSheet · viaje', screen: 'D3', overlay: 'offer', role: 'conductor', uses: 'IncomingOfferHost → IncomingOfferSheet, encima de cualquier pantalla.', changes: 'Variante de viaje con origen y destino por barrio y la duración. La dirección exacta se muestra al aceptar.' },
      { key: 'D5', code: 'D5', title: 'Ir a buscar · navegación', screen: 'D5', role: 'conductor', uses: 'navigate/[assignmentId] con la navegación por voz de hoy.', changes: 'Primer tramo, hasta el pasajero, con su nombre, la referencia, chat, llamada y «Llegué».' },
      { key: 'D6', code: 'D6', title: 'Inicio del viaje · PIN', screen: 'D6', role: 'conductor', uses: 'CodeInput de 4 dígitos tal cual. Al completarlo, valida el PIN y el GPS.', changes: 'Solo el texto, con el nombre del pasajero.' },
      { key: 'D7', code: 'D7', title: 'En viaje · finalizar', screen: 'D7', role: 'conductor', uses: 'Navegación por voz y SlideToConfirm, como en las acciones críticas de hoy.', changes: 'Segundo tramo, hasta el destino, con estado «pasajero a bordo» y el SOS.' },
      { key: 'D8', code: 'D8', title: 'Cierre · cobro', screen: 'D8', role: 'conductor', uses: 'El cierre actual del prestador con FactList y Rating.', changes: 'El título dice cuánto cobrar en efectivo y la acción devuelve al estado disponible.' },
      { key: 'D9', code: 'D9', title: 'Billetera', screen: 'D9', role: 'conductor', uses: 'La billetera actual con HeroPanel, Progress de la deuda y TransactionItem.', changes: 'Los viajes entran como movimientos, con ícono de auto y el medio de cobro.' },
    ],
  },
  {
    title: 'Entrada a la Tienda',
    module: 'market',
    icon: 'home',
    entries: [
      { key: 'EB1', versions: ['v1'], code: 'EB1', title: 'Inicio con tarjeta Market', screen: 'inicio', role: P, flags: { tiendaEntry: 'card' }, uses: 'El Inicio actual (mapa + «¿Qué necesitás?») con la MarketEntryCard.', changes: 'Combinación 2, recomendada al lanzar: la Tienda entra por la tarjeta y se abre apilada; Auto conserva su pestaña.' },
      { key: 'EB2', versions: ['v1'], code: 'EB2', title: 'Inicio · tarjeta sin productos', screen: 'inicio', role: P, flags: { tiendaEntry: 'card', almostEmpty: true }, uses: 'MarketEntryCard sin miniaturas.', changes: 'Si no hay publicaciones cerca: «Sé de los primeros en vender en tu zona».' },
      { key: 'IA3', versions: ['v2'], code: 'IA3', title: 'Tienda con pestaña (combinación 1)', screen: 'M01', role: P, flags: { tiendaEntry: 'tab' }, uses: 'TabBar de 5: Inicio · Auto · Tienda · Actividad · Perfil.', changes: 'Combinación 1: Auto y Tienda con pestaña propia; Equipos pasa a una fila de Perfil.' },
      { key: 'EB3', code: 'EB3', title: 'Perfil con filas nuevas', screen: 'perfil', role: P, uses: 'ProfileMenuCard y ListItem.', changes: '«Mis publicaciones» y «Vender en la Tienda». Con la combinación 1 y Equipos, Equipos aparece acá con la etiqueta «Antes en la barra».' },
      { key: 'EA3', code: 'EA3', title: 'Actividad · Servicios | Tienda', screen: 'A11', role: P, mk: { activity: 'Tienda' }, uses: '(tabs)/activity con SegmentedControl.', changes: '«Mis consultas» con la etiqueta Tienda y el lugar de «Mis pedidos» (Fase 2).' },
      { key: 'EA4', code: 'EA4', title: 'Notificaciones', screen: 'EA4', role: P, uses: 'ListItem de notificaciones.', changes: 'Las 4 del brief, también como push. Tocar abre la pantalla correspondiente.' },
    ],
  },
  {
    title: 'Comprador',
    module: 'market',
    icon: 'search',
    entries: [
      { key: 'M01', code: 'M01', title: 'Inicio de la Tienda', screen: 'M01', role: P, uses: 'SearchBar, CategoryRail, ListingCard (fila y grilla) y FloatingActionButton.', changes: 'Sin carrito en Fase 1. «Vender» flotante, siempre visible. Una sección sin productos no se muestra; al entrar, esqueletos (S1).' },
      { key: 'M02', code: 'M02', title: 'Inicio · Tienda casi vacía', screen: 'M01', role: P, flags: { almostEmpty: true }, uses: 'EmptyState que invita + ListingCard.', changes: 'Menos de 6 publicaciones a 25 km: invita a publicar y amplía a 50 km. «Recién publicados» se oculta.' },
      { key: 'M03', code: 'M03', title: 'Buscar', screen: 'M03', role: P, uses: 'SearchField con sugerencias y recientes.', changes: 'Sugerencia → Resultados; ✕ borra una búsqueda reciente; categoría → Resultados filtrados.' },
      { key: 'M04', code: 'M04', title: 'Resultados', screen: 'M04', role: P, uses: 'Tabs Productos | Servicios, FilterChip y ListingCard.', changes: 'Filtro con contador → Filtros; ✕ en un chip lo quita; «Servicios» muestra prestadores. Sin resultados → S2.' },
      { key: 'M05', code: 'M05', title: 'Filtros', screen: 'M05', role: P, uses: 'FilterChip e Input.', changes: 'Categoría, nuevo/usado, precio, distancia y orden. El botón cuenta los resultados en vivo. Sin envío ni stock.' },
      { key: 'M06', code: 'M06', title: 'Detalle del producto', screen: 'M06', role: P, mk: { listing: 'trek' }, uses: 'PhotoLightbox, SellerRow, VerifiedBadge.', changes: '«Consultar» abre el chat; ♥ guarda; ⋯ → Denunciar. Tocá los costados de la foto para pasarlas. Aviso fijo sobre el pago.' },
      { key: 'M06b', code: 'M06b', title: 'Detalle · venta cruzada', screen: 'M06', role: P, mk: { listing: 'heladera' }, uses: 'Card con borde punteado.', changes: 'Solo Hogar y Tecnología: «Pedí un técnico». Marcado Fase 2.' },
      { key: 'M07', code: 'M07', title: 'Detalle · vendido', screen: 'M06', role: P, mk: { listing: 'iphone' }, uses: 'El detalle con la franja «Vendido».', changes: 'Sin «Consultar» ni ♥; «Ver parecidos» → Resultados de la misma categoría.' },
      { key: 'M08', code: 'M08', title: 'Detalle · ya no disponible', screen: 'M06', role: P, mk: { listing: 'gone' }, uses: 'EmptyState.', changes: 'La publicación se borró o volvió a revisión.' },
      { key: 'S3', code: 'S3', title: 'Detalle · error', screen: 'M06', role: P, mk: { listing: 'broken' }, uses: 'FlowStatusView.', changes: '«Reintentar» vuelve a cargar sin salir de la pantalla.' },
      { key: 'M09', code: 'M09', title: 'Perfil del vendedor', screen: 'M09', role: P, uses: 'ProviderPublicHeader adaptado, StatTile, ListingCard.', changes: 'Nunca teléfono, email ni dirección. ⋯ → Denunciar usuario. Al entrar, esqueleto (S4).' },
      { key: 'M10', code: 'M10', title: 'Chat de consulta', screen: 'M10', role: P, uses: 'El chat actual con la tarjeta del producto fija arriba.', changes: 'Respuestas rápidas; el vendedor contesta solo (demo). Mis burbujas en verde suave, no lleno (mejora).' },
      { key: 'M11', code: 'M11', title: 'Guardados', screen: 'M11', role: P, uses: 'ListItem con foto de 88.', changes: 'Vendido atenuado; bajó de precio con el anterior tachado; ♥ la quita con «Deshacer». Vacío → S5; cargando → S6.' },
      { key: 'M12', code: 'M12', title: 'Denunciar', screen: 'M06', overlay: 'report', role: P, mk: { listing: 'trek' }, uses: 'BottomSheet + radios.', changes: 'Motivos + detalle opcional → «Gracias, lo vamos a revisar». Anónima.' },
      { key: 'M13', code: 'M13', title: 'Invitado · ingresar', screen: 'M06', overlay: 'guest', role: P, flags: { guest: true }, mk: { listing: 'trek' }, uses: 'BottomSheet de ingreso.', changes: 'Mirar no pide cuenta. Al consultar, guardar, publicar o denunciar pide ingresar y después vuelve a esa acción.' },
    ],
  },
  {
    title: 'Vendedor',
    module: 'market',
    icon: 'tag',
    entries: [
      { key: 'V14', code: 'V14', title: 'Vender · bienvenida', screen: 'V14', role: P, mk: { welcomed: false }, uses: 'EmptyState con 3 puntos.', changes: 'Primera vez que toca «Vender». Toques hasta publicar: ~10, entre 60 y 80 segundos.' },
      { key: 'V15a', code: 'V15a', title: 'Verificá tu identidad', screen: 'V15', role: P, flags: { sellerStatus: 'sin-verificar' }, uses: 'La verificación que ya existe (Didit).', changes: 'Sin identidad verificada no se publica.' },
      { key: 'V15b', code: 'V15b', title: 'Cuenta en revisión', screen: 'V15', role: P, flags: { sellerStatus: 'en-revision' }, uses: 'FlowStatusView.', changes: 'Puede preparar la publicación; queda como borrador hasta que se apruebe.' },
      { key: 'V15c', code: 'V15c', title: 'Cuenta suspendida', screen: 'V15', role: P, flags: { sellerStatus: 'suspendido' }, uses: 'FlowStatusView.', changes: 'Dice el motivo y que puede seguir comprando. Sin botón de publicar.' },
      { key: 'V16', code: 'V16', title: 'Publicar 1 · Fotos', screen: 'V16', role: P, mk: { draft: true }, uses: 'UploadSlot y SegmentedProgressBar.', changes: 'Tocá «Agregar» para simular la carga (subiendo → procesando → lista). La 4.ª foto sale «No permitida» para mostrar el estado.' },
      { key: 'V17', code: 'V17', title: 'Publicar 2 · Datos', screen: 'V17', role: P, mk: { draft: true }, uses: 'Input, Select, FilterChip.', changes: 'Los atributos cambian con la categoría. Zona precargada y aproximada. Sin stock.' },
      { key: 'V18', code: 'V18', title: 'Publicar 3 · Revisión', screen: 'V18', role: P, mk: { draft: true }, uses: 'Vista previa como la ve el comprador.', changes: '«Publicar» → Publicado o En revisión según el ajuste «Revisión manual».' },
      { key: 'V19a', code: 'V19a', title: 'Publicado', screen: 'V19', role: P, mk: { review: false }, uses: 'FlowStatusView.', changes: '«Ver publicación» o «Publicar otra».' },
      { key: 'V19b', code: 'V19b', title: 'En revisión', screen: 'V19', role: P, mk: { review: true }, uses: 'FlowStatusView.', changes: 'La revisión automática no alcanza y la revisa una persona.' },
      { key: 'V20', code: 'V20', title: 'Retomar borrador', screen: 'M01', overlay: 'draft', role: P, mk: { draft: true }, uses: 'BottomSheet.', changes: 'Al tocar «Vender» con un borrador: Seguir o Descartar (con confirmación). Cerrar Publicar guarda el borrador.' },
      { key: 'V21', code: 'V21', title: 'Mis publicaciones', screen: 'V21', role: P, mk: { myTab: 'Activas' }, uses: 'Tabs con contador y ListingStatusTag.', changes: 'Pausar, marcar vendida y editar en la fila; ⋯ suma compartir y eliminar. Sin conexión → S8.' },
      { key: 'V21b', code: 'V21b', title: 'Mis publicaciones · Rechazadas', screen: 'V21', role: P, mk: { myTab: 'Rechazadas' }, uses: 'Banner de error.', changes: 'Muestra el motivo y «Corregir», que abre Editar.' },
      { key: 'V22', code: 'V22', title: 'Editar publicación', screen: 'V22', role: P, mk: { draft: true }, uses: 'Publicar 2 y fotos en una sola pantalla.', changes: 'Si cambian título, precio o fotos, vuelve a revisión. Bajar el precio avisa a quienes la guardaron.' },
      { key: 'V23', code: 'V23', title: 'Límite alcanzado', screen: 'V21', overlay: 'limit', role: P, flags: { atLimit: true }, uses: 'BottomSheet.', changes: 'Al intentar publicar con 50 activas.' },
    ],
  },
  {
    title: 'Explorador · Prototipo Auto',
    module: 'auto',
    versions: ['v2'],
    icon: 'layers',
    subtitle: 'Otra opción: selector de sección y barra fija',
    note: 'Del «Prototipo Auto»: cada portada tiene el selector Servicios · Auto · Market arriba a la izquierda y la barra es siempre Inicio · Actividad · Perfil. La app vuelve a abrir en la última sección usada. Se puede dejar fija desde «Navegación» en el menú.',
    entries: [
      { key: 'X1', code: 'X1', title: 'Portada de Servicios', screen: 'inicio', role: P, flags: { navModel: 'explorer', lastSection: 'servicios' }, uses: 'Mapa del Inicio, SectionSelector «Servicios», Sheet con «¿Qué necesitás?», servicios populares (íconos oficiales) y la tarjeta «Nuevo: Chambito Auto».', changes: 'El buscador «Buscá tu lugar» pasa a la hoja; arriba queda el selector de sección. La barra pierde la pestaña Auto: Inicio · Actividad · Perfil.' },
      { key: 'X2s', code: 'X2', title: 'Explorador desde Servicios', screen: 'inicio', overlay: 'explorer', role: P, flags: { navModel: 'explorer', lastSection: 'servicios' }, uses: 'BottomSheet con el logo oficial, «Elegí qué querés hacer» y una fila por sección (la actual con «Estás acá» y el check).', changes: 'Pantalla nueva. La X o tocar afuera cierran sin cambiar de sección; elegir otra la recuerda para la próxima vez.' },
      { key: 'XA0', code: 'A0', title: 'Portada de Auto con selector', screen: 'A0', role: P, flags: { navModel: 'explorer', lastSection: 'auto' }, uses: 'La misma portada de Auto con SectionSelector «Auto» en lugar del buscador de arriba.', changes: 'El destino se busca en la hoja («¿A dónde vas?»). La barra marca Inicio: Auto ya no es una pestaña.' },
      { key: 'X2a', code: 'X2', title: 'Explorador desde Auto', screen: 'A0', overlay: 'explorer', role: P, flags: { navModel: 'explorer', lastSection: 'auto' }, uses: 'El mismo explorador con Auto marcada.', changes: '«Servicios» vuelve a la pantalla principal de la app.' },
      { key: 'MK', code: 'MK', title: 'Portada de Market con selector', screen: 'M01', role: P, flags: { navModel: 'explorer', lastSection: 'market' }, uses: 'La portada de la Tienda con SectionSelector «Market», búsqueda, categorías, Cerca tuyo, Recién publicados y Vender.', changes: 'No se apila sobre el Inicio: es una sección con la barra Inicio · Actividad · Perfil.' },
      { key: 'X2m', code: 'X2', title: 'Explorador desde Market', screen: 'M01', overlay: 'explorer', role: P, flags: { navModel: 'explorer', lastSection: 'market' }, uses: 'El explorador con Market marcada.', changes: 'Desde acá se pasa a Auto o a Servicios sin volver al Inicio.' },
      { key: 'XA11', code: 'A11', title: 'Actividad con todas las secciones', screen: 'A11', role: P, flags: { navModel: 'explorer' }, uses: 'TopBar, ModuleFilter Todo · Servicios · Auto · Market, viajes y servicios (en curso y anteriores) y Mis consultas del Market.', changes: 'El selector Servicios | Tienda pasa a ser un filtro por sección; todo el historial queda en un solo lugar.' },
    ],
  },
  {
    title: 'Explorador · Market',
    module: 'market',
    versions: ['v3'],
    icon: 'layers',
    subtitle: 'Market como sección, con selector',
    entries: [
      { key: 'MKm', code: 'MK', title: 'Portada de Market con selector', screen: 'M01', role: P, flags: { navModel: 'explorer', lastSection: 'market' }, uses: 'La portada de la Tienda con SectionSelector «Market», búsqueda, categorías, Cerca tuyo, Recién publicados y Vender.', changes: 'No se apila sobre el Inicio: es una sección con la barra Inicio · Actividad · Perfil. El recorrido completo está en el menú Auto («Explorar Chambito»).' },
    ],
  },
];

export const ALL_ENTRIES = GROUPS.flatMap((g) => g.entries);

/** Module each entry belongs to (an entry key is unique across groups). */
export const MODULE_OF: Record<string, Module> = Object.fromEntries(GROUPS.flatMap((g) => g.entries.map((e) => [e.key, g.module])));
export const entriesOf = (m: Module) => GROUPS.filter((g) => g.module === m).flatMap((g) => g.entries);

/* ================= Versions: each way to move through the app, seen on its own ================= */
export interface Version {
  id: string;
  label: string;
  hint: string;
  /** source of the design */
  source: string;
  /** settings this version uses */
  flags?: Partial<Settings>;
  /** reference page instead of screens */
  page?: 'integration';
  /** first screen when the version is chosen */
  first?: string;
  /** viewer colour of the version (outside the phone) */
  color: string;
  /** tabs of its bottom bar, shown in the version card */
  bar: string[];
  /** what is different, in one line */
  what: string;
  /** design references that go with it in «Componentes» */
  refs: 'tabs' | 'explorer' | 'estable';
}
export const VERSIONS: Record<Module, Version[]> = {
  auto: [
    { id: 'v1', label: 'Pestaña Auto', hint: 'Auto es un destino de la barra', source: 'Chambito Auto v3', flags: { navModel: 'tabs' }, first: 'A0', color: '#4BAC4F', bar: ['Inicio', 'Auto', 'Actividad', 'Perfil'], what: 'Auto tiene su propia pestaña en la barra.', refs: 'tabs' },
    { id: 'v2', label: 'Selector de sección', hint: 'Servicios · Auto · Market arriba; barra Inicio · Actividad · Perfil', source: 'Prototipo Auto', flags: { navModel: 'explorer' }, first: 'X1', color: '#E0A100', bar: ['Inicio', 'Actividad', 'Perfil'], what: 'Se cambia de sección con «Servicios ▾» arriba; la barra no cambia.', refs: 'explorer' },
    { id: 'v3', label: 'Navegación estable', hint: 'Inicio · Explorar/Trabajo · Actividad · Perfil', source: 'Propuestas de Inicio', page: 'integration', color: '#9B8AFB', bar: ['Inicio', 'Explorar', 'Actividad', 'Perfil'], what: 'Cliente y prestador, con Explorar o Trabajo. Abre la página de propuestas.', refs: 'estable' },
  ],
  market: [
    { id: 'v1', label: 'Tarjeta en Inicio', hint: 'La Tienda se abre desde una tarjeta (combinación 2)', source: 'Chambito Market', flags: { navModel: 'tabs', tiendaEntry: 'card' }, first: 'EB1', color: '#4BAC4F', bar: ['Inicio', 'Auto', 'Actividad', 'Perfil'], what: 'La Tienda entra por una tarjeta en Inicio y se apila con flecha atrás.', refs: 'tabs' },
    { id: 'v2', label: 'Pestaña Tienda', hint: 'Tienda como destino de la barra (combinación 1)', source: 'Chambito Market', flags: { navModel: 'tabs', tiendaEntry: 'tab' }, first: 'IA3', color: '#E0A100', bar: ['Inicio', 'Auto', 'Tienda', 'Actividad', 'Perfil'], what: 'La Tienda es una pestaña; Equipos pasa a Perfil si no entra.', refs: 'tabs' },
    { id: 'v3', label: 'Market como sección', hint: 'Selector «Market ▾» y barra Inicio · Actividad · Perfil', source: 'Prototipo Auto', flags: { navModel: 'explorer', lastSection: 'market' }, first: 'MKm', color: '#9B8AFB', bar: ['Inicio', 'Actividad', 'Perfil'], what: 'Market es una sección del selector, con su portada y la barra fija.', refs: 'explorer' },
  ],
};
/** Version of a module that matches the current settings (a reference page wins when it is open). */
export function versionOf(m: Module, settings: Settings, onIntegration = false): Version {
  const list = VERSIONS[m];
  if (onIntegration && m === 'auto') return list[2];
  if (m === 'auto') return settings.navModel === 'explorer' ? list[1] : list[0];
  return settings.navModel === 'explorer' ? list[2] : settings.tiendaEntry === 'tab' ? list[1] : list[0];
}
const inVersion = (v: string, own?: string[]) => !own || own.includes(v);
/** Groups of a module in a version (screens shared by every version are always there). */
export const groupsIn = (m: Module, v: string) => GROUPS.filter((g) => g.module === m && inVersion(v, g.versions));
/** Screens of a module in a version, in index order (previous / next walk this list). */
export const entriesIn = (m: Module, v: string) => groupsIn(m, v).flatMap((g) => g.entries.filter((e) => inVersion(v, e.versions)));

export const MODULES: Record<Module, { label: string; icon: string; tagline: string; first: string }> = {
  auto: { label: 'Auto', icon: 'car', tagline: 'Viajes: pasajero y conductor', first: 'A0' },
  market: { label: 'Market', icon: 'tag', tagline: 'Tienda: comprar y vender', first: 'M01' },
};

/** Guided flows for presentations: each step is an index entry, played in order. */
export interface Tour {
  id: string;
  module: Module;
  title: string;
  hint: string;
  steps: string[];
}

export const TOURS: Tour[] = [
  { id: 'explorar', module: 'auto', title: 'Explorar Chambito', hint: 'Servicios → Market → Auto con el selector', steps: ['X1', 'X2s', 'MK', 'X2m', 'XA0', 'X2a', 'X1'] },
  { id: 'viaje', module: 'auto', title: 'Pedir un viaje', hint: 'De «¿A dónde vas?» a la calificación', steps: ['A0', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A8b', 'A9', 'A11'] },
  { id: 'conductor', module: 'auto', title: 'Manejar con Chambito', hint: 'Alta, oferta, PIN y cobro', steps: ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9'] },
  { id: 'comprar', module: 'market', title: 'Comprar en la Tienda', hint: 'Buscar, ver, consultar y guardar', steps: ['EB1', 'M01', 'M03', 'M04', 'M05', 'M06', 'M10', 'M11'] },
  { id: 'vender', module: 'market', title: 'Vender en la Tienda', hint: 'De la bienvenida a Mis publicaciones', steps: ['V14', 'V15a', 'V16', 'V17', 'V18', 'V19a', 'V21'] },
];
