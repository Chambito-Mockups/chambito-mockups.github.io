/**
 * Market clásico · ventas y cobros (fase 2, lado vendedor): C2 Tarifas, C3 Cómo pagás (A · membresía sin comisión o B · comisión por venta),
 * C4 Ventas y cobros, C5 Detalle de la venta, C6 Retirar, C7 Retiro en camino, C8 Cuenta de cobro y C9 Resumen y facturas.
 * C1 es el «Recibís» de Publicar 2 (V17). Montos y reglas: src/commission.ts, con la forma de cobro del menú lateral; la moneda sigue al país.
 */
import { CSSProperties, ReactNode } from 'react';
import { useApp } from '../store';
import { P, R } from '../theme';
import { Button, Icon, ListRow } from '../ui/kit';
import {
  balances, CatKey, calcSale, CLAIM_MAX_DAYS, commissionOf, DISPATCH_HOURS, HOLD_DAYS, isMember, limitTxt, monthTotals, MONTHS, PAYOUT, PAYOUTS, Plan, planName, rateLabel, rules, SALES, saleCalc, SaleStatus, STATUS_LABEL, tierOf, TIERS, usd,
} from '../commission';
import { useMarket } from './state';
import { FilterChip, InfoNote, MFooter, MScreen, MTopBar, Photo, pretty } from './kit';
import { useMoney } from './kit';

/** Todo lo que necesitan las pantallas: forma de cobro, saldos y textos por país. */
export function useCobros() {
  const { settings, set } = useApp();
  const { cobros, setCobros } = useMarket();
  const money = useMoney();
  const plan: Plan = settings.sellerPlan ?? 'comision';
  const ar = settings.country === 'AR';
  const acct = ar ? 'Mercado Pago · CVU •••• 2207' : 'Banco Itaú •••• 4410';
  const statusOf = (id: string, s: SaleStatus): SaleStatus => (id === 'v6' && cobros.released ? 'disponible' : s);
  const b = balances(plan);
  const v6net = saleCalc(SALES[0], plan).net;
  const disp = b.disponible + (cobros.released ? v6net : 0) - cobros.withdrawn;
  const pend = b.pendiente - (cobros.released ? v6net : 0);
  const fee = cobros.payCount ? PAYOUT.extraFee : 0;
  const neg = (n: number) => (n ? `−${money(n)}` : money(0));
  const setPlan = (p: Plan) => set({ sellerPlan: p });
  return { settings, cobros, setCobros, money, neg, plan, setPlan, member: isMember(plan), ar, acct, statusOf, disp, pend, ret: b.retenido, fee, v6net };
}

const card = (t: { mSurface: string }): CSSProperties => ({ background: t.mSurface, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 });

