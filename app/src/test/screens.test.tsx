import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import { ALL_ENTRIES } from '../registry';

/** Opens the prototype straight on a screen through its deep link. */
export function openAt(key: string) {
  window.location.hash = `#${key}`;
  return render(<App />);
}

const heading = () => screen.getByRole('heading', { level: 1 });

describe('every screen renders', () => {
  it.each(ALL_ENTRIES.map((e) => [e.key, e.title]))('%s · %s (oscuro, Paraguay)', (key, title) => {
    openAt(key);
    expect(heading()).toHaveTextContent(title);
    expect(window.location.hash).toBe(`#${key}`);
  });

  it.each(ALL_ENTRIES.map((e) => [e.key, e.title]))('%s · %s (claro, Argentina)', (key, title) => {
    openAt(key);
    fireEvent.click(screen.getByRole('radio', { name: 'Argentina' }));
    fireEvent.click(screen.getByRole('button', { name: 'Teléfono: cambiar a tema claro' }));
    expect(heading()).toHaveTextContent(title);
    expect(document.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light');
  });
});

// GitHub Pages is served from Linux: file names are case-sensitive there, unlike on Windows.
const ICON_FILES = new Set(readdirSync(resolve(__dirname, '../../public/ic')).map((f) => f.replace(/\.svg$/, '')));

describe('every icon drawn exists (exact case)', () => {
  it.each(ALL_ENTRIES.map((e) => [e.key]))('%s', (key) => {
    openAt(key);
    const used = [...document.querySelectorAll('[data-icon]')].map((n) => n.getAttribute('data-icon')!);
    const missing = [...new Set(used)].filter((n) => !ICON_FILES.has(n));
    expect(missing).toEqual([]);
  });
});
