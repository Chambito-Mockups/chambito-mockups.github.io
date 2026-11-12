/** The 390 × 844 phone with every screen and overlay, scaled to fit the stage. */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useApp } from '../store';
import { SCREENS } from '../registry';
import { HomeIndicator, StatusBar } from '../ui/kit';
import { CancelDialog, DetailsModal, SosDialog } from '../screens/passenger';
import { OfferSheet } from '../screens/driver';
import { R } from '../theme';
import { GuestSheet, ReportSheet } from '../market/buyer';
import { ActionsSheet, DraftSheet, LimitSheet } from '../market/seller';
import { ExplorerSheet } from '../ui/explorer';
import { useIsPhone, viewportHeight } from './device';

/* ---------------- Phone ---------------- */
/** `nonce` changes on «Reiniciar» so the screen remounts with a clean local state.
 *  `bare`: on a real phone, without the drawn frame, status bar or home indicator, `height` tall. */
export function Phone({ nonce = 0, bare = false, height = 844 }: { nonce?: number; bare?: boolean; height?: number }) {
  const { t, screen, overlay, toast, settings } = useApp();
  const Screen = SCREENS[screen];
  const frame = bare
    ? {}
    : { borderRadius: 44, outline: '1px solid var(--line2)', boxShadow: '0 30px 80px var(--phone-shadow), 0 0 0 10px var(--frame), 0 0 0 11px var(--frame-ring)' };
  return (
    <div
      data-theme={settings.theme}
      data-bare={bare || undefined}
      style={{ position: 'relative', width: 390, height, overflow: 'hidden', background: t.bg, color: t.text, flex: 'none', fontFamily: 'Roboto, sans-serif', transition: 'background .2s', ...frame }}
    >
      <div key={`${screen}-${nonce}`} className="screen-in" style={{ position: 'absolute', inset: 0 }}>
        <Screen />
      </div>
      {overlay === 'sos' && <SosDialog />}
      {overlay === 'details' && <DetailsModal />}
      {overlay === 'offer' && <OfferSheet />}
      {overlay === 'cancel' && <CancelDialog />}
      {overlay === 'report' && <ReportSheet />}
      {overlay === 'guest' && <GuestSheet />}
      {overlay === 'draft' && <DraftSheet />}
      {overlay === 'actions' && <ActionsSheet />}
      {overlay === 'limit' && <LimitSheet />}
      {overlay === 'explorer' && <ExplorerSheet />}
      {toast && (
        <div key={toast} role="status" className="toast" style={{ position: 'absolute', top: 116, left: '50%', transform: 'translateX(-50%)', background: t.name === 'dark' ? '#FFFFFF' : '#000000', color: t.name === 'dark' ? '#000000' : '#FFFFFF', borderRadius: 20, padding: '10px 16px', font: R(14, 500), zIndex: 70, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,.25)' }}>
          {toast}
        </div>
      )}
      {!bare && <StatusBar />}
      {!bare && <HomeIndicator />}
    </div>
  );
}

/** Shortest screen on a phone, in design pixels: below this the screen shrinks instead of getting shorter. */
const MIN_H = 660;

/** Scales the 390 × 844 phone (plus its 11 px frame) down to fit the available box.
 *  On a real phone the screen fills the display instead: full width, as tall as there is room for. */
export function FitPhone({ nonce = 0, gutter = 0 }: { nonce?: number; gutter?: number }) {
  const isPhone = useIsPhone();
  return isPhone ? <BarePhone nonce={nonce} /> : <FramedPhone nonce={nonce} gutter={gutter} />;
}

/** Escala y alto (en píxeles de diseño) de una pantalla sin marco que llena la caja `box`:
 *  todo el ancho y todo el alto que haya, o más chica si el alto no llega a MIN_H. Market y Auto v3 usan el mismo. */
export function useBareSize(box: React.RefObject<HTMLDivElement>) {
  const [size, setSize] = useState({ scale: 1, height: 844 });
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      // presentando: la caja entre el borde de arriba y la barra; si no, el alto visible
      const wrap = el.closest('.presenting') ? el.parentElement : null;
      const room = Math.max(320, wrap?.clientHeight || viewportHeight() - 16);
      const width = el.clientWidth || window.innerWidth;
      const scale = Math.min(width / 390, room / MIN_H, 1.2);
      setSize({ scale, height: Math.floor(room / scale) });
    };
    fit();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fit);
    ro?.observe(el);
    window.addEventListener('resize', fit);
    window.visualViewport?.addEventListener('resize', fit);
    return () => { ro?.disconnect(); window.removeEventListener('resize', fit); window.visualViewport?.removeEventListener('resize', fit); };
  }, [box]);
  return size;
}

function BarePhone({ nonce }: { nonce: number }) {
  const { t } = useApp();
  const box = useRef<HTMLDivElement>(null);
  const size = useBareSize(box);
  const { scale, height } = size;
  return (
    <div ref={box} className="bare-phone" style={{ width: '100%', display: 'flex', justifyContent: 'center', background: t.bg }}>
      <div style={{ width: 390 * scale, height: height * scale, overflow: 'hidden' }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <Phone nonce={nonce} bare height={height} />
        </div>
      </div>
    </div>
  );
}

function FramedPhone({ nonce = 0, gutter = 0 }: { nonce?: number; gutter?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const reserve = el.closest('.presenting') ? 120 : 40; // presentation bar below the phone
      const s = Math.min(1.15, (el.clientWidth - 30 - gutter) / 412, (window.innerHeight - Math.min(top, 240) - reserve) / 866);
      setScale(Math.max(0.5, s));
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener('resize', fit);
    return () => { ro.disconnect(); window.removeEventListener('resize', fit); };
  }, []);
  return (
    <div ref={box} style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: 11 * scale }}>
      <div style={{ width: 390 * scale, height: 844 * scale }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <Phone nonce={nonce} />
        </div>
      </div>
    </div>
  );
}
