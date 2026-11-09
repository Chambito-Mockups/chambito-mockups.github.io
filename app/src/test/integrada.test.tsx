import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';
import { IG_SCREENS, IgScreen, IntegradaHandle, IntegradaPhone } from '../integrada/IntegradaPhone';
import { IG_ENTRIES } from '../integrada/IntegradaPage';

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
  it('el menú del visor tiene todas las pantallas, con claves únicas', () => {
    expect([...new Set(IG_ENTRIES.map((x) => x.screen))].sort()).toEqual([...ALL].sort());
    expect(new Set(IG_ENTRIES.map((x) => x.key)).size).toBe(IG_ENTRIES.length);
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

describe('app integrada: selector de sección', () => {
  const SEL = 'Selector de sección';
  const bar = () => screen.getByRole('navigation', { name: 'Navegación principal' });

  it('la barra es Inicio · Actividad · Perfil y cada portada tiene el selector', () => {
    phone({ navegacion: SEL });
    expect(within(bar()).getAllByRole('button').map((b) => b.textContent)).toEqual(['Inicio', 'Actividad', 'Perfil']);
    expect(screen.getByRole('button', { name: 'Sección: Servicios. Cambiar de sección' })).toBeInTheDocument();
  });

  it('el explorador cambia de sección, marca la actual e Inicio vuelve a la última usada', () => {
    phone({ navegacion: SEL });
    tap('Sección: Servicios. Cambiar de sección');
    const sheet = screen.getByRole('dialog', { name: 'Explorá Chambito' });
    expect(within(sheet).getByRole('listitem', { name: /^Servicios: .*estás acá/ })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(within(sheet).getByRole('listitem', { name: /^Chambito Market/ }));
    expect(shown()).toBe('tienda');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(within(bar()).getByRole('button', { name: 'Inicio' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Sección: Market. Cambiar de sección' })).toBeInTheDocument();

    fireEvent.click(within(bar()).getByRole('button', { name: 'Actividad' }));
    expect(shown()).toBe('actividad');
    fireEvent.click(within(bar()).getByRole('button', { name: 'Inicio' }));
    expect(shown()).toBe('tienda');
  });

  it('cerrar el explorador no cambia de sección', () => {
    phone({ navegacion: SEL, pantallaInicial: 'Auto' });
    tap('Sección: Auto. Cambiar de sección');
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Explorá Chambito' })).getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(shown()).toBe('auto');
  });
});

describe('app integrada: categorías de la Tienda en mosaicos', () => {
  it('dos por fila, y la elegida entera en negro (nunca verde) filtra la Tienda', () => {
    phone({ pantallaInicial: 'Tienda', categorias: 'Mosaicos' });
    const group = screen.getByRole('group', { name: 'Categorías' });
    expect(group.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
    const hogar = within(group).getByRole('button', { name: 'Hogar' });
    fireEvent.click(hogar);
    expect(hogar).toHaveAttribute('aria-pressed', 'true');
    expect(hogar.style.background).toBe('rgb(0, 0, 0)');
    expect(hogar.style.color).toBe('rgb(255, 255, 255)');
  });
});

describe('app integrada en el visor', () => {
  const menu = () => screen.getByRole('navigation', { name: 'Pantallas de la app integrada' });

  it('el menú abre las pantallas del selector con su hoja, y anterior / siguiente lo recorren', () => {
    window.location.hash = '#integrada/X1';
    render(<App />);
    expect(shown()).toBe('inicio');
    expect(within(menu()).getByRole('button', { name: /Portada de Servicios/ })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente: Explorador desde Servicios' }));
    expect(screen.getByRole('dialog', { name: 'Explorá Chambito' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#integrada/X2s');
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(shown()).toBe('auto');
    expect(screen.getByRole('button', { name: 'Sección: Auto. Cambiar de sección' })).toBeInTheDocument();
    fireEvent.click(within(menu()).getByRole('button', { name: /Explorador desde Market/ }));
    expect(shown()).toBe('tienda');
    expect(within(screen.getByRole('dialog', { name: 'Explorá Chambito' })).getByRole('listitem', { name: /^Chambito Market: .*estás acá/ })).toBeInTheDocument();
  });

  it('un enlace a una pantalla del menú la abre con su hoja', () => {
    window.location.hash = '#integrada/X2m';
    render(<App />);
    expect(shown()).toBe('tienda');
    expect(screen.getByRole('dialog', { name: 'Explorá Chambito' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#integrada/X2m');
  });

  it('la búsqueda filtra el menú', () => {
    window.location.hash = '#integrada';
    render(<App />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Buscar en la app integrada' }), { target: { value: 'conductor' } });
    expect(within(menu()).getAllByRole('button').map((b) => b.textContent)).toEqual(['Conductor']);
  });

  it('se abre desde la barra de arriba y con #integrada, y el índice salta a cada pantalla', () => {
    window.location.hash = '';
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'App integrada' }));
    expect(window.location.hash).toMatch(/^#integrada\//);
    const index = screen.getByRole('navigation', { name: 'Pantallas de la app integrada' });
    fireEvent.click(within(index).getByRole('button', { name: 'Ficha del producto' }));
    expect(shown()).toBe('ficha');
    expect(within(index).getByRole('button', { name: 'Ficha del producto' })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('radio', { name: 'Oscuro' }));
    expect(document.querySelector('.ig')).toHaveAttribute('data-theme', 'dark');
  });
});

describe('app integrada: reglas del sistema de diseño (brief del 09/11/2026)', () => {
  const GREEN = 'rgb(75, 172, 79)';
  const WHITE = 'rgb(255, 255, 255)';
  const POPPINS = new Set([32, 28, 22, 18, 16, 14]); // display, titleLg, titleMd, titleSm, subtitle/button, buttonSm
  const ROBOTO = new Set([18, 17, 15, 14, 13, 12]); // lead, bodyLg, body, label, caption, captionStrong
  const styled = () => [...document.querySelectorAll<HTMLElement>('.ig [style]')];

  const cases = ALL.flatMap((id) => [[id, false], [id, true]] as const);
  it.each(cases)('%s (oscuro: %s)', (id, dark) => {
    const ref = phone({ dark, navegacion: 'Selector de sección', faseMarket: 'Fase 2 · compra protegida' });
    act(() => ref.current!.jump(id));
    for (const el of styled()) {
      const s = el.style;
      // sobre verde, siempre blanco
      if (s.background === GREEN || s.backgroundColor === GREEN) {
        if (el.textContent?.trim() || el.querySelector('.i')) expect(s.color, `${id}: ${el.textContent}`).toBe(WHITE);
        // chips, segmentos y pestañas elegidos nunca en verde
        expect(el.getAttribute('aria-pressed'), `${id}: ${el.textContent}`).not.toBe('true');
        expect(el.getAttribute('aria-selected')).not.toBe('true');
        expect(el.getAttribute('aria-current')).not.toBe('page');
      }
      // escala tipográfica
      const m = /^(\d00) (\d+)px\/\S+ (Poppins|Roboto)/.exec(s.font);
      if (m) {
        const [, w, size, fam] = m;
        if (fam === 'Poppins') { expect(w).toBe('700'); if (!s.font.includes('px/1 ')) expect(POPPINS.has(+size), `${id}: Poppins ${size}`).toBe(true); }
        else expect(ROBOTO.has(+size), `${id}: Roboto ${size}`).toBe(true);
      }
      if (s.fontSize) expect(parseInt(s.fontSize, 10), `${id}: ${el.textContent}`).toBeGreaterThanOrEqual(12);
    }
  });

  it('el detector de verde funciona (los chequeos de arriba no están vacíos)', () => {
    const ref = phone({ faseMarket: 'Fase 2 · compra protegida' });
    act(() => ref.current!.jump('ficha'));
    const greens = styled().filter((el) => el.style.background === GREEN || el.style.backgroundColor === GREEN);
    expect(greens.length).toBeGreaterThan(0);
    expect(greens.some((el) => el.textContent?.includes('Comprar'))).toBe(true);
  });

  it('la barra inferior flota a 20 de los lados, mide 72 y marca la activa sin fondo', () => {
    phone({ navegacion: 'Selector de sección' });
    const bar = screen.getByRole('navigation', { name: 'Navegación principal' });
    expect(bar.style.height).toBe('72px');
    expect(bar.style.borderRadius).toBe('16px');
    expect(bar.parentElement!.style.left).toBe('20px');
    expect(bar.parentElement!.style.right).toBe('20px');
    const active = within(bar).getByRole('button', { name: 'Inicio' });
    expect(active).toHaveAttribute('aria-current', 'page');
    expect(active.style.background).toBe('');
    expect(active.style.color).toBe('rgb(47, 122, 51)'); // #2F7A33
  });
});
