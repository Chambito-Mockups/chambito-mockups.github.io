/**
 * «App integrada» en el visor: una sola app con Servicios (base), Auto y Market, navegable de punta a punta.
 * A la izquierda los ajustes de la demo, al centro el teléfono y a la derecha el índice de las 38 pantallas.
 * Cada pantalla es un componente de src/integrada/screens; las piezas compartidas están en src/integrada/kit.tsx.
 */
import { useLayoutEffect, useRef, useState } from 'react';
import { usePersistent } from '../persist';
import { IgScreen, IntegradaHandle, IntegradaPhone } from './IntegradaPhone';
import { IntegradaProps } from './model';

const NAVS = ['Explorar (prototipo)', 'Combinación 1 · Auto y Tienda', 'Combinación 2 · Auto', 'Tienda en la barra'];
const FASES = ['Fase 1 · consulta por chat', 'Fase 2 · compra protegida'];
const INICIOS = ['Inicio (cliente)', 'Tienda', 'Auto', 'Socio · Inicio', 'Conductor'];

/** El índice: las 38 pantallas agrupadas por módulo. */
export const IG_INDEX: { title: string; items: [IgScreen, string][] }[] = [
  {
    title: 'Servicios · base',
    items: [
      ['inicio', 'Inicio'], ['explorar', 'Explorar'], ['actividad', 'Actividad'], ['perfil', 'Perfil'], ['notifs', 'Notificaciones'],
      ['svc', 'Pedir un servicio'], ['svcPros', 'Elegir profesional'], ['svcConfirm', 'Confirmar el pedido'], ['svcOk', 'Pedido enviado'],
    ],
  },
  {
    title: 'Market · comprar',
    items: [
      ['tienda', 'Tienda'], ['mBuscar', 'Buscar'], ['ficha', 'Ficha del producto'], ['chat', 'Consulta'], ['guardados', 'Guardados'],
      ['carrito', 'Carrito (fase 2)'], ['confirmar', 'Confirmar la compra'], ['compraOk', 'Compra hecha'], ['orden', 'Seguimiento de la compra'], ['devolucion', 'Reclamo'],
    ],
  },
  {
    title: 'Market · vender',
    items: [['misPubs', 'Mis publicaciones'], ['vender', 'Vender'], ['pub1', 'Publicar · fotos'], ['pub2', 'Publicar · datos'], ['pub3', 'Publicar · revisar'], ['pubOk', 'Publicado']],
  },
  {
    title: 'Auto · cliente',
    items: [['auto', 'Portada de Auto'], ['aDestino', '¿A dónde vas?'], ['aPunto', 'Punto de encuentro'], ['aConfirmar', 'Confirmá tu viaje'], ['viaje', 'Viaje'], ['aCalificar', 'Calificar']],
  },
  {
    title: 'Socio y conductor',
    items: [['sInicio', 'Inicio del socio'], ['trabajo', 'Trabajo'], ['dHome', 'Conductor'], ['dBuscar', 'Ir a buscar'], ['dPin', 'PIN del pasajero'], ['dViaje', 'Viaje en curso'], ['dCobro', 'Cobro']],
  },
];

/** Escala el teléfono (390 × 844 más el marco) para que entre en el alto de la ventana. */
function useFit() {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      setScale(Math.max(0.5, Math.min(1.1, (el.clientWidth - 30) / 412, (window.innerHeight - Math.min(top, 200) - 40) / 866)));
    };
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fit);
    ro?.observe(el);
    fit();
    window.addEventListener('resize', fit);
    return () => { ro?.disconnect(); window.removeEventListener('resize', fit); };
  }, []);
  return { box, scale };
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="field">
      <span className="side-label">{label}</span>
      <select className="side-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

export function IntegradaPage() {
  const [cfg, setCfg] = usePersistent<Required<IntegradaProps>>('integrada', () => ({
    navegacion: NAVS[0], faseMarket: FASES[0], pantallaInicial: INICIOS[0], dark: false, textoSobreVerde: 'blanco',
  }));
  const set = (o: Partial<IntegradaProps>) => setCfg((c) => ({ ...c, ...o }));
  const phone = useRef<IntegradaHandle>(null);
  const [current, setCurrent] = useState<IgScreen>('inicio');
  const { box, scale } = useFit();

  return (
    <div className="ig-stage">
      <aside className="ig-side" aria-label="Ajustes de la app integrada">
        <div className="ig-intro">
          <h1>App integrada</h1>
          <p>Una sola app con Servicios, Auto y Market: 38 pantallas hechas componentes, con datos de prueba y sin backend.</p>
        </div>
        <div className="side-block">
          <div className="block-body" style={{ paddingTop: 14 }}>
            <Select label="Barra de navegación" value={cfg.navegacion} options={NAVS} onChange={(v) => set({ navegacion: v })} />
            <Select label="Chambito Market" value={cfg.faseMarket} options={FASES} onChange={(v) => set({ faseMarket: v })} />
            <Select label="Empezar en" value={cfg.pantallaInicial} options={INICIOS} onChange={(v) => set({ pantallaInicial: v })} />
            <div className="field">
              <span className="side-label">Tema del teléfono</span>
              <div className="seg seg-sm" role="radiogroup" aria-label="Tema del teléfono">
                {([[false, 'Claro'], [true, 'Oscuro']] as const).map(([v, l]) => (
                  <button key={l} role="radio" aria-checked={cfg.dark === v} className={cfg.dark === v ? 'on' : ''} onClick={() => set({ dark: v })}>{l}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <span className="side-label">Texto sobre verde</span>
              <div className="seg seg-sm" role="radiogroup" aria-label="Texto sobre verde">
                {([['blanco', 'Blanco (hoy)'], ['negro', 'Negro']] as const).map(([v, l]) => (
                  <button key={v} role="radio" aria-checked={cfg.textoSobreVerde === v} className={cfg.textoSobreVerde === v ? 'on' : ''} onClick={() => set({ textoSobreVerde: v })}>{l}</button>
                ))}
              </div>
            </div>
            <button className="ghost-btn" style={{ justifyContent: 'center' }} onClick={() => phone.current?.reset()}>Reiniciar la demo</button>
          </div>
        </div>
        <p className="ig-hint">El PIN del pasajero para el conductor es <b>4827</b>. El viaje, la oferta al conductor y la compra protegida avanzan solos.</p>
      </aside>

      <div ref={box} className="ig-phone" style={{ paddingTop: 11 * scale }}>
        <div style={{ width: 390 * scale, height: 844 * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 390, height: 844, borderRadius: 44, overflow: 'hidden', boxShadow: '0 30px 80px var(--phone-shadow), 0 0 0 10px var(--frame), 0 0 0 11px var(--frame-ring)' }}>
            <IntegradaPhone ref={phone} {...cfg} onScreen={setCurrent} />
          </div>
        </div>
      </div>

      <nav className="ig-index" aria-label="Pantallas de la app integrada">
        {IG_INDEX.map((g) => (
          <div key={g.title} className="group">
            <div className="group-head">{g.title}</div>
            {g.items.map(([id, title]) => (
              <button key={id} className={`side-item${current === id ? ' on' : ''}`} aria-current={current === id ? 'page' : undefined} onClick={() => phone.current?.jump(id)}>
                <span className="title">{title}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}
