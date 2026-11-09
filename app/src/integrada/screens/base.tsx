/** Servicios (base): Inicio, Explorar, Actividad, Perfil, Notificaciones y el pedido de un servicio. Convertido de chambito-app.html. */
import { useVM } from '../model';
import { Body, Btn, Chip, Divider, Footer, H2, Header, I, IconBtn, Screen, SectionHead, StatusSpace, Title } from '../kit';

/** inicio */
export function Inicio() {
  const { a, go, home, notifDot, t, tabPad } = useVM();
  return (
    <Screen id="inicio">
      <StatusSpace />
      <Header>
        <img src={t.logo} alt="Chambito" style={{ height: 30, width: "auto", display: "block" }} />
        <span style={{ flex: 1 }} />
        <div style={{ position: "relative" }}>
          <IconBtn icon="bell" label="Notificaciones" onClick={go.notifs} />
          {notifDot ? (
            <span aria-label="Notificaciones sin leer" style={{ position: "absolute", top: 8, right: 9, width: 9, height: 9, borderRadius: 9999, background: t.danger, boxShadow: `0 0 0 2px ${t.fill}` }} />
          ) : null}
        </div>
      </Header>
      <Body>
        <h1 style={{ margin: 0, font: "700 26px/34px Poppins, Arial, sans-serif" }}>¿Qué necesitás?</h1>
        <button style={{ marginTop: 12, width: "100%", height: 48, borderRadius: 24, background: t.fill, color: t.text2, display: "flex", alignItems: "center", gap: 10, padding: "0 16px", boxSizing: "border-box" }} onClick={go.explorar}>
          <I name="search" size={20} />
          <span>Buscá servicios, viajes o productos</span>
        </button>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>Servicios</H2>
            <button style={{ font: "500 14px/20px Roboto, Arial, sans-serif", color: t.link, minHeight: 44 }} onClick={go.explorar}>Ver todos</button>
          </SectionHead>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
            <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }} onClick={a.svcLimpieza}>
              <span aria-hidden="true" style={{ flex: "none", width: 64, height: 64, borderRadius: 20, background: t.brandSubtle, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="broom" size={28} />
              </span>
              <span style={{ font: "500 13px/18px Roboto, Arial, sans-serif" }}>Limpieza</span>
            </button>
            <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }} onClick={a.svcNinera}>
              <span aria-hidden="true" style={{ flex: "none", width: 64, height: 64, borderRadius: 20, background: t.brandSubtle, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="bottle" size={28} />
              </span>
              <span style={{ font: "500 13px/18px Roboto, Arial, sans-serif" }}>Niñera</span>
            </button>
            <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }} onClick={a.svcEnfermeria}>
              <span aria-hidden="true" style={{ flex: "none", width: 64, height: 64, borderRadius: 20, background: t.brandSubtle, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="nurse" size={28} />
              </span>
              <span style={{ font: "500 13px/18px Roboto, Arial, sans-serif" }}>Enfermería</span>
            </button>
            <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }} onClick={go.explorar}>
              <span aria-hidden="true" style={{ flex: "none", width: 64, height: 64, borderRadius: 20, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="more" size={28} />
              </span>
              <span style={{ font: "500 13px/18px Roboto, Arial, sans-serif" }}>Más</span>
            </button>
          </div>
        </section>
        <section style={{ marginTop: 20 }}>
          <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: 16, boxSizing: "border-box", borderRadius: 20, background: t.inverse, color: t.onInverse }} onClick={go.auto}>
            <span aria-hidden="true" style={{ flex: "none", width: 48, height: 48, borderRadius: 12, background: t.brand, color: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="car" size={26} />
            </span>
            <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ font: "700 18px/24px Poppins, Arial, sans-serif" }}>Chambito Auto</span>
              <span style={{ fontSize: 14, lineHeight: "20px", opacity: 0.8 }}>¿A dónde vas? Viajes, motos y envíos</span>
            </span>
            <I name="chevronright" size={22} style={{ color: t.brandOnInverse }} />
          </button>
        </section>
        <section style={{ marginTop: 16 }}>
          <button style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, padding: 16, boxSizing: "border-box", borderRadius: 20, background: t.cardBg, boxShadow: `inset 0 0 0 1px ${t.line}`, color: t.text }} onClick={go.tienda}>
            <span style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
              <span aria-hidden="true" style={{ flex: "none", width: 48, height: 48, borderRadius: 12, background: t.brandSubtle, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="bag" size={26} />
              </span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ font: "700 18px/24px Poppins, Arial, sans-serif" }}>Chambito Market</span>
                <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Comprá y vendé con gente verificada</span>
              </span>
              <I name="chevronright" size={22} style={{ color: t.text2 }} />
            </span>
            <span style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, width: "100%" }}>
              {(home.thumbs as any[]).map((h: any, i: number) => (
                <span key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span aria-hidden="true" style={{ height: 88, borderRadius: 12, background: h.ph, color: h.t.text3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <I name="image" size={22} />
                  </span>
                  <span style={{ font: "700 13px/18px Poppins, Arial, sans-serif" }}>{h.priceTxt}</span>
                </span>
              ))}
            </span>
          </button>
        </section>
        <div aria-hidden="true" style={{ height: `${tabPad}px` }} />
      </Body>
    </Screen>
  );
}

