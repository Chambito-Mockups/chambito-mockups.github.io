/** Lo que va encima de las pantallas: barra inferior con la tarjeta en vivo, hojas (SOS y oferta), aviso, barra de estado. */
import { useVM } from './model';
import { Btn, I, IconBtn } from './kit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

/** Barra inferior flotante del brief: alto 72, radio 16, margen de 20 a los lados y 12 sobre el área segura, padding 8, elevación 3.
 *  Íconos de 24 y label Roboto Medium 12; la activa en #2F7A33 / #7CCB7F, sin píldora. Encima, la tarjeta en vivo. */
export function Bars() {
  const { live, showTabs, t, tabCols, tabs } = useVM();
  if (!showTabs) return null;
  // bottom 34: queda sobre el área segura del indicador de inicio
  return (
    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 34, zIndex: 40, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {live.show ? (
        <button style={{ display: 'flex', alignItems: 'center', gap: 12, height: 56, padding: '0 12px', borderRadius: 16, background: t.inverse, color: t.onInverse, boxShadow: t.shadow3 }} onClick={live.go}>
          <span aria-hidden="true" style={{ flex: 'none', width: 40, height: 40, borderRadius: 12, background: t.brand, color: t.onBrand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I name={live.icon} size={20} />
          </span>
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{live.title}</span>
            <span style={{ fontSize: 13, lineHeight: '18px', opacity: 0.75, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{live.sub}</span>
          </span>
          <span style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 2, font: '500 14px/20px Roboto, Arial, sans-serif', letterSpacing: 0.1, color: t.brandOnInverse }}>Ver<I name="chevronright" size={16} /></span>
        </button>
      ) : null}
      <nav aria-label="Navegación principal" style={{ height: 72, borderRadius: 16, background: t.cardBg, boxShadow: `${t.shadow3}, inset 0 0 0 1px ${t.outline}`, display: 'grid', gridTemplateColumns: `repeat(${tabCols}, minmax(0, 1fr))`, padding: 8, boxSizing: 'border-box', gap: 4 }}>
        {(tabs as Any[]).map((tb: Any) => (
          <button key={tb.label} aria-current={tb.current === 'page' ? 'page' : undefined} style={{ borderRadius: 12, color: tb.fg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, minWidth: 0, position: 'relative' }} onClick={tb.go}>
            <I name={tb.icon} size={24} />
            <span style={{ font: '500 12px/16px Roboto, Arial, sans-serif', letterSpacing: 0.2, whiteSpace: 'nowrap' }}>{tb.label}</span>
            {tb.dot ? (
              <span aria-label="Novedades" style={{ position: 'absolute', top: 4, left: 'calc(50% + 8px)', width: 8, height: 8, borderRadius: 9999, background: t.danger }} />
            ) : null}
          </button>
        ))}
      </nav>
    </div>
  );
}

export function SosSheet() {
  const { a, sheetSos, t } = useVM();
  return (
    sheetSos ? (
      <div style={{ position: "absolute", inset: 0, zIndex: 80, background: t.scrim, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <section className="ig-sheet" role="dialog" aria-modal="true" aria-label="¿Necesitás ayuda?" style={{ background: t.raised, borderRadius: "24px 24px 0 0", padding: "12px 24px 34px", display: "flex", flexDirection: "column", gap: 12 }}>
          <span aria-hidden="true" style={{ alignSelf: "center", width: 32, height: 4, borderRadius: 2, background: t.handle }} />
          <h1 style={{ margin: 0, font: "700 16px/24px Poppins, Arial, sans-serif" }}>¿Necesitás ayuda?</h1>
          <span style={{ fontSize: 15, lineHeight: "22px", color: t.text2 }}>Llamamos al 911 y avisamos a Soporte con tu ubicación y los datos del viaje.</span>
          <Btn kind="danger" onClick={a.sos911}><I name="phone" size={20} />Llamar al 911</Btn>
          <Btn kind="secondary" onClick={a.sosSupport}>Solo avisar a Soporte</Btn>
          <Btn kind="ghost" onClick={a.closeSheet}>Cancelar</Btn>
        </section>
      </div>
    ) : null
  );
}

export function OfferSheet() {
  const { a, offer, t } = useVM();
  return (
    offer.show ? (
      <div style={{ position: "absolute", inset: 0, zIndex: 85, background: t.scrim, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <section className="ig-sheet" role="alertdialog" aria-label="Nuevo viaje" style={{ background: t.raised, borderRadius: "24px 24px 0 0", padding: "24px 24px 34px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, font: "700 16px/24px Poppins, Arial, sans-serif", whiteSpace: "nowrap" }}><I name="car" size={22} />Nuevo viaje · Económico</span>
            <span style={{ flex: "none", height: 28, padding: "0 10px", borderRadius: 9999, background: t.warnSubtle, color: t.warning, display: "inline-flex", alignItems: "center", font: "500 13px/18px Roboto, Arial, sans-serif", whiteSpace: "nowrap" }}>Vence en {offer.secs}</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: t.fill, overflow: "hidden" }}>
            <div style={{ height: 6, width: `${offer.pct}%`, background: t.warning }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Vas a ganar</span>
            <span style={{ font: "700 32px/40px Poppins, Arial, sans-serif", letterSpacing: -0.5 }}>Gs. 28.160</span>
            <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Cobro en efectivo</span>
          </div>
          <div style={{ display: "flex", gap: 12, padding: 12, borderRadius: 12, background: t.fill }}>
            <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 12, lineHeight: "16px", color: t.text2 }}>Retiro</span>
              <span style={{ fontWeight: 500 }}>Villa Morra · 3 min</span>
            </span>
            <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 12, lineHeight: "16px", color: t.text2 }}>Destino</span>
              <span style={{ fontWeight: 500 }}>Recoleta · 18 min</span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Btn kind="secondary" onClick={a.offerReject}>Ahora no</Btn>
            </div>
            <div style={{ flex: 1.4 }}>
              <Btn onClick={a.offerAccept}>Aceptar</Btn>
            </div>
          </div>
        </section>
      </div>
    ) : null
  );
}

export function Toast() {
  const { t, toast } = useVM();
  return (
    toast.show ? (
      <div role="status" aria-live="polite" style={{ position: "absolute", left: 20, right: 20, top: toast.top, bottom: toast.bottom, zIndex: 90, display: "flex", alignItems: "center", gap: 10, minHeight: 48, padding: "12px 16px", boxSizing: "border-box", borderRadius: 12, background: t.inverse, color: t.onInverse, fontSize: 14, lineHeight: "20px", boxShadow: "0 8px 24px rgba(0,0,0,.25)" }}>
        <I name="success" size={20} style={{ color: t.brandOnInverse }} />
        <span style={{ flex: 1 }}>{toast.msg}</span>
      </div>
    ) : null
  );
}

export function PhoneStatusBar() {
  const { t } = useVM();
  return (
    <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: 390, height: 47, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px 0 38px", boxSizing: "border-box", zIndex: 70, pointerEvents: "none", color: t.text }}>
      <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif" }}>9:41</span>
      <span style={{ width: 25, height: 12, borderRadius: 4, border: "1.5px solid currentColor", boxSizing: "border-box", padding: 1.5, display: "flex" }}>
        <span style={{ flex: 1, borderRadius: 2, background: "currentColor" }} />
      </span>
    </div>
  );
}

export function HomeIndicator() {
  const { t } = useVM();
  return (
    <div aria-hidden="true" style={{ position: "absolute", bottom: 8, left: 128, width: 134, height: 5, borderRadius: 3, background: t.text, zIndex: 70, pointerEvents: "none" }} />
  );
}

/** X2 · «Elegí qué querés hacer»: se abre desde el selector de sección. La X o tocar afuera cierran sin cambiar de sección. */
export function ExplorerSheet() {
  const { a, explorer, t } = useVM();
  if (!explorer.show) return null;
  return (
    <div onClick={a.closeSheet} style={{ position: 'absolute', inset: 0, zIndex: 80, background: t.scrim, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <section className="ig-sheet" role="dialog" aria-modal="true" aria-label="Explorá Chambito" onClick={(e) => e.stopPropagation()} style={{ background: t.raised, borderRadius: '24px 24px 0 0', padding: '12px 24px 34px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <span aria-hidden="true" style={{ alignSelf: 'center', width: 32, height: 4, borderRadius: 2, background: t.handle }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <h1 style={{ margin: 0, font: '700 16px/24px Poppins, Arial, sans-serif' }}>Elegí qué querés hacer</h1>
          <IconBtn icon="close" label="Cerrar" onClick={a.closeSheet} />
        </div>
        <div role="list" aria-label="Secciones de Chambito" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(explorer.items as Any[]).map((x: Any) => (
            <button key={x.title} role="listitem" aria-current={x.on ? 'page' : undefined} aria-label={x.aria} onClick={x.pick}
              style={{ width: '100%', borderRadius: 16, background: t.cardBg, color: t.text, boxShadow: x.on ? `inset 0 0 0 2px ${t.iconBrand}` : `inset 0 0 0 1px ${t.line}`, padding: 16, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span aria-hidden="true" style={{ flex: 'none', width: 52, height: 52, borderRadius: 16, background: x.on ? t.brand : t.fill, color: x.on ? t.onBrand : t.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <I name={x.icon} size={28} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 8, rowGap: 4 }}>
                  <span style={{ font: '700 17px/24px Poppins, Arial, sans-serif', whiteSpace: 'nowrap' }}>{x.title}</span>
                  {x.hasTag ? <span style={{ font: '500 12px/16px Roboto, Arial, sans-serif', color: t.success, background: t.brandSubtle, borderRadius: 12, padding: '2px 8px' }}>{x.tag}</span> : null}
                </span>
                <span style={{ fontSize: 14, lineHeight: '20px', color: t.text2 }}>{x.hint}</span>
              </span>
              {x.on ? (
                <span aria-hidden="true" style={{ flex: 'none', width: 28, height: 28, borderRadius: 14, background: t.brand, color: t.onBrand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I name="check" size={16} /></span>
              ) : (
                <I name="chevronright" size={20} style={{ color: t.text2 }} />
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
