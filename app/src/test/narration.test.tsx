import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';
import { NARRATION } from '../narration';
import { TOURS, entriesIn } from '../registry';

// una voz falsa: guarda lo que se lee y termina cuando el test lo pide
const said: string[] = [];
let finish: (() => void) | null = null;
beforeEach(() => {
  said.length = 0;
  finish = null;
  class Utterance { text: string; voice: unknown; lang = ''; rate = 1; onend: (() => void) | null = null; onerror: (() => void) | null = null; constructor(t: string) { this.text = t; } }
  (globalThis as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = Utterance;
  (window as unknown as { speechSynthesis: unknown }).speechSynthesis = {
    getVoices: () => [{ lang: 'es-MX', name: 'Sabina', localService: true }],
    speak: (u: Utterance) => { said.push(u.text); finish = () => u.onend?.(); },
    cancel: () => {},
  };
});
afterEach(() => {
  delete (window as unknown as { speechSynthesis?: unknown }).speechSynthesis;
  delete (globalThis as unknown as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance;
});

const start = (hash: string) => { window.location.hash = hash; return render(<App />); };
const bar = () => screen.getByRole('toolbar', { name: 'Presentación' });

describe('narración de Market', () => {
  it('cada pantalla de Market v3 y de sus recorridos tiene su explicación', () => {
    for (const e of entriesIn('market', 'v3')) expect(NARRATION.market[e.key], e.key).toBeTruthy();
    for (const t of TOURS.filter((x) => x.module === 'market')) for (const k of t.steps) expect(NARRATION.market[k], `${t.id}:${k}`).toBeTruthy();
  });

  it('🔊 lee la pantalla y la siguiente al avanzar', () => {
    start('#M06');
    fireEvent.keyDown(window, { key: 'p' });
    const voice = within(bar()).getByRole('button', { name: 'Narrar cada pantalla' });
    expect(voice).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(voice);
    expect(voice).toHaveAttribute('aria-pressed', 'true');
    expect(said.at(-1)).toBe(NARRATION.market.M06);
    fireEvent.click(within(bar()).getByRole('button', { name: 'Pantalla siguiente' }));
    expect(said.at(-1)).toBe(NARRATION.market.M06b);
  });

  it('en un recorrido, el paso siguiente llega cuando termina la narración', () => {
    vi.useFakeTimers();
    try {
      start('#M01');
      fireEvent.click(screen.getByRole('button', { name: 'Presentar: Comprar en la Tienda' }));
      fireEvent.click(within(bar()).getByRole('button', { name: 'Narrar cada pantalla' }));
      expect(said.at(-1)).toBe(NARRATION.market.MKm);
      // no avanza por tiempo mientras habla
      act(() => { vi.advanceTimersByTime(20000); });
      expect(within(bar()).getByText(/Comprar en la Tienda · 1 de/)).toBeInTheDocument();
      act(() => { finish?.(); vi.advanceTimersByTime(800); });
      expect(within(bar()).getByText(/Comprar en la Tienda · 2 de/)).toBeInTheDocument();
      expect(said.at(-1)).toBe(NARRATION.market.M01);
    } finally {
      vi.useRealTimers();
    }
  });
});
