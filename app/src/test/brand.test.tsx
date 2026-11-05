/**
 * Brand rules from the brand guide (05/11/2026) and design-system/TOKENS.json, checked on every screen
 * so they don't come back by accident.
 */
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';
import { ALL_ENTRIES } from '../registry';
import { dark, light, P, R } from '../theme';

const openLight = (hash: string) => {
  window.location.hash = hash;
  const r = render(<App />);
  const toLight = screen.queryByRole('button', { name: 'Teléfono: cambiar a tema claro' });
  if (toLight) fireEvent.click(toLight);
  return r;
};

const norm = (v: string) => v.replace(/\s+/g, '').toLowerCase();
const GREEN = ['rgb(75,172,79)', '#4bac4f'];
const isGreen = (el: HTMLElement) => GREEN.some((g) => norm(el.style.backgroundColor || el.style.background || '').includes(g));
const isBlack = (v: string) => ['#000000', '#000', 'rgb(0,0,0)', 'black'].includes(norm(v || ''));

/** Text or icons in black on a solid green element (rule COL-03: white on green). */
function blackOnGreen(root: ParentNode): string[] {
  const bad: string[] = [];
  root.querySelectorAll<HTMLElement>('*').forEach((el) => {
    if (!isGreen(el) || el.hasAttribute('data-icon')) return;
    if (isBlack(el.style.color)) bad.push(`texto: «${(el.textContent ?? '').trim().slice(0, 30)}»`);
    el.querySelectorAll<HTMLElement>(':scope > [data-icon], :scope > span > [data-icon]').forEach((ic) => {
      if (isBlack(ic.style.backgroundColor || ic.style.background)) bad.push(`ícono: ${ic.dataset.icon}`);
    });
  });
  return bad;
}

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

describe('brand rules on every screen (light theme)', () => {
  it.each(ALL_ENTRIES.map((e) => [e.key, e.title]))('%s · %s', (key) => {
    openLight(`#${key}`);
    const phone = document.querySelector('[data-theme]')!;
    // white on green
    expect(blackOnGreen(phone)).toEqual([]);
    // contact is by chat only: no call buttons (the SOS «Llamar al 911» is an emergency call)
    const calls = within(phone as HTMLElement).queryAllByRole('button', { name: /llamar/i }).filter((b) => !/911/.test(b.textContent ?? ''));
    expect(calls).toEqual([]);
    // no emojis in titles
    phone.querySelectorAll('h1,h2,h3').forEach((h) => expect(h.textContent ?? '').not.toMatch(EMOJI));
  });
});

describe('brand rules on the integrated navigation page', () => {
  it('has no black on green in any proposal, theme or bar', () => {
    openLight('#navegacion');
    for (const label of ['Recomendada · navegación estable', 'Selector en Inicio', 'Opción 1', 'Opción 2', 'Opción 3']) {
      fireEvent.click(screen.getByRole('radio', { name: label }));
      for (const th of ['Claro', 'Oscuro']) {
        fireEvent.click(screen.getByRole('radio', { name: th }));
        const phones = screen.getAllByRole('group').filter((g) => /, (estable|mix|op\d)$/.test(g.getAttribute('aria-label') ?? ''));
        expect(phones.length).toBe(2);
        phones.forEach((p) => {
          expect(blackOnGreen(p)).toEqual([]);
          p.querySelectorAll('h1,h2,h3').forEach((h) => expect(h.textContent ?? '').not.toMatch(EMOJI));
        });
      }
    }
  });
});

describe('the green detector works (so the checks above are not empty)', () => {
  it('finds the primary buttons and their white text', () => {
    let greens = 0;
    let white = 0;
    for (const e of ALL_ENTRIES) {
      const { unmount } = openLight(`#${e.key}`);
      document.querySelectorAll<HTMLElement>('[data-theme] *').forEach((el) => {
        if (!isGreen(el)) return;
        greens++;
        if (['#ffffff', 'rgb(255,255,255)'].includes(norm(el.style.color))) white++;
      });
      unmount();
    }
    expect(greens).toBeGreaterThan(20);
    expect(white).toBeGreaterThan(10);
  });
});

describe('bottom bar (TOKENS component.bottomNav)', () => {
  it('shows icon and name on every tab, active in icon.brand, without a green pill', () => {
    openLight('#A0');
    const nav = within(document.querySelector('[data-theme]') as HTMLElement).getByRole('navigation', { name: 'Navegación principal' });
    expect(nav.style.height).toBe('72px');
    expect(nav.style.borderRadius).toBe('16px');
    const active = within(nav).getAllByRole('button').find((b) => b.getAttribute('aria-current') === 'page')!;
    expect(isGreen(active)).toBe(false);
    const label = [...active.querySelectorAll('span')].find((s) => s.textContent === 'Auto')!;
    expect(norm(label.style.color)).toBe(norm('rgb(47, 122, 51)')); // #2F7A33
    for (const b of within(nav).getAllByRole('button')) expect((b.textContent ?? '').trim().length).toBeGreaterThan(0);
  });
});

describe('tokens', () => {
  it('follows TOKENS.json for text on green, switches, links and the active tab', () => {
    expect(light.onGreen).toBe('#FFFFFF');
    expect(dark.onGreen).toBe('#FFFFFF');
    expect([light.switchOn, dark.switchOn]).toEqual(['#2F7A33', '#4BAC4F']);
    expect([light.link, dark.link]).toEqual(['#2F7A33', '#7CCB7F']);
    expect([light.navActive, dark.navActive]).toEqual(['#2F7A33', '#7CCB7F']);
    expect([light.text3, dark.text3]).toEqual(['#707070', '#9E9E9E']);
    expect(dark.shadowCard).toBe('none'); // depth in dark comes from surfaces
  });

  it('never goes under 12 px and only uses Poppins Bold / Roboto Light, Regular, Medium', () => {
    expect(P(10)).toBe('700 12px Poppins, sans-serif');
    expect(R(11, 500)).toBe('500 12px Roboto, sans-serif');
    expect(R(18, 300)).toBe('300 18px Roboto, sans-serif');
  });
});

// Official set (brand kit «06- Iconos svg», 86 icons) plus the proposals still to validate with the brand.
const PROPOSALS = ['car', 'wrench', 'bolt', 'roller'];
describe('icons', () => {
  it('only ships the official set and the listed proposals', () => {
    const files = readdirSync(resolve(__dirname, '../../public/ic')).map((f) => f.replace(/\.svg$/, ''));
    expect(files.length).toBe(86 + PROPOSALS.length);
    for (const p of PROPOSALS) expect(files).toContain(p);
  });
});