function Line({ label, value, strong }: { label: ReactNode; value: ReactNode; strong?: boolean }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
      <span style={{ font: strong ? R(15, 500) : R(14), color: strong ? t.text : t.text2 }}>{label}</span>
      <span style={{ font: strong ? P(20) : R(14, 500), whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}

function Tag({ status }: { status: SaleStatus }) {
  const { t } = useApp();
  const [c, bg] =
    status === 'pendiente' ? [t.text, t.greenSoft] : status === 'disponible' ? [t.success, t.greenSoft] : status === 'reclamo' || status === 'parcial' ? [t.warn, 'rgba(255,181,71,0.16)'] : [t.text2, t.mChip];
  return <span style={{ font: R(12, 500), color: c, background: bg, borderRadius: 10, padding: '2px 8px', alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>{STATUS_LABEL[status]}</span>;
}

const Pad = ({ children, gap = 16 }: { children: ReactNode; gap?: number }) => <div style={{ padding: '8px 20px 24px', display: 'flex', flexDirection: 'column', gap }}>{children}</div>;
const Label = ({ children }: { children: ReactNode }) => {
  const { t } = useApp();
  return <span style={{ font: R(13, 500), color: t.text2, textTransform: 'uppercase', letterSpacing: 0.3 }}>{children}</span>;
};

/* ================= C4 Ventas y cobros ================= */
export function C4() {
  const { t, back, go, showToast } = useApp();
  const c = useCobros();
  const FILTERS: [typeof c.cobros.filter, string][] = [['todas', 'Todas'], ['pendiente', 'Pendientes'], ['disponible', 'Disponibles'], ['reclamo', 'Con reclamo']];
  const sales = SALES.filter((s) => c.cobros.filter === 'todas' || c.statusOf(s.id, s.status) === c.cobros.filter);
  const payouts = [...c.cobros.newPayouts.map((p) => ({ ...p, account: c.acct })), ...PAYOUTS.map((p) => ({ ...p, account: c.acct }))];
  return (
    <MScreen footer={<MFooter><Button onClick={() => (c.disp >= PAYOUT.min ? go('C6') : showToast(`El mínimo para retirar es ${c.money(PAYOUT.min)}`))}>Retirar {c.money(c.disp)}</Button></MFooter>}>
      <MTopBar title="Ventas y cobros" onBack={back} />
      <Pad>
        <div style={card(t)}>
          <span style={{ font: R(13), color: t.text2 }}>Disponible para retirar</span>
          <span style={{ font: P(32), marginTop: -8 }}>{c.money(c.disp)}</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}><span style={{ font: R(13), color: t.text2 }}>Pendiente</span><span style={{ font: R(15, 500) }}>{c.money(c.pend)}</span></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}><span style={{ font: R(13), color: t.text2 }}>Retenido por reclamo</span><span style={{ font: R(15, 500) }}>{c.money(c.ret)}</span></div>
          </div>
        </div>
        <InfoNote>{c.member ? `Tenés ${planName(c.plan)}: tus ventas no pagan comisión.` : 'La comisión ya está descontada en cada venta.'} Publicar sigue siendo gratis.</InfoNote>
        <span style={{ font: P(18) }}>Tus ventas</span>
        <div className="scroll" role="group" aria-label="Filtrar ventas" style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '-4px -20px 0', padding: '0 20px' }}>
          {FILTERS.map(([k, l]) => <FilterChip key={k} selected={c.cobros.filter === k} onClick={() => c.setCobros({ filter: k })}>{l}</FilterChip>)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {sales.map((s) => {
            const st = c.statusOf(s.id, s.status);
            return (
              <button key={s.id} className="press" onClick={() => { c.setCobros({ saleId: s.id }); go('C5'); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', textAlign: 'left', width: '100%' }}>
                <Photo ph={s.saleIndex < 0 ? 0 : (s.saleIndex % 3) as 0 | 1 | 2} radius={12} height={56} iconSize={20} style={{ width: 56, flex: 'none' }} />
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ font: R(15, 500), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</span>
                  <span style={{ font: R(13), color: t.text2 }}>{s.buyer} · {s.when}</span>
                  <Tag status={st} />
                </span>
                <span style={{ font: R(15, 500), whiteSpace: 'nowrap' }}>{c.money(saleCalc(s, c.plan).net)}</span>
              </button>
            );
          })}
          {!sales.length && <span style={{ font: R(14), color: t.text2 }}>No hay ventas con este filtro.</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ListRow icon="creditCard" title="Cuenta de cobro" subtitle={c.acct} onClick={() => go('C8')} trailing={<Icon name="chevronRight" size={18} color={t.text2} />} />
          <ListRow icon="inbox" title="Resumen y facturas" subtitle="Comisiones de cada mes" onClick={() => go('C9')} trailing={<Icon name="chevronRight" size={18} color={t.text2} />} />
          <ListRow icon="star" title="Cómo pagás al vender" subtitle={c.cobros.planNext ? `${planName(c.plan)} · pasás a ${planName(c.cobros.planNext)} el 1 de dic.` : planName(c.plan)} onClick={() => go('C3')} trailing={<Icon name="chevronRight" size={18} color={t.text2} />} />
          <ListRow icon="info" title="Tarifas y comisiones" subtitle="Membresía o comisión por venta" onClick={() => go('C2')} trailing={<Icon name="chevronRight" size={18} color={t.text2} />} />
        </div>
        <Label>Retiros</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {payouts.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
              <Icon name="wallet" size={20} />
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ font: R(15, 500) }}>{c.money(p.amount)}</span>
                <span style={{ font: R(13), color: t.text2 }}>{p.account} · {p.when}</span>
              </span>
              <span style={{ font: R(12, 500), color: t.text2 }}>{p.status}</span>
            </div>
          ))}
        </div>
      </Pad>
    </MScreen>
  );
}

