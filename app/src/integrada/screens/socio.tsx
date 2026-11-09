/** Socio y conductor: Inicio del socio, Trabajo y el recorrido del conductor (buscar, PIN, viaje y cobro). Convertido de chambito-app.html. */
import { useVM } from '../model';
import { Body, Btn, Chip, Divider, Footer, H2, Header, I, IconBtn, Screen, SectionHead, StatusSpace, Title } from '../kit';

/** sInicio */
export function SocioInicio() {
  const { a, d, go, job, socio, t, tabPad } = useVM();
  return (
    <Screen id="sInicio">
      <StatusSpace />
      <Header>
        <img src={t.logo} alt="Chambito" style={{ height: 30, width: "auto", display: "block" }} />
        <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 10px", borderRadius: 9999, background: t.inverse, color: t.onInverse, font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, whiteSpace: "nowrap", flex: "none" }}>Modo socio</span>
        <span style={{ flex: 1 }} />
        <IconBtn icon="bell" label="Notificaciones" onClick={go.notifs} />
      </Header>
      <Body>
        <h1 style={{ margin: 0, font: "700 28px/36px Poppins, Arial, sans-serif", letterSpacing: -0.3 }}>Hola, Lucía</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, marginTop: 12 }}>
          <div style={{ padding: 14, borderRadius: 16, background: t.fill, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Ganancias de hoy</span>
            <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>{d.earnTxt}</span>
          </div>
          <div style={{ padding: 14, borderRadius: 16, background: t.fill, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Viajes de hoy</span>
            <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>{d.trips}</span>
          </div>
        </div>
        {job.pending ? (
          <section style={{ marginTop: 20 }}>
            <SectionHead>
              <H2>Pedido nuevo</H2>
            </SectionHead>
            <div style={{ background: t.cardBg, borderRadius: 16, boxShadow: `inset 0 0 0 1px ${t.line}`, padding: 16, display: "flex", flexDirection: "column", gap: 12, boxSizing: "border-box" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.brand, color: t.onBrand, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <I name="broom" size={22} />
                </span>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 500 }}>Limpieza del hogar · 4 h</span>
                  <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Mañana 10:00 · Villa Morra · a 2 km</span>
                </div>
                <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif" }}>Gs. 100.000</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, padding: "0 20px", borderRadius: 9999, font: "700 14px/20px Poppins, Arial, sans-serif", boxSizing: "border-box", width: "100%", whiteSpace: "nowrap", background: "transparent", color: t.text, boxShadow: `inset 0 0 0 1px ${t.bDefault}` }} onClick={a.jobReject}>Rechazar</button>
                </div>
                <div style={{ flex: 1 }}>
                  <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, padding: "0 20px", borderRadius: 9999, font: "700 14px/20px Poppins, Arial, sans-serif", boxSizing: "border-box", width: "100%", whiteSpace: "nowrap", background: t.brand, color: t.onBrand }} onClick={a.jobAccept}>Aceptar</button>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {job.accepted ? (
          <section style={{ marginTop: 20 }}>
            <div role="status" style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: t.brandSubtle, fontSize: 14, lineHeight: "20px" }}>
              <I name="success" size={20} style={{ color: t.success }} />
              <span style={{ flex: 1 }}>Aceptaste la limpieza de mañana a las 10:00. Te recordamos una hora antes.</span>
            </div>
          </section>
        ) : null}
        <section style={{ marginTop: 24 }}>
          <SectionHead>
            <H2>Tus verticales</H2>
          </SectionHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 16, background: t.inverse, color: t.onInverse, width: "100%", boxSizing: "border-box" }} onClick={a.goDriver}>
              <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.brand, color: t.onBrand, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="car" size={22} />
              </span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 500 }}>Auto · {d.statusShort}</span>
                <span style={{ fontSize: 13, lineHeight: "18px", opacity: 0.75 }}>Conectate para recibir viajes</span>
              </span>
              <I name="chevronright" size={20} style={{ color: t.brandOnInverse }} />
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 16, background: t.cardBg, boxShadow: `inset 0 0 0 1px ${t.line}`, color: t.text, width: "100%", boxSizing: "border-box" }} onClick={a.sellerChat}>
              <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="bag" size={22} />
              </span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 500 }}>Tienda · {socio.marketTitle}</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>«Mesa de luz de madera»</span>
              </span>
              <I name="chevronright" size={20} style={{ color: t.text2 }} />
            </button>
          </div>
        </section>
        <div aria-hidden="true" style={{ height: `${tabPad}px` }} />
      </Body>
    </Screen>
  );
}

