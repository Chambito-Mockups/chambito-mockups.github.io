/** Opened on a real phone (Android or iPhone): the screen fills the display, without the drawn frame. */
import { useEffect, useState } from 'react';

export const PHONE_QUERY = '(max-width: 600px)';

const matches = () => typeof window !== 'undefined' && !!window.matchMedia?.(PHONE_QUERY).matches;

export function useIsPhone() {
  const [on, setOn] = useState(matches);
  useEffect(() => {
    const mq = window.matchMedia?.(PHONE_QUERY);
    if (!mq) return;
    const on = () => setOn(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return on;
}

/** Visible height of the browser (follows the address bar of Safari and Chrome as it hides and shows). */
export function viewportHeight() {
  return Math.round(window.visualViewport?.height ?? window.innerHeight);
}