/* ================= C5 Detalle de la venta ================= */
export function C5() {
  const { t, back, go, showToast } = useApp();
  const { setChatListing } = useMarket();
  const c = useCobros();
  const s = SALES.find((x) => x.id === c.cobros.saleId) ?? SALES[0];
  const st = c.statusOf(s.id, s.status);
  const k = saleCalc(s, c.plan);
  const first = s.buyer.split(' ')[0];
  const steps: [string, string, boolean][] = s.id === 'v6' && c.cobros.released
    ? [['Pagado', `${first} pagó en la app. El dinero está protegido.`, true], ['En camino', 'Despachaste el pedido hoy a las 15:20.', true], ['Entregado', `${first} confirmó que lo recibió.`, true], ['Disponible', 'Ya lo podés retirar a tu cuenta.', true]]
    : s.steps;
  const cur = steps.filter((x) => x[2]).length - 1;
  const footer = st === 'pendiente'
    ? <MFooter><Button kind="secondary" onClick={() => { c.setCobros({ released: true }); showToast(`${first} confirmó. Liberamos ${c.money(c.v6net)} a tu saldo`); }}>Simular: el comprador confirmó</Button></MFooter>
    : undefined;
  return (
    <MScreen footer={footer}>
      <MTopBar title="Detalle de la venta" onBack={back} />
      <Pad>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Photo ph={1} radius={12} height={56} iconSize={20} style={{ width: 56, flex: 'none' }} />
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ font: R(15, 500) }}>{s.title}</span>
            <Tag status={st} />
          </span>
        </div>
        <span style={{ font: R(14), color: t.text2 }}>{s.buyer} compró con compra protegida · {s.when}</span>
        {st === 'reclamo' && (
          <InfoNote icon="warning" tone="warn">
            Retuvimos {c.money(k.net)} hasta resolver el reclamo, como máximo {CLAIM_MAX_DAYS} días. Si se devuelve todo, no cobramos comisión.{' '}
            <button style={{ font: R(14, 500), color: t.link }} onClick={() => { setChatListing('trek'); go('M10'); }}>Responder a {first}</button>
          </InfoNote>
        )}
        {st === 'parcial' && <InfoNote>Se devolvió una parte, así que la comisión se calculó sobre lo que te quedaste.</InfoNote>}
        {st === 'cancelada' && <InfoNote icon="warning" tone="warn">Si no se despacha en {DISPATCH_HOURS} h, la venta se cancela sola y no cobramos comisión.</InfoNote>}
        <Label>Cuánto recibís</Label>
        <div style={card(t)}>
          <Line label="Precio del producto" value={c.money(s.price)} />
          {s.ship > 0 && <Line label={`Envío que pagó ${first}`} value={c.money(s.ship)} />}
          {st === 'cancelada' ? <Line label="Devuelto al comprador" value={c.neg(k.refund)} /> : (
            <>
              {k.refund > 0 && <Line label="Reembolso al comprador" value={c.neg(k.refund)} />}
              {k.member ? <Line label={`Comisión (${planName(c.plan)})`} value={c.money(0)} /> : k.gross > 0 && <Line label={`Comisión ${k.pct} %${k.clamp === 'min' ? ' (mínimo)' : k.clamp === 'cap' ? ' (tope)' : ''}`} value={c.neg(k.gross)} />}
              {k.welcome > 0 && <Line label="Bonificación de bienvenida" value={c.money(k.welcome)} />}
            </>
          )}
          <div style={{ height: 1, background: t.border }} />
          <Line label={st === 'pendiente' ? 'Vas a recibir' : st === 'reclamo' ? 'Retenido por el reclamo' : 'Recibís'} value={c.money(k.net)} strong />
          {st !== 'cancelada' && <span style={{ font: R(13), color: t.text2, ...pretty }}>{k.member ? `Con ${planName(c.plan)} esta venta no paga comisión.` : k.welcome ? 'Es una de tus 3 primeras ventas: no pagás comisión.' : `La comisión de ${c.money(k.fee)} incluye IVA (${c.money(k.iva)}). Va en tu factura del mes.`}</span>}
        </div>
        <Label>Tu dinero</Label>
        <ol aria-label="Estado del dinero" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
          {steps.map(([label, sub, done], i) => (
            <li key={label} aria-current={i === cur ? 'step' : undefined} style={{ display: 'flex', gap: 12 }}>
              <span style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24 }}>
                <span style={{ width: 24, height: 24, borderRadius: 12, background: done ? t.green : t.mSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{done && <Icon name="check" size={14} color={t.onGreen} />}</span>
                <span style={{ flex: 1, width: 2, minHeight: 20, background: i === steps.length - 1 ? 'transparent' : steps[i + 1]?.[2] ? t.green : t.border }} />
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 12 }}>
                <span style={{ font: R(15, i === cur ? 500 : 400), color: done ? t.text : t.text2 }}>{label}</span>
                <span style={{ font: R(13), color: t.text2 }}>{String(sub).replace('{cuenta}', c.acct)}</span>
              </span>
            </li>
          ))}
        </ol>
        {st === 'pendiente' && <span style={{ font: R(13), color: t.text2 }}>Si {first} no confirma ni reclama, lo liberamos {HOLD_DAYS} días después de entregado.</span>}
      </Pad>
    </MScreen>
  );
}