/** explorar */
export function Explorar() {
  const { a, canBack, explore, go, t, tabPad } = useVM();
  return (
    <Screen id="explorar">
      <StatusSpace />
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 8, minHeight: 56, padding: "4px 16px 0" }}>
        {canBack ? (
          <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, font: "700 28px/36px Poppins, Arial, sans-serif" }}>Explorar</h1>
        </div>
      </div>
      <Body>
        <div style={{ marginTop: 8, width: "100%", height: 48, borderRadius: 24, background: t.fill, color: t.text2, display: "flex", alignItems: "center", gap: 10, padding: "0 16px", boxSizing: "border-box" }}>
          <I name="search" size={20} />
          <span>Buscá en Chambito</span>
        </div>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>Elegí qué querés hacer</H2>
          </SectionHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, background: t.cardBg, boxShadow: `inset 0 0 0 1px ${t.line}`, color: t.text, width: "100%", boxSizing: "border-box" }} onClick={a.svcLimpieza}>
              <span aria-hidden="true" style={{ flex: "none", width: 48, height: 48, borderRadius: 12, background: t.brand, color: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="servicios" />
              </span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ font: "700 16px/22px Poppins, Arial, sans-serif" }}>Servicios</span>
                <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Limpieza, niñera, enfermería y más</span>
              </span>
              <I name="chevronright" size={20} style={{ color: t.text2 }} />
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, background: t.cardBg, boxShadow: `inset 0 0 0 1px ${t.line}`, color: t.text, width: "100%", boxSizing: "border-box" }} onClick={go.auto}>
              <span aria-hidden="true" style={{ flex: "none", width: 48, height: 48, borderRadius: 12, background: t.inverse, color: t.brandOnInverse, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="car" />
              </span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ font: "700 16px/22px Poppins, Arial, sans-serif" }}>Chambito Auto</span>
                <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Viajes, motos y envíos con precio cerrado</span>
              </span>
              <I name="chevronright" size={20} style={{ color: t.text2 }} />
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, background: t.cardBg, boxShadow: `inset 0 0 0 1px ${t.line}`, color: t.text, width: "100%", boxSizing: "border-box" }} onClick={go.tienda}>
              <span aria-hidden="true" style={{ flex: "none", width: 48, height: 48, borderRadius: 12, background: t.brandSubtle, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="bag" />
              </span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ font: "700 16px/22px Poppins, Arial, sans-serif" }}>Chambito Market</span>
                <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Comprá y vendé cerca tuyo</span>
              </span>
              <I name="chevronright" size={20} style={{ color: t.text2 }} />
            </button>
          </div>
        </section>
        <section style={{ marginTop: 24 }}>
          <SectionHead>
            <H2>Búsquedas populares</H2>
          </SectionHead>
          <div role="group" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(explore.chips as any[]).map((c: any, i: number) => (
              <Chip key={i} aria-pressed={c.pressed} onClick={c.pick} c={c}>{c.on ? (   <I name="check" size={16} /> ) : null}{c.label}</Chip>
            ))}
          </div>
        </section>
        <div aria-hidden="true" style={{ height: `${tabPad}px` }} />
      </Body>
    </Screen>
  );
}

