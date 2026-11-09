/** Chambito Auto (cliente): portada, destino, punto de encuentro, confirmar, viaje y calificación. Convertido de chambito-app.html. */
import { useVM } from '../model';
import { Body, Btn, Chip, Divider, Footer, H2, Header, I, IconBtn, Screen, SectionHead, SectionPill, StatusSpace, Title } from '../kit';

/** auto */
export function AutoInicio() {
  const { a, auto, canBack, go, live, selector, t, tabPad, trip } = useVM();
  return (
    <Screen id="auto">
      <StatusSpace />
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 8, minHeight: 56, padding: "4px 20px 0" }}>
        {canBack ? (
          <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        ) : null}
        {selector.show ? (
          <>
            <SectionPill />
            <h1 className="ig-sr">Auto</h1>
            <span style={{ flex: 1 }} />
          </>
        ) : (
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, font: "700 28px/36px Poppins, Arial, sans-serif", letterSpacing: -0.3 }}>Auto</h1>
          </div>
        )}
      </div>
      <Body>
        {trip.active ? (
          <button style={{ marginTop: 8, width: "100%", display: "flex", alignItems: "center", gap: 12, padding: 14, boxSizing: "border-box", borderRadius: 16, background: t.inverse, color: t.onInverse }} onClick={go.viaje}>
            <span aria-hidden="true" style={{ flex: "none", width: 40, height: 40, borderRadius: 12, background: t.brand, color: t.onBrand, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="car" size={22} />
            </span>
            <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 500 }}>{live.title}</span>
              <span style={{ fontSize: 13, lineHeight: "18px", opacity: 0.75 }}>{live.sub}</span>
            </span>
            <I name="chevronright" size={20} style={{ color: t.brandOnInverse }} />
          </button>
        ) : null}
        <div role="tablist" aria-label="Tipo de pedido" style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 4, padding: 4, borderRadius: 9999, background: t.fill }}>
          {(auto.modes as any[]).map((md: any, i: number) => (
            <button key={i} role="tab" aria-selected={md.selected} style={{ height: 40, borderRadius: 9999, background: md.bg, color: md.fg, font: "500 14px/20px Roboto, Arial, sans-serif", letterSpacing: 0.1, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: md.shadow }} onClick={md.pick}>{md.label}</button>
          ))}
        </div>
        <button style={{ marginTop: 12, width: "100%", height: 56, borderRadius: 16, background: t.fill, color: t.text, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", boxSizing: "border-box", font: "700 16px/24px Poppins, Arial, sans-serif" }} onClick={go.aDestino}><I name="search" size={22} />{auto.placeholder}</button>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>Mis lugares</H2>
          </SectionHead>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, height: 48, padding: "0 14px", borderRadius: 9999, boxShadow: `inset 0 0 0 1px ${t.bDefault}`, color: t.text }} onClick={a.placeCasa}>
              <I name="home" size={20} />
              <span style={{ fontWeight: 500 }}>Casa</span>
            </button>
            <button style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, height: 48, padding: "0 14px", borderRadius: 9999, boxShadow: `inset 0 0 0 1px ${t.bDefault}`, color: t.text }} onClick={a.placeTrabajo}>
              <I name="servicios" size={20} />
              <span style={{ fontWeight: 500 }}>Trabajo</span>
            </button>
            <button style={{ flex: "none", display: "flex", alignItems: "center", gap: 6, height: 48, padding: "0 14px", borderRadius: 9999, boxShadow: `inset 0 0 0 1px ${t.bDefault}`, color: t.text }} onClick={a.notInProto}>
              <I name="plus" size={18} />
              <span style={{ fontWeight: 500 }}>Agregar</span>
            </button>
          </div>
        </section>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>Recientes</H2>
          </SectionHead>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {(auto.recents as any[]).map((pl: any, i: number) => (
              <button key={i} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, width: "100%", color: pl.t.text, boxShadow: `0 1px 0 ${pl.t.line}` }} onClick={pl.pick}>
                <span aria-hidden="true" style={{ flex: "none", width: 40, height: 40, borderRadius: 9999, background: pl.t.fill, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <I name="clock" size={20} />
                </span>
                <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 500 }}>{pl.name}</span>
                  <span style={{ fontSize: 13, lineHeight: "18px", color: pl.t.text2 }}>{pl.sub}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
        <section style={{ marginTop: 16 }}>
          <div role="status" style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: t.brandSubtle, fontSize: 14, lineHeight: "20px" }}>
            <I name="shield" size={20} style={{ color: t.success }} />
            <span style={{ flex: 1 }}>Conductores verificados, precio cerrado antes de subir y viaje compartible con tu gente.</span>
          </div>
        </section>
        <div aria-hidden="true" style={{ height: `${tabPad}px` }} />
      </Body>
    </Screen>
  );
}