/** trabajo */
export function Trabajo() {
  const { a, canBack, tabPad, work } = useVM();
  return (
    <Screen id="trabajo">
      <StatusSpace />
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 8, minHeight: 56, padding: "4px 20px 0" }}>
        {canBack ? (
          <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, font: "700 28px/36px Poppins, Arial, sans-serif", letterSpacing: -0.3 }}>Trabajo</h1>
        </div>
      </div>
      <div style={{ flex: "none", padding: "8px 16px 4px" }}>
        <div role="group" style={{ display: "flex", gap: 8, overflowX: "auto", margin: "0 -16px", padding: "0 20px" }}>
          {(work.chips as any[]).map((c: any, i: number) => (
            <Chip key={i} aria-pressed={c.pressed} onClick={c.pick} c={c}>{c.on ? (   <I name="check" size={16} /> ) : null}{c.label}</Chip>
          ))}
        </div>
      </div>
      <Body>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          {(work.items as any[]).map((it: any, i: number) => (
            <button key={i} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: 14, boxSizing: "border-box", borderRadius: 16, background: it.t.cardBg, boxShadow: `inset 0 0 0 1px ${it.t.line}`, color: it.t.text }} onClick={it.open}>
              <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: it.ibg, color: it.ifg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name={it.icon} size={22} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, color: it.t.text2 }}>{it.vertical}</span>
                <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.title}</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: it.t.text2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.sub}</span>
              </span>
              <span style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <span style={{ height: 24, padding: "0 10px", borderRadius: 9999, display: "inline-flex", alignItems: "center", font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, background: it.bbg, color: it.bfg, whiteSpace: "nowrap" }}>{it.badge}</span>
                <span style={{ fontSize: 12, lineHeight: "16px", color: it.t.text2 }}>{it.when}</span>
              </span>
            </button>
          ))}
        </div>
        <div aria-hidden="true" style={{ height: `${tabPad}px` }} />
      </Body>
    </Screen>
  );
}

/** dHome */
export function ConductorInicio() {
  const { a, d, t } = useVM();
  return (
    <Screen id="dHome">
      <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <svg width="390" height="844" viewBox="0 0 390 844" role="img" aria-label="Mapa" style={{ position: "absolute", left: 0, top: 0, display: "block" }}>
          <rect width="390" height="844" fill={t.map} />
          <path d="M-10 90 L400 140 M-10 250 L400 210 M80 -10 L120 854 M260 -10 L230 854 M-10 360 L400 330" stroke={t.road} strokeWidth="14" fill="none" />
          <path d="M-10 170 L400 180 M170 -10 L190 854" stroke={t.road} strokeWidth="8" fill="none" />
          <circle cx="186" cy="176" r="12" fill={t.surface} stroke={t.brand} strokeWidth="5" />
          <rect x="200" y="148" width="34" height="20" rx="6" fill={t.bStrong} />
        </svg>
        <div style={{ position: "absolute", left: 20, right: 20, top: 55, display: "flex", alignItems: "center", gap: 8 }}>
          <button aria-label="Salir" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, background: t.bg, color: t.text, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.2)" }} onClick={a.back}>
            <I name="chevronleft" size={20} />
          </button>
          <span style={{ flex: 1 }} />
          <span style={{ height: 44, padding: "0 20px", borderRadius: 9999, background: t.inverse, color: t.onInverse, display: "flex", alignItems: "center", font: "700 16px/24px Poppins, Arial, sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,.2)" }}>{d.earnTxt}</span>
        </div>
      </div>
      <div style={{ flex: "none", position: "relative", marginTop: -24, borderRadius: "24px 24px 0 0", background: t.raised, boxShadow: t.shadow3, padding: "12px 24px 34px", display: "flex", flexDirection: "column", gap: 12 }}>
        <span aria-hidden="true" style={{ alignSelf: "center", width: 32, height: 4, borderRadius: 2, background: t.handle }} />
        {d.offline ? (
          <>
            <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Tu estado</span>
            <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>Desconectado</span>
            <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Conectate para empezar a recibir pedidos de viaje cerca tuyo.</span>
            <Btn onClick={a.dConnect}>Conectarte</Btn>
          </>
        ) : null}
        {d.online ? (
          <>
            <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Tu estado</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span aria-hidden="true" className="ch-pulse-dot" style={{ width: 12, height: 12, borderRadius: 9999, background: t.brand }} />
              <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>Disponible para viajes</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
              <div style={{ padding: "10px 12px", borderRadius: 12, background: t.fill, display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 12, lineHeight: "16px", color: t.text2 }}>Demanda</span>
                <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>×1,4</span>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: 12, background: t.fill, display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 12, lineHeight: "16px", color: t.text2 }}>Viajes de hoy</span>
                <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>{d.trips}</span>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: 12, background: t.fill, display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 12, lineHeight: "16px", color: t.text2 }}>Ganancias</span>
                <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif", whiteSpace: "nowrap" }}>{d.earnTxt}</span>
              </div>
            </div>
            <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Esperando pedidos… El próximo llega en unos segundos.</span>
            <Btn kind="secondary" onClick={a.dDisconnect}>Desconectarte</Btn>
          </>
        ) : null}
      </div>
    </Screen>
  );
}

