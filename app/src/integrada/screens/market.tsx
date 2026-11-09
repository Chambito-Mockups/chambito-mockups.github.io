/** Chambito Market: Tienda, búsqueda, ficha, consulta, Guardados, vender (publicar 1–3), carrito, compra protegida, orden y devolución. Convertido de chambito-app.html. */
import { useVM } from '../model';
import { Body, Btn, Chip, Divider, Footer, H2, Header, I, IconBtn, Pattern, Screen, SectionHead, SectionPill, StatusSpace, Title } from '../kit';

/** tienda */
export function Tienda() {
  const { a, canBack, cart, fabBottom, fase2, go, m, selector, t, tabPad } = useVM();
  return (
    <Screen id="tienda">
      <StatusSpace />
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 8, minHeight: 56, padding: "4px 20px 0" }}>
        {canBack ? (
          <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        ) : null}
        {selector.show ? (
          <>
            <SectionPill />
            <h1 className="ig-sr">Tienda</h1>
            <span style={{ flex: 1 }} />
          </>
        ) : (
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, font: "700 28px/36px Poppins, Arial, sans-serif", letterSpacing: -0.3 }}>Tienda</h1>
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          {fase2 ? (
            <div style={{ position: "relative" }}>
              <IconBtn icon="bag" label="Carrito" onClick={go.carrito} />
              {cart.has ? (
                <span style={{ position: "absolute", top: -2, right: -2, minWidth: 20, height: 20, padding: "0 5px", boxSizing: "border-box", borderRadius: 9999, background: t.brand, color: t.onBrand, font: "500 12px/20px Roboto, Arial, sans-serif", textAlign: "center" }}>{cart.count}</span>
              ) : null}
            </div>
          ) : null}
          <IconBtn icon="heart" label="Guardados" onClick={go.guardados} />
          <IconBtn icon="chat" label="Mis consultas" onClick={a.toConsultas} />
        </div>
      </div>
      <Body>
        <button style={{ marginTop: 8, width: "100%", height: 48, borderRadius: 24, background: t.fill, color: t.text2, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", boxSizing: "border-box" }} onClick={go.mBuscar}>
          <I name="search" size={20} />
          <span>Buscá en Chambito Market</span>
        </button>
        <div role="group" aria-label="Categorías" style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          {(m.cats as any[]).map((c: any, i: number) => (
            <button key={i} aria-pressed={c.pressed} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 64, color: c.t.text }} onClick={c.pick}>
              <span aria-hidden="true" style={{ width: 56, height: 56, borderRadius: 28, background: c.bg, color: c.fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I name={c.icon} size={22} />
              </span>
              <span style={{ font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2 }}>{c.label}</span>
            </button>
          ))}
        </div>
        {m.hasNear ? (
          <section style={{ marginTop: 20 }}>
            <SectionHead>
              <H2>Cerca tuyo</H2>
              <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>{m.catLabel}</span>
            </SectionHead>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", margin: "0 -16px", padding: "0 16px 4px" }}>
              {(m.near as any[]).map((p: any, i: number) => (
                <div key={i} style={{ position: "relative", flex: "none", width: 140 }}>
                  <button aria-label={p.aria} style={{ display: "flex", flexDirection: "column", gap: 4, width: 140, color: p.t.text }} onClick={p.open}>
                    <span aria-hidden="true" style={{ position: "relative", width: 140, height: 140, borderRadius: 16, background: p.ph, color: p.t.text3, display: "flex", alignItems: "center", justifyContent: "center", opacity: p.op }}>
                      <I name="image" size={28} />
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif" }}>{p.priceTxt}</span>
                      {p.sold ? (
                        <span style={{ font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, color: p.t.text2 }}>Vendida</span>
                      ) : null}
                    </span>
                    <span style={{ fontSize: 14, lineHeight: "20px", height: 36, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.title}</span>
                    <span style={{ fontSize: 13, lineHeight: "18px", color: p.t.text2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.where}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, color: p.t.success }}><I name="shield" size={14} />Verificado<span style={{ color: p.t.text2, display: "flex", alignItems: "center", gap: 2, marginLeft: 4 }}><I name="star" size={12} style={{ color: p.t.warning }} />{p.rating}</span></span>
                  </button>
                  <button aria-label={p.saveLabel} aria-pressed={p.savedStr} style={{ position: "absolute", top: 6, right: 6, width: 40, height: 40, borderRadius: 9999, background: p.t.bg, color: p.heart, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} onClick={p.toggleSave}>
                    <I name="heart" size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : null}
        {m.hasRecent ? (
          <section style={{ marginTop: 24 }}>
            <SectionHead>
              <H2>Recién publicados</H2>
            </SectionHead>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px 12px" }}>
              {(m.recent as any[]).map((p: any, i: number) => (
                <div key={i} style={{ position: "relative", flex: "none", width: 173 }}>
                  <button aria-label={p.aria} style={{ display: "flex", flexDirection: "column", gap: 4, width: 173, color: p.t.text }} onClick={p.open}>
                    <span aria-hidden="true" style={{ position: "relative", width: 173, height: 130, borderRadius: 16, background: p.ph, color: p.t.text3, display: "flex", alignItems: "center", justifyContent: "center", opacity: p.op }}>
                      <I name="image" size={28} />
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif" }}>{p.priceTxt}</span>
                      {p.sold ? (
                        <span style={{ font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, color: p.t.text2 }}>Vendida</span>
                      ) : null}
                    </span>
                    <span style={{ fontSize: 14, lineHeight: "20px", height: 36, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.title}</span>
                    <span style={{ fontSize: 13, lineHeight: "18px", color: p.t.text2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.where}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, color: p.t.success }}><I name="shield" size={14} />Verificado<span style={{ color: p.t.text2, display: "flex", alignItems: "center", gap: 2, marginLeft: 4 }}><I name="star" size={12} style={{ color: p.t.warning }} />{p.rating}</span></span>
                  </button>
                  <button aria-label={p.saveLabel} aria-pressed={p.savedStr} style={{ position: "absolute", top: 6, right: 6, width: 40, height: 40, borderRadius: 9999, background: p.t.bg, color: p.heart, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} onClick={p.toggleSave}>
                    <I name="heart" size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : null}
        {m.emptyCat ? (
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
            <span aria-hidden="true" style={{ flex: "none", width: 64, height: 64, borderRadius: 32, background: t.fill, color: t.text2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="bag" size={30} />
            </span>
            <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif" }}>Sé de los primeros en vender en tu zona</span>
            <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Todavía no hay publicaciones en esta categoría.</span>
          </div>
        ) : null}
        <div aria-hidden="true" style={{ height: `${tabPad}px` }} />
      </Body>
      <button style={{ position: "absolute", right: 16, bottom: `${fabBottom}px`, zIndex: 30, height: 52, padding: "0 20px 0 16px", borderRadius: 9999, background: t.inverse, color: t.onInverse, display: "flex", alignItems: "center", gap: 8, font: "700 16px/24px Poppins, Arial, sans-serif", boxShadow: "0 8px 24px rgba(0,0,0,.25)" }} onClick={go.vender}><I name="plus" size={20} />Vender</button>
    </Screen>
  );
}

/** mBuscar */
export function TiendaBuscar() {
  const { a, m, t } = useVM();
  return (
    <Screen id="mBuscar">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <div role="search" style={{ flex: 1, height: 48, borderRadius: 24, background: t.fill, display: "flex", alignItems: "center", gap: 10, padding: "0 8px 0 16px", boxSizing: "border-box" }}>
          <I name="search" size={20} style={{ color: t.text2 }} />
          <span style={{ flex: 1, color: m.qColor }}>{m.qText}</span>
          {m.hasQ ? (
            <button aria-label="Borrar búsqueda" style={{ flex: "none", width: 36, height: 36, borderRadius: 9999, background: "transparent", color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={a.clearQ}>
              <I name="close" size={16} />
            </button>
          ) : null}
        </div>
      </Header>
      <Body>
        {m.noQ ? (
          <>
            <section style={{ marginTop: 8 }}>
              <SectionHead>
                <H2>Búsquedas recientes</H2>
              </SectionHead>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {(m.recents as any[]).map((r: any, i: number) => (
                  <button key={i} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 52, width: "100%", color: r.t.text, boxShadow: `0 1px 0 ${r.t.line}` }} onClick={r.pick}>
                    <I name="clock" size={20} style={{ color: r.t.text2 }} />
                    <span style={{ flex: 1 }}>{r.label}</span>
                    <I name="chevronright" size={18} style={{ color: r.t.text2 }} />
                  </button>
                ))}
              </div>
            </section>
            <section style={{ marginTop: 24 }}>
              <SectionHead>
                <H2>Populares cerca tuyo</H2>
              </SectionHead>
              <div role="group" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(m.popular as any[]).map((c: any, i: number) => (
                  <Chip key={i} aria-pressed={c.pressed} onClick={c.pick} c={c}>{c.on ? (   <I name="check" size={16} /> ) : null}{c.label}</Chip>
                ))}
              </div>
            </section>
          </>
        ) : null}
        {m.hasQ ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "8px 0" }}>
              <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>{m.count}</span>
            </div>
            <div role="group" style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              {(m.sorts as any[]).map((c: any, i: number) => (
                <Chip key={i} aria-pressed={c.pressed} onClick={c.pick} c={c}>{c.on ? (   <I name="check" size={16} /> ) : null}{c.label}</Chip>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {(m.results as any[]).map((p: any, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
                  <button aria-label={p.aria} style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12, color: p.t.text, opacity: p.op }} onClick={p.open}>
                    <span aria-hidden="true" style={{ flex: "none", width: 88, height: 88, borderRadius: 12, background: p.ph, color: p.t.text3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <I name="image" />
                    </span>
                    <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif" }}>{p.priceTxt}</span>
                        {p.hasWas ? (
                          <span style={{ fontSize: 13, lineHeight: "18px", color: p.t.text2, textDecoration: "line-through" }}>{p.wasTxt}</span>
                        ) : null}
                      </span>
                      <span style={{ fontSize: 14, lineHeight: "20px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.title}</span>
                      <span style={{ fontSize: 13, lineHeight: "18px", color: p.t.text2 }}>{p.where}</span>
                      {p.hasTag ? (
                        <span style={{ alignSelf: "flex-start", marginTop: 2, height: 22, padding: "0 8px", borderRadius: 9999, display: "inline-flex", alignItems: "center", font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, background: p.tagBg, color: p.tagFg }}>{p.tag}</span>
                      ) : null}
                    </span>
                  </button>
                </div>
              ))}
            </div>
            {m.noResults ? (
              <div style={{ marginTop: 32, textAlign: "center" }}>
                <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>No encontramos publicaciones con esa búsqueda.</span>
              </div>
            ) : null}
          </>
        ) : null}
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
    </Screen>
  );
}

/** ficha */
export function Ficha() {
  const { a, go, pv, t } = useVM();
  return (
    <Screen id="ficha">
      <div style={{ flex: "none", position: "relative", height: 330, background: pv.ph, color: t.text3, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <I name="image" size={48} />
        <div style={{ position: "absolute", left: 20, right: 20, top: 55, display: "flex", gap: 8 }}>
          <button aria-label="Volver" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, background: t.bg, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={a.back}>
            <I name="chevronleft" size={20} />
          </button>
          <span style={{ flex: 1 }} />
          <button aria-label="Compartir" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, background: t.bg, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={a.share}>
            <I name="share" size={20} />
          </button>
          <button aria-label={pv.saveLabel} aria-pressed={pv.savedStr} style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, background: t.bg, color: pv.heart, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={pv.toggleSave}>
            <I name="heart" size={20} />
          </button>
        </div>
        <span style={{ position: "absolute", right: 16, bottom: 16, height: 28, padding: "0 12px", borderRadius: 9999, background: "rgba(0,0,0,.6)", color: "#FFFFFF", font: "500 12px/28px Roboto, Arial, sans-serif" }}>1 / 5</span>
      </div>
      <Body>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <span style={{ font: "700 28px/36px Poppins, Arial, sans-serif", letterSpacing: -0.3 }}>{pv.priceTxt}</span>
          {pv.hasWas ? (
            <span style={{ fontSize: 15, lineHeight: "22px", color: t.text2, textDecoration: "line-through" }}>{pv.wasTxt}</span>
          ) : null}
          <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 10px", borderRadius: 9999, background: t.fill, color: t.text, font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, whiteSpace: "nowrap", flex: "none" }}>{pv.cond}</span>
          {pv.sold ? (
            <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 10px", borderRadius: 9999, background: t.dangerSubtle, color: t.danger, font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, whiteSpace: "nowrap", flex: "none" }}>Vendida</span>
          ) : null}
        </div>
        <h1 style={{ margin: "4px 0 0", font: "700 18px/26px Poppins, Arial, sans-serif" }}>{pv.title}</h1>
        <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontSize: 14, lineHeight: "20px", color: t.text2 }}><I name="mappin" size={16} />{pv.where} · zona aproximada</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginTop: 16 }}>
          {(pv.attrs as any[]).map((x: any, i: number) => (
            <div key={i} style={{ padding: "10px 12px", borderRadius: 12, background: x.t.fill, display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 12, lineHeight: "16px", color: x.t.text2 }}>{x.k}</span>
              <span style={{ fontWeight: 500 }}>{x.v}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: "22px" }}>{pv.desc}</p>
        {pv.cross ? (
          <button style={{ marginTop: 16, width: "100%", display: "flex", alignItems: "center", gap: 12, padding: 14, boxSizing: "border-box", borderRadius: 16, background: "transparent", outline: `1.5px dashed ${t.bDefault}`, outlineOffset: -1.5, color: t.text }} onClick={a.svcTecnico}>
            <span aria-hidden="true" style={{ flex: "none", width: 40, height: 40, borderRadius: 12, background: t.brand, color: t.onBrand, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="servicios" size={20} />
            </span>
            <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 500 }}>¿Necesitás que la instalen?</span>
              <span style={{ fontSize: 13, lineHeight: "18px", color: t.link }}>Pedí un técnico de Chambito Servicios</span>
            </span>
            <I name="chevronright" size={20} style={{ color: t.text2 }} />
          </button>
        ) : null}
        {pv.notMine ? (
          <section style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, boxShadow: `inset 0 0 0 1px ${t.line}` }}>
              <span aria-hidden="true" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, background: t.brandSubtle, display: "flex", alignItems: "center", justifyContent: "center", font: "700 16px/1 Poppins, Arial, sans-serif" }}>{pv.ini}</span>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500 }}>{pv.seller}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, lineHeight: "18px", color: t.text2 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, color: t.success }}><I name="shield" size={14} />Verificado</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}><I name="star" size={13} style={{ color: t.warning }} />{pv.rating} ({pv.reviews})</span>
                </span>
                <span style={{ fontSize: 12, lineHeight: "16px", color: t.text2 }}>En Chambito desde {pv.since}</span>
              </div>
            </div>
          </section>
        ) : null}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 13, lineHeight: "18px", color: t.text2 }}><I name="lock" size={16} />Nunca pagues por adelantado fuera de Chambito</div>
        <div aria-hidden="true" style={{ height: 16 }} />
      </Body>
      <Footer>
        {pv.showF1 ? (
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={pv.consult}><I name="chat" size={20} />Consultar</Btn>
          </div>
        ) : null}
        {pv.showF2 ? (
          <>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Btn kind="secondary" onClick={pv.consult}>Consultar</Btn>
              </div>
              <div style={{ flex: 1 }}>
                <Btn onClick={pv.buy}>Comprar</Btn>
              </div>
            </div>
            <span style={{ fontSize: 12, lineHeight: "16px", color: t.text2 }}>Compra protegida: el pago se libera cuando recibís el producto.</span>
          </>
        ) : null}
        {pv.showSold ? (
          <Btn kind="secondary" onClick={pv.similar}>Ver similares</Btn>
        ) : null}
        {pv.showMine ? (
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Btn kind="secondary" onClick={a.notInProto}>Editar</Btn>
            </div>
            <div style={{ flex: 1 }}>
              <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 52, padding: "0 20px", borderRadius: 9999, font: "700 16px/24px Poppins, Arial, sans-serif", boxSizing: "border-box", width: "100%", whiteSpace: "nowrap", background: t.inverse, color: t.onInverse }} onClick={go.misPubs}>Mis publicaciones</button>
            </div>
          </div>
        ) : null}
      </Footer>
    </Screen>
  );
}