/** aDestino */
export function AutoDestino() {
  const { a, auto, t } = useVM();
  return (
    <Screen id="aDestino">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>{auto.destTitle}</Title>
      </Header>
      <Body>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "4px 0 16px" }}>
          <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Paso 1 de 3</span>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: t.iconBrand }} />
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: t.bDefault }} />
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: t.bDefault }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, padding: 12, borderRadius: 16, boxShadow: `inset 0 0 0 1px ${t.line}` }}>
          <span aria-hidden="true" style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0" }}>
            <span style={{ width: 12, height: 12, borderRadius: 9999, boxShadow: `inset 0 0 0 3px ${t.brand}` }} />
            <span style={{ width: 2, height: 34, background: t.bDefault }} />
            <span style={{ width: 12, height: 12, borderRadius: 2, background: t.bStrong }} />
          </span>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", padding: "6px 12px", borderRadius: 12, background: t.fill }}>
              <span style={{ fontSize: 12, lineHeight: "16px", color: t.text2 }}>Desde</span>
              <span style={{ fontWeight: 500 }}>Tu ubicación actual</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", padding: "6px 12px", borderRadius: 12, boxShadow: `inset 0 0 0 2px ${t.focus}` }}>
              <span style={{ fontSize: 12, lineHeight: "16px", color: t.text2 }}>Hasta</span>
              <span style={{ color: t.text2 }}>Buscá una dirección</span>
            </div>
          </div>
        </div>
        <section style={{ marginTop: 8 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {(auto.recents as any[]).map((pl: any, i: number) => (
              <button key={i} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, width: "100%", color: pl.t.text, boxShadow: `0 1px 0 ${pl.t.line}` }} onClick={pl.pick}>
                <I name="mappin" size={22} style={{ color: pl.t.text2 }} />
                <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 500 }}>{pl.name}</span>
                  <span style={{ fontSize: 13, lineHeight: "18px", color: pl.t.text2 }}>{pl.sub}</span>
                </span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: pl.t.text2 }}>{pl.km} km</span>
              </button>
            ))}
            <button style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, width: "100%", padding: "8px 0", boxSizing: "border-box" }} onClick={a.placeMapa}>
              <span aria-hidden="true" style={{ flex: "none", width: 40, height: 40, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="mappin" size={20} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500 }}>Fijar en el mapa</span>
              </span>
              <I name="chevronright" size={20} style={{ color: t.text2 }} />
            </button>
          </div>
        </section>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
    </Screen>
  );
}