/** dBuscar */
export function ConductorBuscar() {
  const { a, t } = useVM();
  return (
    <Screen id="dBuscar">
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
        <div style={{ position: "absolute", left: 20, right: 20, top: 55, display: "flex", alignItems: "center", gap: 8 }}>
          <button aria-label="Volver" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, background: t.bg, color: t.text, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.2)" }} onClick={a.back}>
            <I name="chevronleft" size={20} />
          </button>
        </div>
      </div>
      <div style={{ flex: "none", position: "relative", marginTop: -24, borderRadius: "24px 24px 0 0", background: t.raised, boxShadow: t.shadow3, padding: "12px 24px 34px", display: "flex", flexDirection: "column", gap: 12 }}>
        <span aria-hidden="true" style={{ alignSelf: "center", width: 32, height: 4, borderRadius: 2, background: t.handle }} />
        <h1 style={{ margin: 0, font: "700 22px/30px Poppins, Arial, sans-serif", letterSpacing: -0.2 }}>Buscá a Lucía</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span aria-hidden="true" style={{ flex: "none", width: 40, height: 40, borderRadius: 12, background: t.fill, color: t.iconBrand, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I name="mappin" size={20} />
          </span>
          <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 500 }}>Av. España y Brasilia</span>
            <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Llegás en 3 min · Cobro en efectivo</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <Btn kind="secondary" onClick={a.notInProto}><I name="chat" size={20} />Chat</Btn>
          </div>
          <div style={{ flex: 1.4 }}>
            <Btn onClick={a.dArrived}>Llegué</Btn>
          </div>
        </div>
      </div>
    </Screen>
  );
}

/** dPin */
export function ConductorPin() {
  const { a, d, t } = useVM();
  return (
    <Screen id="dPin">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>Inicio del viaje</Title>
      </Header>
      <Body>
        <h1 style={{ margin: 0, font: "700 22px/30px Poppins, Arial, sans-serif", letterSpacing: -0.2 }}>Pedile el PIN a Lucía</h1>
        <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Así confirmás que subió la persona correcta.</span>
        <div aria-label="PIN ingresado" style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          {(d.pinBoxes as any[]).map((pb: any, i: number) => (
            <span key={i} style={{ width: 56, height: 64, borderRadius: 14, boxShadow: `inset 0 0 0 2px ${pb.ring}`, display: "flex", alignItems: "center", justifyContent: "center", font: "700 26px/1 Poppins, Arial, sans-serif" }}>{pb.v}</span>
          ))}
        </div>
        {d.pinErr ? (
          <div role="alert" style={{ marginTop: 12, textAlign: "center", color: t.danger, fontSize: 14, lineHeight: "20px" }}>El PIN no coincide. Pedíselo de nuevo.</div>
        ) : null}
        <div style={{ marginTop: 8, textAlign: "center" }}>
          <span style={{ fontSize: 12, lineHeight: "16px", color: t.text2 }}>Demo: el PIN de Lucía es 4827</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginTop: 20 }}>
          {(d.keys as any[]).map((k: any, i: number) => (
            <button key={i} aria-label={k.aria} style={{ height: 60, borderRadius: 14, background: k.bg, color: k.t.text, font: "700 22px/1 Poppins, Arial, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", visibility: k.vis }} onClick={k.press}>{k.label}</button>
          ))}
        </div>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
    </Screen>
  );
}

