/** El teléfono de Auto v3: estado, temporizadores (viaje, espera, oferta, aviso) y la pantalla abierta con lo que va encima. */
import { ComponentType, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { VMContext } from '../integrada/model';
import { Bars, ExplorerSheet, HomeIndicator, PhoneStatusBar, SosSheet, Toast } from '../integrada/chrome';
import { buildV3, INITIAL, TRIP_STEPS, V3Props, V3Screen, V3State } from './model';
import { A0, A11, A2, A3, A4, A5, A5b, A6, A7, A8, A9, DetallesSheet, X1 } from './pasajero';
import { D0, D1, D2, D3, D5, D6, D7, D8, D9, OfferSheetV3 } from './conductor';
import '../integrada/integrada.css';

export const V3_SCREENS: Record<V3Screen, ComponentType> = { X1, A0, A2, A3, A4, A5, A5b, A6, A7, A8, A9, A11, D0, D1, D2, D3, D5, D6, D7, D8, D9 };

export interface AutoV3Handle {
  /** abre una pantalla con los estados que pide el menú (sin historial) */
  jump: (screen: V3Screen, setup?: Partial<V3State>) => void;
  reset: () => void;
}

export const AutoV3Phone = forwardRef<AutoV3Handle, V3Props & { onPlace?: (s: V3State) => void }>(function AutoV3Phone({ onPlace, ...props }, ref) {
  const [st, setSt] = useState<V3State>(INITIAL);
  const latest = useRef(st);
  const set = useCallback((o: Partial<V3State>) => { latest.current = { ...latest.current, ...o }; setSt(latest.current); }, []);
  const get = useCallback(() => latest.current, []);
  useImperativeHandle(ref, () => ({
    jump: (screen, setup = {}) => { latest.current = { ...INITIAL, ...setup, screen }; setSt(latest.current); },
    reset: () => { latest.current = INITIAL; setSt(INITIAL); },
  }), []);
  const p = useMemo(() => ({ country: props.country, dark: props.dark, sim: props.sim }), [props.country, props.dark, props.sim]);
  const vm = useMemo(() => buildV3(p, { st, set, get }), [p, st, set, get]);
  useEffect(() => { onPlace?.(st); }, [st.screen, st.sheet, st.tripActive, st.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // el viaje avanza solo: buscando → en camino → llegó → en curso → terminado (A5b si no hay conductores)
  useEffect(() => {
    if (!p.sim || st.sheet) return;
    const step = TRIP_STEPS.find(([from]) => from === st.screen);
    if (!step) return;
    const next: V3Screen = st.screen === 'A5' && st.noDrivers ? 'A5b' : step[1];
    const id = setTimeout(() => set({ screen: next, hist: [], sheet: null, ...(next === 'A7' ? { wait: 161 } : {}), ...(next === 'A9' ? { tripActive: false } : {}) }), step[2]);
    return () => clearTimeout(id);
  }, [p.sim, st.screen, st.sheet, st.noDrivers, set]);
  // la espera sin cargo cuenta para atrás
  useEffect(() => {
    if (st.screen !== 'A7' || st.wait <= 0) return;
    const id = setTimeout(() => set({ wait: latest.current.wait - 1 }), 1000);
    return () => clearTimeout(id);
  }, [st.screen, st.wait, set]);
  // conectado y sin nada abierto: a los 4 s llega una oferta, que vence en 12 s
  useEffect(() => {
    if (!p.sim || st.screen !== 'D3' || !st.online || st.sheet) return;
    const id = setTimeout(() => set({ sheet: 'offer', offerSecs: 12 }), 4000);
    return () => clearTimeout(id);
  }, [p.sim, st.screen, st.online, st.sheet, set]);
  useEffect(() => {
    if (st.sheet !== 'offer') return;
    if (st.offerSecs <= 0) { set({ sheet: null, offerSecs: 12, toast: 'Se venció el pedido. Seguís disponible' }); return; }
    const id = setTimeout(() => set({ offerSecs: latest.current.offerSecs - 1 }), 1000);
    return () => clearTimeout(id);
  }, [st.sheet, st.offerSecs, set]);
  // avisos de 4 s
  useEffect(() => {
    if (!st.toast) return;
    const id = setTimeout(() => set({ toast: null }), 4000);
    return () => clearTimeout(id);
  }, [st.toast, set]);

  const Current = V3_SCREENS[st.screen];
  const { t } = vm;
  return (
    <VMContext.Provider value={vm}>
      <div className="ig" data-theme={p.dark ? 'dark' : 'light'} style={{ position: 'relative', width: 390, height: 844, overflow: 'hidden', background: t.bg, color: t.text, fontFamily: 'Roboto, Arial, sans-serif', fontSize: 15, lineHeight: '22px' }}>
        <Current />
        <Bars />
        <ExplorerSheet />
        <SosSheet />
        <DetallesSheet />
        <OfferSheetV3 />
        <Toast />
        <PhoneStatusBar />
        <HomeIndicator />
      </div>
    </VMContext.Provider>
  );
});
