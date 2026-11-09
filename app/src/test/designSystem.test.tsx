import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';
import { DARK, LIGHT } from '../integrada/tokens';

const start = (hash = '') => { window.location.hash = hash; return render(<App />); };
const rail = () => screen.getByRole('tablist', { name: 'Sistema de diseño' });

describe('«Sistema de diseño»', () => {
  it('se abre desde la barra de arriba, en Colores, con los tokens de las pantallas', () => {
    start();
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Referencia' })).getByRole('button', { name: /Sistema de diseño/ }));
    expect(window.location.hash).toBe('#sistema/colores');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Colores');
    // the tables read the same tokens the screens use
    expect(screen.getAllByText(LIGHT.bg).length).toBeGreaterThan(0);
    expect(screen.getAllByText(DARK.cardBg).length).toBeGreaterThan(0);
  });

  it('cada sección del menú se dibuja, y los componentes van en claro y oscuro', () => {
    start('#sistema/colores');
    const tabs = within(rail()).getAllByRole('tab');
    expect(tabs.length).toBe(19);
    for (const tab of tabs) {
      fireEvent.click(tab);
      expect(tab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(tab.textContent!);
    }
    fireEvent.click(within(rail()).getByRole('tab', { name: 'Botones' }));
    expect(document.querySelectorAll('.ds-pane[data-theme="light"]').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('.ds-pane[data-theme="dark"]').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: 'Pedir viaje' })).toHaveLength(2);
  });

  it('un enlace abre la sección, y los componentes de muestra responden', () => {
    start('#sistema/seleccion');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Selección');
    const sw = screen.getAllByRole('switch', { name: 'Modo oscuro' })[0];
    expect(sw).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(sw);
    expect(screen.getAllByRole('switch', { name: 'Modo oscuro' })[0]).toHaveAttribute('aria-checked', 'false');
  });

  it('las referencias de navegación por versión siguen a un clic', () => {
    start('#sistema/colores');
    fireEvent.click(screen.getByRole('button', { name: 'Navegación por versión' }));
    expect(window.location.hash).toBe('#componentes');
    expect(screen.getByRole('tablist', { name: 'En esta versión' })).toBeInTheDocument();
  });
});