/** aPunto */
export function AutoPunto() {
  const { a, go, t } = useVM();
  return (
    <Screen id="aPunto">
      <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <svg width="390" height="844" viewBox="0 0 390 844" role="img" aria-label="Mapa" style={{ position: "absolute", left: 0, top: 0, display: "block" }}>
          <rect width="390" height="844" fill={t.map} />
          <path d="M-10 90 L400 140 M-10 250 L400 210 M80 -10 L120 854 M260 -10 L230 854 M-10 360 L400 330" stroke={t.road} strokeWidth="14" fill="none" />
          <path d="M-10 170 L400 180 M170 -10 L190 854" stroke={t.road} strokeWidth="8" fill="none" />
        </svg>
        <div aria-hidden="true" style={{ position: "absolute", left: 175, top: 230, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ padding: "6px 10px", borderRadius: 9999, background: t.inverse, color: t.onInverse, font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, whiteSpace: "nowrap" }}>Te buscan acá</span>
          <span style={{ width: 3, height: 18, background: t.inverse }} />
          <span style={{ width: 14, height: 14, borderRadius: 9999, background: t.brand, boxShadow: `0 0 0 4px ${t.bg}` }} />
        </div>
        <div style={{ position: "absolute", left: 20, right: 20, top: 55, display: "flex", alignItems: "center", gap: 8 }}>
          <button aria-label="Volver" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, background: t.bg, color: t.text, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.2)" }} onClick={a.back}>
            <I name="chevronleft" size={20} />
          </button>
        </div>
      </div>
      <div style={{ flex: "none", position: "relative", marginTop: -24, borderRadius: "24px 24px 0 0", background: t.raised, boxShadow: t.shadow3, padding: "12px 24px 34px", display: "flex", flexDirection: "column", gap: 12 }}>
        <span aria-hidden="true" style={{ alignSelf: "center", width: 32, height: 4, borderRadius: 2, background: t.handle }} />
        <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Paso 2 de 3</span>
        <h1 style={{ margin: 0, font: "700 18px/26px Poppins, Arial, sans-serif" }}>Elegí el punto de encuentro</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, background: t.fill }}>
          <I name="mappin" size={22} style={{ color: t.iconBrand }} />
          <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 500 }}>Av. España y Brasilia</span>
            <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Andá a la esquina: ahí te ve mejor el conductor</span>
          </span>
        </div>
        <Btn onClick={go.aConfirmar}>Confirmar punto de encuentro</Btn>
      </div>
    </Screen>
  );
}

/** aConfirmar */
export function AutoConfirmar() {
  const { a, auto, t } = useVM();
  return (
    <Screen id="aConfirmar">
      <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <svg width="390" height="844" viewBox="0 0 390 844" role="img" aria-label="Mapa" style={{ position: "absolute", left: 0, top: 0, display: "block" }}>
          <rect width="390" height="844" fill={t.map} />
          <path d="M-10 90 L400 140 M-10 250 L400 210 M80 -10 L120 854 M260 -10 L230 854 M-10 360 L400 330" stroke={t.road} strokeWidth="14" fill="none" />
          <path d="M-10 170 L400 180 M170 -10 L190 854" stroke={t.road} strokeWidth="8" fill="none" />
          <path d="M110 300 L118 232 L232 214 L246 118 L300 110" stroke={t.bStrong} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="110" cy="300" r="10" fill={t.surface} stroke={t.brand} strokeWidth="5" />
          <rect x="291" y="101" width="18" height="18" rx="4" fill={t.bStrong} />
        </svg>
        <div style={{ position: "absolute", left: 20, right: 20, top: 55, display: "flex", alignItems: "center", gap: 8 }}>
          <button aria-label="Volver" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, background: t.bg, color: t.text, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.2)" }} onClick={a.back}>
            <I name="chevronleft" size={20} />
          </button>
        </div>
      </div>
      <div style={{ flex: "none", position: "relative", marginTop: -24, borderRadius: "24px 24px 0 0", background: t.raised, boxShadow: t.shadow3, padding: "12px 24px 34px", display: "flex", flexDirection: "column", gap: 12 }}>
        <span aria-hidden="true" style={{ alignSelf: "center", width: 32, height: 4, borderRadius: 2, background: t.handle }} />
        <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Paso 3 de 3</span>
        <h1 style={{ margin: 0, font: "700 18px/26px Poppins, Arial, sans-serif" }}>Confirmá tu viaje</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, lineHeight: "20px" }}>
          <span style={{ fontWeight: 500 }}>Av. España y Brasilia</span>
          <I name="chevronright" size={16} style={{ color: t.text2 }} />
          <span style={{ fontWeight: 500, flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{auto.destName}</span>
          <span style={{ color: t.text2, whiteSpace: "nowrap" }}>{auto.km} km · {auto.min} min</span>
        </div>
        <div role="status" style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", borderRadius: 12, background: t.warnSubtle, fontSize: 13, lineHeight: "18px" }}>
          <I name="warning" size={20} style={{ color: t.warning }} />
          <span style={{ flex: 1 }}>Hay mucha demanda en tu zona: el precio es más alto que lo habitual.</span>
        </div>
        <div role="radiogroup" aria-label="Nivel del servicio" style={{ display: "flex", gap: 8 }}>
          {(auto.levels as any[]).map((lv: any, i: number) => (
            <button key={i} role="radio" aria-checked={lv.checked} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: 12, borderRadius: 16, boxShadow: `inset 0 0 0 ${lv.ringW}px ${lv.ring}`, color: lv.t.text, textAlign: "left" }} onClick={lv.pick}>
              <I name="car" size={22} />
              <span style={{ fontWeight: 500 }}>{lv.label}</span>
              <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif" }}>{lv.priceTxt}</span>
              <span style={{ fontSize: 12, lineHeight: "16px", color: lv.t.text2 }}>{lv.eta}</span>
            </button>
          ))}
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 44, width: "100%", color: t.text }} onClick={a.togglePay}>
          <I name="wallet" size={20} />
          <span style={{ flex: 1, fontWeight: 500 }}>{auto.payLabel}</span>
          <span style={{ color: t.link, font: "500 14px/20px Roboto, Arial, sans-serif", letterSpacing: 0.1 }}>Cambiar</span>
        </button>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: "none", display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 12, lineHeight: "16px", color: t.text2 }}>Total</span>
            <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>{auto.totalTxt}</span>
          </div>
          <div style={{ flex: 1 }}>
            <Btn onClick={a.startTrip}>{auto.cta}</Btn>
          </div>
        </div>
      </div>
    </Screen>
  );
}

