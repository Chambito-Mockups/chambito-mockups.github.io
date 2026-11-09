/** El teléfono de la app integrada: guarda el estado, arma el modelo y muestra la pantalla abierta con lo que va encima. */
import { ComponentType, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { buildModel, IntegradaProps, St, VMContext } from './model';
import { Bars, ExplorerSheet, HomeIndicator, OfferSheet, PhoneStatusBar, SosSheet, Toast } from './chrome';
import { Actividad, Explorar, Inicio, Notificaciones, Perfil, Servicio, ServicioConfirmar, ServicioEnviado, ServicioProfesional } from './screens/base';
import {
  Carrito, CompraHecha, ConfirmarCompra, Consulta, Devolucion, Ficha, Guardados, MisPublicaciones, Orden, Publicado, Publicar1, Publicar2, Publicar3, Tienda, TiendaBuscar, Vender,
} from './screens/market';
import { AutoCalificar, AutoConfirmar, AutoDestino, AutoInicio, AutoPunto, Viaje } from './screens/auto';
import { ConductorBuscar, ConductorCobro, ConductorInicio, ConductorPin, ConductorViaje, SocioInicio, Trabajo } from './screens/socio';
import './integrada.css';

export type IgScreen =
  | 'inicio' | 'explorar' | 'actividad' | 'perfil' | 'notifs' | 'svc' | 'svcPros' | 'svcConfirm' | 'svcOk'
  | 'tienda' | 'mBuscar' | 'ficha' | 'chat' | 'guardados' | 'misPubs' | 'vender' | 'pub1' | 'pub2' | 'pub3' | 'pubOk' | 'carrito' | 'confirmar' | 'compraOk' | 'orden' | 'devolucion'
  | 'auto' | 'aDestino' | 'aPunto' | 'aConfirmar' | 'viaje' | 'aCalificar'
  | 'sInicio' | 'trabajo' | 'dHome' | 'dBuscar' | 'dPin' | 'dViaje' | 'dCobro';

export const IG_SCREENS: Record<IgScreen, ComponentType> = {
  inicio: Inicio, explorar: Explorar, actividad: Actividad, perfil: Perfil, notifs: Notificaciones,
  svc: Servicio, svcPros: ServicioProfesional, svcConfirm: ServicioConfirmar, svcOk: ServicioEnviado,
  tienda: Tienda, mBuscar: TiendaBuscar, ficha: Ficha, chat: Consulta, guardados: Guardados, misPubs: MisPublicaciones, vender: Vender,
  pub1: Publicar1, pub2: Publicar2, pub3: Publicar3, pubOk: Publicado, carrito: Carrito, confirmar: ConfirmarCompra, compraOk: CompraHecha, orden: Orden, devolucion: Devolucion,
  auto: AutoInicio, aDestino: AutoDestino, aPunto: AutoPunto, aConfirmar: AutoConfirmar, viaje: Viaje, aCalificar: AutoCalificar,
  sInicio: SocioInicio, trabajo: Trabajo, dHome: ConductorInicio, dBuscar: ConductorBuscar, dPin: ConductorPin, dViaje: ConductorViaje, dCobro: ConductorCobro,
};

/** Pantallas del socio (prestador y conductor): al abrirlas desde el índice, la cuenta pasa a socio. */
export const SOCIO_SCREENS: IgScreen[] = ['sInicio', 'trabajo', 'dHome', 'dBuscar', 'dPin', 'dViaje', 'dCobro'];

/** hojas que el menú puede abrir encima de una pantalla */
export type IgSheet = 'explorer' | 'sos';
/** lo que el visor necesita saber para marcar la pantalla en el menú */
export interface IgPlace { screen: IgScreen; sheet: IgSheet | null }

/** sección de cada portada (para que «Inicio» reabra la última usada en el modo selector) */
const SECTION_OF: Partial<Record<IgScreen, string>> = { inicio: 'servicios', auto: 'auto', tienda: 'market' };

export interface IntegradaHandle {
  /** abre una pantalla desde el menú del visor (sin historial, con la cuenta que le corresponde); `sheet` abre además una hoja */
  jump: (id: IgScreen, sheet?: IgSheet) => void;
  /** vuelve al estado inicial */
  reset: () => void;
}

/** Estado de la app: un objeto que se mezcla como el setState del diseño, y temporizadores que se limpian al desmontar. */
function useIntegrada(props: IntegradaProps, onPlace?: (p: IgPlace) => void) {
  const [st, setSt] = useState<St>({});
  const latest = useRef<St>(st);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const S = useCallback((o: St) => {
    latest.current = { ...latest.current, ...o };
    setSt(latest.current);
  }, []);
  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    latest.current = {};
    setSt({});
  }, []);
  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => { timers.current.delete(id); fn(); }, ms);
    timers.current.add(id);
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  // «Empezar en» cambia la pantalla y la cuenta de arranque: se empieza de nuevo
  useEffect(() => { reset(); }, [props.pantallaInicial, reset]);
  const vm = useMemo(() => buildModel(props, { st, cs: () => latest.current, S, later, reset }), [props, st, S, later, reset]);
  const screen = vm.screen as IgScreen;
  const sheet = (st.sheet ?? null) as IgSheet | null;
  useEffect(() => { onPlace?.({ screen, sheet }); }, [screen, sheet, onPlace]);
  return { vm, S, reset };
}

export const IntegradaPhone = forwardRef<IntegradaHandle, IntegradaProps & { onPlace?: (p: IgPlace) => void }>(function IntegradaPhone({ onPlace, ...props }, ref) {
  const stable = useMemo(() => props, [props.navegacion, props.faseMarket, props.pantallaInicial, props.dark, props.categorias]); // eslint-disable-line react-hooks/exhaustive-deps
  const { vm, S, reset } = useIntegrada(stable, onPlace);
  useImperativeHandle(ref, () => ({
    jump: (id, sheet) => S({ screen: id, hist: [], sheet: sheet ?? null, role: SOCIO_SCREENS.includes(id) ? 'socio' : 'cliente', ...(SECTION_OF[id] ? { section: SECTION_OF[id] } : {}) }),
    reset,
  }), [S, reset]);
  const Current = IG_SCREENS[vm.screen as IgScreen] ?? Inicio;
  const { t } = vm;
  return (
    <VMContext.Provider value={vm}>
      <div
        className="ig"
        data-theme={vm.dark ? 'dark' : 'light'}
        style={{ position: 'relative', width: 390, height: 844, overflow: 'hidden', background: t.bg, color: t.text, fontFamily: 'Roboto, Arial, sans-serif', fontSize: 15, lineHeight: '22px' }}
      >
        <Current />
        <Bars />
        <ExplorerSheet />
        <SosSheet />
        <OfferSheet />
        <Toast />
        <PhoneStatusBar />
        <HomeIndicator />
      </div>
    </VMContext.Provider>
  );
});