/** dViaje */
export function ConductorViaje() {
  const { a, t } = useVM();
  return (
    <Screen id="dViaje">
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
        <div style={{ position: "absolute", left: 20, right: 20, top: 55, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ flex: 1 }} />
          <button aria-label="SOS, pedir ayuda" style={{ flex: "none", height: 44, padding: "0 20px", borderRadius: 9999, background: t.danger, color: t.onDanger, font: "700 16px/24px Poppins, Arial, sans-serif", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 8px rgba(0,0,0,.2)" }} onClick={a.openSos}><I name="alert" size={18} />SOS</button>
        </div>
      </div>
      <div style={{ flex: "none", position: "relative", marginTop: -24, borderRadius: "24px 24px 0 0", background: t.raised, boxShadow: t.shadow3, padding: "12px 24px 34px", display: "flex", flexDirection: "column", gap: 12 }}>
        <span aria-hidden="true" style={{ alignSelf: "center", width: 32, height: 4, borderRadius: 2, background: t.handle }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>Lucía a bordo</span>
          <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 10px", borderRadius: 9999, background: t.fill, color: t.text, font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, whiteSpace: "nowrap", flex: "none" }}>Efectivo · Gs. 32.000</span>
        </div>
        <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Hacia Recoleta · 18 min</span>
        <button aria-label="Finalizar viaje" style={{ position: "relative", height: 60, borderRadius: 9999, background: t.brandSubtle, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", color: t.text, font: "700 16px/24px Poppins, Arial, sans-serif" }} onClick={a.dFinish}><span aria-hidden="true" style={{ position: "absolute", left: 6, top: 6, width: 48, height: 48, borderRadius: 9999, background: t.brand, color: t.onBrand, display: "flex", alignItems: "center", justifyContent: "center" }}>   <I name="chevronright" /> </span>Deslizá para finalizar</button>
      </div>
    </Screen>
  );
}

/** dCobro */
export function ConductorCobro() {
  const { a, t } = useVM();
  return (
    <Screen id="dCobro">
      <StatusSpace />
      <div style={{ flex: "none", height: 56 }} />
      <Body>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10, marginTop: 24 }}>
          <span aria-hidden="true" style={{ flex: "none", width: 80, height: 80, borderRadius: 9999, background: t.brandSubtle, color: t.success, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I name="wallet" size={40} />
          </span>
          <h1 style={{ margin: 0, font: "700 22px/30px Poppins, Arial, sans-serif", letterSpacing: -0.2 }}>Cobrá Gs. 32.000 en efectivo</h1>
          <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Viaje con Lucía · Villa Morra → Recoleta</span>
        </div>
        <section style={{ marginTop: 24 }}>
          <div style={{ background: t.cardBg, borderRadius: 16, boxShadow: `inset 0 0 0 1px ${t.line}`, padding: 16, display: "flex", flexDirection: "column", gap: 12, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: t.text2 }}>Tarifa del viaje</span>
              <span>Gs. 32.000</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: t.text2 }}>Comisión 12 %</span>
              <span>−Gs. 3.840</span>
            </div>
            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 500 }}>Tu ganancia</span>
              <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>Gs. 28.160</span>
            </div>
          </div>
        </section>
        <section style={{ marginTop: 12 }}>
          <div role="status" style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: t.fill, fontSize: 14, lineHeight: "20px" }}>
            <I name="info" size={20} style={{ color: t.text }} />
            <span style={{ flex: 1 }}>La comisión se descuenta de tu saldo en la próxima liquidación.</span>
          </div>
        </section>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <Btn onClick={a.dCollected}>Cobré · volver a disponible</Btn>
      </Footer>
    </Screen>
  );
}