/** actividad */
export function Actividad() {
  const { a, act, canBack, t, tabPad } = useVM();
  return (
    <Screen id="actividad">
      <StatusSpace />
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 8, minHeight: 56, padding: "4px 16px 0" }}>
        {canBack ? (
          <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, font: "700 28px/36px Poppins, Arial, sans-serif" }}>Actividad</h1>
        </div>
      </div>
      <div style={{ flex: "none", padding: "8px 16px 4px" }}>
        <div role="group" style={{ display: "flex", gap: 8, overflowX: "auto", margin: "0 -16px", padding: "0 16px" }}>
          {(act.chips as any[]).map((c: any, i: number) => (
            <Chip key={i} aria-pressed={c.pressed} onClick={c.pick} c={c}>{c.on ? (   <I name="check" size={16} /> ) : null}{c.label}</Chip>
          ))}
        </div>
      </div>
      <Body>
        {(act.groups as any[]).map((g: any, i: number) => (
          <section key={i} style={{ marginTop: 16 }}>
            <h2 style={{ margin: "0 0 10px", font: "700 16px/24px Poppins, Arial, sans-serif" }}>{g.title}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(g.items as any[]).map((it: any, i: number) => (
                <button key={i} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: 14, boxSizing: "border-box", borderRadius: 16, background: it.t.cardBg, boxShadow: `inset 0 0 0 1px ${it.t.line}`, color: it.t.text }} onClick={it.open}>
                  <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: it.ibg, color: it.ifg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <I name={it.icon} size={22} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ font: "500 12px/16px Roboto, Arial, sans-serif", color: it.t.text2 }}>{it.vertical}</span>
                    <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.title}</span>
                    <span style={{ fontSize: 13, lineHeight: "18px", color: it.t.text2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.sub}</span>
                  </span>
                  <span style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span style={{ height: 24, padding: "0 10px", borderRadius: 9999, display: "inline-flex", alignItems: "center", font: "500 12px/16px Roboto, Arial, sans-serif", background: it.bbg, color: it.bfg, whiteSpace: "nowrap" }}>{it.badge}</span>
                    <span style={{ fontSize: 12, lineHeight: "16px", color: it.t.text2 }}>{it.when}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
        {act.empty ? (
          <div style={{ marginTop: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
            <span aria-hidden="true" style={{ flex: "none", width: 64, height: 64, borderRadius: 32, background: t.fill, color: t.text2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="inbox" size={30} />
            </span>
            <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif" }}>Todavía no hay nada acá</span>
            <span style={{ fontSize: 14, lineHeight: "19px", color: t.text2 }}>Cuando pidas un servicio, un viaje o consultes en la Tienda, lo vas a ver en esta lista.</span>
          </div>
        ) : null}
        <div aria-hidden="true" style={{ height: `${tabPad}px` }} />
      </Body>
    </Screen>
  );
}

/** perfil */
export function Perfil() {
  const { a, canBack, go, perfil, t, tabPad } = useVM();
  return (
    <Screen id="perfil">
      <StatusSpace />
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 8, minHeight: 56, padding: "4px 16px 0" }}>
        {canBack ? (
          <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, font: "700 28px/36px Poppins, Arial, sans-serif" }}>Perfil</h1>
        </div>
      </div>
      <Body>
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 14 }}>
          <span aria-hidden="true" style={{ flex: "none", width: 64, height: 64, borderRadius: 9999, background: t.brand, color: "#000000", display: "flex", alignItems: "center", justifyContent: "center", font: "700 23px/1 Poppins, Arial, sans-serif" }}>LG</span>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ font: "700 18px/24px Poppins, Arial, sans-serif" }}>Lucía Giménez</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, font: "500 12px/16px Roboto, Arial, sans-serif", color: t.success }}><I name="shield" size={14} />Verificado</span>
              <span style={{ fontSize: 13, color: t.text2 }}>· {perfil.roleLabel}</span>
            </span>
          </div>
        </div>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>Tienda</H2>
          </SectionHead>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <button style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, width: "100%", padding: "8px 0", boxSizing: "border-box" }} onClick={go.misPubs}>
              <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="tag" size={22} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500 }}>Mis publicaciones</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>{perfil.pubsSub}</span>
              </span>
              <I name="chevronright" size={20} style={{ color: t.text2 }} />
            </button>
            <Divider />
            <button style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, width: "100%", padding: "8px 0", boxSizing: "border-box" }} onClick={go.guardados}>
              <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="heart" size={22} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500 }}>Guardados</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>{perfil.savedSub}</span>
              </span>
              <I name="chevronright" size={20} style={{ color: t.text2 }} />
            </button>
            <Divider />
            <button style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, width: "100%", padding: "8px 0", boxSizing: "border-box" }} onClick={go.vender}>
              <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="plus" size={22} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500 }}>Vender en la Tienda</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Publicar es gratis</span>
              </span>
              <I name="chevronright" size={20} style={{ color: t.text2 }} />
            </button>
          </div>
        </section>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>Trabajá con Chambito</H2>
          </SectionHead>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <button role="switch" aria-checked={perfil.socio.checked} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, width: "100%" }} onClick={perfil.socio.toggle}>
              <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="servicios" size={22} />
              </span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500 }}>Modo socio</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>{perfil.socio.sub}</span>
              </span>
              <span aria-hidden="true" style={{ flex: "none", width: 52, height: 32, borderRadius: 9999, background: perfil.socio.track, display: "flex", alignItems: "center", padding: 3, boxSizing: "border-box", justifyContent: perfil.socio.knob }}>
                <span style={{ width: 26, height: 26, borderRadius: 9999, background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,.3)" }} />
              </span>
            </button>
            <Divider />
            <button style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, width: "100%", padding: "8px 0", boxSizing: "border-box" }} onClick={a.goDriver}>
              <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="car" size={22} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500 }}>Conducir con Chambito</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Conectate y recibí viajes</span>
              </span>
              <I name="chevronright" size={20} style={{ color: t.text2 }} />
            </button>
          </div>
        </section>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>Cuenta</H2>
          </SectionHead>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <button style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, width: "100%", padding: "8px 0", boxSizing: "border-box" }} onClick={a.notInProto}>
              <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="user" size={22} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500 }}>Mis datos</span>
              </span>
              <I name="chevronright" size={20} style={{ color: t.text2 }} />
            </button>
            <Divider />
            <button style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, width: "100%", padding: "8px 0", boxSizing: "border-box" }} onClick={a.notInProto}>
              <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="mappin" size={22} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500 }}>Direcciones</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Casa · Trabajo</span>
              </span>
              <I name="chevronright" size={20} style={{ color: t.text2 }} />
            </button>
            <Divider />
            <button style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, width: "100%", padding: "8px 0", boxSizing: "border-box" }} onClick={a.notInProto}>
              <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="card" size={22} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500 }}>Medios de pago</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Visa •••• 4521 · Efectivo</span>
              </span>
              <I name="chevronright" size={20} style={{ color: t.text2 }} />
            </button>
            <Divider />
            <button role="switch" aria-checked={perfil.dark.checked} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, width: "100%" }} onClick={perfil.dark.toggle}>
              <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name="gear" size={22} />
              </span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500 }}>Tema oscuro</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>{perfil.dark.sub}</span>
              </span>
              <span aria-hidden="true" style={{ flex: "none", width: 52, height: 32, borderRadius: 9999, background: perfil.dark.track, display: "flex", alignItems: "center", padding: 3, boxSizing: "border-box", justifyContent: perfil.dark.knob }}>
                <span style={{ width: 26, height: 26, borderRadius: 9999, background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,.3)" }} />
              </span>
            </button>
          </div>
        </section>
        <div style={{ marginTop: 16 }}>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, padding: "0 20px", borderRadius: 9999, font: "700 14px/20px Poppins, Arial, sans-serif", boxSizing: "border-box", width: "100%", whiteSpace: "nowrap", color: t.link }} onClick={a.reset}><I name="refresh" size={20} />Reiniciar la demo</button>
        </div>
        <div aria-hidden="true" style={{ height: `${tabPad}px` }} />
      </Body>
    </Screen>
  );
}

