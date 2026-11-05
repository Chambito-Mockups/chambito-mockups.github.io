import { usePersistent } from '../persist';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { paymentLabel, tripPrice, useApp } from '../store';
import { P, R } from '../theme';
import { AutoMap } from '../ui/AutoMap';
import {
  Avatar, Badge, Banner, Button, Chip, CircleButton, HubTopChrome, Icon, IconCircle, LinearProgress, LinkText, ListRow, LocationFab,
  PinBoxes, Plate, RouteSummary, Row, SectionLabel, Sheet, SosButton, Stars, StepProgress, TrackingTopChrome, VehicleCard,
} from '../ui/kit';
import { FloatingNav, useAutoAdvance, useSeconds } from './common';
import { BottomSheet, QuickChatSheet } from '../ui/sheets';

const pretty = { textWrap: 'pretty' } as CSSProperties;

/* ================= A0 Portada de Auto ================= */
export function A0() {
  const { t, d, go, setTrip, showToast } = useApp();
  const [adding, setAdding] = useState(false);
  const [extra, setExtra] = usePersistent<string[]>('auto.places', []);
  return (
    <>
      <AutoMap variant="base" drop />
      <HubTopChrome onSearch={() => go('A2')} onProfile={() => go('perfil')} />
      <Sheet bottomPad={112}>
        <LocationFab onClick={() => showToast('Centrado en tu ubicación')} />
        <button className="press" onClick={() => go('A2')} style={{ height: 56, borderRadius: 28, background: t.card, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px' }}>
          <Icon name="search" size={22} />
          <span style={{ font: P(18) }}>¿A dónde vas?</span>
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SectionLabel>Mis lugares</SectionLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            {d.savedPlaces.slice(0, 2).map((p) => (
              <Chip key={p.label} icon={p.icon} onClick={() => go('A2')}>{p.label}</Chip>
            ))}
            {extra.map((x) => (
              <Chip key={x} icon="bookmark" onClick={() => { setTrip({ destination: x }); go('A3'); }}>{x}</Chip>
            ))}
            {extra.length < 2 && <Chip icon="plus" onClick={() => setAdding(true)}>Agregar</Chip>}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <SectionLabel style={{ paddingBottom: 4 }}>Viajes recientes</SectionLabel>
          {d.recents.map((r) => (
            <ListRow key={r.name} icon="clock" title={r.name} subtitle={r.detail} onClick={() => { setTrip({ destination: r.name }); go('A3'); }} />
          ))}
        </div>
      </Sheet>
      <FloatingNav active="auto" />
      {adding && <AddPlaceSheet taken={extra} onClose={() => setAdding(false)} onAdd={(x) => { setExtra((e) => [...e, x]); setAdding(false); showToast(`«${x}» guardado en Mis lugares`); }} />}
    </>
  );
}

function AddPlaceSheet({ taken, onAdd, onClose }: { taken: string[]; onAdd: (label: string) => void; onClose: () => void }) {
  const { t } = useApp();
  const [label, setLabel] = useState('');
  const ideas = ['Gimnasio', 'Facultad', 'Casa de mamá'].filter((x) => !taken.includes(x));
  const ok = label.trim().length > 1 && !taken.includes(label.trim());
  return (
    <BottomSheet onClose={onClose} label="Agregar un lugar" title="Agregar un lugar">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {ideas.map((x) => <Chip key={x} icon="bookmark" selected={label === x} onClick={() => setLabel(x)}>{x}</Chip>)}
      </div>
      <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Nombre del lugar" aria-label="Nombre del lugar" style={{ height: 48, borderRadius: 14, background: t.mSurface, padding: '0 14px', font: R(15), color: t.text }} />
      <Button kind={ok ? 'primary' : 'disabled'} onClick={() => ok && onAdd(label.trim())}>Guardar lugar</Button>
    </BottomSheet>
  );
}

/** Masked chat during a trip. The automatic answer is demo only. */
export function TripChat({ side, onClose }: { side: 'passenger' | 'driver'; onClose: () => void }) {
  const { d, trip } = useApp();
  const where = trip.phase === 'ontrip' ? `Vamos bien, llegamos a las ${d.arrival}.` : trip.phase === 'arrived' ? 'Ya estoy en el punto de encuentro.' : `Estoy a ${d.etaMin} min, en un ${d.driver.make}.`;
  if (side === 'passenger')
    return (
      <QuickChatSheet
        name={d.driver.first}
        initials={d.driver.initials}
        replies={['Ya bajo', 'Estoy en la puerta', '¿Dónde estás?', 'Gracias']}
        answer={(m) => (m.includes('?') ? where : 'Perfecto, te espero.')}
        onClose={onClose}
      />
    );
  return (
    <QuickChatSheet
      name={d.passenger.name}
      initials={d.passenger.initials}
      replies={['Estoy llegando', 'Ya llegué', `Estoy en un ${d.driver.make}`, '¿Dónde te espero?']}
      answer={(m) => (m.includes('?') ? d.passenger.reference : '¡Genial, ya bajo!')}
      onClose={onClose}
    />
  );
}

/* Status of the active trip, shared by A0b and Actividad */
export function useTripStatus() {
  const { d, trip } = useApp();
  switch (trip.phase) {
    case 'searching': return { label: 'Buscando conductor', screen: 'A5' as const };
    case 'assigned': return { label: `${d.driver.onTheWay} · ${d.etaMin} min`, screen: 'A6' as const };
    case 'arrived': return { label: 'Tu conductor llegó', screen: 'A7' as const };
    case 'ontrip': return { label: 'Viaje en curso', screen: 'A8' as const };
    default: return { label: '', screen: 'A0' as const };
  }
}

/* ================= A0b Portada con viaje activo ================= */
export function A0b() {
  const { t, d, trip, go } = useApp();
  const st = useTripStatus();
  const hasDriver = trip.phase !== 'searching';
  return (
    <>
      <AutoMap variant={trip.phase === 'searching' ? 'search' : 'driver'} drop offsetY={20} />
      <HubTopChrome onSearch={() => go('A2')} onProfile={() => go('perfil')} />
      <Sheet bottomPad={112}>
        <button className="press" onClick={() => go(st.screen)} style={{ background: t.card, borderRadius: 20, padding: 14, display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
            {hasDriver ? <Avatar initials={d.driver.initials} /> : <IconCircle icon="car" size={48} iconSize={24} bg={t.well} />}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ font: P(16) }}>Tu viaje a {trip.destination}</span>
              <Badge>{st.label}</Badge>
            </div>
            <Icon name="chevronRight" size={18} color={t.text2} />
          </div>
          {hasDriver && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Plate text={d.driver.plate} size="sm" />
              <span style={{ font: R(14), color: t.text2 }}>{d.driver.short}</span>
            </div>
          )}
        </button>
      </Sheet>
      <FloatingNav active="auto" />
    </>
  );
}

/* ================= A2 ¿A dónde vas? (paso 1 de 3) ================= */
export function A2() {
  const { t, d, back, go, setTrip } = useApp();
  const [q, setQ] = useState(d.destination.name.slice(0, 12));
  const [focus, setFocus] = useState(true);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); }, []);
  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  // matches first, then recents, as in the design (match + «Reciente»)
  const matches = q.trim() ? d.searchPlaces.filter((p) => norm(p.name + ' ' + p.detail).includes(norm(q.trim()))) : [];
  const results = q.trim() ? [...matches, ...d.searchPlaces.filter((p) => p.icon === 'clock' && !matches.includes(p))] : d.searchPlaces;
  const pick = (name: string) => {
    setTrip({ destination: name });
    go('A3');
  };
  return (
    <>
      <AutoMap variant="origin" drop offsetY={-100} />
      <div style={{ position: 'absolute', top: 55, left: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 11 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <CircleButton icon="arrowLeft" onClick={back} label="Atrás" />
        </div>
        <div style={{ background: t.sheet, borderRadius: 20, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ font: P(18) }}>¿A dónde vas?</span>
          <span style={{ font: R(14), color: t.text2 }}>Elegí el destino y te mostramos el precio</span>
        </div>
      </div>
      <Sheet>
        <StepProgress step={1} total={3} />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ position: 'absolute', left: 21, top: 30, bottom: 30, width: 2, background: t.dividerStrong }} />
          <div style={{ height: 52, borderRadius: 16, background: t.card, display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px' }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: t.green, flex: 'none' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ font: R(12), color: t.text2 }}>Desde</span>
              <span style={{ font: R(15, 500) }}>Tu ubicación · {d.myLocation}</span>
            </div>
          </div>
          <label style={{ height: 52, borderRadius: 16, background: t.card, outline: focus ? `2px solid ${t.green}` : 'none', outlineOffset: -2, display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px', cursor: 'text' }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: t.map.dest, flex: 'none' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span style={{ font: R(12), color: t.text2 }}>Hasta</span>
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onKeyDown={(e) => e.key === 'Enter' && results[0] && pick(results[0].name)}
                placeholder="¿A dónde vas?"
                aria-label="Destino"
                style={{ font: R(15, 500), color: t.text, caretColor: t.link, padding: 0, height: 18 }}
              />
            </div>
            {q && (
              <button aria-label="Borrar" onClick={() => setQ('')} style={{ display: 'flex' }}>
                <Icon name="close" size={18} color={t.text2} />
              </button>
            )}
          </label>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SectionLabel>Mis lugares</SectionLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            {d.savedPlaces.map((p) => (
              <Chip key={p.label} icon={p.icon} onClick={() => pick(p.label)}>{p.label}</Chip>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 128 }}>
          <SectionLabel style={{ paddingBottom: 4 }}>Resultados</SectionLabel>
          {results.slice(0, 2).map((p) => (
            <ListRow key={p.name} icon={p.icon} title={p.name} subtitle={p.detail} onClick={() => pick(p.name)} trailing={<span style={{ font: R(13), color: t.text3 }}>{p.km}</span>} />
          ))}
          {matches.length === 0 && q.trim() !== '' && <span style={{ font: R(14), color: t.text2, padding: '8px 0' }}>No encontramos «{q}». Probá con otra dirección.</span>}
        </div>
      </Sheet>
    </>
  );
}

/* ================= A3 Punto de encuentro (paso 2 de 3) ================= */
export function A3() {
  const { t, d, trip, setTrip, back, go, settings, showToast } = useApp();
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<null | { x: number; y: number; px: number; py: number }>(null);
  const [idx, setIdx] = useState(Math.max(0, d.pickupCandidates.indexOf(trip.pickup)));
  const address = d.pickupCandidates[idx];
  return (
    <>
      <div
        style={{ position: 'absolute', inset: 0, cursor: drag ? 'grabbing' : 'grab', touchAction: 'none' }}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          setDrag({ x: e.clientX, y: e.clientY, px: pan.x, py: pan.y });
        }}
        onPointerMove={(e) => drag && setPan({ x: drag.px + (e.clientX - drag.x), y: drag.py + (e.clientY - drag.y) })}
        onPointerUp={(e) => {
          if (drag && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 12) setIdx((i) => (i + 1) % d.pickupCandidates.length);
          setDrag(null);
        }}
      >
        <AutoMap variant="none" panX={pan.x} panY={pan.y} />
      </div>
      <div style={{ position: 'absolute', top: 55, left: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 11 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <CircleButton icon="arrowLeft" onClick={back} label="Atrás" />
        </div>
        <div style={{ background: t.sheet, borderRadius: 20, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="mapPin" size={20} color={t.green} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: P(18) }}>{address}</span>
            <span style={{ font: R(14), color: t.text2 }}>Mové el mapa para ajustar el pin</span>
          </div>
        </div>
      </div>
      {/* fixed pin at the center; lifts while dragging */}
      <svg width="28" height="42" viewBox="-14 -40 28 42" style={{ position: 'absolute', left: 181, top: 330, zIndex: 5, pointerEvents: 'none', transform: drag ? 'translateY(-10px)' : 'none', transition: 'transform .15s' }}>
        <path d="M0,0 C-3,-7 -12,-13 -12,-24 A12,12 0 1 1 12,-24 C12,-13 3,-7 0,0Z" fill={t.green} stroke={t.map.bg === '#111111' ? '#000000' : t.map.bg} strokeWidth="2" />
        <circle cx="0" cy="-24" r="4.5" fill="#FFFFFF" />
      </svg>
      <Sheet>
        <LocationFab onClick={() => { setPan({ x: 0, y: 0 }); setIdx(0); showToast('Centrado en tu ubicación'); }} />
        <StepProgress step={2} total={3} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ font: P(22) }}>Confirmá el punto de encuentro</span>
          <span style={{ font: R(15), color: t.text2 }}>Ahí te va a buscar el conductor.</span>
        </div>
        <input
          value={trip.reference}
          onChange={(e) => setTrip({ reference: e.target.value })}
          placeholder="Referencia (opcional): portón negro, farmacia…"
          aria-label="Referencia"
          style={{ height: 52, borderRadius: 16, background: t.card, padding: '0 16px', font: R(15), color: t.text }}
        />
        <Button onClick={() => { setTrip({ pickup: address }); go(settings.guest ? 'E1' : 'A4'); }}>Confirmar punto de encuentro</Button>
      </Sheet>
    </>
  );
}

/* ================= A4 Confirmá tu viaje (paso 3 de 3) ================= */
export function A4() {
  const { t, d, trip, setTrip, back, go, showToast } = useApp();
  const levels = (['eco', 'confort'] as const).map((k) => ({ k, ...d.levels[k] }));
  return (
    <>
      <AutoMap variant="route" drop />
      <CircleButton icon="arrowLeft" onClick={back} label="Atrás" style={{ position: 'absolute', top: 55, left: 20, zIndex: 11 }} />
      <Sheet gap={12}>
        <StepProgress step={3} total={3} />
        <span style={{ font: P(22) }}>Confirmá tu viaje</span>
        <div style={{ background: t.card, borderRadius: 16, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: R(13, 500), color: t.text2 }}>Tu viaje</span>
          <RouteSummary from={trip.pickup} to={trip.destination} meta={`${d.trip.km} · ${d.trip.min}`} />
        </div>
        {d.surge && <Banner>Hay mucha demanda en tu zona: el precio es más alto que lo habitual</Banner>}
        <SectionLabel>Nivel del servicio</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }} role="radiogroup" aria-label="Nivel del servicio">
          {levels.map((l) => {
            const on = trip.level === l.k;
            return (
              <button key={l.k} role="radio" aria-checked={on} className="press" onClick={() => setTrip({ level: l.k })} style={{ background: t.card, border: `2px solid ${on ? t.green : t.card}`, borderRadius: 16, padding: 12, display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left', transition: 'border-color .15s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ font: P(16) }}>{l.label}</span>
                  {on && <Icon name="success" size={18} color={t.green} />}
                </div>
                <span style={{ font: P(18) }}>{d.currency(l.price)}</span>
                <span style={{ font: R(13), color: t.text2 }}>Llega en {l.eta}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44 }}>
          <Icon name={trip.payment === 'cash' ? 'wallet' : 'creditCard'} size={20} />
          <span style={{ flex: 1, font: R(15, 500) }}>{paymentLabel(d, trip)}</span>
          <LinkText size={15} onClick={() => (d.cashAllowed ? setTrip({ payment: trip.payment === 'card' ? 'cash' : 'card' }) : showToast('En Argentina se paga con Mercado Pago'))}>Cambiar</LinkText>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderTop: `1px solid ${t.divider}`, paddingTop: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ font: R(13), color: t.text2 }}>Total</span>
            <span style={{ font: P(22) }}>{d.currency(d.levels[trip.level].price)}</span>
          </div>
          <Button style={{ flex: 1 }} onClick={() => { setTrip({ phase: 'searching', expanded: false }); go('A5'); }}>Pedir viaje</Button>
        </div>
      </Sheet>
    </>
  );
}

