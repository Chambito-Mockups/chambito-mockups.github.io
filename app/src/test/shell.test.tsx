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

  it('opens the integrated navigation from the top bar, on the Inicio designs', () => {
    start();
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Referencia' })).getByRole('button', { name: /Navegación/ }));
    expect(window.location.hash).toBe('#navegacion');
    expect(screen.getByRole('tab', { name: 'Diseños de Inicio' })).toHaveAttribute('aria-selected', 'true');
    // recommended first: the stable navigation
    expect(screen.getByRole('group', { name: 'Cliente, estable' })).toBeInTheDocument();
    // module switcher at the top of Inicio
    fireEvent.click(screen.getByRole('radio', { name: 'Selector en Inicio' }));
    const cliente = screen.getByRole('group', { name: 'Cliente, mix' });
    expect(within(cliente).getByRole('tablist', { name: 'Módulos' })).toBeInTheDocument();
    expect(within(cliente).getByText('Servicios populares')).toBeInTheDocument();
    fireEvent.click(within(cliente).getByRole('tab', { name: /Auto/ }));
    expect(within(cliente).getByText('¿A dónde vas?')).toBeInTheDocument();
    const prestador = screen.getByRole('group', { name: 'Prestador, mix' });
    expect(within(prestador).getByRole('navigation').textContent).toContain('Trabajo');
    fireEvent.click(within(prestador).getByRole('switch'));
    expect(within(prestador).getByText('No disponible')).toBeInTheDocument();
    // each of the three proposals renders both sides
    for (const [label, id, tabName] of [['Opción 1', 'op1', 'Módulos'], ['Opción 2', 'op2', 'Comercios'], ['Opción 3', 'op3', 'Explorar']] as const) {
      fireEvent.click(screen.getByRole('radio', { name: label }));
      expect(screen.getByRole('group', { name: `Prestador, ${id}` })).toBeInTheDocument();
      expect(within(screen.getByRole('group', { name: `Cliente, ${id}` })).getByRole('navigation').textContent).toContain(tabName);
    }
  });

  it('navigates the stable proposal: one search, filters, availability per module', () => {
    start('#navegacion');
    const cliente = () => screen.getByRole('group', { name: 'Cliente, estable' });
    const tabBtn = (g: HTMLElement, name: string | RegExp) => within(within(g).getByRole('navigation')).getByRole('button', { name });
    // light theme and docked bar by default, like the mockup
    expect(screen.getByRole('radio', { name: 'Claro' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Barra fija' })).toHaveAttribute('aria-checked', 'true');
    // one search for every module
    const search = within(cliente()).getByRole('textbox', { name: 'Buscar servicios, viajes o productos' });
    fireEvent.change(search, { target: { value: 'plomero' } });
    expect(within(cliente()).getByRole('region', { name: 'Resultados de Servicios' })).toHaveTextContent('Plomería');
    fireEvent.change(search, { target: { value: 'costanera' } });
    expect(within(cliente()).getByRole('region', { name: 'Resultados de Auto' })).toBeInTheDocument();
    fireEvent.change(search, { target: { value: 'ventilador' } });
    expect(within(cliente()).getByRole('region', { name: 'Resultados de Market' })).toBeInTheDocument();
    // the Servicios tile opens Explorar already filtered
    fireEvent.click(within(cliente()).getByRole('button', { name: /^Servicios: Profesionales verificados/ }));
    expect(within(cliente()).getByRole('heading', { name: 'Explorar' })).toBeInTheDocument();
    expect(within(cliente()).getByRole('tab', { name: /Servicios/ })).toHaveAttribute('aria-selected', 'true');
    // the bar only has 4 fixed tabs; Perfil offers to activate what is not used
    expect(within(within(cliente()).getByRole('navigation')).getAllByRole('button').length).toBe(4);
    fireEvent.click(tabBtn(cliente(), 'Perfil'));
    expect(within(cliente()).getByText('Chambito Auto')).toBeInTheDocument();

    const prestador = () => screen.getByRole('group', { name: 'Prestador, estable' });
    expect(within(prestador()).getByRole('switch', { name: 'En línea' })).toHaveAttribute('aria-checked', 'true');
    // Trabajo: one feed, filtered by module, each card labelled with icon + text
    fireEvent.click(tabBtn(prestador(), 'Trabajo'));
    expect(within(prestador()).getByText('Market · Entrega')).toBeInTheDocument();
    expect(within(prestador()).getByText('Hace 2 min')).toBeInTheDocument();
    fireEvent.click(within(prestador()).getByRole('tab', { name: /Servicios/ }));
    expect(within(prestador()).queryByText('Viaje al centro')).not.toBeInTheDocument();
    expect(within(prestador()).getByText('Limpieza del hogar')).toBeInTheDocument();
    // Actividad: every module in one timeline
    fireEvent.click(tabBtn(prestador(), /Actividad/));
    expect(within(prestador()).getByText('Pago recibido')).toBeInTheDocument();
    fireEvent.click(within(prestador()).getByRole('tab', { name: /Auto/ }));
    expect(within(prestador()).queryByText('Pago recibido')).not.toBeInTheDocument();
    expect(within(prestador()).getByText('Viaje cancelado')).toBeInTheDocument();
  });

  it('opens the module screens of the mockup: Chambito Auto, Market and Disponibilidad', () => {
    start('#navegacion');
    const cliente = () => screen.getByRole('group', { name: 'Cliente, estable' });
    // Auto: route map, where to and place shortcuts; back returns to Inicio
    fireEvent.click(within(cliente()).getByRole('button', { name: /^Auto: Movete de forma segura/ }));
    expect(within(cliente()).getByRole('heading', { name: 'Chambito Auto' })).toBeInTheDocument();
    expect(within(cliente()).getByRole('img', { name: 'Mapa con la ruta del viaje' })).toBeInTheDocument();
    for (const p of ['Casa', 'Trabajo', 'Favoritos']) expect(within(cliente()).getByRole('button', { name: p })).toBeInTheDocument();
    fireEvent.click(within(cliente()).getByRole('button', { name: 'Atrás' }));
    expect(within(cliente()).getByRole('heading', { name: '¿Qué necesitás hoy?' })).toBeInTheDocument();
    // Market: categories, a neutral launch notice (no promotional banners) and products you can save
    fireEvent.click(within(cliente()).getByRole('button', { name: /^Market: Comprá y vendé cerca tuyo/ }));
    expect(within(cliente()).getByRole('heading', { name: 'Market' })).toBeInTheDocument();
    expect(within(cliente()).queryByRole('region', { name: 'Ofertas' })).not.toBeInTheDocument();
    expect(within(cliente()).getByRole('note')).toHaveTextContent('Market es nuevo en tu zona');
    for (const c of ['Tecnología', 'Hogar', 'Moda', 'Más']) expect(within(cliente()).getByRole('button', { name: c })).toBeInTheDocument();
    const save = within(cliente()).getAllByRole('button', { name: /^Guardar / })[0];
    fireEvent.click(save);
    expect(save).toHaveAttribute('aria-pressed', 'true');

    // Disponibilidad: one switch per module; Inicio and the module rows follow it
    const prestador = () => screen.getByRole('group', { name: 'Prestador, estable' });
    expect(within(prestador()).getByText('Desconectado · no recibís viajes')).toBeInTheDocument();
    fireEvent.click(within(prestador()).getByRole('button', { name: /Elegir módulos/ }));
    expect(within(prestador()).getByRole('heading', { name: 'Disponibilidad' })).toBeInTheDocument();
    fireEvent.click(within(prestador()).getByRole('switch', { name: 'Auto' }));
    expect(within(prestador()).getByRole('switch', { name: 'Auto' })).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(within(prestador()).getByRole('button', { name: 'Atrás' }));
    expect(within(prestador()).getByText('Disponible para viajes')).toBeInTheDocument();
    expect(within(prestador()).getByText(/En 3 de 3 módulos/)).toBeInTheDocument();
    // the master switch turns every module off
    fireEvent.click(within(prestador()).getByRole('switch', { name: 'En línea' }));
    expect(within(prestador()).getByText('Fuera de línea · no recibís oportunidades')).toBeInTheDocument();
  });

  it('switches the stable proposal to the floating bar', () => {
    start('#navegacion');
    fireEvent.click(screen.getByRole('radio', { name: 'Barra flotante' }));
    expect(screen.getByRole('radio', { name: 'Barra flotante' })).toHaveAttribute('aria-checked', 'true');
    expect(within(screen.getByRole('group', { name: 'Cliente, estable' })).getByRole('navigation')).toBeInTheDocument();
  });

  it('shows the architecture of the four fixed destinations', () => {
    start('#navegacion');
    fireEvent.click(screen.getByRole('tab', { name: 'Arquitectura' }));
    for (const name of ['Inicio', 'Explorar / Trabajo', 'Actividad', 'Perfil']) expect(screen.getByRole('region', { name })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Opción alterna (5 pestañas)' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Componentes' }));
    expect(screen.getByText('Paleta del mockup vs. el prototipo')).toBeInTheDocument();
    expect(screen.getByText('CategoryRow · PromoCarousel')).toBeInTheDocument();
  });

  it('opens the integrated navigation from its link', () => {
    start('#navegacion');
    expect(screen.getByRole('tab', { name: 'Diseños de Inicio' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#navegacion');
  });

  it('shows the bar options and the account simulator in their tabs', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: /Navegación integrada/ }));
    fireEvent.click(screen.getByRole('tab', { name: 'Opciones de barra' }));
    expect(screen.getAllByRole('region', { name: /^[A-F] · / }).length).toBe(6);
    expect(within(screen.getByRole('region', { name: /^A · / })).getByText('Recomendada')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Componentes' }));
    expect(screen.getByText('ModuleSwitcher')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Probalo' }));
    const bar = () => within(screen.getByRole('group', { name: 'Inicio de ejemplo, tema oscuro' })).getByRole('navigation');
    // launch: Tienda is a top icon, not a tab
    expect(within(screen.getByRole('group', { name: 'Inicio de ejemplo, tema oscuro' })).getAllByRole('button', { name: 'Tienda' }).length).toBe(1);
    expect(bar().textContent).not.toContain('Tienda');
    fireEvent.click(screen.getByRole('radio', { name: 'Tienda con uso' }));
    expect(bar().textContent).toContain('Tienda');
    fireEvent.click(screen.getByRole('radio', { name: 'Prestador' }));
    expect(within(screen.getByRole('group', { name: 'Inicio de ejemplo, tema claro' })).getByText('Trabajos')).toBeInTheDocument();
    expect(screen.getByText('Mi trabajo')).toBeInTheDocument();
  });
});