/** chat */
export function Consulta() {
  const { a, chat, t } = useVM();
  return (
    <Screen id="chat">
      <Pattern />
      <StatusSpace />
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 10, height: 60, padding: "0 20px", boxShadow: `0 1px 0 ${t.line}` }}>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <span aria-hidden="true" style={{ flex: "none", width: 40, height: 40, borderRadius: 9999, background: t.brandSubtle, display: "flex", alignItems: "center", justifyContent: "center", font: "700 14px/1 Poppins, Arial, sans-serif" }}>{chat.ini}</span>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif" }}>{chat.name}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, color: t.success }}><I name="shield" size={14} />Verificado</span>
        </div>
      </div>
      <button style={{ flex: "none", display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: t.fill, color: t.text, width: "100%", boxSizing: "border-box" }} onClick={chat.openProduct}>
        <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 10, background: chat.ph, color: t.text3, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <I name="image" size={18} />
        </span>
        <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 14, lineHeight: "20px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chat.ptitle}</span>
          <span style={{ font: "700 14px/20px Poppins, Arial, sans-serif" }}>{chat.pprice}</span>
        </span>
        <I name="chevronright" size={18} style={{ color: t.text2 }} />
      </button>
      <Body>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 12 }}>
          <div role="status" style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: t.fill, fontSize: 13, lineHeight: "18px" }}>
            <I name="lock" size={20} style={{ color: t.text }} />
            <span style={{ flex: 1 }}>Coordiná todo por este chat. Nunca pagues por adelantado fuera de Chambito.</span>
          </div>
          {chat.empty ? (
            <div style={{ textAlign: "center", margin: "24px 0" }}>
              <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Empezá la conversación con una pregunta rápida.</span>
            </div>
          ) : null}
          {(chat.msgs as any[]).map((mm: any, i: number) => (
            <div key={i} style={{ alignSelf: mm.align, maxWidth: "78%", padding: "8px 12px", borderRadius: mm.me ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: mm.bg, color: mm.fg, fontSize: 15, lineHeight: "22px" }}>{mm.text}</div>
          ))}
          {chat.typing ? (
            <div aria-live="polite" style={{ alignSelf: "flex-start", padding: "8px 12px", borderRadius: "16px 16px 16px 4px", background: t.fill, fontSize: 13, lineHeight: "18px", color: t.text2 }}>{chat.typingTxt}</div>
          ) : null}
        </div>
        <div aria-hidden="true" style={{ height: 12 }} />
      </Body>
      <div style={{ flex: "none", padding: "8px 16px 0", display: "flex", gap: 8, overflowX: "auto" }}>
        {(chat.quick as any[]).map((c: any, i: number) => (
          <Chip key={i} aria-pressed={c.pressed} onClick={c.pick} c={c}>{c.on ? (   <I name="check" size={16} /> ) : null}{c.label}</Chip>
        ))}
      </div>
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 8, padding: "10px 16px 34px" }}>
        <div style={{ flex: 1, height: 48, borderRadius: 24, background: t.fill, color: t.text2, display: "flex", alignItems: "center", padding: "0 20px" }}>Escribí un mensaje</div>
        <button aria-label="Enviar mensaje" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, background: t.brand, color: t.onBrand, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={chat.sendDefault}>
          <I name="navigation" size={20} />
        </button>
      </div>
    </Screen>
  );
}

