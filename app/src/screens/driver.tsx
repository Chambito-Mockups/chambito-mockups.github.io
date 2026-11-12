import { CSSProperties, useEffect, useState } from 'react';
import { useApp } from '../store';
import { P, R } from '../theme';
import { AutoMap } from '../ui/AutoMap';
import {
  AppBar, Avatar, Badge, Button, CircleButton, Icon, IconCircle, LinearProgress, LinkText, ListRow, Sheet, SlideToConfirm, SosButton, StatTile, Stars,
} from '../ui/kit';
import { TripChat } from './passenger';
import { FloatingNav, useAutoAdvance, useSeconds } from './common';

const pretty = { textWrap: 'pretty' } as CSSProperties;

/* ================= D0 Sumate como conductor ================= */
export function D0() {
  const { t, d, go } = useApp();
  const inner = t.name === 'dark' ? t.sheet : t.bg;
  return (
    <>
      <div style={{ position: 'absolute', top: 47, left: 0, right: 0, bottom: 0, padding: '8px 20px 128px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <span style={{ font: P(28) }}>Auto</span>
        <div style={{ background: t.cardOnBg, borderRadius: 24, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <IconCircle icon="car" size={56} iconSize={40} bg={t.well} />
          <span style={{ font: P(26) }}>Sumate como conductor</span>
          <span style={{ font: R(15), color: t.text2, ...pretty }}>Ganá con tu auto, cuando quieras.</span>
          <div style={{ background: inner, borderRadius: 16, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: R(13), color: t.text2 }}>Un viaje promedio en {d.avgEarn.city} deja</span>
            <span style={{ font: P(22) }}>{d.currency(d.avgEarn.amount)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ font: P(18) }}>Qué necesitás</span>
          {[
            ['user', 'Licencia de conducir vigente'],
            ['car', 'Auto con título o cédula verde'],
            ['shield', 'Seguro vigente'],
          ].map(([icon, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <IconCircle icon={icon} />
              <span style={{ font: R(15, 500) }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto' }}>
          <Button onClick={() => go('D1')}>Empezar</Button>
        </div>
      </div>
      <FloatingNav active="auto" />
    </>
  );
}

/* ================= D1 Requisitos de conductor ================= */
type Slot = 'titulo' | 'frente' | 'lateral' | 'patente';
export function D1() {
  const { t, d, back, go, showToast, setDocsSubmitted } = useApp();
  const [up, setUp] = useState<Record<Slot, boolean>>({ titulo: false, frente: false, lateral: false, patente: false });
  const photos = up.frente && up.lateral && up.patente;
  const count = 3 + (up.titulo ? 1 : 0) + (photos ? 1 : 0);
  const ready = count === 5;
  const toggle = (s: Slot) => setUp((u) => ({ ...u, [s]: !u[s] }));
  const doneRows = [
    { icon: 'user', title: 'Licencia de conducir', sub: 'Frente y dorso · vence 03/2029' },
    { icon: 'car', title: 'Datos del vehículo', sub: `${d.driver.make} ${d.driver.detail.split(' · ')[1]} · ${d.driver.detail.split(' · ')[0]} · ${d.driver.plate}` },
    { icon: 'shield', title: 'Seguro vigente', sub: 'Póliza · vence 12/2027' },
  ];
  const slotStyle = (on: boolean, h: number, r: number): CSSProperties => ({
    height: h,
    borderRadius: r,
    border: on ? `1.5px solid ${t.green}` : `1.5px dashed ${t.dashed}`,
    background: on ? t.greenSoft : 'transparent',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: h > 90 ? 6 : 4,
    width: '100%',
  });
  return (
    <>
      <AppBar title="Conductor" onBack={back} />
      <div style={{ position: 'absolute', top: 111, left: 0, right: 0, bottom: 0, padding: '0 20px 42px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: R(13, 500), color: t.text2 }}>{count} de 5 requisitos</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} style={{ height: 4, borderRadius: 2, background: i < count ? t.green : t.track, transition: 'background .3s' }} />
            ))}
          </div>
        </div>
        {doneRows.map((r) => (
          <button key={r.title} className="press" onClick={() => showToast('Requisito completo')} style={{ background: t.cardOnBg, borderRadius: 16, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
            <IconCircle icon={r.icon} size={40} iconSize={r.icon === 'car' ? 22 : 20} bg={t.well} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ font: R(15, 500) }}>{r.title}</span>
              <span style={{ font: R(13), color: t.text2 }}>{r.sub}</span>
            </div>
            <Icon name="success" size={22} color={t.success} />
          </button>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: R(15, 500) }}>Título o cédula verde</span>
          <button className="press" onClick={() => toggle('titulo')} style={slotStyle(up.titulo, 96, 16)}>
            <Icon name={up.titulo ? 'success' : 'upload'} size={24} color={up.titulo ? t.success : t.icon} />
            <span style={{ font: R(14, 500) }}>{up.titulo ? 'cedula-verde.pdf · Cargado' : 'Subir foto o PDF'}</span>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: R(15, 500) }}>Fotos del auto</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {(['frente', 'lateral', 'patente'] as const).map((s) => (
              <button key={s} className="press" onClick={() => toggle(s)} style={slotStyle(up[s], 84, 12)}>
                <Icon name={up[s] ? 'success' : 'camera'} size={20} color={up[s] ? t.success : t.icon} />
                <span style={{ font: R(12), color: t.text2 }}>{s[0].toUpperCase() + s.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>
        <Button kind={ready ? 'primary' : 'disabled'} style={{ marginTop: 'auto' }} onClick={() => { setDocsSubmitted(true); go('D2', { replace: true }); showToast('Enviado a revisión'); }}>
          Enviar a revisión
        </Button>
      </div>
    </>
  );
}

/* ================= D2 Revisión y vencimientos ================= */
export function D2() {
  const { t, back, showToast } = useApp();
  const [resent, setResent] = useState(false);
  const card: CSSProperties = { background: t.cardOnBg, borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
  return (
    <>
      <AppBar title="Mis documentos" onBack={back} />
      <div className="scroll" style={{ position: 'absolute', top: 111, left: 0, right: 0, bottom: 0, padding: '0 20px 42px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
        <div style={{ background: t.cardOnBg, borderRadius: 12, padding: 12, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Icon name="warning" size={18} color={t.warn} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ font: R(14, 500), color: t.warn }}>Tu seguro vence en 12 días</span>
            <span style={{ font: R(13), color: t.text2 }}>Subí la nueva antes del 16/11.</span>
          </div>
        </div>
        <div style={card}><span style={{ font: R(15, 500) }}>Licencia de conducir</span><Badge>Aprobado</Badge></div>
        <div style={card}><span style={{ font: R(15, 500) }}>Datos del vehículo</span><Badge>Aprobado</Badge></div>
        <div style={card}><span style={{ font: R(15, 500) }}>Título o cédula verde</span><Badge tone="warn" outline>En revisión</Badge></div>
        {resent ? (
          <div style={card}><span style={{ font: R(15, 500) }}>Fotos del auto</span><Badge tone="warn" outline>En revisión</Badge></div>
        ) : (
          <div style={{ ...card, flexDirection: 'column', alignItems: 'stretch', gap: 10, outline: `1.5px solid ${t.error}`, outlineOffset: -1.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ font: R(15, 500) }}>Fotos del auto</span>
              <Badge tone="error" outline>Rechazado</Badge>
            </div>
            <span style={{ font: R(14), color: t.text2, ...pretty }}>No se lee la patente.</span>
            <LinkText onClick={() => { setResent(true); showToast('Fotos enviadas otra vez'); }}>Volver a enviar</LinkText>
          </div>
        )}
        <div style={card}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: R(15, 500) }}>Seguro vigente</span>
            <span style={{ font: R(13), color: t.warn }}>Vence el 16/11/2026</span>
          </div>
          <LinkText onClick={() => showToast('Subí la póliza nueva')}>Actualizar</LinkText>
        </div>
      </div>
    </>
  );
}

/* ================= D3 Modo conductor ================= */
export function D3() {
  const { t, d, go, overlay, setOverlay, driverAvailable: on, setDriverAvailable } = useApp();
  const [heat, setHeat] = useState(true);
  useAutoAdvance(4000, () => setOverlay('offer'), on && overlay === null);
  return (
    <>
      <AutoMap variant="heat" heat={heat && on} drop />
      <div style={{ position: 'absolute', top: 55, left: 20, right: 20, background: t.sheet, borderRadius: 20, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, zIndex: 11 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: R(13, 500), color: t.text2 }}>Tu estado</span>
          <span style={{ font: P(18) }}>{on ? 'Disponible para viajes' : 'No disponible'}</span>
          <span style={{ font: R(13), color: t.text2 }}>{on ? 'Buscando pasajeros cerca tuyo' : 'Activá para recibir viajes'}</span>
        </div>
        <button
          role="switch"
          aria-checked={on}
          aria-label="Disponible para viajes"
          onClick={() => setDriverAvailable(!on)}
          style={{ width: 52, height: 32, borderRadius: 16, background: on ? t.switchOn : t.border, display: 'flex', alignItems: 'center', padding: 4, boxSizing: 'border-box', flex: 'none', transition: 'background .2s' }}
        >
          <span style={{ width: 24, height: 24, borderRadius: 12, background: '#FFFFFF', transform: `translateX(${on ? 20 : 0}px)`, transition: 'transform .2s' }} />
        </button>
      </div>
      {heat && on && <span className="fade-in" style={{ position: 'absolute', top: 200, left: 118, font: P(13), color: t.success, zIndex: 2 }}>×1,4</span>}
      <Sheet bottomPad={112} gap={14}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 8 }}>
          <StatTile label="Viajes de hoy" value={String(d.today.trips)} size={22} />
          <StatTile label="Ganancias de hoy" value={d.currency(d.today.earnings)} size={22} onClick={() => go('D9')} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="press" onClick={() => setHeat(!heat)} aria-pressed={heat} style={{ height: 36, borderRadius: 18, background: t.chip, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', font: R(13, 500), color: heat ? t.text : t.text2 }}>
            {heat ? <Icon name="success" size={16} color={t.green} /> : <span style={{ width: 16, height: 16, borderRadius: 8, border: `2px solid ${t.text3}`, boxSizing: 'border-box' }} />}
            {heat ? 'Zonas con demanda' : 'Apagada'}
          </button>
          {heat && <span style={{ font: R(13), color: t.text2 }}>Más en {d.today.hotspot}</span>}
        </div>
      </Sheet>
      <FloatingNav active="auto" />
    </>
  );
}

/* ================= D4 IncomingOfferSheet (overlay above any screen) ================= */
export function OfferSheet() {
  const { t, d, setOverlay, go, showToast } = useApp();
  const secs = useSeconds();
  const total = 15;
  const left = Math.max(0, total - secs);
  useEffect(() => {
    if (left === 0) {
      setOverlay(null);
      showToast('La oferta venció');
    }
  }, [left, setOverlay, showToast]);
  return (
    <>
      <div className="fade-in" style={{ position: 'absolute', inset: 0, background: t.scrimOffer, zIndex: 50 }} />
      <div role="dialog" aria-label="Nuevo viaje" className="sheet-in" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: t.sheet, borderRadius: '24px 24px 0 0', padding: '8px 20px 42px', display: 'flex', flexDirection: 'column', gap: 16, zIndex: 51 }}>
        <span style={{ alignSelf: 'center', width: 36, height: 4, borderRadius: 2, background: t.handle }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Badge size={13}>Nuevo viaje · Económico</Badge>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="15" fill="none" stroke={t.card} strokeWidth="4" />
              <circle cx="18" cy="18" r="15" fill="none" stroke={t.green} strokeWidth="4" strokeLinecap="round" strokeDasharray="94" strokeDashoffset={94 * (1 - left / total)} style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <span style={{ font: R(14, 500) }}>Vence en 0:{String(left).padStart(2, '0')}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: R(14), color: t.text2 }}>Vas a ganar</span>
          <span style={{ font: P(32) }}>{d.currency(d.offer.earn)}</span>
          <span style={{ font: R(13), color: t.text2 }}>{d.offer.payment}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <StatTile label="Llegás en" value={d.offer.toPickup} />
          <StatTile label="Duración del viaje" value={d.offer.duration} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: t.green }} />
            <span style={{ flex: 1, width: 2, background: t.dividerStrong }} />
            <span style={{ width: 10, height: 10, borderRadius: 2, background: t.map.dest }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ font: R(15, 500) }}>{d.offer.fromHood}</span>
              <span style={{ font: R(13), color: t.text2 }}>Hasta el lugar del servicio · {d.offer.fromKm}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ font: R(15, 500) }}>{d.offer.toHood}</span>
              <span style={{ font: R(13), color: t.text2 }}>{d.offer.toKm} de viaje</span>
            </div>
          </div>
        </div>
        <LinkText onClick={() => showToast('La dirección exacta se muestra al aceptar')}>Ver detalle</LinkText>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 12 }}>
          <Button kind="secondary" height={56} onClick={() => setOverlay(null)}>Ahora no</Button>
          <Button height={56} onClick={() => go('D5')}>Aceptar</Button>
        </div>
      </div>
    </>
  );
}

/* Turn-by-turn card shared by D5 and D7 */
function NavCard({ icon, distance, instruction, voice }: { icon: string; distance: string; instruction: string; voice?: boolean }) {
  const { t, showToast } = useApp();
  const [muted, setMuted] = useState(false);
  return (
    <div style={{ position: 'absolute', top: 55, left: 20, right: 20, background: t.sheet, borderRadius: 20, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, zIndex: 11 }}>
      <Icon name={icon} size={44} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: P(22) }}>{distance}</span>
        <span style={{ font: R(15), color: t.text2 }}>{instruction}</span>
      </div>
      {voice && (
        <CircleButton icon="volumeOn" size={44} bg={t.btn2} label={muted ? 'Activar voz' : 'Silenciar voz'} style={{ opacity: muted ? 0.5 : 1 }} onClick={() => { setMuted(!muted); showToast(muted ? 'Voz activada' : 'Voz silenciada'); }} />
      )}
    </div>
  );
}

