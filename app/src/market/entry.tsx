import { useState } from 'react';
import { useApp } from '../store';
import { P, R } from '../theme';
import { AutoMap } from '../ui/AutoMap';
import { HubTopChrome, Icon, MenuGroup, MenuItem, QuickAccess, QuickTile, Sheet, TopBar } from '../ui/kit';
import { BottomSheet, ChoiceList, SwitchRow } from '../ui/sheets';
import { FloatingNav, useTabNav } from '../screens/common';
import { ServiciosActivity, useTripStatus } from '../screens/passenger';
import { LISTINGS, priceFor } from './data';
import { MScreen, MTopBar, Photo, pretty, RoundBtn, Segmented, useMoney, Verified } from './kit';
import { useMarket } from './state';
import { ConsultasList, useOpenListing } from './buyer';
import { useVender } from './seller';

/* ================= Inicio (EB1 con tarjeta Market · EB2 sin productos) ================= */
const SERVICES: [string, string, string][] = [['limpieza', 'Limpieza', 'Hogar y oficinas'], ['ninera', 'Niñera', 'Cuidado de chicos'], ['enfermero', 'Enfermería', 'En tu casa']];

export function Inicio() {
  const { t, settings, go, trip } = useApp();
  const money = useMoney();
  const tab = useTabNav();
  const open = useOpenListing();
  const tripStatus = useTripStatus();
  const [service, setService] = useState<(typeof SERVICES)[number] | null>(null);
  const card = settings.tiendaEntry === 'card';
  const thumbs = LISTINGS.filter((l) => ['trek', 'nike', 'silla'].includes(l.id));

  // one app, every module: Auto and Tienda open from Inicio too
  const tiles: QuickTile[] = [];
  if (settings.autoEnabled) tiles.push({ key: 'auto', icon: 'car', label: 'Viaje', hint: trip.phase !== 'none' ? tripStatus.label : '¿A dónde vas?', status: trip.phase !== 'none' ? 'En curso' : undefined, onClick: () => tab('auto') });
  tiles.push({ key: 'tienda', icon: 'tag', label: 'Tienda', hint: 'Comprá y vendé', onClick: () => go('M01') });

  return (
    <>
      <AutoMap variant="base" drop />
      <HubTopChrome onSearch={() => setService(SERVICES[0])} onProfile={() => go('perfil', { replace: true })} />
      <Sheet bottomPad={108} gap={12}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: P(22) }}>Hola, Lucía</span>
          <span style={{ font: R(14), color: t.text2 }}>¿Qué necesitás hoy?</span>
        </div>
        <QuickAccess tiles={tiles} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: R(13, 500), color: t.text2 }}>Servicios a domicilio</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {SERVICES.map((s) => (
              <button key={s[1]} className="press quick-tile" onClick={() => setService(s)} style={{ height: 52, borderRadius: 16, background: t.card, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Icon name={s[0]} size={22} />
                <span style={{ font: R(13, 500) }}>{s[1]}</span>
              </button>
            ))}
          </div>
        </div>
        {card && (
          <div style={{ background: t.card, borderRadius: 20, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="press" onClick={() => go('M01')} aria-label="Abrir Chambito Market" style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left' }}>
              <span style={{ width: 40, height: 40, borderRadius: 20, background: t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name="tag" size={20} color={t.success} /></span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ font: P(16) }}>Chambito Market</span>
                <span style={{ font: R(13), color: t.text2 }}>Comprá y vendé con gente verificada</span>
              </span>
              <Icon name="chevronRight" size={18} color={t.text2} />
            </button>
            {settings.almostEmpty ? (
              <button className="press" onClick={() => go('M01')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: t.sheet, borderRadius: 14, padding: '10px 12px', width: '100%', textAlign: 'left' }}>
                <Icon name="plus" size={18} color={t.success} />
                <span style={{ font: R(14, 500), ...pretty }}>Sé de los primeros en vender en tu zona</span>
              </button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, width: '100%' }}>
                {thumbs.map((l) => (
                  <button key={l.id} className="press" onClick={() => open(l)} aria-label={`${l.title}, ${money(l.price)}`} style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left' }}>
                    <Photo ph={l.ph} cat={l.category} radius={12} iconSize={20} />
                    <span style={{ font: R(13, 500) }}>{money(l.price)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </Sheet>
      <FloatingNav active="inicio" />
      {service && <ServiceSheet service={service} onClose={() => setService(null)} />}
    </>
  );
}

/** Services keep today's Chambito flow; the sheet shows where it starts. */
function ServiceSheet({ service, onClose }: { service: (typeof SERVICES)[number]; onClose: () => void }) {
  const { t, showToast } = useApp();
  const [when, setWhen] = useState<'hoy' | 'manana' | 'semana'>('hoy');
  return (
    <BottomSheet onClose={onClose} label={service[1]} title={service[1]}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 48, height: 48, borderRadius: 16, background: t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={service[0]} size={26} color={t.success} /></span>
        <span style={{ font: R(14), color: t.text2, flex: 1, ...pretty }}>{service[2]}. Este pedido sigue el flujo actual de Chambito.</span>
      </div>
      <span style={{ font: R(13, 500), color: t.text2 }}>¿Cuándo?</span>
      <ChoiceList
        value={when}
        onChange={setWhen}
        options={[
          { value: 'hoy', label: 'Hoy', hint: 'Lo antes posible', icon: 'clock' },
          { value: 'manana', label: 'Mañana', hint: 'Elegís el horario', icon: 'calendar' },
          { value: 'semana', label: 'Esta semana', hint: 'Te muestran opciones', icon: 'calendar' },
        ]}
      />
      <button className="press btn btn-primary" onClick={() => { onClose(); showToast(`Buscando ${service[1].toLowerCase()} para ${when === 'hoy' ? 'hoy' : when === 'manana' ? 'mañana' : 'esta semana'}`); }} style={{ height: 52, borderRadius: 26, background: t.green, color: '#000000', font: P(16), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Pedir {service[1].toLowerCase()}
      </button>
    </BottomSheet>
  );
}

/* ================= Perfil (EB3 filas nuevas · IA4 con Equipos) ================= */
type ProfileSheet = null | 'datos' | 'direcciones' | 'pago' | 'config' | 'ayuda';

export function Perfil() {
  const { t, go, settings, set, showToast, driverAvailable } = useApp();
  const vender = useVender();
  const { mine, saved } = useMarket();
  const [sheet, setSheet] = useState<ProfileSheet>(null);
  const equiposInPerfil = settings.teams && settings.tiendaEntry === 'tab' && settings.autoEnabled; // didn't fit in the bar
  const active = mine.filter((m) => m.status === 'Activas').length;
  const driver = settings.role === 'conductor';
  return (
    <>
      <MScreen style={{ paddingBottom: 120 }}>
        <TopBar large title="Perfil" right={<RoundBtn icon="settings" label="Configuración" onClick={() => setSheet('config')} />} />
        <div style={{ padding: '4px 20px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ProfileCard onEdit={() => setSheet('datos')} />

          {settings.autoEnabled && (
            <MenuGroup title="Auto">
              {driver ? (
                <>
                  <MenuItem icon="car" label="Modo conductor" hint={driverAvailable ? 'Disponible para viajes' : 'No disponible'} tag={driverAvailable ? 'Activo' : undefined} tagTone="new" accent onClick={() => go('D3')} />
                  <MenuItem icon="wallet" label="Billetera" hint="Ganancias y cobros" onClick={() => go('D9')} />
                  <MenuItem icon="shield" label="Mis documentos" hint="Vencimientos y revisión" onClick={() => go('D2')} last />
                </>
              ) : (
                <>
                  <MenuItem icon="clock" label="Mis viajes" hint="Historial y recibos" onClick={() => go('A11')} />
                  <MenuItem icon="car" label="Manejá con Chambito" hint="Ganá con tu auto" tag="Nuevo" tagTone="new" accent onClick={() => go('D0')} last />
                </>
              )}
            </MenuGroup>
          )}

          <MenuGroup title="Tienda">
            <MenuItem icon="tag" label="Mis publicaciones" hint={`${active} activas`} tag="Nuevo" tagTone="new" onClick={() => go('V21')} />
            <MenuItem icon="plus" label="Vender en la Tienda" hint="Publicar es gratis" accent onClick={vender} />
            <MenuItem icon="heart" label="Guardados" hint={saved.size ? `${saved.size} guardados` : 'Todavía nada'} onClick={() => go('M11')} last />
          </MenuGroup>

          {equiposInPerfil && (
            <MenuGroup title="Trabajo">
              <MenuItem icon="users" label="Equipos" tag="Antes en la barra" onClick={() => go('equipos')} last />
            </MenuGroup>
          )}

          <MenuGroup title="Cuenta">
            <MenuItem icon="mapPin" label="Direcciones" hint="Casa, trabajo y más" onClick={() => setSheet('direcciones')} />
            <MenuItem icon="creditCard" label="Medios de pago" hint={settings.country === 'PY' ? 'Bancard o efectivo' : 'Mercado Pago'} onClick={() => setSheet('pago')} />
            <MenuItem icon="bell" label="Notificaciones" onClick={() => go('EA4')} />
            <MenuItem icon="messageCircle" label="Ayuda" onClick={() => setSheet('ayuda')} last />
          </MenuGroup>

          <button className="press" onClick={() => { set({ guest: true }); showToast('Cerraste sesión · seguís como invitado'); }} style={{ alignSelf: 'center', font: R(15, 500), color: settings.guest ? t.text2 : t.error, padding: 10 }}>
            {settings.guest ? 'Estás como invitado' : 'Cerrar sesión'}
          </button>
        </div>
      </MScreen>
      <FloatingNav active="perfil" band />
      {sheet && <ProfileSheets which={sheet} onClose={() => setSheet(null)} />}
    </>
  );
}

function ProfileCard({ onEdit }: { onEdit: () => void }) {
  const { t, settings, set } = useApp();
  if (settings.guest)
    return (
      <div style={{ background: t.mSurface, borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ font: P(18) }}>Entrá a tu cuenta</span>
        <span style={{ font: R(14), color: t.text2, ...pretty }}>Para pedir viajes, consultar y publicar en la Tienda.</span>
        <button className="press btn btn-primary" onClick={() => set({ guest: false })} style={{ height: 48, borderRadius: 24, background: t.green, color: '#000000', font: P(15), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Iniciar sesión</button>
      </div>
    );
  return (
    <button className="press" onClick={onEdit} style={{ background: t.mSurface, borderRadius: 20, padding: 14, display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', width: '100%' }}>
      <span style={{ width: 60, height: 60, borderRadius: 30, background: t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center', font: P(22), flex: 'none' }}>LG</span>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: P(20) }}>Lucía Giménez</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Verified size={13} />
          <span style={{ font: R(13), color: t.text2 }}>★ 4,9</span>
        </span>
      </span>
      <span style={{ font: R(14, 500), color: t.link }}>Editar</span>
    </button>
  );
}

function ProfileSheets({ which, onClose }: { which: Exclude<ProfileSheet, null>; onClose: () => void }) {
  const { t, d, settings, set, showToast, go } = useApp();
  const [name, setName] = useState('Lucía Giménez');
  const [pay, setPay] = useState<'card' | 'cash'>('card');
  const [faq, setFaq] = useState<number | null>(null);
  const inputStyle = { height: 48, borderRadius: 14, background: t.mSurface, padding: '0 14px', font: R(15), color: t.text } as const;

  if (which === 'datos')
    return (
      <BottomSheet onClose={onClose} label="Mis datos" title="Mis datos">
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ font: R(13, 500), color: t.text2 }}>Nombre</span>
          <input value={name} onChange={(e) => setName(e.target.value)} aria-label="Nombre" style={inputStyle} />
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Verified size={13} />
          <span style={{ font: R(13), color: t.text2 }}>Identidad verificada con tu documento</span>
        </div>
        <button className="press btn btn-primary" disabled={!name.trim()} onClick={() => { onClose(); showToast('Datos guardados'); }} style={{ height: 52, borderRadius: 26, background: name.trim() ? t.green : t.btn2, color: name.trim() ? '#000000' : t.text3, font: P(16), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Guardar</button>
      </BottomSheet>
    );

  if (which === 'direcciones')
    return (
      <BottomSheet onClose={onClose} label="Direcciones" title="Direcciones">
        <MenuGroup>
          {d.savedPlaces.map((p, i) => (
            <MenuItem key={p.label} icon={p.icon} label={p.label} hint={d.recents[i]?.detail ?? d.city} onClick={() => { onClose(); go('A2'); }} last={i === d.savedPlaces.length - 1} />
          ))}
        </MenuGroup>
        <button className="press" onClick={() => showToast('Buscá la dirección en el mapa')} style={{ display: 'flex', alignItems: 'center', gap: 8, font: R(15, 500), color: t.link, padding: '4px 0' }}>
          <Icon name="plus" size={18} color={t.link} /> Agregar dirección
        </button>
      </BottomSheet>
    );

  if (which === 'pago')
    return (
      <BottomSheet onClose={onClose} label="Medios de pago" title="Medios de pago">
        <ChoiceList
          value={pay}
          onChange={(v) => { setPay(v); showToast(v === 'card' ? 'Tarjeta como medio principal' : 'Efectivo como medio principal'); }}
          options={[
            { value: 'card', label: d.card, hint: 'Principal', icon: 'creditCard' },
            ...(d.cashAllowed ? [{ value: 'cash' as const, label: 'Efectivo', hint: 'Pagás al terminar el viaje', icon: 'wallet' }] : []),
          ]}
        />
        {!d.cashAllowed && <span style={{ font: R(13), color: t.text2, ...pretty }}>En Argentina los viajes se pagan con Mercado Pago.</span>}
      </BottomSheet>
    );

  if (which === 'config')
    return (
      <BottomSheet onClose={onClose} label="Configuración" title="Configuración">
        <SwitchRow label="Tema oscuro" hint="Cambia los colores de la app" on={settings.theme === 'dark'} onChange={(v) => set({ theme: v ? 'dark' : 'light' })} />
        <span style={{ font: R(13, 500), color: t.text2 }}>País</span>
        <ChoiceList
          value={settings.country}
          onChange={(v) => set({ country: v })}
          options={[
            { value: 'PY', label: 'Paraguay', hint: 'Guaraníes · Bancard o efectivo', icon: 'flag' },
            { value: 'AR', label: 'Argentina', hint: 'Pesos · Mercado Pago', icon: 'flag' },
          ]}
        />
      </BottomSheet>
    );

  const QA: [string, string][] = [
    ['¿Cómo comparto mi viaje?', 'En el seguimiento tocá «Compartir viaje»: mandás un link con la ruta y la patente.'],
    ['¿Es seguro comprar en la Tienda?', 'Los vendedores verifican su identidad. Nunca pagues por adelantado fuera de Chambito.'],
    ['¿Qué pasa si cancelo?', 'Cancelar mientras buscamos conductor no tiene cargo.'],
  ];
  return (
    <BottomSheet onClose={onClose} label="Ayuda" title="Ayuda">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {QA.map(([q, a], i) => (
          <div key={q} style={{ background: t.mSurface, borderRadius: 16 }}>
            <button className="press" aria-expanded={faq === i} onClick={() => setFaq(faq === i ? null : i)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '14px', textAlign: 'left' }}>
              <span style={{ flex: 1, font: R(15, 500) }}>{q}</span>
              <Icon name="chevronDown" size={16} color={t.text2} style={{ transform: faq === i ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
            </button>
            {faq === i && <p className="fade-in" style={{ margin: 0, padding: '0 14px 14px', font: R(14), color: t.text2, ...pretty }}>{a}</p>}
          </div>
        ))}
      </div>
      <button className="press" onClick={() => { onClose(); showToast('Te contactamos por el chat de Soporte'); }} style={{ height: 52, borderRadius: 26, background: t.btn2, font: P(16), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Icon name="messageCircle" size={18} /> Hablar con Soporte
      </button>
    </BottomSheet>
  );
}

/* ================= Actividad (EA3 · Servicios | Tienda) ================= */
export function Actividad() {
  const { t, go } = useApp();
  const { activityTab, setActivityTab } = useMarket();
  return (
    <>
      <MScreen style={{ paddingBottom: 120 }}>
        <TopBar large title="Actividad" right={<RoundBtn icon="bell" label="Notificaciones" badge={2} onClick={() => go('EA4')} />} />
        <div style={{ padding: '4px 20px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Segmented options={['Servicios', 'Tienda'] as const} value={activityTab} onChange={setActivityTab} />
          {activityTab === 'Servicios' ? (
            <ServiciosActivity />
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ font: P(18) }}>Mis consultas</span>
                <ConsultasList />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ font: P(18) }}>Mis pedidos</span>
                  <span style={{ font: R(12, 500), color: '#000000', background: t.warn, borderRadius: 10, padding: '2px 8px' }}>Fase 2</span>
                </div>
                <div style={{ border: `1.5px dashed ${t.dashed}`, borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span style={{ font: R(14), color: t.text2, ...pretty }}>Cuando puedas comprar dentro de la app, tus pedidos van a aparecer acá.</span>
                  <button className="press" onClick={() => go('M01')} style={{ alignSelf: 'flex-start', font: R(14, 500), color: t.link }}>Ir a la Tienda</button>
                </div>
              </div>
            </>
          )}
        </div>
      </MScreen>
      <FloatingNav active="actividad" band />
    </>
  );
}

/* ================= EA4 Notificaciones ================= */
export function EA4() {
  const { t, back, go, settings, d } = useApp();
  const { notifs, openListing, setChatListing, setMyTab } = useMarket();
  const tone = (k: string) => (k === 'success' ? [t.greenSoft, t.success] : k === 'error' ? [t.name === 'dark' ? 'rgba(255,107,107,0.16)' : 'rgba(183,28,28,0.08)', t.error] : [t.mSurface, t.icon]);
  return (
    <MScreen>
      <MTopBar title="Notificaciones" onBack={back} />
      <div style={{ padding: '4px 20px 40px', display: 'flex', flexDirection: 'column' }}>
        {notifs.map((n) => {
          const [bg, c] = tone(n.tone);
          return (
            <button
              key={n.id}
              className="press"
              onClick={() => {
                if (n.go.screen === 'M06' && n.go.listing) openListing(n.go.listing);
                if (n.go.screen === 'M10' && n.go.listing) setChatListing(n.go.listing);
                if (n.go.screen === 'V21') setMyTab(n.tone === 'error' ? 'Rechazadas' : 'Activas');
                go(n.go.screen);
              }}
              style={{ display: 'flex', gap: 12, padding: '14px 0', textAlign: 'left', borderBottom: `1px solid ${t.name === 'dark' ? '#262626' : '#EBEBEB'}` }}
            >
              <span style={{ width: 40, height: 40, borderRadius: 20, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={n.icon} size={18} color={c} /></span>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ font: R(15, 500), ...pretty }}>{n.title}</span>
                <span style={{ font: R(14), color: t.text2, ...pretty }}>{n.text.replace('{price}', d.currency(priceFor(180000, settings.country)))}</span>
              </div>
              <span style={{ font: R(12), color: t.text2 }}>{n.time}</span>
            </button>
          );
        })}
      </div>
    </MScreen>
  );
}