/** guardados */
export function Guardados() {
  const { a, go, saved, t } = useVM();
  return (
    <Screen id="guardados">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>Guardados</Title>
      </Header>
      <Body>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {(saved.items as any[]).map((p: any, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
              <button aria-label={p.aria} style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12, color: p.t.text, opacity: p.op }} onClick={p.open}>
                <span aria-hidden="true" style={{ flex: "none", width: 88, height: 88, borderRadius: 12, background: p.ph, color: p.t.text3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <I name="image" />
                </span>
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif" }}>{p.priceTxt}</span>
                    {p.hasWas ? (
                      <span style={{ fontSize: 13, lineHeight: "18px", color: p.t.text2, textDecoration: "line-through" }}>{p.wasTxt}</span>
                    ) : null}
                  </span>
                  <span style={{ fontSize: 14, lineHeight: "20px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.title}</span>
                  <span style={{ fontSize: 13, lineHeight: "18px", color: p.t.text2 }}>{p.where}</span>
                  {p.hasTag ? (
                    <span style={{ alignSelf: "flex-start", marginTop: 2, height: 22, padding: "0 8px", borderRadius: 9999, display: "inline-flex", alignItems: "center", font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, background: p.tagBg, color: p.tagFg }}>{p.tag}</span>
                  ) : null}
                </span>
              </button>
              <button aria-label="Quitar de Guardados" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, color: p.t.iconBrand, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={p.toggleSave}>
                <I name="heart" size={20} />
              </button>
            </div>
          ))}
        </div>
        {saved.empty ? (
          <div style={{ marginTop: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
            <span aria-hidden="true" style={{ flex: "none", width: 64, height: 64, borderRadius: 32, background: t.fill, color: t.text2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="heart" size={30} />
            </span>
            <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif" }}>Todavía no guardaste nada</span>
            <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Tocá el corazón en una publicación para verla acá.</span>
            <div style={{ width: 220, marginTop: 8 }}>
              <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, padding: "0 20px", borderRadius: 9999, font: "700 14px/20px Poppins, Arial, sans-serif", boxSizing: "border-box", width: "100%", whiteSpace: "nowrap", background: t.inverse, color: t.onInverse }} onClick={go.tienda}>Ir a la Tienda</button>
            </div>
          </div>
        ) : null}
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
    </Screen>
  );
}

/** misPubs */
export function MisPublicaciones() {
  const { a, go, mine, t } = useVM();
  return (
    <Screen id="misPubs">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>Mis publicaciones</Title>
      </Header>
      <Body>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {(mine.items as any[]).map((p: any, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
              <button aria-label={p.aria} style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12, color: p.t.text, opacity: p.op }} onClick={p.open}>
                <span aria-hidden="true" style={{ flex: "none", width: 88, height: 88, borderRadius: 12, background: p.ph, color: p.t.text3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <I name="image" />
                </span>
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif" }}>{p.priceTxt}</span>
                    {p.hasWas ? (
                      <span style={{ fontSize: 13, lineHeight: "18px", color: p.t.text2, textDecoration: "line-through" }}>{p.wasTxt}</span>
                    ) : null}
                  </span>
                  <span style={{ fontSize: 14, lineHeight: "20px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.title}</span>
                  <span style={{ fontSize: 13, lineHeight: "18px", color: p.t.text2 }}>{p.where}</span>
                  {p.hasTag ? (
                    <span style={{ alignSelf: "flex-start", marginTop: 2, height: 22, padding: "0 8px", borderRadius: 9999, display: "inline-flex", alignItems: "center", font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, background: p.tagBg, color: p.tagFg }}>{p.tag}</span>
                  ) : null}
                </span>
              </button>
            </div>
          ))}
        </div>
        <section style={{ marginTop: 16 }}>
          <div role="status" style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: t.fill, fontSize: 14, lineHeight: "20px" }}>
            <I name="info" size={20} style={{ color: t.text }} />
            <span style={{ flex: 1 }}>Las publicaciones se revisan en minutos. Si una foto no muestra el producto, te avisamos para corregirla.</span>
          </div>
        </section>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <Btn onClick={go.vender}><I name="plus" size={20} />Publicar algo nuevo</Btn>
      </Footer>
    </Screen>
  );
}

/** vender */
export function Vender() {
  const { a, go, t } = useVM();
  return (
    <Screen id="vender">
      <StatusSpace />
      <Header>
        <IconBtn icon="close" label="Cerrar" onClick={a.back} />
        <span style={{ flex: 1 }} />
      </Header>
      <Body>
        <h1 style={{ margin: 0, font: "700 28px/36px Poppins, Arial, sans-serif", letterSpacing: -0.3 }}>Vendé en Chambito Market</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 24 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="tag" size={22} />
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 500 }}>Publicar es gratis</span>
              <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>No cobramos comisión en esta etapa.</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="shield" size={22} />
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 500 }}>Sólo vendedores verificados</span>
              <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Por eso los compradores confían.</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="chat" size={22} />
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 500 }}>Hablás por el chat de Chambito</span>
              <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>Sin dar tu teléfono ni tu dirección.</span>
            </div>
          </div>
        </div>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <Btn onClick={go.pub1}>Empezar</Btn>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Te lleva menos de 2 minutos</span>
        </div>
      </Footer>
    </Screen>
  );
}

