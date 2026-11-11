/**
 * Cobro al vendedor del Market: reglas de negocio de ejemplo y cálculo, compartidos por el Market clásico y la Unificada.
 * Montos de ventas en guaraníes (cada universo convierte y formatea con su helper); las membresías se cobran en USD.
 *
 * Dos formas de pagar, para decidir entre ellas en la pantalla de planes:
 *  A. Membresía: suscripción mensual sin comisiones. El nivel define cuántas publicaciones activas podés tener.
 *  B. Comisión por venta: sin costo fijo; se cobra un % de cada venta con compra protegida.
 */

/** «comision» es la opción B; los demás son los niveles de la membresía (opción A). */
export type Plan = 'comision' | 'emprendedor' | 'comercio' | 'negocio';
export type Tier = Exclude<Plan, 'comision'>;
/** claves de categoría de la Unificada; el clásico usa los nombres (Ropa, Tecnología…) y pasa por `catKey`. */
export type CatKey = 'ropa' | 'tecnologia' | 'deportes' | 'hogar' | 'otros';

/* ---------------- Reglas (valores de ejemplo) ---------------- */

/** B · Comisión por venta: % según la categoría, con mínimo y tope por artículo. */
export const CAT_PCT: Record<CatKey, number> = { tecnologia: 8, deportes: 8, hogar: 10, ropa: 12, otros: 10 };
export const CAT_LABEL: Record<CatKey, string> = { tecnologia: 'Tecnología', deportes: 'Deportes', hogar: 'Hogar', ropa: 'Ropa', otros: 'Otros' };
export const MIN_FEE = 5000;
export const CAP_FEE = 300000;
/** publicaciones activas con la opción B */
export const COMMISSION_LIMIT = 10;

/** A · Membresía: niveles en USD por mes, sin comisión en ninguna venta. */
export interface TierInfo { key: Tier; name: string; usd: number; limit: number | null; perks: string[] }
export const TIERS: TierInfo[] = [
  { key: 'emprendedor', name: 'Emprendedor', usd: 20, limit: 15, perks: ['Sin comisión por venta', 'Stock por producto'] },
  { key: 'comercio', name: 'Comercio', usd: 45, limit: 50, perks: ['Sin comisión por venta', 'Perfil de negocio', '2 destacados por mes'] },
  { key: 'negocio', name: 'Negocio', usd: 80, limit: null, perks: ['Sin comisión por venta', 'Perfil de negocio con logo', 'Destacados ilimitados', 'Soporte prioritario'] },
];
export const tierOf = (p: Plan) => TIERS.find((x) => x.key === p);
export const isMember = (p: Plan) => p !== 'comision';
export const limitOf = (p: Plan) => (isMember(p) ? tierOf(p)!.limit : COMMISSION_LIMIT);
export const limitTxt = (p: Plan) => { const l = limitOf(p); return l == null ? 'Publicaciones sin límite' : `Hasta ${l} publicaciones activas`; };
export const usd = (n: number) => `USD ${n}`;
/** nombre corto del plan, p. ej. «Comisión por venta» o «Membresía Negocio» */
export const planName = (p: Plan) => (isMember(p) ? `Membresía ${tierOf(p)!.name}` : 'Comisión por venta');

/** opciones del visor: la forma de cobro con la que arranca la demo */
export const PLAN_OPTIONS: { key: Plan; label: string }[] = [
  { key: 'comision', label: 'B · Comisión por venta' },
  ...TIERS.map((x) => ({ key: x.key, label: `A · Membresía ${x.name} (${usd(x.usd)})` })),
];

/** Con comisión, las primeras ventas protegidas no pagan. */
export const WELCOME_SALES = 3;
/** Días que espera el dinero después de entregado si el comprador no confirma ni reclama. */
export const HOLD_DAYS = 5;
/** Máximo de días que se retiene el dinero de una venta con reclamo. */
export const CLAIM_MAX_DAYS = 10;
/** Horas para despachar antes de que la venta se cancele sola. */
export const DISPATCH_HOURS = 48;
export const PAYOUT = { min: 50000, extraFee: 3000, freePerWeek: 1, eta: '24 a 48 h hábiles', autoDay: 'lunes' };
export const IVA_PCT = 10;
export const SHIP_FEE = 25000;

/** Quién paga el envío: lo elige el vendedor al publicar y el comprador lo ve antes de comprar. */
export type ShipPay = 'vendedor' | 'comprador';
export const SHIP_LABEL: Record<ShipPay, string> = { vendedor: 'Envío gratis: lo paga el vendedor', comprador: 'Envío a cargo del comprador' };

