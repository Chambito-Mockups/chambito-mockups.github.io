import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { IntegradaHandle, IntegradaPhone } from '../integrada/IntegradaPhone';
import { balances, Plan, saleCalc, SALES } from '../commission';

const FASE2 = 'Fase 2 · compra protegida';
const shown = () => document.querySelector('[data-screen-label]')?.getAttribute('data-screen-label');
const gs = (n: number) => 'Gs. ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const tap = (name: string | RegExp) => act(() => { fireEvent.click(screen.getByRole('button', { name })); });

function phone(cobro: Plan = 'comision') {
  const ref = createRef<IntegradaHandle>();
  render(<IntegradaPhone ref={ref} faseMarket={FASE2} cobro={cobro} />);
  return ref;
}

describe('ventas y cobros (Unificada, fase 2)', () => {
  it('la venta pendiente se libera, suma al saldo y se retira', () => {
    const ref = phone();
    act(() => ref.current!.jump('venta', undefined, { saleId: 'v6' }));
    const net = saleCalc(SALES[0], 'comision').net;
    expect(screen.getByText('Vas a recibir')).toBeInTheDocument();
    tap('Simular: el comprador confirmó');
    expect(screen.getByText(`Andrea confirmó. Liberamos ${gs(net)} a tu saldo`)).toBeInTheDocument();
    act(() => ref.current!.jump('ventas'));
    const disp = balances('comision').disponible + net;
    tap(`Retirar ${gs(disp)}`);
    expect(shown()).toBe('retirar');
    tap(`Retirar ${gs(disp)}`);
    expect(shown()).toBe('retiroOk');
  });

  it('Publicar muestra cuánto recibís: con comisión o sin ella por la membresía', () => {
    const ref = phone('comision');
    act(() => ref.current!.jump('pub2'));
    expect(screen.getByText('Recibís Gs. 270.000')).toBeInTheDocument();
    act(() => ref.current!.jump('planes'));
    act(() => { fireEvent.click(screen.getByRole('radio', { name: /^Negocio/ })); });
    tap('Elegir Membresía Negocio');
    act(() => ref.current!.jump('pub2'));
    expect(screen.getByText('Recibís Gs. 300.000')).toBeInTheDocument();
    expect(screen.getByText(/Con tu membresía no pagás comisión/)).toBeInTheDocument();
  });

  it('publicar con stock y envío; la ficha muestra envío y stock al comprador', () => {
    const ref = phone();
    act(() => ref.current!.jump('pub2'));
    tap('Sumar una unidad');
    tap('Lo pago yo (envío gratis)');
    tap('Continuar');
    expect(screen.getByText(/Stock: 2 unidades/)).toBeInTheDocument();
    expect(screen.getByText('Envío gratis: lo pagás vos')).toBeInTheDocument();
    act(() => ref.current!.jump('ficha', undefined, { pid: 'notebook' }));
    expect(screen.getAllByText('Sin stock').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: 'Comprar' })).toBeNull();
    act(() => ref.current!.jump('ficha', undefined, { pid: 'nike' }));
    expect(screen.getByText('Envío gratis')).toBeInTheDocument();
    tap(/Ver el perfil de Fer Calzados/);
    expect(shown()).toBe('vendedor');
    expect(screen.getByText('Sobre el negocio')).toBeInTheDocument();
  });

  it('el vendedor baja el stock a 0 y la publicación queda sin stock', () => {
    const ref = phone();
    act(() => ref.current!.jump('misPubs'));
    tap('Restar una unidad de Mesa de luz de madera');
    tap('Restar una unidad de Mesa de luz de madera');
    expect(screen.getAllByText('Sin stock').length).toBeGreaterThan(0);
  });
});