/** viaje */
export function Viaje() {
  const { a, auto, t, trip } = useVM();
  return (
    <Screen id="viaje">
      <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <svg width="390" height="844" viewBox="0 0 390 844" role="img" aria-label="Mapa" style={{ position: "absolute", left: 0, top: 0, display: "block" }}>
          <rect width="390" height="844" fill={t.map} />
          <path d="M-10 90 L400 140 M-10 250 L400 210 M80 -10 L120 854 M260 -10 L230 854 M-10 360 L400 330" stroke={t.road} strokeWidth="14" fill="none" />
          <path d="M-10 170 L400 180 M170 -10 L190 854" stroke={t.road} strokeWidth="8" fill="none" />
          <path d="M110 300 L118 232 L232 214 L246 118 L300 110" stroke={t.bStrong} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="110" cy="300" r="10" fill={t.surface} stroke={t.brand} strokeWidth="5" />
          <rect x="291" y="101" width="18" height="18" rx="4" fill={t.bStrong} />
          <circle cx="186" cy="176" r="12" fill={t.surface} stroke={t.brand} strokeWidth="5" />
          <rect x="200" y="148" width="34" height="20" rx="6" fill={t.bStrong} />
        </svg>
        {trip.buscando ? (
          <span aria-hidden="true" className="ch-pulse" style={{ position: "absolute", left: 30, top: 220, width: 160, height: 160, borderRadius: 9999, background: t.brandSubtle }} />
        ) : null}
        <div style={{ position: "absolute", left: 20, right: 20, top: 55, display: "flex", alignItems: "center", gap: 8 }}>
          <button aria-label="Volver al inicio" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, background: t.bg, color: t.text, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.2)" }} onClick={a.home}>
            <I name="chevronleft" size={20} />
          </button>
          <span style={{ flex: 1 }} />
          {trip.enCurso ? (
            <button aria-label="SOS, pedir ayuda" style={{ flex: "none", height: 44, padding: "0 20px", borderRadius: 9999, background: t.danger, color: t.onDanger, font: "700 16px/24px Poppins, Arial, sans-serif", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 8px rgba(0,0,0,.2)" }} onClick={a.openSos}><I name="alert" size={18} />SOS</button>
          ) : null}
        </div>
      </div>
      <div style={{ flex: "none", position: "relative", marginTop: -24, borderRadius: "24px 24px 0 0", background: t.raised, boxShadow: t.shadow3, padding: "12px 24px 34px", display: "flex", flexDirection: "column", gap: 12 }}>
        <span aria-hidden="true" style={{ alignSelf: "center", width: 32, height: 4, borderRadius: 2, background: t.handle }} />
        {trip.buscando ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span aria-hidden="true" className="ch-spin" style={{ flex: "none", width: 28, height: 28, borderRadius: 9999, border: `3px solid ${t.bDefault}`, borderTopColor: t.brand, boxSizing: "border-box" }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>Buscando conductor…</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Estamos buscando en un radio de 3 km</span>
              </div>
            </div>
            <Btn kind="secondary" onClick={a.cancelTrip}>Cancelar pedido</Btn>
          </>
        ) : null}
        {trip.enCamino ? (
          <>
            <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>Tu conductor llega en 3 min</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span aria-hidden="true" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, background: t.inverse, color: t.onInverse, display: "flex", alignItems: "center", justifyContent: "center", font: "700 18px/1 Poppins, Arial, sans-serif" }}>MR</span>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 500 }}>Marcos · <I name="star" size={13} style={{ color: t.warning }} /> 4,9</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>{trip.vehicle}</span>
              </div>
              <span style={{ flex: "none", padding: "6px 10px", borderRadius: 8, boxShadow: `inset 0 0 0 1.5px ${t.bStrong}`, font: "700 16px/24px Poppins, Arial, sans-serif", letterSpacing: 1 }}>ABCD 123</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 12, background: t.brandSubtle }}>
              <span style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 500 }}>Tu PIN</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Decíselo al conductor al subir</span>
              </span>
              <span style={{ font: "700 28px/36px Poppins, Arial, sans-serif", letterSpacing: 6 }}>4827</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, padding: "0 20px", borderRadius: 9999, font: "700 14px/20px Poppins, Arial, sans-serif", boxSizing: "border-box", width: "100%", whiteSpace: "nowrap", background: "transparent", color: t.text, boxShadow: `inset 0 0 0 1px ${t.bDefault}` }} onClick={a.notInProto}><I name="chat" size={20} />Chat</button>
              </div>
              <div style={{ flex: 1 }}>
                <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, padding: "0 20px", borderRadius: 9999, font: "700 14px/20px Poppins, Arial, sans-serif", boxSizing: "border-box", width: "100%", whiteSpace: "nowrap", background: "transparent", color: t.text, boxShadow: `inset 0 0 0 1px ${t.bDefault}` }} onClick={a.share}><I name="share" size={20} />Compartir viaje</button>
              </div>
            </div>
            <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, padding: "0 20px", borderRadius: 9999, font: "700 14px/20px Poppins, Arial, sans-serif", boxSizing: "border-box", width: "100%", whiteSpace: "nowrap", color: t.link }} onClick={a.cancelTrip}>Cancelar viaje</button>
          </>
        ) : null}
        {trip.llego ? (
          <>
            <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>Tu conductor llegó</span>
            <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Te espera hasta 5 minutos sin cargo. Revisá la patente antes de subir.</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span aria-hidden="true" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, background: t.inverse, color: t.onInverse, display: "flex", alignItems: "center", justifyContent: "center", font: "700 18px/1 Poppins, Arial, sans-serif" }}>MR</span>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 500 }}>Marcos · <I name="star" size={13} style={{ color: t.warning }} /> 4,9</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>{trip.vehicle}</span>
              </div>
              <span style={{ flex: "none", padding: "6px 10px", borderRadius: 8, boxShadow: `inset 0 0 0 1.5px ${t.bStrong}`, font: "700 16px/24px Poppins, Arial, sans-serif", letterSpacing: 1 }}>ABCD 123</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 12, background: t.brandSubtle }}>
              <span style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 500 }}>Tu PIN</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Decíselo al conductor al subir</span>
              </span>
              <span style={{ font: "700 28px/36px Poppins, Arial, sans-serif", letterSpacing: 6 }}>4827</span>
            </div>
            <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, padding: "0 20px", borderRadius: 9999, font: "700 14px/20px Poppins, Arial, sans-serif", boxSizing: "border-box", width: "100%", whiteSpace: "nowrap", background: "transparent", color: t.text, boxShadow: `inset 0 0 0 1px ${t.bDefault}` }} onClick={a.notInProto}><I name="chat" size={20} />Chat</button>
          </>
        ) : null}
        {trip.enCurso ? (
          <>
            <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>Viaje en curso</span>
            <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Llegás 9:59 a {auto.destName} · {auto.payLabel} · {auto.totalTxt}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span aria-hidden="true" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, background: t.inverse, color: t.onInverse, display: "flex", alignItems: "center", justifyContent: "center", font: "700 18px/1 Poppins, Arial, sans-serif" }}>MR</span>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 500 }}>Marcos · <I name="star" size={13} style={{ color: t.warning }} /> 4,9</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>{trip.vehicle}</span>
              </div>
              <span style={{ flex: "none", padding: "6px 10px", borderRadius: 8, boxShadow: `inset 0 0 0 1.5px ${t.bStrong}`, font: "700 16px/24px Poppins, Arial, sans-serif", letterSpacing: 1 }}>ABCD 123</span>
            </div>
            <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, padding: "0 20px", borderRadius: 9999, font: "700 14px/20px Poppins, Arial, sans-serif", boxSizing: "border-box", width: "100%", whiteSpace: "nowrap", background: "transparent", color: t.text, boxShadow: `inset 0 0 0 1px ${t.bDefault}` }} onClick={a.share}><I name="share" size={20} />Compartir viaje</button>
          </>
        ) : null}
      </div>
    </Screen>
  );
}

