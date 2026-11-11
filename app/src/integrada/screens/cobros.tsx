/**
 * Market · ventas y cobros (fase 2, lado vendedor): saldo, ventas con su comisión, detalle con desglose y línea de tiempo del dinero,
 * retiros, cuenta de cobro, tarifas, planes y facturas. Los montos salen de src/commission.ts según el modelo elegido en el visor.
 */
import { ReactNode } from 'react';
import { useVM } from '../model';
import { Body, Btn, Chip, Divider, Footer, H2, Header, I, IconBtn, Screen, SectionHead, StatusSpace, Title } from '../kit';
import { Avatar, Badge, Banner, Card, ListGroup, ListItem, SectionLabel, Switch } from '../ds';

const POPPINS = 'Poppins, Arial, sans-serif';

/** fila «concepto … monto» de un desglose */
function Row({ label, value, strong }: { label: ReactNode; value: ReactNode; strong?: boolean }) {
  const { t } = useVM();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
      <span style={{ color: strong ? t.text : t.text2, fontWeight: strong ? 500 : 400 }}>{label}</span>
      <span style={strong ? { font: `700 18px/26px ${POPPINS}`, whiteSpace: 'nowrap' } : { whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}

function Back({ title }: { title: string }) {
  const { a } = useVM();
  return (
    <Header>
      <IconBtn icon="chevronleft" label="Volver" onClick={a.back} />
      <Title>{title}</Title>
    </Header>
  );
}

const Gap = () => <div aria-hidden="true" style={{ height: 24 }} />;

/** ventas · C4 Mis ventas y cobros */
export function Ventas() {
  const { a, cb, go, t } = useVM();
  return (
    <Screen id="ventas">
      <StatusSpace />
      <Back title="Ventas y cobros" />
      <Body>
        <Card variant="muted">
          <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>Disponible para retirar</span>
          <span style={{ font: `700 32px/40px ${POPPINS}`, marginTop: -8 }}>{cb.dispTxt}</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>Pendiente</span>
              <span style={{ fontWeight: 500 }}>{cb.pendTxt}</span>
            </div>
            {cb.hasRet ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>Retenido por reclamo</span>
                <span style={{ fontWeight: 500 }}>{cb.retTxt}</span>
              </div>
            ) : null}
          </div>
        </Card>
        <div style={{ marginTop: 12 }}>
          <Banner>{cb.member ? `Tenés ${cb.planName}: tus ventas no pagan comisión.` : 'La comisión ya está descontada en cada venta.'} Publicar sigue siendo gratis.</Banner>
        </div>
        <section style={{ marginTop: 20 }}>
          <SectionHead><H2>Tus ventas</H2></SectionHead>
          <div role="group" aria-label="Filtrar ventas" style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -20px 12px', padding: '0 20px' }}>
            {(cb.chips as any[]).map((c: any) => <Chip key={c.label} c={c} aria-pressed={c.pressed} onClick={c.pick}>{c.label}</Chip>)}
          </div>
          <ListGroup>
            {(cb.sales as any[]).map((s: any, i: number, arr: any[]) => (
              <ListItem key={s.id} icon="bag" title={s.title} sub={<>{s.sub}<br /><Badge tone={s.tone}>{s.status}</Badge></>} end={<span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{s.netTxt}</span>} onClick={s.open} divider={i < arr.length - 1} />
            ))}
          </ListGroup>
          {!(cb.sales as any[]).length ? <p style={{ color: t.text2, fontSize: 14, lineHeight: '20px' }}>No hay ventas con este filtro.</p> : null}
        </section>
        <section style={{ marginTop: 20 }}>
          <ListGroup>
            <ListItem icon="card" title="Cuenta de cobro" sub={cb.payout.hasAcct ? cb.payout.acct : 'Agregá una cuenta para retirar'} chevron onClick={go.cuentaCobro} divider />
            <ListItem icon="inbox" title="Resumen y facturas" sub="Comisiones de cada mes" chevron onClick={go.facturas} divider />
            <ListItem icon="star" title="Cómo pagás al vender" sub={cb.planNext ? `${cb.planName} · pasás a ${cb.planNext} el 1 de dic.` : cb.planName} chevron onClick={go.planes} divider />
            <ListItem icon="info" title="Tarifas y comisiones" sub="Membresía o comisión por venta" chevron onClick={go.tarifas} />
          </ListGroup>
        </section>
        <section style={{ marginTop: 20 }}>
          <SectionLabel>Retiros</SectionLabel>
          <ListGroup>
            {(cb.payouts as any[]).map((p: any, i: number, arr: any[]) => (
              <ListItem key={i} icon="wallet" title={p.title} sub={p.sub} end={<Badge tone={p.status === 'En camino' ? 'live' : 'neutral'}>{p.status}</Badge>} divider={i < arr.length - 1} />
            ))}
          </ListGroup>
        </section>
        <Gap />
      </Body>
      <Footer>
        <Btn onClick={a.withdraw} aria-disabled={cb.canWithdraw ? undefined : true}>Retirar {cb.dispTxt}</Btn>
      </Footer>
    </Screen>
  );
}

/** venta · C5 Detalle de la venta (pendiente, con reclamo, reembolso parcial, cancelada…) */
export function Venta() {
  const { a, cb, t } = useVM();
  const s = cb.sale;
  return (
    <Screen id="venta">
      <StatusSpace />
      <Back title="Detalle de la venta" />
      <Body>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
          <span aria-hidden="true" style={{ flex: 'none', width: 56, height: 56, borderRadius: 12, background: t.ph, color: t.text3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I name="image" size={22} />
          </span>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500 }}>{s.title}</span>
            <span><Badge tone={s.tone}>{s.status}</Badge></span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <Avatar ini={s.ini} verified />
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 500 }}>{s.buyer}</span>
            <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>Compró con compra protegida · {s.when}</span>
          </span>
        </div>
        {s.claim ? (
          <div style={{ marginTop: 16 }}>
            <Banner tone="warning" title={`Retuvimos ${s.netTxt}`} action={<button style={{ alignSelf: 'flex-start', marginTop: 4, color: t.link, font: '500 14px/20px Roboto, Arial, sans-serif' }} onClick={a.replyClaim}>Responder a {s.buyer.split(' ')[0]}</button>}>
              Hasta resolver el reclamo, como máximo 10 días. Si se devuelve todo, no cobramos comisión.
            </Banner>
          </div>
        ) : null}
        {s.partial ? <div style={{ marginTop: 16 }}><Banner>Se devolvió una parte, así que la comisión se calculó sobre lo que te quedaste.</Banner></div> : null}
        {s.cancelled ? <div style={{ marginTop: 16 }}><Banner tone="warning">{s.dispatchTxt}</Banner></div> : null}
        <section style={{ marginTop: 20 }}>
          <SectionLabel>Cuánto recibís</SectionLabel>
          <Card>
            {(s.rows as any[]).map((r: any) => <Row key={r[0]} label={r[0]} value={r[1]} />)}
            <Divider />
            <Row label={s.netLabel} value={s.netTxt} strong />
            {s.cancelled ? null : (
              <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>
                {s.member ? `Con ${cb.planName} esta venta no paga comisión.` : s.welcome ? 'Es una de tus 3 primeras ventas: no pagás comisión.' : `La comisión de ${s.feeTxt} incluye IVA (${s.ivaTxt}). Va en tu factura del mes.`}
              </span>
            )}
          </Card>
        </section>
        <section style={{ marginTop: 20 }}>
          <SectionLabel>Tu dinero</SectionLabel>
          <ol aria-label="Estado del dinero" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
            {(s.steps as any[]).map((o: any) => (
              <li key={o.label} aria-current={o.current ? 'step' : undefined} style={{ display: 'flex', gap: 12 }}>
                <span style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24 }}>
                  <span aria-hidden="true" style={{ width: 24, height: 24, borderRadius: 9999, background: o.done ? t.brand : t.fill, color: o.done ? t.onBrand : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <I name="check" size={14} />
                  </span>
                  <span style={{ flex: 1, width: 2, minHeight: 22, background: o.last ? 'transparent' : o.next ? t.brand : t.bDefault }} />
                </span>
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 14 }}>
                  <span style={{ fontWeight: o.current ? 500 : 400, color: o.done ? t.text : t.text2 }}>{o.label}</span>
                  <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>{o.sub}</span>
                </span>
              </li>
            ))}
          </ol>
          {s.pending ? <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>{s.holdTxt}</span> : null}
        </section>
        <Gap />
      </Body>
      {s.pending ? (
        <Footer>
          <Btn kind="secondary" onClick={a.release}>Simular: el comprador confirmó</Btn>
        </Footer>
      ) : null}
    </Screen>
  );
}