export const catKey = (c: string): CatKey => {
  const n = c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  return (['ropa', 'tecnologia', 'deportes', 'hogar', 'otros'] as CatKey[]).includes(n as CatKey) ? (n as CatKey) : 'otros';
};

/* ---------------- Cálculo ---------------- */

export interface SaleInput {
  /** precio del producto (sin envío) */
  price: number;
  cat: CatKey;
  /** envío que paga el comprador y va entero al vendedor */
  ship?: number;
  plan: Plan;
  /** número de venta protegida del vendedor, desde 0 (con comisión, las primeras WELCOME_SALES son bonificadas) */
  saleIndex?: number;
  /** monto devuelto al comprador (reembolso parcial o total) */
  refund?: number;
  /** venta cancelada (no se despachó): no se cobra nada */
  cancelled?: boolean;
}

export interface SaleCalc {
  /** lo que pagó el comprador */
  paid: number;
  /** base de la comisión: lo que el vendedor se queda del producto */
  base: number;
  ship: number;
  refund: number;
  /** % aplicado (0 con membresía) */
  pct: number;
  /** comisión antes de la bonificación */
  gross: number;
  /** bonificación de bienvenida (se resta de la comisión) */
  welcome: number;
  /** comisión cobrada (IVA incluido) */
  fee: number;
  /** IVA incluido en la comisión */
  iva: number;
  /** lo que recibe el vendedor */
  net: number;
  /** la comisión quedó en el mínimo o en el tope */
  clamp: 'min' | 'cap' | null;
  /** con membresía no hay comisión */
  member: boolean;
}

export const ivaOf = (fee: number) => Math.round(fee / (100 + IVA_PCT) * IVA_PCT);

export function calcSale(i: SaleInput): SaleCalc {
  const ship = i.ship ?? 0;
  const refund = Math.min(i.refund ?? 0, i.price + ship);
  const paid = i.price + ship;
  const base = i.cancelled ? 0 : Math.max(0, i.price - refund);
  const member = isMember(i.plan);
  let pct = member || base <= 0 ? 0 : CAT_PCT[i.cat];
  let gross = 0;
  let clamp: SaleCalc['clamp'] = null;
  if (pct) {
    gross = Math.round(base * pct / 100);
    if (gross < MIN_FEE) { gross = Math.min(MIN_FEE, base); clamp = 'min'; }
    else if (gross > CAP_FEE) { gross = CAP_FEE; clamp = 'cap'; }
  } else pct = 0;
  const welcome = (i.saleIndex ?? WELCOME_SALES) < WELCOME_SALES ? gross : 0;
  const fee = gross - welcome;
  const keptShip = i.cancelled ? 0 : Math.max(0, ship - Math.max(0, refund - i.price));
  return { paid, base, ship: keptShip, refund: i.cancelled ? paid : refund, pct, gross, welcome, fee, iva: ivaOf(fee), net: i.cancelled ? 0 : base + keptShip - fee, clamp, member };
}

/** Texto corto de lo que se cobra, p. ej. «10 % por venta» o «sin comisión (Membresía Negocio)». */
export const rateLabel = (plan: Plan, cat: CatKey) => (isMember(plan) ? `sin comisión (${planName(plan)})` : `${CAT_PCT[cat]} % por venta`);

/* ---------------- Datos de ejemplo ---------------- */

export type SaleStatus = 'pendiente' | 'disponible' | 'reclamo' | 'parcial' | 'retirado' | 'cancelada';
export const STATUS_LABEL: Record<SaleStatus, string> = {
  pendiente: 'Pendiente', disponible: 'Disponible', reclamo: 'Con reclamo', parcial: 'Reembolso parcial', retirado: 'Retirado', cancelada: 'Cancelada',
};
export const STATUS_TONE: Record<SaleStatus, 'live' | 'success' | 'warning' | 'danger' | 'neutral'> = {
  pendiente: 'live', disponible: 'success', reclamo: 'warning', parcial: 'warning', retirado: 'neutral', cancelada: 'neutral',
};

export interface Sale {
  id: string;
  title: string;
  price: number;
  cat: CatKey;
  ship: number;
  buyer: string;
  buyerIni: string;
  when: string;
  status: SaleStatus;
  saleIndex: number;
  refund?: number;
  /** línea de tiempo del dinero: [título, detalle, hecho]; «{cuenta}» se reemplaza por la cuenta de cobro */
  steps: [string, string, boolean][];
}