/** aCalificar */
export function AutoCalificar() {
  const { a, auto, rate, t } = useVM();
  return (
    <Screen id="aCalificar">
      <StatusSpace />
      <Header>
        <IconBtn icon="close" label="Cerrar" onClick={a.home} />
        <span style={{ flex: 1 }} />
      </Header>
      <Body>
        <h1 style={{ margin: 0, font: "700 22px/30px Poppins, Arial, sans-serif", letterSpacing: -0.2 }}>¿Cómo estuvo tu viaje con Marcos?</h1>
        <div role="radiogroup" aria-label="Calificación" style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {(rate.stars as any[]).map((sr: any, i: number) => (
            <button key={i} role="radio" aria-checked={sr.checked} aria-label={sr.label} style={{ width: 52, height: 52, borderRadius: 9999, display: "flex", alignItems: "center", justifyContent: "center", color: sr.color }} onClick={sr.pick}>
              <I name="star" size={36} />
            </button>
          ))}
        </div>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>¿Qué te gustó?</H2>
          </SectionHead>
          <div role="group" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(rate.chips as any[]).map((c: any, i: number) => (
              <Chip key={i} aria-pressed={c.pressed} onClick={c.pick} c={c}>{c.on ? (   <I name="check" size={16} /> ) : null}{c.label}</Chip>
            ))}
          </div>
        </section>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>Propina para Marcos</H2>
          </SectionHead>
          <div role="group" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(rate.tips as any[]).map((c: any, i: number) => (
              <Chip key={i} aria-pressed={c.pressed} onClick={c.pick} c={c}>{c.on ? (   <I name="check" size={16} /> ) : null}{c.label}</Chip>
            ))}
          </div>
        </section>
        <section style={{ marginTop: 20 }}>
          <div style={{ background: t.cardBg, borderRadius: 16, boxShadow: `inset 0 0 0 1px ${t.line}`, padding: 16, display: "flex", flexDirection: "column", gap: 12, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, lineHeight: "20px" }}>
              <span style={{ color: t.text2 }}>Viaje · {auto.payLow} · {auto.kmReal} km · {auto.minReal} min</span>
              <span>{auto.totalTxt}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, lineHeight: "20px" }}>
              <span style={{ color: t.text2 }}>Propina</span>
              <span>{rate.tipTxt}</span>
            </div>
            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 500 }}>Total</span>
              <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>{rate.totalTxt}</span>
            </div>
          </div>
        </section>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <Btn onClick={a.sendRating}>Enviar calificación</Btn>
      </Footer>
    </Screen>
  );
}