/* ================= A5 Buscando conductor ================= */
export function A5() {
  const { t, d, trip, setTrip, go, resetTrip, settings, showToast } = useApp();
  const secs = useSeconds();
  useAutoAdvance(5000, () => {
    if (settings.noDrivers && !trip.expanded) go('A5b', { replace: true });
    else { setTrip({ phase: 'assigned' }); go('A6', { replace: true }); }
  });
  const radius = trip.expanded ? d.expanded.radius : '3 km';
  return (
    <>
      <AutoMap variant="search" />
      <Sheet>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 48, height: 48, borderRadius: 24, background: t.well, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <Icon name="loader" size={24} style={{ animation: 'spin 1.4s linear infinite' }} />
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: P(22) }}>Esperando conductor</span>
            <span style={{ font: R(14), color: t.text2 }}>Avisando a conductores en un radio de {radius}</span>
          </div>
        </div>
        <LinearProgress value={Math.min(95, 20 + secs * 16)} />
        <div style={{ background: t.card, borderRadius: 16, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconCircle icon="car" size={40} iconSize={22} bg={t.well} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: R(15, 500) }}>{d.levels[trip.level].label} · {trip.destination}</span>
            <span style={{ font: R(13), color: t.text2 }}>{paymentLabel(d, trip)}</span>
          </div>
          <span style={{ font: P(16) }}>{d.currency(tripPrice(d, trip))}</span>
        </div>
        <Button kind="secondary" onClick={() => { resetTrip(); go('A0', { replace: true }); showToast('Pedido cancelado, sin cargo'); }}>Cancelar pedido</Button>
      </Sheet>
    </>
  );
}