/* ================= C6 Retirar ================= */
export function C6() {
  const { t, back, go } = useApp();
  const c = useCobros();
  const receive = Math.max(0, c.disp - c.fee);
  const confirm = () => {
    c.setCobros({ withdrawn: c.cobros.withdrawn + c.disp, payCount: c.cobros.payCount + 1, lastPayout: receive, newPayouts: [{ when: 'Hoy', amount: receive, status: 'En camino' }, ...c.cobros.newPayouts] });
    go('C7', { replace: true });
  };
  return (
    <MScreen footer={<MFooter><Button onClick={confirm}>Retirar {c.money(receive)}</Button></MFooter>}>
      <MTopBar title="Retirar dinero" onBack={back} />
      <Pad>
        <span style={{ font: R(13), color: t.text2 }}>Vas a retirar todo lo disponible</span>
        <span style={{ font: P(32), marginTop: -12 }}>{c.money(c.disp)}</span>
        <Label>A dónde</Label>
        <ListRow icon="creditCard" title={c.acct} subtitle="A tu nombre · verificada" onClick={() => go('C8')} trailing={<Icon name="chevronRight" size={18} color={t.text2} />} />
        <div style={card(t)}>
          <Line label="Disponible" value={c.money(c.disp)} />
          <Line label="Costo del retiro" value={c.fee ? c.money(c.fee) : 'Gratis'} />
          <div style={{ height: 1, background: t.border }} />
          <Line label="Te llega" value={c.money(receive)} strong />
          <span style={{ font: R(13), color: t.text2 }}>En {PAYOUT.eta}. {c.fee ? `Ya usaste el retiro gratis de esta semana.` : 'Tenés 1 retiro gratis esta semana.'}</span>
        </div>
        <InfoNote>El mínimo para retirar es {c.money(PAYOUT.min)}. Solo transferimos a cuentas a tu nombre.</InfoNote>
      </Pad>
    </MScreen>
  );
}