/** pub1 */
export function Publicar1() {
  const { a, pub, t } = useVM();
  return (
    <Screen id="pub1">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>Publicar</Title>
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
        <h1 style={{ margin: 0, font: "700 22px/30px Poppins, Arial, sans-serif", letterSpacing: -0.2 }}>Agregá fotos</h1>
        <span style={{ fontSize: 14, lineHeight: "20px", color: t.text2 }}>La primera es la portada. Mostrá el producto real, con buena luz.</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginTop: 16 }}>
          {pub.canAdd ? (
            <button style={{ aspectRatio: 1, borderRadius: 14, outline: `1.5px dashed ${t.bField}`, outlineOffset: -1.5, color: t.text, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }} onClick={a.addPhoto}>
              <I name="camera" />
              <span style={{ font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2 }}>Agregar foto</span>
            </button>
          ) : null}
          {(pub.tiles as any[]).map((ph: any, i: number) => (
            <div key={i} style={{ position: "relative", aspectRatio: 1, borderRadius: 14, background: ph.bg, color: ph.t.text3, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="image" />
              {ph.cover ? (
                <span style={{ position: "absolute", left: 6, bottom: 6, height: 22, padding: "0 8px", borderRadius: 9999, background: ph.t.inverse, color: ph.t.onInverse, font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2 }}>Portada</span>
              ) : null}
              <button aria-label={ph.label} style={{ position: "absolute", top: 2, right: 2, width: 32, height: 32, borderRadius: 9999, background: "rgba(0,0,0,.6)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={ph.remove}>
                <I name="close" size={14} />
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>{pub.count}</span>
        </div>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 52, padding: "0 20px", borderRadius: 9999, font: "700 16px/24px Poppins, Arial, sans-serif", boxSizing: "border-box", width: "100%", whiteSpace: "nowrap", background: t.brand, color: t.onBrand, opacity: pub.nextOp }} onClick={a.pub1Next}>Continuar</button>
      </Footer>
    </Screen>
  );
}

/** pub2 */
export function Publicar2() {
  const { a, go, pub, t } = useVM();
  return (
    <Screen id="pub2">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>Publicar</Title>
      </Header>
      <Body>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "4px 0 16px" }}>
          <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Paso 2 de 3</span>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: t.iconBrand }} />
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: t.iconBrand }} />
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: t.bDefault }} />
          </div>
        </div>
        <h1 style={{ margin: 0, font: "700 22px/30px Poppins, Arial, sans-serif", letterSpacing: -0.2 }}>Contanos qué vendés</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ font: "500 14px/20px Roboto, Arial, sans-serif", letterSpacing: 0.1 }}>Título</span>
            <span style={{ minHeight: 52, padding: "14px 16px", boxSizing: "border-box", borderRadius: 12, boxShadow: `inset 0 0 0 1px ${t.bField}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>Mesa ratona de madera<I name="edit" size={18} style={{ color: t.text2 }} /></span>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ font: "500 14px/20px Roboto, Arial, sans-serif", letterSpacing: 0.1 }}>Precio</span>
            <span style={{ minHeight: 52, padding: "14px 16px", boxSizing: "border-box", borderRadius: 12, boxShadow: `inset 0 0 0 1px ${t.bField}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>Gs. 300.000<I name="edit" size={18} style={{ color: t.text2 }} /></span>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ font: "500 14px/20px Roboto, Arial, sans-serif", letterSpacing: 0.1 }}>Descripción</span>
            <span style={{ minHeight: 52, padding: "14px 16px", boxSizing: "border-box", borderRadius: 12, boxShadow: `inset 0 0 0 1px ${t.bField}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>Madera maciza, 90 × 50 cm. Algunas marcas de uso.<I name="edit" size={18} style={{ color: t.text2 }} /></span>
          </label>
        </div>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>Categoría</H2>
          </SectionHead>
          <div role="group" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(pub.cats as any[]).map((c: any, i: number) => (
              <Chip key={i} aria-pressed={c.pressed} onClick={c.pick} c={c}>{c.on ? (   <I name="check" size={16} /> ) : null}{c.label}</Chip>
            ))}
          </div>
        </section>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>Estado</H2>
          </SectionHead>
          <div role="group" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(pub.conds as any[]).map((c: any, i: number) => (
              <Chip key={i} aria-pressed={c.pressed} onClick={c.pick} c={c}>{c.on ? (   <I name="check" size={16} /> ) : null}{c.label}</Chip>
            ))}
          </div>
        </section>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <Btn onClick={go.pub3}>Continuar</Btn>
      </Footer>
    </Screen>
  );
}

/** pub3 */
export function Publicar3() {
  const { a, pub, t } = useVM();
  return (
    <Screen id="pub3">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>Publicar</Title>
      </Header>
      <Body>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "4px 0 16px" }}>
          <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Paso 3 de 3</span>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: t.iconBrand }} />
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: t.iconBrand }} />
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: t.iconBrand }} />
          </div>
        </div>
        <h1 style={{ margin: 0, font: "700 22px/30px Poppins, Arial, sans-serif", letterSpacing: -0.2 }}>Revisá tu publicación</h1>
        <div style={{ background: t.cardBg, borderRadius: 16, boxShadow: `inset 0 0 0 1px ${t.line}`, padding: 16, display: "flex", flexDirection: "column", gap: 12, boxSizing: "border-box", marginTop: 16 }}>
          <span aria-hidden="true" style={{ height: 180, borderRadius: 12, background: t.ph, color: t.text3, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I name="image" size={36} />
          </span>
          <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>Gs. 300.000</span>
          <span style={{ fontWeight: 500 }}>Mesa ratona de madera</span>
          <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>{pub.catLabel} · {pub.cond} · Lambaré</span>
          <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>{pub.photosTxt}</span>
        </div>
        <section style={{ marginTop: 12 }}>
          <div role="status" style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: t.fill, fontSize: 14, lineHeight: "20px" }}>
            <I name="info" size={20} style={{ color: t.text }} />
            <span style={{ flex: 1 }}>Mostramos una zona aproximada, nunca tu dirección.</span>
          </div>
        </section>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <Btn onClick={a.publish}>Publicar</Btn>
      </Footer>
    </Screen>
  );
}

/** pubOk */
export function Publicado() {
  const { a, t } = useVM();
  return (
    <Screen id="pubOk">
      <StatusSpace />
      <div style={{ flex: "none", height: 56 }} />
      <Body>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12, marginTop: 48 }}>
          <span aria-hidden="true" style={{ flex: "none", width: 88, height: 88, borderRadius: 9999, background: t.brandSubtle, color: t.success, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I name="success" size={44} />
          </span>
          <h1 style={{ margin: 0, font: "700 28px/36px Poppins, Arial, sans-serif", letterSpacing: -0.3 }}>¡Publicado!</h1>
          <span style={{ fontSize: 15, lineHeight: "22px", color: t.text2 }}>«Mesa ratona de madera» ya se ve en la Tienda. Te avisamos cuando alguien consulte.</span>
        </div>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <Btn onClick={a.viewLastPub}>Ver publicación</Btn>
        <Btn kind="ghost" onClick={a.toTienda}>Volver a la Tienda</Btn>
      </Footer>
    </Screen>
  );
}

/** carrito */
export function Carrito() {
  const { a, cart, go, t } = useVM();
  return (
    <Screen id="carrito">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>Carrito</Title>
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          {(cart.items as any[]).map((p: any, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
              <button aria-label={p.aria} style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12, color: p.t.text, opacity: p.op }} onClick={p.open}>
                <span aria-hidden="true" style={{ flex: "none", width: 88, height: 88, borderRadius: 12, background: p.ph, color: p.t.text3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <I name="image" />
                </span>
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif" }}>{p.priceTxt}</span>
                    {p.hasWas ? (
                      <span style={{ fontSize: 13, lineHeight: "18px", color: p.t.text2, textDecoration: "line-through" }}>{p.wasTxt}</span>
                    ) : null}
                  </span>
                  <span style={{ fontSize: 14, lineHeight: "20px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.title}</span>
                  <span style={{ fontSize: 13, lineHeight: "18px", color: p.t.text2 }}>{p.where}</span>
                  {p.hasTag ? (
                    <span style={{ alignSelf: "flex-start", marginTop: 2, height: 22, padding: "0 8px", borderRadius: 9999, display: "inline-flex", alignItems: "center", font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2, background: p.tagBg, color: p.tagFg }}>{p.tag}</span>
                  ) : null}
                </span>
              </button>
              <button aria-label="Quitar del carrito" style={{ flex: "none", width: 48, height: 48, borderRadius: 9999, color: p.t.text2, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={p.remove}>
                <I name="trash" size={20} />
              </button>
            </div>
          ))}
        </div>
        {cart.empty ? (
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
            <span aria-hidden="true" style={{ flex: "none", width: 64, height: 64, borderRadius: 32, background: t.fill, color: t.text2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="bag" size={30} />
            </span>
            <span style={{ font: "700 16px/24px Poppins, Arial, sans-serif" }}>Tu carrito está vacío</span>
            <div style={{ width: 220 }}>
              <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, padding: "0 20px", borderRadius: 9999, font: "700 14px/20px Poppins, Arial, sans-serif", boxSizing: "border-box", width: "100%", whiteSpace: "nowrap", background: t.inverse, color: t.onInverse }} onClick={go.tienda}>Ir a la Tienda</button>
            </div>
          </div>
        ) : null}
        {cart.has ? (
          <section style={{ marginTop: 12 }}>
            <div role="status" style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: t.brandSubtle, fontSize: 14, lineHeight: "20px" }}>
              <I name="shield" size={20} style={{ color: t.success }} />
              <span style={{ flex: 1 }}>Compra protegida: el vendedor recibe el pago cuando confirmás que recibiste el producto.</span>
            </div>
          </section>
        ) : null}
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      {cart.has ? (
        <Footer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ color: t.text2 }}>Subtotal</span>
            <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>{cart.subtotalTxt}</span>
          </div>
          <Btn onClick={go.confirmar}>Continuar</Btn>
        </Footer>
      ) : null}
    </Screen>
  );
}

/** confirmar */
export function ConfirmarCompra() {
  const { a, cart, t } = useVM();
  return (
    <Screen id="confirmar">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>Confirmar compra</Title>
      </Header>
      <Body>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "4px 0 16px" }}>
          <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Paso 2 de 3</span>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: t.iconBrand }} />
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: t.iconBrand }} />
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: t.bDefault }} />
          </div>
        </div>
        <SectionHead>
          <H2>Entrega</H2>
        </SectionHead>
        <div role="radiogroup" aria-label="Entrega" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(cart.entregas as any[]).map((e: any, i: number) => (
            <button key={i} role="radio" aria-checked={e.checked} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, boxShadow: `inset 0 0 0 ${e.ringW}px ${e.ring}`, color: e.t.text, width: "100%", boxSizing: "border-box" }} onClick={e.pick}>
              <span aria-hidden="true" style={{ flex: "none", width: 24, height: 24, borderRadius: 9999, background: e.rBg, boxShadow: `inset 0 0 0 2px ${e.rRing}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ width: 10, height: 10, borderRadius: 9999, background: e.dot }} />
              </span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 500 }}>{e.label}</span>
                <span style={{ fontSize: 13, lineHeight: "18px", color: e.t.text2 }}>{e.sub}</span>
              </span>
              <span style={{ fontWeight: 500 }}>{e.cost}</span>
            </button>
          ))}
        </div>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>Pago</H2>
          </SectionHead>
          <button style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, width: "100%", padding: "8px 0", boxSizing: "border-box" }} onClick={a.notInProto}>
            <span aria-hidden="true" style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: t.fill, color: t.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="card" size={22} />
            </span>
            <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 500 }}>Visa •••• 4521</span>
              <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Vence 08/29</span>
            </span>
            <span style={{ color: t.link, font: "500 14px/20px Roboto, Arial, sans-serif", letterSpacing: 0.1 }}>Cambiar</span>
          </button>
        </section>
        <section style={{ marginTop: 20 }}>
          <div style={{ background: t.cardBg, borderRadius: 16, boxShadow: `inset 0 0 0 1px ${t.line}`, padding: 16, display: "flex", flexDirection: "column", gap: 12, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, lineHeight: "20px" }}>
              <span style={{ color: t.text2 }}>Productos ({cart.count})</span>
              <span>{cart.subtotalTxt}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, lineHeight: "20px" }}>
              <span style={{ color: t.text2 }}>Envío</span>
              <span>{cart.shipTxt}</span>
            </div>
            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 500 }}>Total</span>
              <span style={{ font: "700 18px/26px Poppins, Arial, sans-serif" }}>{cart.totalTxt}</span>
            </div>
          </div>
        </section>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <Btn onClick={a.pay}><I name="lock" size={20} />{cart.payLabel}</Btn>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 12, lineHeight: "16px", color: t.text2 }}>Retenemos el pago hasta que confirmes la entrega.</span>
        </div>
      </Footer>
    </Screen>
  );
}