/* ================= A5b Ampliar el radio ================= */
export function A5b() {
  const { t, d, trip, setTrip, go, resetTrip } = useApp();
  return (
    <>
      <AutoMap variant="base" drop />
      <Sheet>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ font: P(22) }}>No hay conductores cerca</span>
          <span style={{ font: R(15), color: t.text2, ...pretty }}>Podemos buscar en {d.expanded.radius}. Tarda un poco más y el precio cambia.</span>
        </div>
        <div style={{ background: t.card, borderRadius: 16, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ font: R(14), color: t.text2 }}>Precio actual</span>
            <span style={{ font: R(15, 500), color: t.text3, textDecoration: 'line-through' }}>{d.currency(d.levels[trip.level].price)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ font: R(15, 500) }}>Precio nuevo</span>
            <span style={{ font: P(22) }}>{d.currency(d.expanded.price)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ font: R(14), color: t.text2 }}>Llegada aproximada</span>
            <span style={{ font: R(14, 500) }}>{d.expanded.eta}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button onClick={() => { setTrip({ expanded: true, phase: 'searching' }); go('A5', { replace: true }); }}>Aceptar y buscar</Button>
          <Button kind="secondary" onClick={() => { resetTrip(); go('A0', { replace: true }); }}>Cancelar</Button>
        </div>
      </Sheet>
    </>
  );
}