/* ================= C7 Retiro en camino ================= */
export function C7() {
  const { t, go } = useApp();
  const c = useCobros();
  return (
    <MScreen footer={<MFooter><Button onClick={() => go('C4', { replace: true })}>Volver a ventas y cobros</Button></MFooter>}>
      <div style={{ padding: '72px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
        <span style={{ width: 88, height: 88, borderRadius: 44, background: t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="wallet" size={40} color={t.success} /></span>
        <span style={{ font: P(28) }}>Retiro en camino</span>
        <span style={{ font: R(15), color: t.text2, ...pretty }}>Te llegan {c.money(c.cobros.lastPayout || 488000)} a {c.acct} en {PAYOUT.eta}. Te avisamos cuando se acredite.</span>
      </div>
    </MScreen>
  );
}

/* ================= C8 Cuenta de cobro ================= */
export function C8() {
  const { t, back, showToast } = useApp();
  const c = useCobros();
  const fields: [string, string][] = c.ar
    ? [['Cuenta', 'Mercado Pago'], ['CVU', '0000 0031 •••• 2207'], ['Titular', 'Lucía Giménez · DNI 34.512.330']]
    : [['Banco', 'Banco Itaú'], ['Número de cuenta', '•••• •••• 4410'], ['Titular', 'Lucía Giménez · CI 4.512.330']];
  return (
    <MScreen footer={<MFooter><Button onClick={() => { back(); showToast('Guardamos tu cuenta de cobro'); }}>Guardar cuenta</Button></MFooter>}>
      <MTopBar title="Cuenta de cobro" onBack={back} />
      <Pad gap={14}>
        {fields.map(([l, v]) => (
          <label key={l} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ font: R(14, 500) }}>{l}</span>
            <span style={{ minHeight: 52, padding: '14px 16px', boxSizing: 'border-box', borderRadius: 12, boxShadow: `inset 0 0 0 1px ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', font: R(15) }}>{v}<Icon name="edit" size={16} color={t.text2} /></span>
          </label>
        ))}
        <InfoNote>La cuenta tiene que estar a tu nombre, el mismo que verificaste. No transferimos a cuentas de otras personas.</InfoNote>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ font: R(15, 500) }}>Retiro automático</span>
            <span style={{ font: R(13), color: t.text2 }}>Todos los {PAYOUT.autoDay} transferimos lo disponible.</span>
          </span>
          <button role="switch" aria-checked={c.cobros.autoPay} aria-label="Retiro automático" onClick={() => c.setCobros({ autoPay: !c.cobros.autoPay })} style={{ flex: 'none', width: 52, height: 32, borderRadius: 16, background: c.cobros.autoPay ? t.green : t.mChip, padding: 4, boxSizing: 'border-box', display: 'flex', justifyContent: c.cobros.autoPay ? 'flex-end' : 'flex-start' }}>
            <span style={{ width: 24, height: 24, borderRadius: 12, background: '#FFFFFF' }} />
          </button>
        </div>
      </Pad>
    </MScreen>
  );
}

/* ================= C2 Tarifas y comisiones ================= */
export function C2() {
  const { t, back, go } = useApp();
  const c = useCobros();
  const ex = calcSale({ price: 300000, cat: 'hogar', plan: 'comision' });
  return (
    <MScreen footer={<MFooter><Button kind="secondary" onClick={() => go('C3')}>Comparar las dos opciones</Button></MFooter>}>
      <MTopBar title="Tarifas y comisiones" onBack={back} />
      <Pad>
        <span style={{ font: P(22), ...pretty }}>Publicar es gratis. Elegí cómo pagar cuando vendés.</span>
        <div style={card(t)}>
          <span style={{ font: R(13), color: t.text2 }}>Ejemplo: vendés una mesa de {c.money(300000)} (Hogar)</span>
          <Line label="B · Con comisión recibís" value={c.money(ex.net)} />
          <Line label="A · Con membresía recibís" value={c.money(300000)} />
          <span style={{ font: R(13), color: t.text2 }}>Hoy tenés: {planName(c.plan)}.</span>
        </div>
        {rules(c.money, c.ar ? 'cuenta (CVU o CBU)' : 'cuenta bancaria').map((r) => (
          <div key={r.title} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ font: P(18) }}>{r.title}</span>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, font: R(14) }}>
              {r.items.map((x) => <li key={x} style={pretty}>{x}</li>)}
            </ul>
          </div>
        ))}
      </Pad>
    </MScreen>
  );
}

/* ================= C3 Cómo pagás: A · membresía o B · comisión ================= */
function Option({ k, pick, current, onPick, title, price, detail, children }: { k: Plan; pick: Plan; current: Plan; onPick: (k: Plan) => void; title: string; price: string; detail: string; children?: ReactNode }) {
  const { t } = useApp();
  const on = k === pick;
  return (
    <button role="radio" aria-checked={on} className="press" onClick={() => onPick(k)} style={{ textAlign: 'left', borderRadius: 16, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start', background: t.mSurface, boxShadow: on ? `inset 0 0 0 2px ${t.chipSelBg}` : 'none' }}>
      <span style={{ flex: 'none', width: 22, height: 22, marginTop: 2, borderRadius: 11, boxShadow: `inset 0 0 0 2px ${on ? t.chipSelBg : t.text3}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {on && <span style={{ width: 10, height: 10, borderRadius: 5, background: t.chipSelBg }} />}
      </span>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ font: P(16) }}>{title}</span>
          {k === current && <span style={{ font: R(12, 500), color: t.success, background: t.greenSoft, borderRadius: 10, padding: '2px 8px' }}>Tu plan</span>}
        </span>
        <span style={{ font: R(15, 500) }}>{price}</span>
        <span style={{ font: R(13), color: t.text2, ...pretty }}>{detail}</span>
        {children}
      </span>
    </button>
  );
}

export function C3() {
  const { t, back, showToast } = useApp();
  const c = useCobros();
  const pick = c.cobros.planPick ?? c.plan;
  const rank = (p: Plan) => tierOf(p)?.usd ?? 0;
  const apply = () => {
    if (pick === c.plan) return back();
    const now = rank(pick) > rank(c.plan);
    if (now) c.setPlan(pick);
    c.setCobros({ planNext: now ? null : pick, planPick: null });
    back();
    showToast(now ? `Listo: ${planName(pick)}. Desde ahora no pagás comisión` : `Pasás a ${planName(pick)} cuando termine el mes`);
  };
  const ex = calcSale({ price: 300000, cat: 'hogar', plan: 'comision' });
  const oct = MONTHS[1];
  const onPick = (k: Plan) => c.setCobros({ planPick: k });
  return (
    <MScreen footer={<MFooter><Button onClick={apply}>{pick === c.plan ? `Seguir con ${planName(c.plan)}` : `Elegir ${planName(pick)}`}</Button></MFooter>}>
      <MTopBar title="Cómo pagás al vender" onBack={back} />
      <Pad gap={12}>
        <span style={{ font: R(14), color: t.text2, ...pretty }}>Elegí entre pagar una membresía fija sin comisiones o pagar solo cuando vendés.</span>
        <div role="radiogroup" aria-label="Formas de pago" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Label>A · Membresía sin comisión</Label>
          <span style={{ font: R(13), color: t.text2, marginTop: -6, ...pretty }}>Pagás un monto fijo por mes y ninguna venta paga comisión. El nivel define cuántas publicaciones activas tenés.</span>
          {TIERS.map((x) => (
            <Option key={x.key} k={x.key} pick={pick} current={c.plan} onPick={onPick} title={x.name} price={`${usd(x.usd)} por mes`} detail={`${limitTxt(x.key)}. ${x.perks.join('. ')}.`} />
          ))}
          <span style={{ font: R(13), color: t.text2, ...pretty }}>En octubre vendiste por {c.money(monthTotals(oct, 'comision').sold)}: con comisión pagaste {c.money(commissionOf(oct))}. Con membresía, {c.money(0)} de comisión.</span>
          <span style={{ marginTop: 8 }}><Label>B · Comisión por venta</Label></span>
          <Option k="comision" pick={pick} current={c.plan} onPick={onPick} title="Comisión por venta" price="Sin costo fijo" detail={`${limitTxt('comision')}. Pagás un % solo cuando vendés con compra protegida.`}>
            <span style={{ font: R(13), color: t.text2 }}>Ej.: en una venta de {c.money(300000)} (Hogar) pagás {c.money(ex.fee)} y recibís {c.money(ex.net)}.</span>
          </Option>
        </div>
        <InfoNote>Pasar a membresía o subir de nivel aplica al instante. Bajar o volver a comisión, al terminar el mes. La membresía se cobra en dólares con tu tarjeta.</InfoNote>
      </Pad>
    </MScreen>
  );
}

/* ================= C9 Resumen y facturas ================= */
export function C9() {
  const { t, back, showToast } = useApp();
  const c = useCobros();
  return (
    <MScreen>
      <MTopBar title="Resumen y facturas" onBack={back} />
      <Pad>
        <span style={{ font: R(14), color: t.text2, ...pretty }}>{c.member ? `Con ${planName(c.plan)} tus ventas no pagan comisión. La membresía se factura aparte, en dólares.` : 'Cada mes te mandamos una factura electrónica con el total de comisiones. El IVA ya está incluido.'}</span>
        {MONTHS.map((m) => {
          const r = monthTotals(m, c.plan);
          return (
            <div key={m.key} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Label>{m.label}</Label>
              <div style={card(t)}>
                <Line label={`Vendiste (${r.count})`} value={c.money(r.sold)} />
                <Line label="Comisiones" value={c.money(r.fee)} />
                {r.membershipUsd ? <Line label={planName(c.plan)} value={usd(r.membershipUsd)} /> : <Line label="IVA incluido" value={c.money(r.iva)} />}
                <div style={{ height: 1, background: t.border }} />
                <Line label="Total facturado" value={r.membershipUsd ? usd(r.membershipUsd) : c.money(r.fee)} strong />
                {m.key === 'nov'
                  ? <span style={{ font: R(13), color: t.text2 }}>La factura sale el 1 de diciembre.</span>
                  : <button style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, font: R(14, 500), color: t.link }} onClick={() => showToast('Te mandamos la factura por correo')}><Icon name="download" size={16} color={t.link} />Recibir la factura por correo</button>}
              </div>
            </div>
          );
        })}
      </Pad>
    </MScreen>
  );
}

/** C1: la línea «Recibís» debajo del precio en Publicar 2 (V17). */
export function RecibisNote({ priceGs, category }: { priceGs: number; category: CatKey }) {
  const { go } = useApp();
  const c = useCobros();
  const k = calcSale({ price: priceGs, cat: category, plan: c.plan });
  return (
    <InfoNote icon="wallet">
      Fase 2 · Con compra protegida: {c.member ? `no pagás comisión (${planName(c.plan)})` : `comisión ${rateLabel(c.plan, category)} (${c.neg(k.fee)})`}. <b>Recibís {c.money(k.net)}</b>.{' '}
      <button style={{ font: R(14, 500), color: 'inherit', textDecoration: 'underline' }} onClick={() => go('C2')}>Cómo cobramos</button>
    </InfoNote>
  );
}
