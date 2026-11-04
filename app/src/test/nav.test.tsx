import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AppProvider } from '../store';
import { BottomNavBar, MenuGroup, MenuItem, QuickAccess, TopBar, navItems } from '../ui/nav';

describe('navItems', () => {
  it('keeps the bar as today without Auto nor a Tienda tab', () => {
    expect(navItems(false, false)).toEqual(['inicio', 'actividad', 'perfil']);
    expect(navItems(false, true)).toEqual(['inicio', 'comercios', 'equipos', 'actividad', 'perfil']);
  });

  it('adds Auto as its own destination', () => {
    expect(navItems(true, false)).toEqual(['inicio', 'auto', 'actividad', 'perfil']);
    expect(navItems(true, true)).toEqual(['inicio', 'auto', 'equipos', 'actividad', 'perfil']);
  });

  it('never goes over 5 destinations: Equipos moves to Perfil', () => {
    const all = navItems(true, true, true);
    expect(all).toEqual(['inicio', 'auto', 'tienda', 'actividad', 'perfil']);
    for (const a of [true, false]) for (const b of [true, false]) for (const c of [true, false]) expect(navItems(a, b, c).length).toBeLessThanOrEqual(5);
  });
});

const wrap = (ui: React.ReactNode) => render(<AppProvider>{ui}</AppProvider>);

describe('BottomNavBar', () => {
  it('marks the active destination and reports taps', () => {
    const onSelect = vi.fn();
    wrap(<BottomNavBar items={['inicio', 'auto', 'perfil']} active="auto" onSelect={onSelect} />);
    expect(screen.getByRole('button', { name: 'Auto' })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('button', { name: 'Perfil' }));
    expect(onSelect).toHaveBeenCalledWith('perfil');
  });

  it('announces badges in the accessible name', () => {
    wrap(<BottomNavBar items={['inicio', 'actividad']} active="inicio" badges={{ actividad: 3 }} />);
    expect(screen.getByRole('button', { name: 'Actividad, 3 nuevas' })).toBeInTheDocument();
  });
});

describe('TopBar, menus and tiles', () => {
  it('renders a back button only when there is somewhere to go back', () => {
    const onBack = vi.fn();
    const { rerender } = wrap(<TopBar title="Tienda" />);
    expect(screen.queryByRole('button', { name: 'Atrás' })).toBeNull();
    rerender(<AppProvider><TopBar title="Tienda" onBack={onBack} /></AppProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Atrás' }));
    expect(onBack).toHaveBeenCalled();
  });

  it('runs menu items and quick tiles', () => {
    const a = vi.fn();
    const b = vi.fn();
    wrap(
      <>
        <MenuGroup title="Cuenta"><MenuItem icon="bell" label="Notificaciones" onClick={a} last /></MenuGroup>
        <QuickAccess tiles={[{ key: 'auto', icon: 'car', label: 'Viaje', hint: '¿A dónde vas?', status: 'En curso', onClick: b }]} />
      </>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Notificaciones/ }));
    fireEvent.click(screen.getByRole('listitem', { name: 'Viaje: ¿A dónde vas?, En curso' }));
    expect(a).toHaveBeenCalled();
    expect(b).toHaveBeenCalled();
  });
});