export const SALES: Sale[] = [
  { id: 'v6', title: 'Mesa de luz de madera', price: 250000, cat: 'hogar', ship: SHIP_FEE, buyer: 'Andrea Villalba', buyerIni: 'AV', when: 'Hoy', status: 'pendiente', saleIndex: 6,
    steps: [['Pagado', 'Andrea pagó en la app. El dinero está protegido.', true], ['En camino', 'Despachaste el pedido hoy a las 15:20.', true], ['Entregado', 'Cuando Andrea confirme, o 5 días después sin reclamo.', false], ['Disponible', 'Lo podés retirar a tu cuenta.', false]] },
  { id: 'v5', title: 'Lámpara de pie con pantalla de tela', price: 180000, cat: 'hogar', ship: 0, buyer: 'Jorge Benítez', buyerIni: 'JB', when: 'Ayer', status: 'disponible', saleIndex: 5,
    steps: [['Pagado', '9 nov. · 10:12', true], ['Entregado', 'Jorge confirmó que lo recibió.', true], ['Disponible', 'Desde ayer a las 18:40.', true]] },
  { id: 'v4', title: 'Auriculares JBL inalámbricos', price: 320000, cat: 'tecnologia', ship: SHIP_FEE, buyer: 'Paula Riveros', buyerIni: 'PR', when: '8 nov.', status: 'reclamo', saleIndex: 4,
    steps: [['Pagado', '6 nov. · 09:30', true], ['Entregado', '7 nov. · 17:05', true], ['Reclamo abierto', 'Paula dice que un auricular no carga. Respondé antes del 18 nov.', true], ['Disponible', 'Cuando se resuelva el reclamo.', false]] },
  { id: 'v3', title: 'Campera de cuero talle S', price: 450000, cat: 'ropa', ship: 0, buyer: 'Sofía Duarte', buyerIni: 'SD', when: '5 nov.', status: 'parcial', saleIndex: 3, refund: 100000,
    steps: [['Pagado', '3 nov. · 12:00', true], ['Reembolso parcial', 'Acordaron con Sofía devolver una parte por un cierre roto.', true], ['Disponible', 'El resto quedó en tu saldo.', true]] },
  { id: 'v2', title: 'Raqueta de pádel Bullpadel', price: 290000, cat: 'deportes', ship: 0, buyer: 'Marcos Insfrán', buyerIni: 'MI', when: '2 nov.', status: 'retirado', saleIndex: 2,
    steps: [['Pagado', '30 oct. · 16:45', true], ['Entregado', '31 oct. · 11:20', true], ['Disponible', '31 oct. · 11:20', true], ['Retirado', '{cuenta} · 3 nov.', true]] },
  { id: 'v1', title: 'Juego de sábanas 2 plazas', price: 120000, cat: 'hogar', ship: SHIP_FEE, buyer: 'Lorena Gaona', buyerIni: 'LG', when: '30 oct.', status: 'cancelada', saleIndex: -1,
    steps: [['Pagado', '28 oct. · 08:10', true], ['Cancelada', 'No se despachó en 48 h. Le devolvimos todo a Lorena y no cobramos comisión.', true]] },
];

export const saleCalc = (s: Sale, plan: Plan) =>
  calcSale({ price: s.price, cat: s.cat, ship: s.ship, plan, saleIndex: s.saleIndex, refund: s.refund, cancelled: s.status === 'cancelada' });

/** Saldos del vendedor según el estado de cada venta. */
export function balances(plan: Plan) {
  let disponible = 0, pendiente = 0, retenido = 0;
  for (const s of SALES) {
    const c = saleCalc(s, plan);
    if (s.status === 'disponible' || s.status === 'parcial') disponible += c.net;
    else if (s.status === 'pendiente') pendiente += c.net;
    else if (s.status === 'reclamo') retenido += c.net;
  }
  return { disponible, pendiente, retenido };
}

export const PAYOUTS = [
  { when: '3 nov.', amount: 290000, status: 'Acreditado' },
  { when: '20 oct.', amount: 515000, status: 'Acreditado' },
];

