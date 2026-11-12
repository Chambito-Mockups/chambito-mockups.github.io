import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';
import { entriesIn } from '../registry';
import { V3_ENTRIES } from '../autov3/AutoV3Page';

// un teléfono: 390 px de ancho, y la media query del visor coincide
const realMatch = window.matchMedia;
const realWidth = window.innerWidth;
beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 });
  window.matchMedia = ((q: string) => ({
    matches: q.includes('max-width: 600px'), media: q, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});
afterEach(() => {
  window.matchMedia = realMatch;
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: realWidth });
});

const start = (hash = '') => { window.location.hash = hash; return render(<App />); };
const heading = () => screen.getByRole('heading', { level: 1 });
const bar = () => screen.getByRole('toolbar', { name: 'Presentación' });

describe('en el celular', () => {
  it('abre en una portada con Auto, Market y los recorridos', () => {
    start();
    expect(screen.getByRole('heading', { name: '¿Qué querés ver?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Chambito Auto/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Recorridos guiados/ }));
    expect(screen.getByRole('button', { name: 'Presentar: Pedir un viaje' })).toBeInTheDocument();
  });

  it('Auto abre Auto v3 y Market abre Market v3 en pantalla completa', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: /Chambito Market/ }));
    expect(heading()).toHaveTextContent('Portada de Market con selector');
    expect(bar()).toBeInTheDocument();
  });

  it('«Pantallas» abre una hoja para saltar a cualquier pantalla', () => {
    start('#MKm');
    fireEvent.click(within(bar()).getByRole('button', { name: 'Pantallas' }));
    const sheet = screen.getByRole('dialog', { name: 'Pantallas' });
    fireEvent.change(within(sheet).getByRole('textbox', { name: 'Buscar pantalla' }), { target: { value: 'filtros' } });
    fireEvent.click(within(sheet).getByRole('button', { name: /Filtros/ }));
    expect(heading()).toHaveTextContent('Filtros');
    expect(screen.queryByRole('dialog', { name: 'Pantallas' })).toBeNull();
  });

  it('deslizar la barra pasa a la pantalla siguiente y a la anterior', () => {
    start('#M05');
    const list = entriesIn('market', 'v3');
    const i = list.findIndex((e) => e.key === 'M05');
    fireEvent.touchStart(bar(), { touches: [{ clientX: 300, clientY: 10 }] });
    fireEvent.touchEnd(bar(), { changedTouches: [{ clientX: 120, clientY: 14 }] });
    expect(heading()).toHaveTextContent(list[i + 1].title);
    fireEvent.touchStart(bar(), { touches: [{ clientX: 100, clientY: 10 }] });
    fireEvent.touchEnd(bar(), { changedTouches: [{ clientX: 300, clientY: 12 }] });
    expect(heading()).toHaveTextContent(list[i].title);
  });
});

describe('Auto v3 en el celular, igual que Market v3', () => {
  const v3Title = () => within(bar()).getByText((_, el) => !!el?.classList.contains('pb-long') && !!el.classList.contains('pb-title'));

  it('«Chambito Auto» abre Auto v3 con la misma barra de abajo y sin la barra del visor', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: /Chambito Auto/ }));
    expect(bar()).toBeInTheDocument();
    expect(v3Title()).toHaveTextContent('A0 · Portada de Auto');
    expect(document.querySelector('.shell')).toHaveClass('presenting');
    expect(document.querySelector('.v3-bar')).toBeNull();
  });

  it('«Pantallas» lista las de Auto v3 y salta a una', () => {
    start('#autov3/A0');
    fireEvent.click(within(bar()).getByRole('button', { name: 'Pantallas' }));
    const sheet = screen.getByRole('dialog', { name: 'Pantallas' });
    fireEvent.change(within(sheet).getByRole('textbox', { name: 'Buscar pantalla' }), { target: { value: 'llegó' } });
    fireEvent.click(within(sheet).getAllByRole('button', { name: /llegó/ })[0]);
    expect(v3Title()).toHaveTextContent(/llegó/);
    expect(screen.queryByRole('dialog', { name: 'Pantallas' })).toBeNull();
  });

  it('deslizar la barra pasa a la siguiente pantalla de Auto v3', () => {
    start('#autov3/A0');
    const i = V3_ENTRIES.findIndex((x) => x.key === 'A0');
    fireEvent.touchStart(bar(), { touches: [{ clientX: 300, clientY: 10 }] });
    fireEvent.touchEnd(bar(), { changedTouches: [{ clientX: 100, clientY: 12 }] });
    expect(v3Title()).toHaveTextContent(`${V3_ENTRIES[i + 1].key} · ${V3_ENTRIES[i + 1].title}`);
  });

  it('cambiar a Market desde la hoja mantiene el mismo diseño', () => {
    start('#autov3/A0');
    fireEvent.click(within(bar()).getByRole('button', { name: 'Pantallas' }));
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Pantallas' })).getByRole('radio', { name: /Market/ }));
    expect(heading()).toHaveTextContent('Portada de Market con selector');
    expect(bar()).toBeInTheDocument();
    expect(document.querySelector('.shell')).toHaveClass('presenting');
  });
});
