import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';
import { AutoV3Handle, AutoV3Phone } from '../autov3/AutoV3Phone';
import { V3_ENTRIES } from '../autov3/AutoV3Page';
import { Country } from '../autov3/model';

const shown = () => document.querySelector('[data-screen-label]')?.getAttribute('data-screen-label');
const tap = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));
function phone(country: Country = 'PY', dark = true, sim = true) {
  const ref = createRef<AutoV3Handle>();
  render(<AutoV3Phone ref={ref} country={country} dark={dark} sim={sim} />);
  return ref;
}
afterEach(() => vi.useRealTimers());

const GREEN = 'rgb(75, 172, 79)';
const WHITE = 'rgb(255, 255, 255)';

describe('Auto v3: cada pantalla y estado del lienzo', () => {
  const cases = V3_ENTRIES.flatMap((e) => (['PY', 'AR'] as const).map((c, i) => [e.key, e.title, c, i === 1] as const));
  it.each(cases)('%s · %s (%s, oscuro: %s)', (_key, _title, country, dark) => {
    const e = V3_ENTRIES.find((x) => x.key === _key)!;
    const ref = phone(country, dark, false);
    act(() => ref.current!.jump(e.screen, e.setup));
    expect(shown()).toBe(e.screen);
    expect(document.querySelector('.ig h1')?.textContent).toBeTruthy();
    // sobre verde, siempre blanco; lo elegido nunca en verde
    for (const el of document.querySelectorAll<HTMLElement>('.ig [style]')) {
      if (el.style.background !== GREEN && el.style.backgroundColor !== GREEN) continue;
      if (el.textContent?.trim() || el.querySelector('.i')) expect(el.style.color, `${_key}: ${el.textContent}`).toBe(WHITE);
      expect(el.getAttribute('aria-pressed')).not.toBe('true');
      expect(el.getAttribute('aria-selected')).not.toBe('true');
    }
    // sin botón de llamar (el contacto es por chat)
    expect(screen.queryByRole('button', { name: /Llamar a / })).toBeNull();
  });

  it('el menú tiene claves únicas', () => {
    expect(new Set(V3_ENTRIES.map((e) => e.key)).size).toBe(V3_ENTRIES.length);
  });
});