/* ================= A6 Conductor en camino ================= */
export function A6() {
  const { t, d, setTrip, go, setOverlay, showToast, autoRoot } = useApp();
  const [chat, setChat] = useState(false);
  useAutoAdvance(7000, () => { setTrip({ phase: 'arrived' }); go('A7', { replace: true }); }, !chat);
  return (
    <>
      <AutoMap variant="driver" drop offsetY={20} />
      <TrackingTopChrome label={`Llega en ${d.eta}`} onBack={() => go(autoRoot(), { replace: true })} onChat={() => setChat(true)} />
      <Sheet gap={14}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar initials={d.driver.initials} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: P(16) }}>{d.driver.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ font: R(13, 500), color: t.success }}>{d.driver.onTheWay}</span>
              <span style={{ font: R(13), color: t.text3 }}>·</span>
              <Icon name="star" size={12} />
              <span style={{ font: R(13), color: t.text2 }}>{d.driver.rating}</span>
            </div>
          </div>
          <LinkText onClick={() => setOverlay('details')}>Ver detalle</LinkText>
        </div>
        <VehicleCard plate={d.driver.plate} make={d.driver.make} detail={d.driver.detail} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: R(14, 500) }}>PIN de inicio</span>
            <span style={{ font: R(13), color: t.text2 }}>Mostráselo al subir</span>
          </div>
          <PinBoxes pin={d.pin} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Button kind="secondary" icon="share" onClick={() => showToast('Link del viaje copiado')}>Compartir viaje</Button>
          <Button kind="secondary" onClick={() => setOverlay('cancel')}>Cancelar</Button>
        </div>
      </Sheet>
      {chat && <TripChat side="passenger" onClose={() => setChat(false)} />}
    </>
  );
}

