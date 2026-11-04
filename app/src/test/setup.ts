// jsdom lacks a few browser APIs the prototype uses.
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

class RO { observe() {} unobserve() {} disconnect() {} }
(globalThis as unknown as { ResizeObserver: typeof RO }).ResizeObserver = RO;
Element.prototype.scrollTo = function () {} as typeof Element.prototype.scrollTo;
HTMLElement.prototype.setPointerCapture = function () {};

afterEach(() => {
  cleanup();
  window.location.hash = '';
  localStorage.clear();
});
