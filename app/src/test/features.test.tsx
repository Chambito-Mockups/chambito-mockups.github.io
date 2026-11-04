import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';
import { TOURS, ALL_ENTRIES, MODULE_OF } from '../registry';
import { clearDemo, load, save } from '../persist';
import { TOUR_STEP_MS } from '../shell/Presenter';

const start = (hash = '') => { window.location.hash = hash; return render(<App />); };
const heading = () => screen.getByRole('heading', { level: 1 });
const bar = () => screen.getByRole('toolbar', { name: 'Presentación' });

describe('persistence', () => {
  it('keeps settings across reloads', () => {
    const first = start('#A0');
    fireEvent.click(screen.getByRole('radio', { name: 'Argentina' }));
    first.unmount();
    start('#A0');
    expect(screen.getByRole('radio', { name: 'Argentina' })).toHaveAttribute('aria-checked', 'true');
  });

  it('keeps a saved place across reloads', () => {
    const first = start('#A0');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Facultad' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Guardar lugar' }));
    first.unmount();
    start('#A0');
    expect(screen.getByRole('button', { name: 'Facultad' })).toBeInTheDocument();
  });

  it('clears only the demo keys', () => {
    save('x', 1);
    localStorage.setItem('other', 'keep');
    clearDemo();
    expect(load('x', 0)).toBe(0);
    expect(localStorage.getItem('other')).toBe('keep');
  });

  it('survives broken stored data', () => {
    localStorage.setItem('chambito:v1:settings', '{not json');
    start('#A0');
    expect(heading()).toHaveTextContent('Portada de Auto');
  });
});

describe('page theme', () => {
  it('switches the page between dark and light, apart from the phone', () => {
    start('#A0');
    const html = document.documentElement;
    const initial = html.dataset.ui;
    const next = initial === 'dark' ? 'claro' : 'oscuro';
    fireEvent.click(screen.getByRole('button', { name: `Página: cambiar a tema ${next}` }));
    expect(html.dataset.ui).toBe(initial === 'dark' ? 'light' : 'dark');
    expect(document.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark'); // phone unchanged
  });
});

describe('presentation mode', () => {
  it('opens from the toolbar, moves, and closes with Escape', () => {
    start('#A0');
    fireEvent.click(screen.getByRole('button', { name: 'Presentar' }));
    expect(document.querySelector('.shell')).toHaveClass('presenting');
    fireEvent.click(within(bar()).getByRole('button', { name: 'Pantalla siguiente' }));
    expect(heading()).toHaveTextContent('Portada con viaje activo');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.querySelector('.shell')).not.toHaveClass('presenting');
  });

  it('toggles with P', () => {
    start('#M01');
    fireEvent.keyDown(window, { key: 'p' });
    expect(bar()).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'p' });
    expect(screen.queryByRole('toolbar', { name: 'Presentación' })).toBeNull();
  });
});

describe('guided flows', () => {
  it('only lists real screens of their own module', () => {
    for (const t of TOURS) for (const k of t.steps) {
      expect(ALL_ENTRIES.some((e) => e.key === k), `${t.id}:${k}`).toBe(true);
      expect(MODULE_OF[k], `${t.id}:${k}`).toBe(t.module);
    }
  });

  it('plays a flow step by step and stops at the end', () => {
    vi.useFakeTimers();
    try {
      start('#A0');
      fireEvent.click(screen.getByRole('button', { name: 'Presentar: Manejar con Chambito' }));
      const tour = TOURS.find((t) => t.id === 'conductor')!;
      expect(within(bar()).getByText(`Manejar con Chambito · 1 de ${tour.steps.length}`)).toBeInTheDocument();
      act(() => { vi.advanceTimersByTime(TOUR_STEP_MS + 50); });
      expect(within(bar()).getByText(`Manejar con Chambito · 2 de ${tour.steps.length}`)).toBeInTheDocument();
      // pause with the space bar: it stays put
      fireEvent.keyDown(window, { key: ' ' });
      act(() => { vi.advanceTimersByTime(TOUR_STEP_MS * 2); });
      expect(within(bar()).getByText(`Manejar con Chambito · 2 de ${tour.steps.length}`)).toBeInTheDocument();
      // jump to the last step with its dot
      fireEvent.click(within(bar()).getByRole('tab', { name: `Paso ${tour.steps.length}` }));
      expect(within(bar()).getByRole('button', { name: 'Pantalla siguiente' })).toBeDisabled();
    } finally {
      vi.useRealTimers();
    }
  });

  it('restores the trip simulation when the flow ends', () => {
    start('#A0');
    fireEvent.click(screen.getByRole('button', { name: 'Presentar: Pedir un viaje' }));
    fireEvent.click(within(bar()).getByRole('button', { name: 'Salir de la presentación' }));
    fireEvent.click(screen.getByRole('button', { name: /Simular situaciones/ }));
    expect(screen.getByRole('switch', { name: /Viaje en tiempo real/ })).toHaveAttribute('aria-checked', 'true');
  });
});

describe('Reiniciar', () => {
  it('reloads the screen with a clean state', () => {
    start('#A0');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(screen.getByRole('dialog', { name: 'Agregar un lugar' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Reiniciar/ }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Pantalla reiniciada');
    expect(heading()).toHaveTextContent('Portada de Auto');
  });
});

describe('search box', () => {
  it('counts results, highlights the match and moves with the arrows', () => {
    start('#A0');
    const box = screen.getByRole('textbox', { name: 'Buscar pantalla' });
    fireEvent.change(box, { target: { value: 'viaje' } });
    const nav = screen.getByRole('navigation', { name: 'Pantallas de Auto' });
    const marks = nav.querySelectorAll('mark');
    expect(marks.length).toBeGreaterThan(1);
    expect(marks[0].textContent?.toLowerCase()).toBe('viaje');
    expect(screen.getByText(/\d+ pantallas/)).toBeInTheDocument();
    const items = within(nav).getAllByRole('button').filter((b) => b.id.startsWith('opt-'));
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    expect(box).toHaveAttribute('aria-activedescendant', items[1].id);
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(heading()).toHaveTextContent(items[1].querySelector('.title')!.textContent!);
  });

  it('matches without accents', () => {
    start('#A0');
    fireEvent.change(screen.getByRole('textbox', { name: 'Buscar pantalla' }), { target: { value: 'ubicacion' } });
    const mark = screen.getByRole('navigation', { name: 'Pantallas de Auto' }).querySelector('mark');
    expect(mark?.textContent).toBe('Ubicación');
  });
});