/** retirar · C6 */
export function Retirar() {
  const { a, cb, go, t } = useVM();
  const p = cb.payout;
  return (
    <Screen id="retirar">
      <StatusSpace />
      <Back title="Retirar dinero" />
      <Body>
        <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>Vas a retirar todo lo disponible</span>
        <span style={{ display: 'block', font: `700 32px/40px ${POPPINS}` }}>{p.amountTxt}</span>
        <section style={{ marginTop: 20 }}>
          <SectionLabel>A dónde</SectionLabel>
          <ListGroup>
            <ListItem icon="card" title={p.hasAcct ? p.acct : 'Sin cuenta de cobro'} sub={p.hasAcct ? 'A tu nombre · verificada' : 'Agregala para poder retirar'} chevron onClick={go.cuentaCobro} />
          </ListGroup>
        </section>
        <section style={{ marginTop: 20 }}>
          <Card>
            <Row label="Disponible" value={p.amountTxt} />
            <Row label="Costo del retiro" value={p.feeTxt} />
            <Divider />
            <Row label="Te llega" value={p.receiveTxt} strong />
            <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>En {p.eta}. {p.freeTxt}</span>
          </Card>
        </section>
        <div style={{ marginTop: 12 }}>
          <Banner>El mínimo para retirar es {p.minTxt}. Solo transferimos a cuentas a tu nombre.</Banner>
        </div>
        <Gap />
      </Body>
      <Footer>
        <Btn onClick={a.confirmWithdraw}>{p.hasAcct ? `Retirar ${p.receiveTxt}` : 'Agregar cuenta de cobro'}</Btn>
      </Footer>
    </Screen>
  );
}