/** Meses para el resumen y las facturas: ventas de cada mes [precio, categoría, índice de venta]. */
export const MONTHS: { key: string; label: string; sales: [number, CatKey, number][] }[] = [
  { key: 'nov', label: 'Noviembre 2026 (en curso)', sales: [[250000, 'hogar', 6], [180000, 'hogar', 5], [320000, 'tecnologia', 4], [350000, 'ropa', 3]] },
  { key: 'oct', label: 'Octubre 2026', sales: [[290000, 'deportes', 2], [300000, 'hogar', 1], [215000, 'tecnologia', 0]] },
];
export function monthTotals(m: (typeof MONTHS)[number], plan: Plan) {
  let sold = 0, fee = 0;
  for (const [price, cat, idx] of m.sales) { sold += price; fee += calcSale({ price, cat, plan, saleIndex: idx }).fee; }
  return { sold, count: m.sales.length, fee, iva: ivaOf(fee), membershipUsd: isMember(plan) ? tierOf(plan)!.usd : 0 };
}

/** Lo que te hubiera costado el mes con comisión, para comparar con la membresía. */
export const commissionOf = (m: (typeof MONTHS)[number]) => monthTotals(m, 'comision').fee;

/* ---------------- Reglas para mostrar ---------------- */

export interface RuleSection { title: string; items: string[] }

/** Reglas de negocio de ejemplo, en el idioma de la app. `money` formatea guaraníes en la moneda del país. */
export function rules(money: (gs: number) => string, bank = 'cuenta bancaria'): RuleSection[] {
  return [
    { title: 'Dos formas de pagar', items: [
      'A. Membresía: pagás un monto fijo por mes y no pagás comisión en ninguna venta. El nivel define cuántas publicaciones activas podés tener.',
      `B. Comisión por venta: no pagás nada fijo y te cobramos un % solo cuando vendés con compra protegida. ${limitTxt('comision')}.`,
      'Podés cambiar cuando quieras. Pasar a membresía o subir de nivel aplica al instante; bajar o volver a comisión, al terminar el mes.',
    ] },
    { title: 'A · Membresía', items: [
      ...TIERS.map((x) => `${x.name}: ${usd(x.usd)} por mes. ${x.limit == null ? 'Publicaciones sin límite' : `Hasta ${x.limit} publicaciones activas`}.`),
      'Se cobra en dólares con tu tarjeta, al tipo de cambio del día, el mismo día de cada mes.',
      'Si bajás de nivel y tenés más publicaciones que el nuevo límite, elegís cuáles pausar.',
      'Si el pago no pasa, te avisamos y por 7 días seguís con la membresía; después volvés a comisión por venta.',
    ] },
    { title: 'B · Comisión por venta', items: [
      `Según la categoría: ${(Object.keys(CAT_PCT) as CatKey[]).map((k) => `${CAT_LABEL[k]} ${CAT_PCT[k]} %`).join(', ')}.`,
      `Mínimo ${money(MIN_FEE)} y tope ${money(CAP_FEE)} por artículo. Tus primeras ${WELCOME_SALES} ventas no pagan comisión.`,
      'Se calcula sobre el precio del producto; el envío que paga el comprador es todo tuyo.',
      `La comisión incluye IVA ${IVA_PCT} % y se descuenta sola antes de liberarte el dinero. Te mandamos la factura una vez por mes.`,
      'Publicar, responder consultas y vender en persona con pago por fuera no paga comisión.',
    ] },
    { title: 'Envío y stock', items: [
      'Al publicar elegís si el envío lo pagás vos (envío gratis para el comprador) o el comprador. Él lo ve antes de comprar.',
      'Cargás el stock de cada producto. Cada venta descuenta una unidad; con 0 la publicación se ve «Sin stock» y no se puede comprar.',
    ] },
    { title: 'Cuándo te llega el dinero', items: [
      `Queda pendiente hasta que el comprador confirma que lo recibió, o ${HOLD_DAYS} días después de entregado sin reclamo.`,
      `Si no despachás en ${DISPATCH_HOURS} h, la venta se cancela y le devolvemos todo al comprador. Con 3 cancelaciones en 30 días revisamos tu cuenta.`,
      `Con un reclamo abierto, retenemos el dinero de esa venta hasta resolverlo (máximo ${CLAIM_MAX_DAYS} días). Si se devuelve todo, no hay comisión; si se devuelve una parte, baja en proporción.`,
    ] },
    { title: 'Retiros', items: [
      `Solo a una ${bank} a tu nombre, la misma identidad que verificaste.`,
      `Mínimo ${money(PAYOUT.min)}. Un retiro gratis por semana; los demás cuestan ${money(PAYOUT.extraFee)}. Llega en ${PAYOUT.eta}. Podés activar el retiro automático los ${PAYOUT.autoDay}.`,
    ] },
    { title: 'Cambios', items: ['Si cambiamos precios o comisiones te avisamos con 30 días. Aplican desde el mes siguiente.'] },
  ];
}