/* ================= A7 Tu conductor llegó ================= */
export function A7() {
  const { t, d, trip, setTrip, go, autoRoot } = useApp();
  const secs = useSeconds();
  const left = Math.max(0, 161 - secs);
  const [chat, setChat] = useState(false);
  useAutoAdvance(7000, () => { setTrip({ phase: 'ontrip' }); go('A8', { replace: true }); }, !chat);
  return (
    <>
      <AutoMap variant="arrived" drop offsetY={20} />
      <TrackingTopChrome label={`Te espera · ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')} sin cargo`} onBack={() => go(autoRoot(), { replace: true })} onChat={() => setChat(true)} />
      <Sheet>
        <div style={{ background: t.greenSoft, borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="success" size={28} color={t.success} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ font: P(22) }}>Tu conductor llegó</span>
              <span style={{ font: R(14) }}>{d.driver.first} te espera en {trip.pickup}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Plate text={d.driver.plate} size="md" />
            <span style={{ font: R(15, 500) }}>{d.driver.short}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <span style={{ font: R(14, 500), color: t.text2 }}>Tu PIN de inicio</span>
          <PinBoxes pin={d.pin} size="lg" />
        </div>
        {/* no calls in Chambito: contact is by chat only (brand guide §1) */}
        <Button kind="secondary" icon="messageCircle" onClick={() => setChat(true)}>Escribile a {d.driver.first}</Button>
      </Sheet>
      {chat && <TripChat side="passenger" onClose={() => setChat(false)} />}
    </>
  );
}