/** retiroOk · C7 */
export function RetiroHecho() {
  const { a, cb, t } = useVM();
  return (
    <Screen id="retiroOk">
      <StatusSpace />
      <div style={{ flex: 'none', height: 56 }} />
      <Body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12, marginTop: 48 }}>
          <span aria-hidden="true" style={{ flex: 'none', width: 88, height: 88, borderRadius: 9999, background: t.brandSubtle, color: t.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I name="wallet" size={44} />
          </span>
          <h1 style={{ margin: 0, font: `700 28px/36px ${POPPINS}`, letterSpacing: -0.3 }}>Retiro en camino</h1>
          <span style={{ fontSize: 15, lineHeight: '22px', color: t.text2 }}>Te llegan {cb.payout.lastTxt} a {cb.payout.acct} en {cb.payout.eta}. Te avisamos cuando se acredite.</span>
        </div>
        <Gap />
      </Body>
      <Footer>
        <Btn onClick={a.toVentas}>Volver a ventas y cobros</Btn>
      </Footer>
    </Screen>
  );
}

/** cuentaCobro · C8 */
export function CuentaCobro() {
  const { a, cb, t } = useVM();
  const field = (label: string, value: string) => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ font: '500 14px/20px Roboto, Arial, sans-serif', letterSpacing: 0.1 }}>{label}</span>
      <span style={{ minHeight: 52, padding: '14px 16px', boxSizing: 'border-box', borderRadius: 12, boxShadow: `inset 0 0 0 1px ${t.bField}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>{value}<I name="edit" size={18} style={{ color: t.text2 }} /></span>
    </label>
  );
  return (
    <Screen id="cuentaCobro">
      <StatusSpace />
      <Back title="Cuenta de cobro" />
      <Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
          {field('Banco', 'Banco Itaú')}
          {field('Número de cuenta', '•••• •••• 4410')}
          {field('Titular', 'Lucía Giménez · CI 4.512.330')}
        </div>
        <div style={{ marginTop: 12 }}>
          <Banner>La cuenta tiene que estar a tu nombre, el mismo que verificaste. No transferimos a cuentas de otras personas.</Banner>
        </div>
        <section style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 500 }}>Retiro automático</span>
              <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>Todos los {cb.autoDay} transferimos lo disponible. Usa tu retiro gratis de la semana.</span>
            </span>
            <Switch on={cb.auto} onChange={a.toggleAuto} label="Retiro automático" />
          </div>
        </section>
        <Gap />
      </Body>
      <Footer>
        <Btn onClick={a.saveAcct}>Guardar cuenta</Btn>
      </Footer>
    </Screen>
  );
}

/** tarifas · C2 */
export function Tarifas() {
  const { cb, go, t } = useVM();
  return (
    <Screen id="tarifas">
      <StatusSpace />
      <Back title="Tarifas y comisiones" />
      <Body>
        <h1 style={{ margin: 0, font: `700 22px/30px ${POPPINS}`, letterSpacing: -0.2 }}>Publicar es gratis. Elegí cómo pagar cuando vendés.</h1>
        <section style={{ marginTop: 16 }}>
          <Card variant="muted">
            <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>Ejemplo: vendés una mesa de {cb.example.price} (Hogar)</span>
            <Row label="B · Con comisión recibís" value={cb.example.netTxt} />
            <Row label="A · Con membresía recibís" value={cb.example.price} />
            <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>Hoy tenés: {cb.planName}.</span>
          </Card>
        </section>
        {(cb.rules as any[]).map((r: any) => (
          <section key={r.title} style={{ marginTop: 20 }}>
            <SectionHead><H2>{r.title}</H2></SectionHead>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, lineHeight: '20px' }}>
              {(r.items as string[]).map((x) => <li key={x}>{x}</li>)}
            </ul>
          </section>
        ))}
        <Gap />
      </Body>
      <Footer>
        <Btn kind="secondary" onClick={go.planes}>Comparar las dos opciones</Btn>
      </Footer>
    </Screen>
  );
}

/** una opción elegible de la pantalla de planes */
function Option({ p, children }: { p: any; children?: ReactNode }) {
  const { t } = useVM();
  return (
    <button role="radio" aria-checked={p.checked} onClick={p.pick} style={{ textAlign: 'left', borderRadius: 16, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start', background: t.cardBg, color: t.text, boxShadow: p.on ? `inset 0 0 0 2px ${t.focus}` : `inset 0 0 0 1px ${t.line}` }}>
      <span aria-hidden="true" style={{ flex: 'none', width: 24, height: 24, marginTop: 2, borderRadius: 9999, background: p.rBg, boxShadow: `inset 0 0 0 2px ${p.rRing}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ width: 10, height: 10, borderRadius: 9999, background: p.dot }} />
      </span>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ font: `700 16px/24px ${POPPINS}` }}>{p.name}</span>
          {p.current ? <Badge tone="success">Tu plan</Badge> : null}
        </span>
        <span style={{ fontWeight: 500 }}>{p.priceTxt}</span>
        <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>{p.limit}{(p.perks as string[]).length ? '. ' + (p.perks as string[]).join('. ') : ''}.</span>
        {children}
      </span>
    </button>
  );
}

