import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';
import { IG_SCREENS, IgScreen, IntegradaHandle, IntegradaPhone } from '../integrada/IntegradaPhone';
import { IG_INDEX } from '../integrada/IntegradaPage';

const ALL = Object.keys(IG_SCREENS) as IgScreen[];
const shown = () => document.querySelector('[data-screen-label]')?.getAttribute('data-screen-label');
const tap = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));

function phone(props: Parameters<typeof IntegradaPhone>[0] = {}) {
  const ref = createRef<IntegradaHandle>();
  render(<IntegradaPhone ref={ref} {...props} />);
  return ref;
}

afterEach(() => vi.useRealTimers());

describe('app integrada: las 38 pantallas', () => {
  it('el índice del visor tiene cada pantalla una sola vez', () => {
    const ids = IG_INDEX.flatMap((g) => g.items.map(([id]) => id));
    expect(ids.sort()).toEqual([...ALL].sort());
  });

  it.each(ALL.flatMap((id) => [[id, false], [id, true]] as const))('%s (oscuro: %s) se dibuja', (id, dark) => {
    const ref = phone({ dark });
    act(() => ref.current!.jump(id));
    expect(shown()).toBe(id);
    expect(document.querySelector('.ig')).toHaveAttribute('data-theme', dark ? 'dark' : 'light');
  });
});

describe('app integrada: recorridos', () => {
  it('pide un viaje y el viaje avanza solo hasta calificar', () => {
    vi.useFakeTimers();
    phone({ pantallaInicial: 'Auto' });
    expect(shown()).toBe('auto');
    act(() => { tap(/Paseo La Galería/); });
    expect(shown()).toBe('aPunto');
    act(() => { tap('Confirmar punto de encuentro'); });
    act(() => { tap('Pedir viaje'); });
    expect(shown()).toBe('viaje');
    expect(screen.getAllByText('Buscando conductor…').length).toBeGreaterThan(0);
    act(() => { vi.advanceTimersByTime(3500); });
    expect(screen.getAllByText('Tu conductor llega en 3 min').length).toBeGreaterThan(0);
    act(() => { vi.advanceTimersByTime(7000 + 6000 + 9000); });
    expect(shown()).toBe('aCalificar');
    expect(screen.getByText('¿Cómo estuvo tu viaje con Marcos?')).toBeInTheDocument();
  });

  it('consulta por chat y el vendedor responde', () => {
    vi.useFakeTimers();
    const ref = phone();
    act(() => ref.current!.jump('ficha'));
    act(() => { tap('Consultar'); });
    expect(shown()).toBe('chat');
    act(() => { tap('¿Último precio?'); });
    act(() => { vi.advanceTimersByTime(1600); });
    expect(screen.getByText(/Te lo dejo en Gs\./)).toBeInTheDocument();
  });

  it('en Fase 2 compra con pago protegido y sigue el pedido', () => {
    vi.useFakeTimers();
    const ref = phone({ faseMarket: 'Fase 2 · compra protegida' });
    act(() => ref.current!.jump('ficha'));
    act(() => { tap('Comprar'); });
    expect(shown()).toBe('carrito');
    act(() => { tap('Continuar'); });
    expect(shown()).toBe('confirmar');
    act(() => { tap(/^Pagar Gs\./); });
    expect(shown()).toBe('compraOk');
    act(() => { vi.advanceTimersByTime(10000); });
    expect(screen.getByRole('status')).toHaveTextContent('Tu compra está en camino');
  });

  it('el conductor se conecta, acepta la oferta, ingresa el PIN y cobra', () => {
    vi.useFakeTimers();
    phone({ pantallaInicial: 'Conductor' });
    expect(shown()).toBe('dHome');
    act(() => { tap('Conectarte'); });
    act(() => { vi.advanceTimersByTime(4000); });
    const offer = screen.getByRole('alertdialog', { name: 'Nuevo viaje' });
    act(() => { fireEvent.click(within(offer).getByRole('button', { name: 'Aceptar' })); });
    expect(shown()).toBe('dBuscar');
    act(() => { tap('Llegué'); });
    for (const d of '4827') act(() => { tap(d); });
    expect(shown()).toBe('dViaje');
    act(() => { tap('Finalizar viaje'); });
    expect(shown()).toBe('dCobro');
    act(() => { tap('Cobré · volver a disponible'); });
    expect(shown()).toBe('dHome');
  });

  it('un PIN equivocado no deja empezar el viaje', () => {
    const ref = phone({ pantallaInicial: 'Conductor' });
    act(() => ref.current!.jump('dPin'));
    for (const d of '1111') act(() => { tap(d); });
    expect(shown()).toBe('dPin');
  });

  it('la barra cambia según la navegación elegida', () => {
    phone({ navegacion: 'Combinación 1 · Auto y Tienda' });
    const bar = screen.getByRole('navigation', { name: 'Navegación principal' });
    expect(within(bar).getAllByRole('button').map((b) => b.textContent)).toEqual(['Inicio', 'Auto', 'Tienda', 'Actividad', 'Perfil']);
    fireEvent.click(within(bar).getByRole('button', { name: 'Tienda' }));
    expect(shown()).toBe('tienda');
  });
});

describe('app integrada en el visor', () => {
  it('se abre desde la barra de arriba y con #integrada, y el índice salta a cada pantalla', () => {
    window.location.hash = '';
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'App integrada' }));
    expect(window.location.hash).toBe('#integrada');
    const index = screen.getByRole('navigation', { name: 'Pantallas de la app integrada' });
    fireEvent.click(within(index).getByRole('button', { name: 'Ficha del producto' }));
    expect(shown()).toBe('ficha');
    expect(within(index).getByRole('button', { name: 'Ficha del producto' })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('radio', { name: 'Oscuro' }));
    expect(document.querySelector('.ig')).toHaveAttribute('data-theme', 'dark');
  });
});