/* ================= A8 Viaje en curso ================= */
export function A8() {
  const { t, d, trip, go, setOverlay, showToast, autoRoot } = useApp();
  const secs = useSeconds();
  const [chat, setChat] = useState(false);
  useAutoAdvance(9000, () => go('A9', { replace: true }), !chat);
  return (
    <>
      <AutoMap variant="trip" drop offsetY={70} />
      <TrackingTopChrome label={`Llegás a las ${d.arrival}`} onBack={() => go(autoRoot(), { replace: true })} onChat={() => setChat(true)} />
      <Sheet gap={14}>
        <SosButton onClick={() => setOverlay('sos')} style={{ position: 'absolute', top: -68, right: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar initials={d.driver.initials} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: P(16) }}>Viaje en curso</span>
            <span style={{ font: R(13), color: t.text2 }}>{d.driver.first} · {d.driver.plate}</span>
          </div>
          <LinkText onClick={() => setOverlay('details')}>Ver detalle</LinkText>
        </div>
        <LinearProgress value={Math.min(98, 45 + secs * 6)} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, background: t.map.dest, flex: 'none', margin: '0 4px' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: R(15, 500) }}>{trip.destination}</span>
            <span style={{ font: R(13), color: t.text2 }}>{d.remaining}</span>
          </div>
        </div>
        <Button kind="secondary" icon="share" onClick={() => showToast('Link del viaje copiado')}>Compartir viaje</Button>
      </Sheet>
      {chat && <TripChat side="passenger" onClose={() => setChat(false)} />}
    </>
  );
}

/* ================= A9 Viaje terminado ================= */
const GOOD = ['Manejo seguro', 'Puntual', 'Auto limpio', 'Buena atención'];
const BAD = ['Manejo brusco', 'Llegó tarde', 'Auto sucio', 'Otro recorrido'];

