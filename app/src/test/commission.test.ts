import { describe, expect, it } from 'vitest';
import { balances, calcSale, catKey, CAP_FEE, commissionOf, ivaOf, limitOf, MIN_FEE, monthTotals, MONTHS, planName, rules, SALES, saleCalc } from '../commission';

const gs = (n: number) => 'Gs. ' + n;

describe('cobro al vendedor', () => {
  it('B · comisión por venta: % por categoría con mínimo y tope', () => {
    expect(calcSale({ price: 300000, cat: 'hogar', plan: 'comision' })).toMatchObject({ fee: 30000, net: 270000, pct: 10 });
    expect(calcSale({ price: 20000, cat: 'tecnologia', plan: 'comision' })).toMatchObject({ fee: MIN_FEE, clamp: 'min' });
    expect(calcSale({ price: 9000000, cat: 'ropa', plan: 'comision' })).toMatchObject({ fee: CAP_FEE, clamp: 'cap' });
  });

  it('A · membresía: ninguna venta paga comisión', () => {
    for (const plan of ['emprendedor', 'comercio', 'negocio'] as const) {
      expect(calcSale({ price: 300000, cat: 'hogar', plan })).toMatchObject({ fee: 0, net: 300000, member: true });
    }
    expect(monthTotals(MONTHS[0], 'negocio')).toMatchObject({ fee: 0, membershipUsd: 80 });
    expect(commissionOf(MONTHS[0])).toBeGreaterThan(0);
    expect(planName('negocio')).toBe('Membresía Negocio');
  });

  it('los niveles definen las publicaciones activas', () => {
    expect(limitOf('comision')).toBe(10);
    expect(limitOf('emprendedor')).toBe(15);
    expect(limitOf('comercio')).toBe(50);
    expect(limitOf('negocio')).toBeNull();
  });

  it('el envío va entero al vendedor y no comisiona', () => {
    const c = calcSale({ price: 250000, cat: 'hogar', ship: 25000, plan: 'comision' });
    expect(c).toMatchObject({ paid: 275000, fee: 25000, net: 250000 });
  });

  it('con comisión, las primeras 3 ventas no pagan', () => {
    expect(calcSale({ price: 300000, cat: 'hogar', plan: 'comision', saleIndex: 2 })).toMatchObject({ gross: 30000, welcome: 30000, fee: 0 });
    expect(calcSale({ price: 300000, cat: 'hogar', plan: 'comision', saleIndex: 3 }).fee).toBe(30000);
  });

  it('reembolso parcial baja la comisión en proporción; cancelada no cobra nada', () => {
    expect(calcSale({ price: 450000, cat: 'ropa', plan: 'comision', refund: 100000 })).toMatchObject({ base: 350000, fee: 42000, net: 308000 });
    expect(calcSale({ price: 120000, cat: 'hogar', ship: 25000, plan: 'comision', cancelled: true })).toMatchObject({ fee: 0, net: 0, refund: 145000 });
  });

  it('IVA incluido, categorías del clásico, saldos y reglas', () => {
    expect(ivaOf(11000)).toBe(1000);
    expect(catKey('Tecnología')).toBe('tecnologia');
    expect(catKey('Cualquiera')).toBe('otros');
    const b = balances('comision');
    const net = (id: string) => saleCalc(SALES.find((s) => s.id === id)!, 'comision').net;
    expect(b.disponible).toBe(net('v5') + net('v3'));
    expect(balances('negocio').disponible).toBeGreaterThan(b.disponible);
    expect(rules(gs).map((r) => r.title)).toContain('A · Membresía');
  });
});