/** notifs */
export function Notificaciones() {
  const { a, notifs } = useVM();
  return (
    <Screen id="notifs">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>Notificaciones</Title>
      </Header>
      <Body>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {(notifs as any[]).map((n: any, i: number) => (
            <button key={i} style={{ display: "flex", gap: 12, padding: "14px 0", width: "100%", textAlign: "left", boxShadow: `0 1px 0 ${n.t.line}`, color: n.t.text }} onClick={n.open}>
              <span aria-hidden="true" style={{ flex: "none", width: 40, height: 40, borderRadius: 12, background: n.ibg, color: n.ifg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name={n.icon} size={20} />
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500 }}>{n.title}</span>
                <span style={{ fontSize: 14, lineHeight: "20px", color: n.t.text2 }}>{n.body}</span>
              </span>
              <span style={{ flex: "none", fontSize: 12, lineHeight: "16px", color: n.t.text2 }}>{n.when}</span>
            </button>
          ))}
        </div>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
    </Screen>
  );
}

/** svc */
export function Servicio() {
  const { a, go, svc, t } = useVM();
  return (
    <Screen id="svc">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>{svc.title}</Title>
      </Header>
      <Body>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
          <span aria-hidden="true" style={{ flex: "none", width: 56, height: 56, borderRadius: 16, background: t.brandSubtle, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I name={svc.icon} size={28} />
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ font: "700 18px/24px Poppins, Arial, sans-serif" }}>{svc.headline}</span>
            <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>{svc.blurb}</span>
          </div>
        </div>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>{svc.qtyTitle}</H2>
          </SectionHead>
          <div role="group" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(svc.hours as any[]).map((c: any, i: number) => (
              <Chip key={i} aria-pressed={c.pressed} onClick={c.pick} c={c}>{c.on ? (   <I name="check" size={16} /> ) : null}{c.label}</Chip>
            ))}
          </div>
        </section>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>¿Cuándo?</H2>
          </SectionHead>
          <div role="group" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(svc.days as any[]).map((c: any, i: number) => (
              <Chip key={i} aria-pressed={c.pressed} onClick={c.pick} c={c}>{c.on ? (   <I name="check" size={16} /> ) : null}{c.label}</Chip>
            ))}
          </div>
          <div style={{ height: 10 }} />
          <div role="group" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(svc.times as any[]).map((c: any, i: number) => (
              <Chip key={i} aria-pressed={c.pressed} onClick={c.pick} c={c}>{c.on ? (   <I name="check" size={16} /> ) : null}{c.label}</Chip>
            ))}
          </div>
        </section>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>¿Dónde?</H2>
          </SectionHead>
          <button style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, width: "100%", padding: "8px 0", boxSizing: "border-box" }} onClick={a.notInProto}>
            <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="mappin" size={22} />
            </span>
            <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 500 }}>Casa</span>
              <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Av. Santa Teresa 1827, Asunción</span>
            </span>
            <I name="chevronright" size={20} style={{ color: t.text2 }} />
          </button>
        </section>
        <section style={{ marginTop: 16 }}>
          <div role="status" style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: t.brandSubtle, fontSize: 14, lineHeight: "20px" }}>
            <I name="shield" size={20} style={{ color: t.success }} />
            <span style={{ flex: 1 }}>Todos los profesionales están verificados y tienen calificaciones de otros clientes.</span>
          </div>
        </section>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ color: t.text2 }}>Precio estimado</span>
          <span style={{ font: "700 18px/24px Poppins, Arial, sans-serif" }}>{svc.priceTxt}</span>
        </div>
        <Btn onClick={go.svcPros}>Ver profesionales</Btn>
      </Footer>
    </Screen>
  );
}