export function A9() {
  const { t, d, trip, go, setTrip, showToast } = useApp();
  const [stars, setStars] = useState(5);
  const [reasons, setReasons] = useState<string[]>(['Manejo seguro', 'Puntual']);
  const [tip, setTip] = useState<number | 'otro' | null>(d.tips[1]);
  const [custom, setCustom] = useState('');
  const low = stars <= 2;
  const options = low ? BAD : GOOD;
  const tipAmount = tip === 'otro' ? Number(custom.replace(/\D/g, '')) || 0 : tip ?? 0;
  const fare = tripPrice(d, trip);
  const valid = !low || reasons.some((r) => BAD.includes(r));
  return (
    <div style={{ position: 'absolute', top: 47, left: 0, right: 0, bottom: 0, padding: '16px 20px 42px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
        <Avatar initials={d.driver.initials} size={72} />
        <span style={{ font: P(24) }}>¿Cómo estuvo tu viaje con {d.driver.first}?</span>
        <Stars value={stars} onChange={(n) => { setStars(n); setReasons([]); }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SectionLabel>{low ? '¿Qué salió mal? (obligatorio)' : '¿Qué te gustó?'}</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {options.map((o) => (
            <Chip key={o} selected={reasons.includes(o)} onClick={() => setReasons((r) => (r.includes(o) ? r.filter((x) => x !== o) : [...r, o]))}>{o}</Chip>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SectionLabel>Propina (opcional)</SectionLabel>
        <div style={{ display: 'flex', gap: 8 }}>
          {d.tips.map((a) => (
            <Chip key={a} selected={tip === a} onClick={() => setTip(tip === a ? null : a)}>{d.currency(a)}</Chip>
          ))}
          {tip === 'otro' ? (
            <input
              autoFocus
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Monto"
              aria-label="Otro monto"
              inputMode="numeric"
              style={{ height: 36, width: 92, borderRadius: 18, background: t.chip, outline: `2px solid ${t.green}`, outlineOffset: -2, padding: '0 14px', font: R(14, 500), color: t.text }}
            />
          ) : (
            <Chip onClick={() => setTip('otro')}>Otro</Chip>
          )}
        </div>
      </div>
      <div style={{ background: t.cardOnBg, borderRadius: 16, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Row label={`Viaje · ${d.final}`} value={d.currency(fare)} />
        <Row label="Propina" value={tipAmount ? d.currency(tipAmount) : '—'} />
        <div style={{ height: 1, background: t.dividerStrong }} />
        <Row strong label={`Total · ${paymentLabel(d, trip)}`} value={d.currency(fare + tipAmount)} />
        <LinkText onClick={() => showToast('Recibo enviado a tu correo')}>Ver recibo</LinkText>
      </div>
      <Button
        kind={valid ? 'primary' : 'disabled'}
        style={{ marginTop: 'auto' }}
        onClick={() => { setTrip({ phase: 'none', completed: true, expanded: false }); go('A11', { replace: true }); showToast('¡Gracias por calificar!'); }}
      >
        Enviar calificación
      </Button>
    </div>
  );
}

/* ================= A11 Actividad · Servicios (wrapped by Actividad with the Servicios | Tienda selector) ================= */
export function ServiciosActivity() {
  const { d, trip, go } = useApp();
  const st = useTripStatus();
  const { t } = useApp();
  const from = d.myLocation.split(' ').slice(0, 2).join(' ');
  return (
    <>
      {trip.phase !== 'none' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ font: P(18) }}>En curso</span>
          <button className="press" onClick={() => go(st.screen)} style={{ background: t.cardOnBg, borderRadius: 20, padding: 14, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
            <IconCircle icon="car" size={44} iconSize={24} bg={t.well} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ font: R(15, 500) }}>{from} → {trip.destination}</span>
              <Badge>{st.label}</Badge>
            </div>
            <Icon name="chevronRight" size={18} color={t.text2} />
          </button>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ font: P(18) }}>Anteriores</span>
        {trip.completed && <HistoryCard icon="car" title={`${from} → ${trip.destination}`} detail={`Hoy, ${d.arrival} · Auto ${d.levels[trip.level].label}`} amount={d.currency(tripPrice(d, trip) + d.tips[1])} status="ok" />}
        {d.history.map((h) => (
          <HistoryCard key={h.title} {...h} />
        ))}
      </div>
    </>
  );
}

function HistoryCard({ icon, title, detail, amount, status }: { icon: string; title: string; detail: string; amount: string; status: 'ok' | 'cancel' }) {
  const { t, setTrip, go, showToast } = useApp();
  const [open, setOpen] = useState(false);
  const dest = title.split('→').pop()?.trim() ?? title;
  return (
    <div style={{ background: t.cardOnBg, borderRadius: 20, overflow: 'hidden' }}>
    <button className="press" aria-expanded={open} onClick={() => setOpen(!open)} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left' }}>
      <IconCircle icon={icon} size={44} iconSize={24} bg={t.well} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ font: R(15, 500) }}>{title}</span>
        <span style={{ font: R(13), color: t.text2 }}>{detail}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
        <span style={{ font: P(15), color: status === 'cancel' ? t.text2 : t.text, whiteSpace: 'nowrap' }}>{amount}</span>
        <span style={{ font: R(12), color: status === 'cancel' ? t.error : t.success }}>{status === 'cancel' ? 'Cancelado' : 'Completado'}</span>
      </div>
    </button>
    {open && (
      <div className="fade-in" style={{ padding: '0 14px 14px', display: 'flex', gap: 8 }}>
        {icon === 'car' && (
          <Button height={40} icon="refresh" onClick={() => { setTrip({ destination: dest, phase: 'none' }); go('A3'); }} style={{ font: P(14) }}>Repetir viaje</Button>
        )}
        <Button height={40} kind="secondary" onClick={() => showToast('Recibo enviado a tu correo')} style={{ font: P(14) }}>Ver recibo</Button>
      </div>
    )}
    </div>
  );
}

/* ================= Overlays: A8b SOS, A10 Detalles, cancel confirm ================= */
export function SosDialog() {
  const { t, d, setOverlay, showToast } = useApp();
  return (
    <>
      <div className="fade-in" onClick={() => setOverlay(null)} style={{ position: 'absolute', inset: 0, background: t.scrimDialog, zIndex: 50 }} />
      <div role="dialog" aria-modal className="pop-in" style={{ position: 'absolute', left: 20, right: 20, top: 230, background: t.sheet, borderRadius: 24, padding: '24px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center', zIndex: 51 }}>
        <span style={{ width: 64, height: 64, borderRadius: 32, background: t.well, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="shield" size={32} color={t.error} />
        </span>
        <span style={{ font: P(22) }}>¿Necesitás ayuda?</span>
        <span style={{ font: R(15), color: t.text2, ...pretty }}>Llamamos al 911 y avisamos a Soporte Chambito con tu ubicación en vivo y la patente {d.driver.plate}.</span>
        <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          <Button kind="danger" icon="phone" onClick={() => { setOverlay(null); showToast('Llamando al 911 · Soporte avisado'); }}>Llamar al 911</Button>
          <Button kind="secondary" onClick={() => { setOverlay(null); showToast('Avisamos a Soporte con tu ubicación'); }}>Solo avisar a Soporte</Button>
          <button onClick={() => setOverlay(null)} style={{ font: R(15, 500), color: t.text2, padding: '8px 0' }}>Cancelar</button>
        </div>
      </div>
    </>
  );
}

export function CancelDialog() {
  const { t, setOverlay, resetTrip, go, showToast } = useApp();
  return (
    <>
      <div className="fade-in" onClick={() => setOverlay(null)} style={{ position: 'absolute', inset: 0, background: t.scrimDialog, zIndex: 50 }} />
      <div role="dialog" aria-modal className="pop-in" style={{ position: 'absolute', left: 20, right: 20, top: 260, background: t.sheet, borderRadius: 24, padding: '24px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center', zIndex: 51 }}>
        <span style={{ font: P(22) }}>¿Cancelar el viaje?</span>
        <span style={{ font: R(15), color: t.text2, ...pretty }}>Tu conductor ya está en camino. Si cancelás ahora puede haber un cargo por cancelación.</span>
        <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          <Button kind="secondary" onClick={() => { resetTrip(); go('A0', { replace: true }); showToast('Viaje cancelado'); }}>Sí, cancelar</Button>
          <button onClick={() => setOverlay(null)} style={{ font: R(15, 500), color: t.text2, padding: '8px 0' }}>Seguir con el viaje</button>
        </div>
      </div>
    </>
  );
}

export function DetailsModal() {
  const { t, d, trip, setOverlay } = useApp();
  const done = { searching: 0, assigned: 1, arrived: 2, ontrip: 3, none: 3 }[trip.phase];
  const steps = ['Conductor asignado', 'Tu conductor llegó', 'Viaje en curso', 'Llegada al destino'];
  const f = d.fare;
  return (
    <>
      <div className="fade-in" onClick={() => setOverlay(null)} style={{ position: 'absolute', inset: 0, background: t.scrimDialog, zIndex: 50 }} />
      <div role="dialog" aria-modal className="sheet-in" style={{ position: 'absolute', left: 0, right: 0, top: 64, bottom: 0, background: t.sheet, borderRadius: '24px 24px 0 0', padding: '8px 20px 42px', display: 'flex', flexDirection: 'column', gap: 20, zIndex: 51 }}>
        <span style={{ alignSelf: 'center', width: 36, height: 4, borderRadius: 2, background: t.handle }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ font: P(22) }}>Detalles del pedido</span>
          <CircleButton icon="close" size={40} iconSize={16} bg={t.card} onClick={() => setOverlay(null)} label="Cerrar" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <RouteSummary from={trip.pickup} to={trip.destination} gap={10} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 4 }}>
            {[['Distancia', d.trip.km], ['Tiempo', d.trip.min], ['Categoría', d.levels[trip.level].label]].map(([l, v]) => (
              <div key={l} style={{ background: t.card, borderRadius: 12, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ font: R(12), color: t.text2 }}>{l}</span>
                <span style={{ font: P(16) }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: P(18) }}>Tarifa</span>
          <Row label="Banderazo" value={d.currency(f.base)} />
          <Row label={`Distancia · ${d.trip.km}`} value={d.currency(f.distance)} />
          <Row label={`Tiempo · ${d.trip.min}`} value={d.currency(f.time)} />
          {d.surge && <Row label="Demanda alta" value={d.currency(f.surge)} labelColor={t.warn} valueColor={t.warn} />}
          <div style={{ height: 1, background: t.divider }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ flex: 1, minWidth: 0, font: R(15, 500) }}>Total cerrado · {paymentLabel(d, trip)}</span>
            <span style={{ font: P(18), whiteSpace: 'nowrap' }}>{d.currency(f.base + f.distance + f.time + (d.surge ? f.surge : 0))}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ font: P(18) }}>Cómo va tu pedido</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 5 }}>
              {steps.map((s, i) => (
                <span key={s} style={{ display: 'contents' }}>
                  {i > 0 && <span style={{ width: 2, height: 22, background: i < done ? t.green : t.dividerStrong }} />}
                  <span style={{ width: 10, height: 10, borderRadius: 5, boxSizing: 'border-box', background: i < done ? t.green : 'transparent', border: i < done ? 'none' : `2px solid ${t.dividerStrong}` }} />
                </span>
              ))}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {steps.map((s, i) => (
                <div key={s} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ font: R(14, 500), color: i < done ? t.text : t.text2 }}>{s}</span>
                  <span style={{ font: R(13), color: t.text2 }}>{i < done || i === 3 ? d.timeline[i] : '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
