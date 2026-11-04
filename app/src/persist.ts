/**
 * Keeps the demo state between reloads (localStorage). Everything lives under one prefix
 * so "Restablecer demo" can wipe it in one go. Bump the version when shapes change.
 */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

const PREFIX = 'chambito:v1:';

function storage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null; // private mode or blocked storage: the demo still works, it just forgets
  }
}

export function load<T>(key: string, fallback: T): T {
  const raw = storage()?.getItem(PREFIX + key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown) {
  try {
    storage()?.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* quota or blocked: ignore */
  }
}

/** Removes every saved value of the demo. */
export function clearDemo() {
  const s = storage();
  if (!s) return;
  Object.keys(s).filter((k) => k.startsWith(PREFIX)).forEach((k) => s.removeItem(k));
}

/**
 * `useState` that survives reloads. `decode` / `encode` adapt values JSON can't hold (e.g. a Set).
 */
export function usePersistent<T, S = T>(key: string, init: T | (() => T), codec?: { encode: (v: T) => S; decode: (s: S) => T }): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const fallback = typeof init === 'function' ? (init as () => T)() : init;
    const stored = load<S | undefined>(key, undefined);
    if (stored === undefined) return fallback;
    try {
      return codec ? codec.decode(stored) : (stored as unknown as T);
    } catch {
      return fallback;
    }
  });
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; } // don't write the initial value back
    save(key, codec ? codec.encode(value) : value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);
  return [value, setValue];
}

export const setCodec = { encode: (s: Set<string>) => [...s], decode: (a: string[]) => new Set(a) };