describe('Auto v3: recorridos', () => {
  it('pide un viaje en 3 pasos y el viaje avanza solo hasta calificar', () => {
    vi.useFakeTimers();
    phone();
    tap('¿A dónde vas?');
    expect(shown()).toBe('A2');
    tap(/Paseo La Galería/);
    expect(shown()).toBe('A3');
    tap('Confirmar punto de encuentro');
    expect(shown()).toBe('A4');
    fireEvent.click(screen.getByRole('radio', { name: /Confort/ }));
    expect(screen.getAllByText('Gs. 41.500')).toHaveLength(2); // la opción y el total
    tap('Pedir viaje');
    expect(shown()).toBe('A5');
    act(() => { vi.advanceTimersByTime(3500); });
    expect(shown()).toBe('A6');
    expect(screen.getByRole('group', { name: 'PIN de inicio: 4 8 2 7' })).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(7000); });
    expect(shown()).toBe('A7');
    act(() => { vi.advanceTimersByTime(6000); });
    expect(shown()).toBe('A8');
    act(() => { vi.advanceTimersByTime(9000); });
    expect(shown()).toBe('A9');
    tap('Enviar calificación');
    expect(screen.getByRole('status')).toHaveTextContent('Elegí de 1 a 5 estrellas');
    fireEvent.click(screen.getByRole('radio', { name: '2 estrellas' }));
    expect(screen.getByText('¿Qué pasó? (obligatorio)')).toBeInTheDocument();
    tap('Enviar calificación');
    expect(shown()).toBe('A9');
    fireEvent.click(screen.getByRole('button', { name: 'Llegó tarde' }));
    tap('Enviar calificación');
    expect(shown()).toBe('A0');
  });

  it('sin conductores cerca ofrece ampliar el radio', () => {
    vi.useFakeTimers();
    const ref = phone();
    act(() => ref.current!.jump('A5', { tripActive: true, noDrivers: true }));
    act(() => { vi.advanceTimersByTime(3500); });
    expect(shown()).toBe('A5b');
    tap('Aceptar y buscar');
    expect(shown()).toBe('A5');
  });

  it('Moto y Envío cambian la hoja de la portada', () => {
    phone();
    fireEvent.click(screen.getByRole('tab', { name: 'Moto' }));
    expect(screen.getByText('Moto: para 1 persona y equipaje chico.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Envío' }));
    expect(screen.getByRole('button', { name: '¿A dónde lo mandamos?' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Sobre' }));
    expect(screen.getByRole('button', { name: 'Sobre' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('el explorador lleva a Servicios y muestra el viaje en curso', () => {
    const ref = phone();
    act(() => ref.current!.jump('A0', { tripActive: true }));
    tap('Sección: Auto. Cambiar de sección');
    const sheet = screen.getByRole('dialog', { name: 'Explorá Chambito' });
    expect(within(sheet).getByRole('listitem', { name: /Marcos llega en 3 min/ })).toBeInTheDocument();
    fireEvent.click(within(sheet).getByRole('listitem', { name: /^Servicios/ }));
    expect(shown()).toBe('X1');
    expect(screen.getByRole('heading', { name: 'Ya tenés un viaje en curso' })).toBeInTheDocument();
  });

  it('el conductor se conecta, recibe la oferta, ingresa el PIN, finaliza y cobra', () => {
    vi.useFakeTimers();
    const ref = phone('AR');
    act(() => ref.current!.jump('D3'));
    fireEvent.click(screen.getByRole('switch', { name: 'Disponible para viajes' }));
    act(() => { vi.advanceTimersByTime(4000); });
    const offer = screen.getByRole('alertdialog', { name: 'Nuevo viaje' });
    expect(within(offer).getByText('$ 7.300')).toBeInTheDocument();
    fireEvent.click(within(offer).getByRole('button', { name: 'Aceptar' }));
    expect(shown()).toBe('D5');
    tap('Llegué');
    for (const d of '1111') tap(d);
    expect(screen.getByRole('alert')).toHaveTextContent('El PIN no coincide');
    for (const d of '3156') tap(d);
    expect(shown()).toBe('D7');
    tap('Deslizá para finalizar el viaje');
    act(() => { vi.advanceTimersByTime(200); });
    expect(shown()).toBe('D8');
    tap('Cobré · volver a disponible');
    expect(shown()).toBe('D3');
  });

  it('la oferta vence a los 12 s', () => {
    vi.useFakeTimers();
    const ref = phone();
    act(() => ref.current!.jump('D3', { online: true, sheet: 'offer' }));
    for (let i = 0; i < 13; i++) act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Se venció el pedido');
  });
});

describe('Auto v3 en el visor', () => {
  it('se abre desde la barra de arriba, el menú abre cada pantalla con su estado y el enlace la recuerda', () => {
    window.location.hash = '';
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Auto v3' }));
    expect(window.location.hash).toBe('#autov3/A0');
    const menu = screen.getByRole('navigation', { name: 'Pantallas de Auto v3' });
    fireEvent.click(within(menu).getByRole('button', { name: /E1/ }));
    expect(screen.getByText('Iniciá sesión para ver el precio')).toBeInTheDocument();
    expect(window.location.hash).toBe('#autov3/E1');
    fireEvent.click(screen.getByRole('button', { name: /^Siguiente: Ubicación desactivada/ }));
    expect(screen.getByText('Activá tu ubicación')).toBeInTheDocument();
  });

  it('un enlace a una pantalla la abre', () => {
    window.location.hash = '#autov3/A10';
    render(<App />);
    expect(screen.getByRole('dialog', { name: 'Detalles del viaje' })).toBeInTheDocument();
  });
});