/** planes · C3: A · membresía sin comisión (por niveles) o B · comisión por venta */
export function Planes() {
  const { a, cb, t } = useVM();
  return (
    <Screen id="planes">
      <StatusSpace />
      <Back title="Cómo pagás al vender" />
      <Body>
        <span style={{ fontSize: 14, lineHeight: '20px', color: t.text2 }}>Elegí entre pagar una membresía fija sin comisiones o pagar solo cuando vendés.</span>
        <div role="radiogroup" aria-label="Formas de pago" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          <SectionLabel>A · Membresía sin comisión</SectionLabel>
          <span style={{ marginTop: -4, fontSize: 13, lineHeight: '18px', color: t.text2 }}>Pagás un monto fijo por mes y ninguna venta paga comisión. El nivel define cuántas publicaciones activas tenés.</span>
          {(cb.optA as any[]).map((p: any) => <Option key={p.key} p={p} />)}
          <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>{cb.optAex}</span>
          <div style={{ marginTop: 8 }}><SectionLabel>B · Comisión por venta</SectionLabel></div>
          <Option p={cb.optB}>
            <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>{cb.optBex}</span>
          </Option>
        </div>
        <div style={{ marginTop: 16 }}>
          <Banner>Pasar a membresía o subir de nivel aplica al instante. Bajar o volver a comisión, al terminar el mes. La membresía se cobra en dólares con tu tarjeta.</Banner>
        </div>
        <Gap />
      </Body>
      <Footer>
        <Btn onClick={a.applyPlan}>{cb.planSame ? 'Seguir con ' + cb.planName : 'Elegir ' + cb.pickName}</Btn>
      </Footer>
    </Screen>
  );
}