/** compraOk */
export function CompraHecha() {
  const { a, order, t } = useVM();
  return (
    <Screen id="compraOk">
      <StatusSpace />
      <div style={{ flex: "none", height: 56 }} />
      <Body>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12, marginTop: 48 }}>
          <span aria-hidden="true" style={{ flex: "none", width: 88, height: 88, borderRadius: 9999, background: t.brandSubtle, color: t.success, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I name="shield" size={44} />
          </span>
          <h1 style={{ margin: 0, font: "700 22px/30px Poppins, Arial, sans-serif", letterSpacing: -0.2 }}>¡Listo! Tu pago está protegido</h1>
          <span style={{ fontSize: 15, lineHeight: "22px", color: t.text2 }}>Le avisamos a {order.seller}. El pago se libera cuando confirmes que recibiste el producto.</span>
        </div>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <Btn onClick={a.toOrden}>Ver seguimiento</Btn>
        <Btn kind="ghost" onClick={a.toTienda}>Seguir comprando</Btn>
      </Footer>
    </Screen>
  );
}

/** orden */
export function Orden() {
  const { a, go, order, t } = useVM();
  return (
    <Screen id="orden">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>Seguimiento</Title>
      </Header>
      <Body>
        <div style={{ background: t.cardBg, borderRadius: 16, boxShadow: `inset 0 0 0 1px ${t.line}`, padding: 16, display: "flex", flexDirection: "column", gap: 12, boxSizing: "border-box", marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span aria-hidden="true" style={{ flex: "none", width: 56, height: 56, borderRadius: 12, background: t.ph, color: t.text3, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="image" size={22} />
            </span>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{order.title}</span>
              <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>{order.totalTxt} · {order.entrega}</span>
            </div>
          </div>
        </div>
        {order.claim ? (
          <section style={{ marginTop: 12 }}>
            <div role="status" style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: t.warnSubtle, fontSize: 14, lineHeight: "20px" }}>
              <I name="warning" size={20} style={{ color: t.warning }} />
              <span style={{ flex: 1 }}>Abrimos tu reclamo. Retenemos el pago hasta resolverlo y te escribimos por el chat.</span>
            </div>
          </section>
        ) : null}
        <section style={{ marginTop: 20 }}>
          <ol aria-label="Estado del pedido" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
            {(order.steps as any[]).map((o: any, i: number) => (
              <li key={i} aria-current={o.current} style={{ display: "flex", gap: 12 }}>
                <span style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "center", width: 24 }}>
                  <span aria-hidden="true" style={{ width: 24, height: 24, borderRadius: 9999, background: o.dotBg, color: o.dotFg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <I name="check" size={14} />
                  </span>
                  <span style={{ flex: 1, width: 2, minHeight: 22, background: o.lineBg }} />
                </span>
                <span style={{ flex: 1, display: "flex", flexDirection: "column", paddingBottom: 14 }}>
                  <span style={{ fontWeight: o.weight, color: o.color }}>{o.label}</span>
                  <span style={{ fontSize: 13, lineHeight: "18px", color: o.t.text2 }}>{o.sub}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
        <div style={{ background: t.cardBg, borderRadius: 16, boxShadow: `inset 0 0 0 1px ${t.line}`, padding: 16, display: "flex", flexDirection: "column", gap: 12, boxSizing: "border-box", alignItems: "center", textAlign: "center" }}>
          <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Código de entrega</span>
          <span style={{ font: "700 32px/40px Poppins, Arial, sans-serif", letterSpacing: 10 }}>{order.code}</span>
          <span style={{ fontSize: 13, lineHeight: "18px", color: t.text2 }}>Dáselo al vendedor sólo cuando tengas el producto en la mano.</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <div style={{ flex: 1 }}>
            <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, padding: "0 20px", borderRadius: 9999, font: "700 14px/20px Poppins, Arial, sans-serif", boxSizing: "border-box", width: "100%", whiteSpace: "nowrap", background: "transparent", color: t.text, boxShadow: `inset 0 0 0 1px ${t.bDefault}` }} onClick={a.orderChat}><I name="chat" size={20} />Chat</button>
          </div>
          <div style={{ flex: 1 }}>
            <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, padding: "0 20px", borderRadius: 9999, font: "700 14px/20px Poppins, Arial, sans-serif", boxSizing: "border-box", width: "100%", whiteSpace: "nowrap", color: t.link }} onClick={go.devolucion}>Tengo un problema</button>
          </div>
        </div>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      {order.canReceive ? (
        <Footer>
          <Btn onClick={a.received}>Ya lo recibí</Btn>
        </Footer>
      ) : null}
    </Screen>
  );
}

/** devolucion */
export function Devolucion() {
  const { a, claim, t } = useVM();
  return (
    <Screen id="devolucion">
      <StatusSpace />
      <Header>
        <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
        <Title>Tengo un problema</Title>
      </Header>
      <Body>
        <SectionHead>
          <H2>¿Qué pasó?</H2>
        </SectionHead>
        <div role="radiogroup" aria-label="Motivo" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(claim.reasons as any[]).map((r: any, i: number) => (
            <button key={i} role="radio" aria-checked={r.checked} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 56, padding: "0 14px", borderRadius: 16, boxShadow: `inset 0 0 0 ${r.ringW}px ${r.ring}`, color: r.t.text, width: "100%", boxSizing: "border-box" }} onClick={r.pick}>
              <span aria-hidden="true" style={{ flex: "none", width: 24, height: 24, borderRadius: 9999, background: r.rBg, boxShadow: `inset 0 0 0 2px ${r.rRing}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ width: 10, height: 10, borderRadius: 9999, background: r.dot }} />
              </span>
              <span style={{ flex: 1, fontWeight: 500 }}>{r.label}</span>
            </button>
          ))}
        </div>
        <section style={{ marginTop: 20 }}>
          <SectionHead>
            <H2>Fotos</H2>
          </SectionHead>
          <button style={{ width: 104, height: 104, borderRadius: 14, outline: `1.5px dashed ${t.bField}`, outlineOffset: -1.5, color: t.text, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }} onClick={a.notInProto}>
            <I name="camera" />
            <span style={{ font: "500 12px/16px Roboto, Arial, sans-serif", letterSpacing: 0.2 }}>Agregar</span>
          </button>
        </section>
        <section style={{ marginTop: 20 }}>
          <div role="status" style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: t.brandSubtle, fontSize: 14, lineHeight: "20px" }}>
            <I name="shield" size={20} style={{ color: t.success }} />
            <span style={{ flex: 1 }}>Mientras revisamos, el pago queda retenido. No se libera al vendedor.</span>
          </div>
        </section>
        <div aria-hidden="true" style={{ height: 24 }} />
      </Body>
      <Footer>
        <Btn onClick={a.sendClaim}>Enviar reclamo</Btn>
      </Footer>
    </Screen>
  );
}
