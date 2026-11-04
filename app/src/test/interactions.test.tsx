import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';

const start = (hash: string) => { window.location.hash = hash; return render(<App />); };
const heading = () => screen.getByRole('heading', { level: 1 });
const phoneNav = () => screen.getByRole('navigation', { name: 'Navegación principal' });

describe('Inicio integrates every module', () => {
  it('opens the Tienda from its tile', () => {
    start('#EB1');
    fireEvent.click(screen.getByRole('listitem', { name: /^Tienda/ }));
    expect(heading()).toHaveTextContent('Inicio de la Tienda');
  });

  it('opens a listing from the Market card thumbnails', () => {
    start('#EB1');
    fireEvent.click(screen.getByRole('button', { name: /Bicicleta Trek/ }));
    expect(heading()).toHaveTextContent('Detalle del producto');
  });

  it('asks when for a home service', () => {
    start('#EB1');
    fireEvent.click(screen.getByRole('button', { name: 'Niñera' }));
    const sheet = screen.getByRole('dialog', { name: 'Niñera' });
    fireEvent.click(within(sheet).getByRole('radio', { name: /Mañana/ }));
    expect(within(sheet).getByRole('radio', { name: /Mañana/ })).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(within(sheet).getByRole('button', { name: 'Pedir niñera' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Buscando niñera para mañana');
  });

  it('moves between tabs with the bottom bar', () => {
    start('#EB1');
    fireEvent.click(within(phoneNav()).getByRole('button', { name: 'Perfil' }));
    expect(heading()).toHaveTextContent('Perfil con filas nuevas');
    fireEvent.click(within(phoneNav()).getByRole('button', { name: 'Auto' }));
    expect(heading()).toHaveTextContent('Portada de Auto');
  });
});

describe('Perfil menus', () => {
  it('changes the phone theme from Configuración', () => {
    start('#EB3');
    fireEvent.click(screen.getByRole('button', { name: 'Configuración' }));
    const sheet = screen.getByRole('dialog', { name: 'Configuración' });
    fireEvent.click(within(sheet).getByRole('switch', { name: /Tema oscuro/ }));
    expect(document.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light');
  });

  it('closes sheets with Escape', () => {
    start('#EB3');
    fireEvent.click(screen.getByRole('button', { name: /Ayuda/ }));
    const sheet = screen.getByRole('dialog', { name: 'Ayuda' });
    fireEvent.click(within(sheet).getByRole('button', { name: /cancelo/ }));
    expect(within(sheet).getByText(/no tiene cargo/)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('links to the Auto and Tienda sections', () => {
    start('#EB3');
    fireEvent.click(screen.getByRole('button', { name: /Manejá con Chambito/ }));
    expect(heading()).toHaveTextContent('Sumate como conductor');
  });
});

describe('Auto interactions', () => {
  it('saves a new place from the Auto home', () => {
    start('#A0');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    const sheet = screen.getByRole('dialog', { name: 'Agregar un lugar' });
    expect(within(sheet).getByRole('button', { name: 'Guardar lugar' })).toBeDisabled();
    fireEvent.click(within(sheet).getByRole('button', { name: 'Gimnasio' }));
    fireEvent.click(within(sheet).getByRole('button', { name: 'Guardar lugar' }));
    expect(screen.getByRole('button', { name: 'Gimnasio' })).toBeInTheDocument();
  });

  it('chats with the driver and gets an answer', () => {
    vi.useFakeTimers();
    try {
      start('#A6');
      fireEvent.click(screen.getByRole('button', { name: 'Chat' }));
      const sheet = screen.getByRole('dialog', { name: /Chat con/ });
      expect(within(sheet).getByRole('button', { name: 'Enviar' })).toBeDisabled();
      fireEvent.click(within(sheet).getByRole('button', { name: '¿Dónde estás?' }));
      act(() => { vi.advanceTimersByTime(1200); });
      const log = within(sheet).getByRole('log');
      expect(log).toHaveTextContent('¿Dónde estás?');
      expect(log).toHaveTextContent(/Estoy a \d+ min/);
      // the trip does not advance while the chat is open
      act(() => { vi.advanceTimersByTime(8000); });
      expect(heading()).toHaveTextContent('Seguimiento');
    } finally {
      vi.useRealTimers();
    }
  });

  it('expands a past trip and repeats it', () => {
    start('#A11');
    const trip = screen.getAllByRole('button', { expanded: false }).find((b) => /→/.test(b.textContent ?? ''))!;
    fireEvent.click(trip);
    fireEvent.click(screen.getByRole('button', { name: /Repetir viaje/ }));
    expect(heading()).toHaveTextContent('Punto de encuentro');
  });
});