/** facturas · C9 */
export function Facturas() {
  const { a, cb, t } = useVM();
  return (
    <Screen id="facturas">
      <StatusSpace />
      <Back title="Resumen y facturas" />
      <Body>
        <span style={{ fontSize: 14, lineHeight: '20px', color: t.text2 }}>
          {cb.member ? `Con ${cb.planName} tus ventas no pagan comisión. La membresía se factura aparte, en dólares.` : 'Cada mes te mandamos una factura electrónica con el total de comisiones. El IVA ya está incluido.'}
        </span>
        {(cb.months as any[]).map((m: any) => (
          <section key={m.label} style={{ marginTop: 20 }}>
            <SectionLabel>{m.label}</SectionLabel>
            <Card>
              <Row label={`Vendiste (${m.count})`} value={m.soldTxt} />
              <Row label="Comisiones" value={m.feeTxt} />
              {m.memberTxt ? <Row label={cb.planName} value={m.memberTxt} /> : <Row label="IVA incluido" value={m.ivaTxt} />}
              <Divider />
              <Row label="Total facturado" value={m.memberTxt || m.feeTxt} strong />
              {m.closed ? (
                <button style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, color: t.link, font: '500 14px/20px Roboto, Arial, sans-serif' }} onClick={a.invoice}>
                  <I name="inbox" size={18} />Recibir la factura por correo
                </button>
              ) : (
                <span style={{ fontSize: 13, lineHeight: '18px', color: t.text2 }}>La factura sale el 1 de diciembre.</span>
              )}
            </Card>
          </section>
        ))}
        <Gap />
      </Body>
    </Screen>
  );
}

/** vendedor · perfil de negocio: datos del negocio y sus productos; se llega desde la ficha de cualquier producto */
export function Vendedor() {
  const { biz, t } = useVM();
  return (
    <Screen id="vendedor">
      <StatusSpace />
      <Back title="Perfil del negocio" />
      <Body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 6, marginTop: 4 }}>
          <Avatar ini={biz.ini} size={80} verified />
          <span style={{ font: `700 22px/30px ${POPPINS}` }}>{biz.name}</span>
          <span style={{ fontSize: 14, lineHeight: '20px', color: t.text2 }}>{biz.rubro} · {biz.place}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, lineHeight: '18px', color: t.text2 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: t.success, font: '500 12px/16px Roboto, Arial, sans-serif' }}><I name="shield" size={14} />Verificado</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}><I name="star" size={13} style={{ color: t.warning }} />{biz.rating} ({biz.reviews})</span>
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, marginTop: 16 }}>
          {[[String(biz.count), 'publicaciones'], [String(biz.ventas), 'ventas'], [biz.responde, 'para responder']].map(([v, k]) => (
            <div key={k} style={{ padding: '10px 12px', borderRadius: 12, background: t.fill, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ font: `700 18px/26px ${POPPINS}` }}>{v}</span>
              <span style={{ fontSize: 12, lineHeight: '16px', color: t.text2 }}>{k}</span>
            </div>
          ))}
        </div>
        <section style={{ marginTop: 20 }}>
          <SectionLabel>Sobre el negocio</SectionLabel>
          <Card>
            <span style={{ fontSize: 14, lineHeight: '20px' }}>{biz.desc}</span>
            <Row label="Responsable" value={biz.owner} />
            <Row label="Horario" value={biz.horario} />
            <Row label="Zona" value={`${biz.place} · aproximada`} />
            <Row label="En Chambito desde" value={biz.since} />
          </Card>
        </section>
        <section style={{ marginTop: 20 }}>
          <SectionHead><H2>Productos ({biz.count})</H2></SectionHead>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            {(biz.items as any[]).map((p: any) => (
              <button key={p.id} aria-label={p.aria} onClick={p.open} style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left', color: t.text, opacity: p.op }}>
                <span aria-hidden="true" style={{ aspectRatio: 1, borderRadius: 12, background: p.ph, color: t.text3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I name="image" /></span>
                <span style={{ font: `700 16px/24px ${POPPINS}` }}>{p.priceTxt}</span>
                <span style={{ fontSize: 13, lineHeight: '18px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.title}</span>
                {p.hasTag ? <Badge tone={p.tag === 'Sin stock' ? 'warning' : p.tag === 'Vendida' ? 'danger' : 'success'}>{p.tag}</Badge> : null}
              </button>
            ))}
          </div>
        </section>
        <Gap />
      </Body>
      <Footer>
        <Btn kind="secondary" onClick={biz.chat}><I name="chat" size={20} />Escribirle al negocio</Btn>
      </Footer>
    </Screen>
  );
}
