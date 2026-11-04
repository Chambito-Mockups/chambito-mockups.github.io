/** The 390 × 844 phone with every screen and overlay, scaled to fit the stage. */
import { useLayoutEffect, useRef, useState } from 'react';
import { useApp } from '../store';
import { SCREENS } from '../registry';
import { HomeIndicator, StatusBar } from '../ui/kit';
import { CancelDialog, DetailsModal, SosDialog } from '../screens/passenger';
import { OfferSheet } from '../screens/driver';
import { R } from '../theme';
import { GuestSheet, ReportSheet } from '../market/buyer';
import { ActionsSheet, DraftSheet, LimitSheet } from '../market/seller';

/* ---------------- Phone ---------------- */
/** `nonce` changes on «Reiniciar» so the screen remounts with a clean local state. */
export function Phone({ nonce = 0 }: { nonce?: number }) {
  const { t, screen, overlay, toast, settings } = useApp();
  const Screen = SCREENS[screen];
  return (
    <div
      data-theme={settings.theme}
      style={{ position: 'relative', width: 390, height: 844, borderRadius: 44, overflow: 'hidden', background: t.bg, color: t.text, flex: 'none', outline: '1px solid var(--line2)', boxShadow: '0 30px 80px var(--phone-shadow), 0 0 0 10px var(--frame), 0 0 0 11px var(--frame-ring)', fontFamily: 'Roboto, sans-serif', transition: 'background .2s' }}
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
      {toast && (
        <div key={toast} role="status" className="toast" style={{ position: 'absolute', top: 116, left: '50%', transform: 'translateX(-50%)', background: t.name === 'dark' ? '#FFFFFF' : '#000000', color: t.name === 'dark' ? '#000000' : '#FFFFFF', borderRadius: 20, padding: '10px 16px', font: R(14, 500), zIndex: 70, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,.25)' }}>
          {toast}
        </div>
      )}
      <StatusBar />
      <HomeIndicator />
    </div>
  );
}

/** Scales the 390 × 844 phone (plus its 11 px frame) down to fit the available box. */
export function FitPhone({ nonce = 0 }: { nonce?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const reserve = el.closest('.presenting') ? 120 : 40; // presentation bar below the phone
      const s = Math.min(1.15, (el.clientWidth - 30) / 412, (window.innerHeight - Math.min(top, 160) - reserve) / 866);
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
