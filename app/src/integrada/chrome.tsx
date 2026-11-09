/** Lo que va encima de las pantallas: barra inferior con la tarjeta en vivo, hojas (SOS y oferta), aviso, barra de estado. */
import { useVM } from './model';
import { Btn, I } from './kit';

export function Bars() {
  const { live, showTabs, t, tabCols, tabs } = useVM();
  return (
    showTabs ? (
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 390, padding: "8px 16px 30px", boxSizing: "border-box", background: t.bg, zIndex: 40, display: "flex", flexDirection: "column", gap: 8 }}>
        {live.show ? (
          <button style={{ display: "flex", alignItems: "center", gap: 12, height: 56, padding: "0 12px", borderRadius: 16, background: t.inverse, color: t.onInverse }} onClick={live.go}>
            <span aria-hidden="true" style={{ flex: "none", width: 36, height: 36, borderRadius: 10, background: t.brand, color: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name={live.icon} size={20} />
            </span>
            <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{live.title}</span>
              <span style={{ fontSize: 13, lineHeight: "18px", opacity: 0.75, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{live.sub}</span>
            </span>
            <span style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 2, font: "500 14px/20px Roboto, Arial, sans-serif", color: t.brandOnInverse }}>Ver<I name="chevronright" size={16} /></span>
          </button>
        ) : null}
        <nav aria-label="Navegación principal" style={{ height: 64, borderRadius: 32, background: t.bg, boxShadow: `inset 0 0 0 1px ${t.outline}`, display: "grid", gridTemplateColumns: `repeat(${tabCols}, minmax(0, 1fr))`, padding: 6, boxSizing: "border-box", gap: 4 }}>
          {(tabs as any[]).map((tb: any, i: number) => (
            <button key={i} aria-current={tb.current} style={{ borderRadius: 26, background: tb.bg, color: tb.fg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, minWidth: 0, position: "relative" }} onClick={tb.go}>
              <I name={tb.icon} size={22} />
              <span style={{ font: "500 12px/16px Roboto, Arial, sans-serif", whiteSpace: "nowrap" }}>{tb.label}</span>
              {tb.dot ? (
                <span aria-label="Novedades" style={{ position: "absolute", top: 6, left: "calc(50% + 8px)", width: 8, height: 8, borderRadius: 9999, background: tb.t.danger }} />
              ) : null}
            </button>
          ))}
        </nav>
      </div>
    ) : null
  );
}

export function SosSheet() {
  const { a, sheetSos, t } = useVM();
  return (
    sheetSos ? (
      <div style={{ position: "absolute", inset: 0, zIndex: 80, background: t.scrim, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <section role="dialog" aria-modal="true" aria-label="¿Necesitás ayuda?" style={{ background: t.bg, borderRadius: "24px 24px 0 0", padding: "10px 20px 34px", display: "flex", flexDirection: "column", gap: 12 }}>
          <span aria-hidden="true" style={{ alignSelf: "center", width: 36, height: 4, borderRadius: 2, background: t.handle }} />
          <h1 style={{ margin: 0, font: "700 22px/30px Poppins, Arial, sans-serif" }}>¿Necesitás ayuda?</h1>
          <span style={{ fontSize: 15, lineHeight: "20px", color: t.text2 }}>Llamamos al 911 y avisamos a Soporte con tu ubicación y los datos del viaje.</span>
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
        <section role="alertdialog" aria-label="Nuevo viaje" style={{ background: t.bg, borderRadius: "24px 24px 0 0", padding: "16px 20px 34px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, font: "700 17px/24px Poppins, Arial, sans-serif", whiteSpace: "nowrap" }}><I name="car" size={22} />Nuevo viaje · Económico</span>
            <span style={{ flex: "none", height: 28, padding: "0 10px", borderRadius: 9999, background: t.warnSubtle, color: t.warning, display: "inline-flex", alignItems: "center", font: "500 13px/18px Roboto, Arial, sans-serif", whiteSpace: "nowrap" }}>Vence en {offer.secs}</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: t.fill, overflow: "hidden" }}>
            <div style={{ height: 6, width: `${offer.pct}%`, background: t.warning }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, color: t.text2 }}>Vas a ganar</span>
            <span style={{ font: "700 30px/38px Poppins, Arial, sans-serif" }}>Gs. 28.160</span>
            <span style={{ fontSize: 14, color: t.text2 }}>Cobro en efectivo</span>
          </div>
          <div style={{ display: "flex", gap: 12, padding: 12, borderRadius: 12, background: t.fill }}>
            <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 12, color: t.text2 }}>Retiro</span>
              <span style={{ fontWeight: 500 }}>Villa Morra · 3 min</span>
            </span>
            <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 12, color: t.text2 }}>Destino</span>
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
      <div role="status" aria-live="polite" style={{ position: "absolute", left: 16, right: 16, top: toast.top, bottom: toast.bottom, zIndex: 90, display: "flex", alignItems: "center", gap: 10, minHeight: 48, padding: "12px 16px", boxSizing: "border-box", borderRadius: 12, background: t.inverse, color: t.onInverse, fontSize: 14, lineHeight: "20px", boxShadow: "0 8px 24px rgba(0,0,0,.25)" }}>
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
      <span style={{ font: "700 15px/20px Poppins, Arial, sans-serif" }}>9:41</span>
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
