import { CSSProperties } from 'react';
import { useApp } from '../store';
import { P, R } from '../theme';
import { AutoMap } from '../ui/AutoMap';
import { Badge, Button, CircleButton, HubTopChrome, Icon, IconCircle, RouteSummary, Sheet } from '../ui/kit';
import { FloatingNav } from './common';

const pretty = { textWrap: 'pretty' } as CSSProperties;

function EmptyState({ icon, title, text }: { icon: string; title: string; text: string }) {
  const { t } = useApp();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center', padding: '8px 0' }}>
      <IconCircle icon={icon} size={64} iconSize={30} bg={t.well} />
      <span style={{ font: P(22) }}>{title}</span>
      <span style={{ font: R(15), color: t.text2, maxWidth: 310, ...pretty }}>{text}</span>
    </div>
  );
}

/* E1 Invitado: arma el recorrido, el precio pide sesión */
export function E1() {
  const { t, d, trip, back, go, set, showToast } = useApp();
  return (
    <>
      <AutoMap variant="route" drop />
      <CircleButton icon="arrowLeft" onClick={back} label="Atrás" style={{ position: 'absolute', top: 55, left: 20, zIndex: 11 }} />
      <Sheet>
        <div style={{ background: t.card, borderRadius: 16, padding: '12px 14px' }}>
          <RouteSummary from={trip.pickup} to={trip.destination} meta={`${d.trip.km} · ${d.trip.min}`} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <Icon name="lock" size={24} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ font: P(22) }}>Iniciá sesión para ver el precio</span>
            <span style={{ font: R(15), color: t.text2 }}>Tu recorrido queda guardado.</span>
          </div>
        </div>
        <Button onClick={() => { set({ guest: false }); go('A4', { replace: true }); showToast('Sesión iniciada'); }}>Iniciar sesión</Button>
        <Button kind="secondary" onClick={() => { set({ guest: false }); go('A4', { replace: true }); showToast('Cuenta creada'); }}>Crear cuenta</Button>
      </Sheet>
    </>
  );
}

/* E2 Ubicación desactivada */
export function E2() {
  const { go, set, showToast } = useApp();
  return (
    <>
      <AutoMap variant="none" drop />
      <HubTopChrome onSearch={() => go('A2')} onProfile={() => go('perfil')} />
      <Sheet bottomPad={112}>
        <EmptyState icon="mapPin" title="Activá tu ubicación" text="La usamos solo mientras usás la app, para marcar dónde te buscan." />
        <Button onClick={() => { set({ locationOff: false }); go('A0', { replace: true }); showToast('Ubicación activada'); }}>Activar ubicación</Button>
        <Button kind="secondary" onClick={() => go('A2')}>Escribir la dirección</Button>
      </Sheet>
      <FloatingNav active="auto" />
    </>
  );
}

/* E3 Sin conexión */
export function E3() {
  const { t, set, go, settings, trip } = useApp();
  return (
    <>
      <AutoMap variant="none" drop />
      <div style={{ position: 'absolute', top: 55, left: 20, right: 20, background: t.card, borderRadius: 16, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, zIndex: 11 }}>
        <Icon name="warning" size={18} color={t.warn} />
        <span style={{ font: R(14, 500), color: t.warn }}>Sin conexión. Reintentando…</span>
      </div>
      <Sheet bottomPad={112}>
        <EmptyState icon="refresh" title="No pudimos cargar Auto" text="Revisá tus datos o el wifi. Si tenés un viaje activo, sigue en curso." />
        <Button
          onClick={() => {
            set({ offline: false });
            go(trip.phase !== 'none' ? 'A0b' : settings.otherService ? 'E4' : settings.locationOff ? 'E2' : 'A0', { replace: true });
          }}
        >
          Reintentar
        </Button>
      </Sheet>
      <FloatingNav active="auto" />
    </>
  );
}

/* E4 Ya tenés un servicio en curso */
export function E4() {
  const { t, go, showToast } = useApp();
  return (
    <>
      <AutoMap variant="base" drop />
      <HubTopChrome onSearch={() => showToast('Primero terminá el servicio en curso')} onProfile={() => go('perfil')} />
      <Sheet bottomPad={112}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <IconCircle icon="info" size={48} iconSize={24} bg={t.well} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ font: P(22) }}>Ya tenés un servicio en curso</span>
            <span style={{ font: R(15), color: t.text2, ...pretty }}>Esperá a que termine o cancelalo antes de pedir un viaje.</span>
          </div>
        </div>
        <button className="press" onClick={() => go('A11')} style={{ background: t.card, borderRadius: 20, padding: 14, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
          <IconCircle icon="limpieza" size={44} iconSize={24} bg={t.well} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ font: R(15, 500) }}>Limpieza general · 4 h</span>
            <Badge>Servicio en curso</Badge>
          </div>
          <Icon name="chevronRight" size={18} color={t.text2} />
        </button>
        <Button kind="secondary" onClick={() => go('A11')}>Ver el servicio</Button>
      </Sheet>
      <FloatingNav active="auto" />
    </>
  );
}