/* ================= D5 Ir a buscar ================= */
export function D5() {
  const { t, d, go, settings } = useApp();
  const [chat, setChat] = useState(false);
  const secs = useSeconds();
  const m = Math.max(10, 200 - secs * 15);
  return (
    <>
      <AutoMap variant="driver" drop offsetY={140} />
      <NavCard icon="turnLeft" distance={`${m} m`} instruction={`Girá a la izquierda en ${settings.country === 'PY' ? 'Av. Brasilia' : 'Gallo'}`} voice />
      <Sheet>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar initials={d.passenger.initials} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: P(16) }}>Buscá a {d.passenger.name}</span>
            <span style={{ font: R(13), color: t.text2 }}>{d.passenger.pickup} · {d.offer.toPickup}</span>
          </div>
          <CircleButton icon="messageCircle" bg={t.btn2} label="Chat" onClick={() => setChat(true)} />
        </div>
        <span style={{ font: R(14), color: t.text2 }}>Referencia: {d.passenger.reference}</span>
        <Button onClick={() => go('D6', { replace: true })}>Llegué</Button>
      </Sheet>
      {chat && <TripChat side="driver" onClose={() => setChat(false)} />}
    </>
  );
}

/* ================= D6 PIN de inicio ================= */
export function D6() {
  const { t, d, back, go, showToast } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const press = (k: string) => {
    if (error) return;
    if (k === 'del') return setPin((p) => p.slice(0, -1));
    setPin((p) => (p.length < 4 ? p + k : p));
  };
  useEffect(() => {
    if (pin.length < 4) return;
    if (pin === d.pin) {
      const id = window.setTimeout(() => { showToast('PIN correcto · viaje iniciado'); go('D7', { replace: true }); }, 250);
      return () => window.clearTimeout(id);
    }
    setError(true);
    const id = window.setTimeout(() => { setPin(''); setError(false); }, 1100);
    return () => window.clearTimeout(id);
  }, [pin, d.pin, go, showToast]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) press(e.key);
      if (e.key === 'Backspace') press('del');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  return (
    <>
      <AppBar onBack={back} />
      <div style={{ position: 'absolute', top: 111, left: 0, right: 0, bottom: 0, padding: '12px 20px 42px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ font: P(26) }}>Pedile el PIN a {d.passenger.name}</span>
          <span style={{ font: R(15), color: error ? t.error : t.text2, ...pretty }}>
            {error ? 'El PIN no coincide. Pedíselo de nuevo.' : 'Lo ve en su app.'}
          </span>
        </div>
        <div className={error ? 'shake' : undefined} style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          {[0, 1, 2, 3].map((i) => {
            const focus = i === pin.length && !error;
            return (
              <span key={i} style={{ width: 64, height: 76, borderRadius: 14, background: t.cardOnBg, border: `2px solid ${error ? t.error : focus ? t.green : 'transparent'}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', font: P(32) }}>
                {pin[i] ?? (focus ? <span className="blink" style={{ width: 2, height: 32, background: t.text }} /> : null)}
              </span>
            );
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 'auto' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((k, i) =>
            k === '' ? (
              <span key={i} />
            ) : (
              <button key={i} className="press key" aria-label={k === 'del' ? 'Borrar' : k} onClick={() => press(k)} style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', font: P(26), borderRadius: 16 }}>
                {k === 'del' ? <Icon name="arrowLeft" size={24} /> : k}
              </button>
            ),
          )}
        </div>
      </div>
    </>
  );
}

/* ================= D7 En viaje ================= */
export function D7() {
  const { t, d, trip, go, setOverlay, settings } = useApp();
  const secs = useSeconds();
  const m = Math.max(100, 800 - secs * 25);
  const street = settings.country === 'PY' ? 'Av. Santa Teresa' : 'Av. Córdoba';
  const pay = d.driverPayment === 'cash' ? `Efectivo · ${d.currency(d.driverFare)}` : `Mercado Pago · ${d.currency(d.driverFare)}`;
  return (
    <>
      <AutoMap variant="trip" drop offsetY={140} />
      <NavCard icon="arrowUp" distance={`${m} m`} instruction={`Seguí por ${street}`} />
      <Sheet>
        <SosButton onClick={() => setOverlay('sos')} style={{ position: 'absolute', top: -68, right: 20 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ font: P(22) }}>Hacia {trip.destination}</span>
          <span style={{ font: R(14), color: t.text2 }}>Llegás {d.arrival} · {d.remaining}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Badge size={12}>{d.passenger.name} a bordo</Badge>
          <span style={{ font: R(13), color: t.text2 }}>{pay}</span>
        </div>
        <SlideToConfirm label="Deslizá para finalizar el viaje" onConfirm={() => go('D8', { replace: true })} />
      </Sheet>
    </>
  );
}

/* ================= D8 Cierre y cobro ================= */
export function D8() {
  const { t, d, trip, go, setDriverAvailable, showToast } = useApp();
  const [stars, setStars] = useState(5);
  const commission = d.driverFare - d.offer.earn;
  const cash = d.driverPayment === 'cash';
  return (
    <div style={{ position: 'absolute', top: 47, left: 0, right: 0, bottom: 0, padding: '24px 20px 42px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ font: R(14, 500), color: t.text2 }}>Viaje terminado · {trip.destination}</span>
        <span style={{ font: P(28), ...pretty }}>{cash ? `Cobrá ${d.currency(d.driverFare)} en efectivo` : `Cobrado: ${d.currency(d.driverFare)} con Mercado Pago`}</span>
      </div>
      <div style={{ background: t.cardOnBg, borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ font: R(14), color: t.text2 }}>Tarifa cerrada</span>
          <span style={{ font: R(14, 500) }}>{d.currency(d.driverFare)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ font: R(14), color: t.text2 }}>Comisión Chambito ({d.commissionPct} %)</span>
          <span style={{ font: R(14, 500) }}>− {d.currency(commission)}</span>
        </div>
        <div style={{ height: 1, background: t.dividerStrong }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ font: R(15, 500) }}>Tu ganancia</span>
          <span style={{ font: P(22) }}>{d.currency(d.offer.earn)}</span>
        </div>
        {cash && <span style={{ font: R(13), color: t.warn, ...pretty }}>Se descuenta en la próxima liquidación.</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ font: P(18) }}>¿Cómo fue viajar con {d.passenger.name}?</span>
        <Stars value={stars} onChange={setStars} size={40} />
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button onClick={() => { setDriverAvailable(true); go('D3', { replace: true }); showToast('Volviste a estar disponible'); }}>{cash ? 'Cobré · volver a disponible' : 'Volver a disponible'}</Button>
        <Button kind="secondary" onClick={() => showToast('Abrimos un caso con Soporte')}>Reportar un problema</Button>
      </div>
    </div>
  );
}

/* ================= D9 Billetera ================= */
export function D9() {
  const { t, d, back } = useApp();
  const w = d.wallet;
  return (
    <>
      <AppBar title="Billetera" onBack={back} />
      <div className="scroll" style={{ position: 'absolute', top: 111, left: 0, right: 0, bottom: 0, padding: '0 20px 42px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
        <div style={{ background: t.cardOnBg, borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ font: R(13), color: t.text2 }}>Ganancias de la semana</span>
          <span style={{ font: P(32) }}>{d.currency(w.week)}</span>
          <span style={{ font: R(13), color: t.text2 }}>Próxima liquidación: {w.nextPayout}</span>
        </div>
        <div style={{ background: t.cardOnBg, borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ font: R(15, 500) }}>Deuda de comisión</span>
            <span style={{ font: P(18), color: w.debt ? t.warn : t.success }}>{d.currency(w.debt)}</span>
          </div>
          <LinearProgress value={(w.debt / w.cap) * 100} color={t.warn} height={6} track={t.dividerStrong} />
          <span style={{ font: R(13), color: t.text2 }}>
            {d.cashAllowed ? `Tope ${d.currency(w.cap)} para seguir cobrando en efectivo.` : 'Sin deuda: cobrás con Mercado Pago.'}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ font: P(18), paddingBottom: 8 }}>Movimientos</span>
          {w.moves.map((m) => (
            <ListRow key={m.title} icon={m.icon} title={m.title} subtitle={m.detail} pad={10} trailing={<span style={{ font: P(15), color: m.positive ? t.success : t.text }}>{d.currency(m.amount)}</span>} />
          ))}
        </div>
      </div>
    </>
  );
}
