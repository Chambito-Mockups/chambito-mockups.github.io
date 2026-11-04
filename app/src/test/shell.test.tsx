import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';
import { entriesOf } from '../registry';

const heading = () => screen.getByRole('heading', { level: 1 });
const menu = (name: string) => screen.getByRole('navigation', { name: `Pantallas de ${name}` });
const moduleBtn = (name: string) => within(screen.getByRole('navigation', { name: 'Módulo' })).getByRole('button', { name });
const start = (hash = '') => { window.location.hash = hash; return render(<App />); };

describe('Auto | Market menus', () => {
  it('starts on Auto with only Auto screens in the side menu', () => {
    start();
    expect(moduleBtn('Auto')).toHaveAttribute('aria-current', 'page');
    const nav = menu('Auto');
    expect(within(nav).getByText('Portada de Auto')).toBeInTheDocument();
    expect(within(nav).queryByText('Inicio de la Tienda')).toBeNull();
  });

  it('switches to Market and back, remembering the last screen of each menu', () => {
    start();
    fireEvent.click(within(menu('Auto')).getByText('Tu conductor llegó'));
    expect(heading()).toHaveTextContent('Tu conductor llegó');

    fireEvent.click(moduleBtn('Market'));
    expect(heading()).toHaveTextContent('Inicio de la Tienda');
    expect(within(menu('Market')).getByText('Filtros')).toBeInTheDocument();

    fireEvent.click(moduleBtn('Auto'));
    expect(heading()).toHaveTextContent('Tu conductor llegó');
  });

  it('shows the settings of the current menu only', () => {
    start();
    expect(screen.getByRole('radiogroup', { name: 'Ver la app como' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Cuenta de vendedor')).toBeNull();
    fireEvent.click(moduleBtn('Market'));
    expect(screen.getByLabelText('Cuenta de vendedor')).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup', { name: 'Ver la app como' })).toBeNull();
  });

  it('follows in-phone navigation into the other module', () => {
    start('#EB1');
    expect(moduleBtn('Market')).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('listitem', { name: /^Viaje/ }));
    expect(moduleBtn('Auto')).toHaveAttribute('aria-current', 'page');
    expect(heading()).toHaveTextContent('Portada de Auto');
  });
});

describe('search', () => {
  it('filters the current menu and opens the first hit with Enter', () => {
    start();
    const box = screen.getByRole('textbox', { name: 'Buscar pantalla' });
    fireEvent.change(box, { target: { value: 'pin' } });
    const nav = menu('Auto');
    expect(within(nav).getByRole('button', { name: /Inicio del viaje · PIN/ })).toBeInTheDocument();
    expect(within(nav).queryByRole('button', { name: /Portada de Auto/ })).toBeNull();
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(heading()).toHaveTextContent('Inicio del viaje · PIN');
  });

  it('ignores accents and offers the other menu when nothing matches', () => {
    start();
    const box = screen.getByRole('textbox', { name: 'Buscar pantalla' });
    fireEvent.change(box, { target: { value: 'publicacion' } });
    fireEvent.click(screen.getByRole('button', { name: /en Market →/ }));
    expect(moduleBtn('Market')).toHaveAttribute('aria-current', 'page');
    expect(within(menu('Market')).getByRole('button', { name: /Editar publicación/ })).toBeInTheDocument();
  });
});

describe('toolbar and keyboard', () => {
  it('moves with the arrows through the current menu', () => {
    start();
    const auto = entriesOf('auto');
    expect(screen.getByText(`1 de ${auto.length}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pantalla anterior' })).toBeDisabled();
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(heading()).toHaveTextContent(auto[1].title);
    fireEvent.click(screen.getByRole('button', { name: 'Pantalla siguiente' }));
    expect(heading()).toHaveTextContent(auto[2].title);
    (document.activeElement as HTMLElement | null)?.blur(); // A2 focuses its destination field
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(heading()).toHaveTextContent(auto[1].title);
  });

  it('does not steal the arrows while typing', () => {
    start();
    const box = screen.getByRole('textbox', { name: 'Buscar pantalla' });
    box.focus();
    fireEvent.keyDown(box, { key: 'ArrowRight' });
    expect(heading()).toHaveTextContent('Portada de Auto');
  });

  it('jumps when the link changes while open', () => {
    start();
    window.location.hash = '#M05';
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(heading()).toHaveTextContent('Filtros');
    expect(moduleBtn('Market')).toHaveAttribute('aria-current', 'page');
  });

  it('opens the design reference pages and comes back', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: /Barra inferior/ }));
    fireEvent.click(screen.getByRole('button', { name: /Volver al prototipo/ }));
    expect(heading()).toHaveTextContent('Portada de Auto');
  });
});