/** svcPros */
export function ServicioProfesional() {
  const { a, go, svc, t } = useVM();
  return (
    <Screen id="svcPros">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>Elegí a tu profesional</Title>
      </Header>
      <Body>
        <span style={{ fontSize: 14, lineHeight: "19px", color: t.text2 }}>{svc.summary}</span>
        <div role="radiogroup" aria-label="Profesionales" style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          {(svc.pros as any[]).map((p: any, i: number) => (
            <button key={i} role="radio" aria-checked={p.checked} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, background: p.t.cardBg, boxShadow: `inset 0 0 0 ${p.ringW}px ${p.ring}`, color: p.t.text, width: "100%", boxSizing: "border-box" }} onClick={p.pick}>
              <span aria-hidden="true" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, background: p.t.fill, display: "flex", alignItems: "center", justifyContent: "center", font: "700 16px/1 Poppins, Arial, sans-serif" }}>{p.ini}</span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500 }}>{p.name}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: p.t.text2 }}><I name="star" size={13} style={{ color: p.t.warning }} />{p.rating} · {p.jobs}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, font: "500 12px/16px Roboto, Arial, sans-serif", color: p.t.success }}><I name="shield" size={14} />Verificada</span>
              </span>
              <span style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <span style={{ font: "700 15px/20px Poppins, Arial, sans-serif" }}>{p.rate}</span>
                <span aria-hidden="true" style={{ flex: "none", width: 22, height: 22, borderRadius: 9999, boxShadow: `inset 0 0 0 2px ${p.ring}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ width: 12, height: 12, borderRadius: 9999, background: p.dot }} />
                </span>
              </span>
            </button>
          ))}
        </div>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <Btn onClick={go.svcConfirm}>Continuar</Btn>
      </Footer>
    </Screen>
  );
}

/** svcConfirm */
export function ServicioConfirmar() {
  const { a, svc, t } = useVM();
  return (
    <Screen id="svcConfirm">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>Confirmá tu pedido</Title>
      </Header>
      <Body>
        <div style={{ background: t.cardBg, borderRadius: 16, boxShadow: `inset 0 0 0 1px ${t.line}`, padding: 16, display: "flex", flexDirection: "column", gap: 12, boxSizing: "border-box", marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.brandSubtle, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name={svc.icon} size={22} />
            </span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 500 }}>{svc.title}</span>
              <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>{svc.summary}</span>
            </div>
          </div>
          <Divider />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: t.text2 }}>Profesional</span>
              <span style={{ fontWeight: 500 }}>{svc.proName}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: t.text2 }}>Dirección</span>
              <span style={{ fontWeight: 500 }}>Av. Santa Teresa 1827</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: t.text2 }}>Pago</span>
              <span style={{ fontWeight: 500 }}>Visa •••• 4521</span>
            </div>
          </div>
        </div>
        <section style={{ marginTop: 16 }}>
          <div role="status" style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: t.fill, fontSize: 14, lineHeight: "20px" }}>
            <I name="info" size={20} style={{ color: t.text }} />
            <span style={{ flex: 1 }}>Te cobramos cuando el servicio termina. Podés cancelar sin cargo hasta 24 h antes.</span>
          </div>
        </section>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ color: t.text2 }}>Total estimado</span>
          <span style={{ font: "700 18px/24px Poppins, Arial, sans-serif" }}>{svc.priceTxt}</span>
        </div>
        <Btn onClick={a.svcSend}>Confirmar pedido</Btn>
      </Footer>
    </Screen>
  );
}

/** svcOk */
export function ServicioEnviado() {
  const { a, svc, t } = useVM();
  return (
    <Screen id="svcOk">
      <StatusSpace />
      <div style={{ flex: "none", height: 56 }} />
      <Body>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12, marginTop: 40 }}>
          <span aria-hidden="true" style={{ flex: "none", width: 88, height: 88, borderRadius: 9999, background: t.brandSubtle, color: t.success, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I name="success" size={44} />
          </span>
          <h1 style={{ margin: 0, font: "700 24px/32px Poppins, Arial, sans-serif" }}>¡Pedido enviado!</h1>
          <span style={{ fontSize: 15, lineHeight: "20px", color: t.text2 }}>Le avisamos a {svc.proName}. Te confirmamos por acá y con una notificación.</span>
        </div>
        <section style={{ marginTop: 28 }}>
          <div style={{ background: t.cardBg, borderRadius: 16, boxShadow: `inset 0 0 0 1px ${t.line}`, padding: 16, display: "flex", flexDirection: "column", gap: 12, boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontWeight: 500 }}>{svc.title}</span>
              <span style={{ height: 24, padding: "0 10px", borderRadius: 9999, display: "inline-flex", alignItems: "center", font: "500 12px/16px Roboto, Arial, sans-serif", background: svc.stBg, color: svc.stFg }}>{svc.statusLabel}</span>
            </div>
            <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>{svc.summary}</span>
          </div>
        </section>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <Btn onClick={a.toActividad}>Ver en Actividad</Btn>
        <Btn kind="ghost" onClick={a.home}>Volver al inicio</Btn>
      </Footer>
    </Screen>
  );
}
