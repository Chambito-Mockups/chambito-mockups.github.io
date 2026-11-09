/** Auto v3 · explorador y pasajero: X1, A0 (Viaje, Moto, Envío y sus estados E2–E4, A0b), A2–A9, A11 y los detalles (A10). */
import { useVM } from '../integrada/model';
import { Body, Btn, Chip, I, Screen, SectionPill, StatusSpace } from '../integrada/kit';
import { Avatar, Badge, Banner, EmptyState, ListGroup, ListItem, PinBoxes, Radio, RatingInput, SearchField, Segmented, SheetFrame, StepProgress, TextField, VehicleCard } from '../integrada/ds';
import { AppBar, FactList, LiveRequestCard, MapBadge, MapControl, MapScreen, P, PersonRow, R, Rating, RouteFields, SheetTitle, SosButton, StatusTimeline, StickyActionBar } from './parts';
import { Mode } from './model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

const chipC = (t: Any, on: boolean) => ({ bg: on ? t.inverse : t.fill, fg: on ? t.onInverse : t.text });
const sr = 'ig-sr';

/** El viaje en vivo (A0b y V4): la tarjeta lleva al seguimiento. */
function LiveTrip() {
  const { D, dest, a } = useVM();
  return <LiveRequestCard title={`Tu viaje a ${dest.name}`} sub={`${D.driver.female ? 'Conductora' : 'Conductor'} en camino · ${D.etaEco} min`} plate={D.driver.plate} car={D.driver.carShort} onClick={() => a.go('A6')} />;
}

/* ---------------- X1 · Portada de Servicios (V4 con un viaje en curso) ---------------- */
export function X1() {
  const { t, a, tripActive } = useVM();
  const tiles: [string, string][] = [['broom', 'Tareas domésticas'], ['nurse', 'Enfermero'], ['bottle', 'Cuidador de niños']];
  return (
    <MapScreen id="X1" variant="base" tabs top={<><SectionPill /><span style={{ flex: 1 }} /><MapControl icon="navigation" label="Ir a mi ubicación" onClick={() => a.toast('Ubicación actualizada')} /></>}>
      {tripActive ? (
        <>
          <SheetTitle title="Ya tenés un viaje en curso" sub="Esperá a que termine o cancelalo antes de pedir un servicio. Si es para otro día, podés pedirlo ahora." size={18} />
          <LiveTrip />
          <Btn kind="secondary" onClick={() => a.toast('Abre el pedido agendado de Servicios')}>Pedir para otro día</Btn>
        </>
      ) : (
        <>
          <h1 className={sr}>Portada de Servicios</h1>
          <SearchField placeholder="¿Qué necesitás?" onClick={() => a.toast('Abre el pedido de servicios (flujo actual)')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ font: `500 14px/20px ${R}`, letterSpacing: 0.1, color: t.text2 }}>Servicios populares</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
              {tiles.map(([icon, label]) => (
                <button key={label} onClick={() => a.toast('Abre el pedido de servicios (flujo actual)')} style={{ borderRadius: 16, background: t.cardBg, boxShadow: t.shadow1, padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: t.text }}>
                  <I name={icon} size={28} /><span style={{ font: `500 13px/18px ${R}`, textAlign: 'center' }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
          <ListGroup>
            <ListItem icon="car" title="Nuevo: Chambito Auto" sub="Pedí un viaje sin salir de Chambito" chevron onClick={() => a.go('A0')} />
          </ListGroup>
        </>
      )}
    </MapScreen>
  );
}

/* ---------------- A0 · Portada de Auto (V1 Moto, V2 Envío, A0b, E2, E3, E4) ---------------- */
export function A0() {
  const { t, a, D, mode, envio, tripActive, locOff, offline, serviceActive } = useVM();
  const top = <><SectionPill /><span style={{ flex: 1 }} /><MapControl icon="navigation" label="Ir a mi ubicación" onClick={() => a.toast('Ubicación actualizada')} /></>;
  const modes: { key: Mode; label: string; icon?: string }[] = [{ key: 'viaje', label: 'Viaje', icon: 'car' }, { key: 'moto', label: 'Moto' }, { key: 'envio', label: 'Envío', icon: 'bag' }];
  let body;
  if (offline) {
    body = <><h1 className={sr}>Sin conexión</h1><EmptyState icon="refresh" title="No pudimos cargar Auto" text="Revisá tus datos o el wifi. Si tenés un viaje activo, sigue en curso." action={<div style={{ width: 200 }}><Btn onClick={() => a.toast('Reintentando…')}>Reintentar</Btn></div>} /></>;
  } else if (serviceActive) {
    body = (
      <>
        <SheetTitle title="Ya tenés un servicio en curso" sub="Esperá a que termine o cancelalo antes de pedir un viaje, una moto o un envío." size={18} />
        <ListGroup><ListItem icon="broom" title="Limpieza general · 4 h" end={<Badge tone="live" dot>Servicio en curso</Badge>} /></ListGroup>
        <Btn kind="secondary" onClick={() => a.toast('Abre el servicio en curso')}>Ver el servicio</Btn>
      </>
    );
  } else if (tripActive) {
    body = <><h1 className={sr}>Portada con viaje activo</h1><LiveTrip /></>;
  } else if (locOff) {
    body = (
      <>
        <h1 className={sr}>Ubicación desactivada</h1>
        <Segmented label="Tipo de pedido" value={mode} onChange={a.setMode} options={modes} />
        <EmptyState icon="mappin" title="Activá tu ubicación" text="La usamos solo mientras usás la app, para marcar dónde te buscan." action={<div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 240 }}><Btn onClick={() => a.toast('Abre el permiso del sistema')}>Activar ubicación</Btn><Btn kind="ghost" onClick={() => a.go('A2')}>Escribir la dirección</Btn></div>} />
      </>
    );
  } else {
    body = (
      <>
        <h1 className={sr}>Portada de Auto</h1>
        <Segmented label="Tipo de pedido" value={mode} onChange={a.setMode} options={modes} />
        {mode === 'envio' ? (
          <>
            <SearchField placeholder="¿A dónde lo mandamos?" onClick={() => a.go('A2')} />
            <ListGroup><ListItem icon="mappin" title="Lo retiran en" sub={D.myPlace} end={<span style={{ color: t.link, font: `500 14px/20px ${R}` }}>Cambiar</span>} /></ListGroup>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ font: `500 14px/20px ${R}`, letterSpacing: 0.1, color: t.text2 }}>¿Qué enviás?</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {([['sobre', 'Sobre'], ['chico', 'Paquete chico'], ['mediano', 'Paquete mediano']] as const).map(([k, l]) => (
                  <Chip key={k} c={chipC(t, envio === k)} aria-pressed={envio === k ? 'true' : 'false'} onClick={() => a.patch({ envio: k })}>{envio === k && <I name="check" size={16} />}{l}</Chip>
                ))}
              </div>
            </div>
            <Banner>Lo lleva una moto o un auto, según el tamaño. Quien recibe sigue el envío con un enlace.</Banner>
          </>
        ) : (
          <>
            <SearchField placeholder="¿A dónde vas?" onClick={() => a.go('A2')} />
            {mode === 'moto' && <Banner>Moto: para 1 persona y equipaje chico.</Banner>}
            <div style={{ display: 'flex', gap: 8 }}>
              {['Casa', 'Trabajo'].map((l) => <Chip key={l} c={chipC(t, false)} onClick={() => a.pickDest(0)}><I name={l === 'Casa' ? 'home' : 'bag'} size={16} />{l}</Chip>)}
              <Chip c={chipC(t, false)} onClick={() => a.toast('Agregá un lugar desde Perfil')}><I name="plus" size={16} />Agregar</Chip>
            </div>
            <div>
              <span style={{ display: 'block', margin: '0 0 8px', font: `500 12px/16px ${R}`, letterSpacing: 0.2, textTransform: 'uppercase', color: t.text2 }}>Viajes recientes</span>
              <ListGroup>
                {D.dests.map((d: Any, i: number) => <ListItem key={d.name} icon="clock" title={d.name} sub={d.sub} divider={i === 0} onClick={() => a.pickDest(i)} />)}
              </ListGroup>
            </div>
          </>
        )}
      </>
    );
  }
  return (
    <>
      {offline && (
        <div role="status" style={{ position: 'absolute', left: 0, right: 0, top: 47, zIndex: 6, padding: '8px 20px', background: t.fill, color: t.text, font: `500 14px/20px ${R}`, display: 'flex', alignItems: 'center', gap: 8 }}><I name="refresh" size={16} />Sin conexión. Reintentando…</div>
      )}
      <MapScreen id="A0" variant={offline || locOff ? 'none' : 'base'} tabs top={offline ? undefined : top}>{body}</MapScreen>
    </>
  );
}

/* ---------------- A2 · ¿A dónde vas? (paso 1 de 3) ---------------- */
export function A2() {
  const { t, a, D } = useVM();
  return (
    <Screen id="A2">
      <StatusSpace />
      <AppBar title="¿A dónde vas?" onBack={a.back} />
      <Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ font: `400 15px/22px ${R}`, color: t.text2 }}>Elegí el destino y te mostramos el precio</span>
          <StepProgress step={1} total={3} />
          <RouteFields from={D.myPlace.replace('Tu ubicación · ', 'Tu ubicación · ')} to={D.dests[0].name.slice(0, 11)} focus />
          <div style={{ display: 'flex', gap: 8 }}>
            {['Casa', 'Trabajo'].map((l) => <Chip key={l} c={chipC(t, false)} onClick={() => a.pickDest(0)}><I name={l === 'Casa' ? 'home' : 'bag'} size={16} />{l}</Chip>)}
          </div>
          <div>
            <span style={{ display: 'block', margin: '0 0 8px', font: `500 12px/16px ${R}`, letterSpacing: 0.2, textTransform: 'uppercase', color: t.text2 }}>Resultados</span>
            <ListGroup>
              {D.dests.map((d: Any, i: number) => <ListItem key={d.name} icon="mappin" title={d.name} sub={d.sub} end={<span style={{ font: `400 13px/18px ${R}`, color: t.text2 }}>{d.km} km</span>} divider={i === 0} onClick={() => a.pickDest(i)} />)}
            </ListGroup>
          </div>
        </div>
      </Body>
    </Screen>
  );
}

/* ---------------- A3 · Punto de encuentro (paso 2 de 3) ---------------- */
export function A3() {
  const { t, a, D } = useVM();
  return (
    <MapScreen id="A3" variant="origin" top={<><MapControl icon="chevronleft" label="Volver" onClick={a.back} /><span style={{ flex: 1, height: 48, borderRadius: 9999, background: t.raised, boxShadow: '0 8px 24px #0000001F', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 16px' }}><span style={{ font: `500 15px/20px ${R}` }}>{D.origin}</span><span style={{ font: `400 12px/16px ${R}`, color: t.text2 }}>Mové el mapa para ajustar el pin</span></span><MapControl icon="navigation" label="Ir a mi ubicación" /></>}>
      <StepProgress step={2} total={3} />
      <SheetTitle title="Confirmá el punto de encuentro" sub="Ahí te va a buscar el conductor." />
      <TextField label="Referencia (opcional)" placeholder="Portón negro, farmacia…" />
      <Btn onClick={a.confirmPoint}>Confirmar punto de encuentro</Btn>
    </MapScreen>
  );
}

/* ---------------- A4 · Confirmá tu viaje (paso 3 de 3) · E1 invitado ---------------- */
export function A4() {
  const { t, a, D, dest, level, priceEco, priceConfort, price, pay, guest, fmt, card } = useVM();
  const lv = (k: 'eco' | 'confort', label: string, p: number, eta: number) => {
    const on = level === k;
    return (
      <button role="radio" aria-checked={on} onClick={() => a.patch({ level: k })} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: 12, borderRadius: 16, background: t.cardBg, boxShadow: on ? `inset 0 0 0 2px ${t.focus}` : `inset 0 0 0 1px ${t.bDefault}`, color: t.text, textAlign: 'left' }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ font: `500 15px/22px ${R}` }}>{label}</span><Radio on={on} /></span>
        <span style={{ font: `700 18px/26px ${P}` }}>{fmt(p)}</span>
        <span style={{ font: `400 13px/18px ${R}`, color: t.text2 }}>Llega en {eta} min</span>
      </button>
    );
  };
  return (
    <MapScreen id="A4" variant="route" top={<MapControl icon="chevronleft" label="Volver" onClick={a.back} />}>
      <StepProgress step={3} total={3} />
      <SheetTitle title="Confirmá tu viaje" />
      <ListGroup><ListItem icon="navigation" title={`${D.origin} → ${dest.name}`} sub={`${dest.km} km · ${dest.min} min`} /></ListGroup>
      {guest ? (
        <>
          <Banner title="Iniciá sesión para ver el precio">Tu recorrido queda guardado: al volver, seguís en este paso.</Banner>
          <Btn onClick={() => a.patch({ guest: false })}>Iniciar sesión</Btn>
          <Btn kind="secondary" onClick={() => a.patch({ guest: false })}>Crear cuenta</Btn>
        </>
      ) : (
        <>
          <Banner tone="warning">Hay mucha demanda en tu zona: el precio es más alto que lo habitual.</Banner>
          <div role="radiogroup" aria-label="Nivel del servicio" style={{ display: 'flex', gap: 12 }}>
            {lv('eco', 'Económico', priceEco, D.etaEco)}
            {lv('confort', 'Confort', priceConfort, D.etaConfort)}
          </div>
          <ListGroup><ListItem icon="wallet" title={pay} end={<button onClick={() => a.patch({ card: !card })} style={{ color: t.link, font: `500 14px/20px ${R}` }}>Cambiar</button>} /></ListGroup>
          <StickyActionBar total={fmt(price)}><Btn onClick={a.order}>Pedir viaje</Btn></StickyActionBar>
        </>
      )}
    </MapScreen>
  );
}

/* ---------------- A5 · Buscando conductor · A5b ampliar el radio ---------------- */
export function A5() {
  const { t, a, dest, price, pay, fmt, level } = useVM();
  return (
    <MapScreen id="A5" variant="search">
      <SheetTitle title="Buscando conductor" sub="Avisando a conductores en un radio de 3 km" />
      <div style={{ borderRadius: 16, padding: 16, background: t.cardBg, boxShadow: t.shadow1, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: `500 15px/22px ${R}` }}>{level === 'confort' ? 'Confort' : 'Económico'} · {dest.name}</span>
          <span style={{ font: `400 13px/18px ${R}`, color: t.text2 }}>{pay}</span>
        </span>
        <span style={{ font: `700 18px/26px ${P}` }}>{fmt(price)}</span>
      </div>
      <Badge tone="live" dot>Buscando</Badge>
      <Btn kind="secondary" onClick={a.cancelSearch}>Cancelar pedido</Btn>
    </MapScreen>
  );
}

export function A5b() {
  const { a, D, price, fmt } = useVM();
  return (
    <MapScreen id="A5b" variant="none">
      <SheetTitle title="No hay conductores cerca" sub="Podemos buscar en 6 km. Tarda un poco más y el precio cambia." />
      <FactList rows={[['Precio actual', fmt(price)], ['Precio nuevo', fmt(D.radiusNew)], ['Llegada aproximada', '9 min']]} />
      <Btn onClick={a.acceptRadius}>Aceptar y buscar</Btn>
      <Btn kind="ghost" onClick={a.cancelSearch}>Cancelar</Btn>
    </MapScreen>
  );
}

/* ---------------- A6 · Conductor en camino · A7 llegó · A8 en curso ---------------- */
function DriverBlock({ status }: { status: string }) {
  const { t, a, D } = useVM();
  return <PersonRow ini={D.driver.ini} name={D.driver.name} sub={<>{status} · <Rating value={D.driver.rating} /></>} action={<button onClick={() => a.sheet('detalles')} style={{ color: t.link, font: `500 14px/20px ${R}` }}>Ver detalle</button>} />;
}

export function A6() {
  const { a, D } = useVM();
  return (
    <MapScreen id="A6" variant="driver" top={<><MapControl icon="chevronleft" label="Volver" onClick={() => a.go('A0')} /><span style={{ flex: 1 }} /><MapBadge>Llega en {D.etaEco} min · {D.times.arrives}</MapBadge></>}>
      <h1 className={sr}>{D.driver.female ? 'Conductora' : 'Conductor'} en camino</h1>
      <DriverBlock status={D.driver.female ? 'Conductora en camino' : 'Conductor en camino'} />
      <VehicleCard plate={D.driver.plate} model={D.driver.car} detail={`${D.driver.color} · ${D.driver.year}`} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ display: 'flex', flexDirection: 'column' }}><b style={{ font: `500 15px/22px ${R}` }}>PIN de inicio</b><span style={{ font: `400 13px/18px ${R}`, opacity: 0.75 }}>Mostráselo al subir</span></span>
        <PinBoxes digits={D.pinCode} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <span style={{ flex: 1 }}><Btn kind="secondary" onClick={a.share}>Compartir viaje</Btn></span>
        <span style={{ flex: 1 }}><Btn kind="ghost" onClick={a.cancelSearch}>Cancelar</Btn></span>
      </div>
    </MapScreen>
  );
}

export function A7() {
  const { a, D, wait } = useVM();
  const mm = Math.floor(wait / 60), ss = String(wait % 60).padStart(2, '0');
  return (
    <MapScreen id="A7" variant="arrived" top={<><span style={{ flex: 1 }} /><MapBadge><I name="clock" size={16} />Te espera · {mm}:{ss} sin cargo</MapBadge></>}>
      <SheetTitle title={D.driver.female ? 'Tu conductora llegó' : 'Tu conductor llegó'} sub={`${D.driver.first} te espera en ${D.origin}`} />
      <VehicleCard plate={D.driver.plate} model={D.driver.carShort} variant="arrived" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <b style={{ font: `500 15px/22px ${R}` }}>Tu PIN de inicio</b>
        <PinBoxes digits={D.pinCode} />
      </div>
      {/* el sistema de diseño no tiene botón de llamar: el contacto es por chat */}
      <Btn kind="secondary" onClick={a.chat}><I name="chat" size={20} />Escribile a {D.driver.first}</Btn>
    </MapScreen>
  );
}

export function A8() {
  const { t, a, D, dest } = useVM();
  return (
    <MapScreen id="A8" variant="trip" floating={<SosButton onClick={() => a.sheet('sos')} />} top={<><span style={{ flex: 1 }} /><MapBadge>Llegás a las {dest.arrive}</MapBadge></>}>
      <h1 className={sr}>Viaje en curso</h1>
      <PersonRow ini={D.driver.ini} name="Viaje en curso" sub={`${D.driver.first} · ${D.driver.plate}`} action={<button onClick={() => a.sheet('detalles')} style={{ color: t.link, font: `500 14px/20px ${R}` }}>Ver detalle</button>} />
      <ListGroup><ListItem icon="mappin" title={dest.name} sub={dest.tripLeft} /></ListGroup>
      <Btn kind="secondary" onClick={a.share}>Compartir viaje</Btn>
    </MapScreen>
  );
}

/* ---------------- A9 · Viaje terminado y calificación ---------------- */
export function A9() {
  const { t, a, D, dest, stars, chips, tip, tipValue, price, fmt } = useVM();
  const bad = stars > 0 && stars <= 2;
  const options = bad ? ['Manejo inseguro', 'Llegó tarde', 'Auto sucio', 'Mala atención'] : ['Manejo seguro', 'Puntual', 'Auto limpio', 'Buena atención'];
  return (
    <Screen id="A9">
      <StatusSpace />
      <Body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 16, textAlign: 'center' }}>
          <Avatar ini={D.driver.ini} size={80} verified />
          <h1 style={{ margin: 0, font: `700 22px/30px ${P}`, letterSpacing: -0.2 }}>¿Cómo estuvo tu viaje con {D.driver.first}?</h1>
          <RatingInput value={stars} onChange={(n) => a.patch({ stars: n, chips: {} })} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
          <span style={{ font: `500 14px/20px ${R}`, letterSpacing: 0.1, color: bad ? t.danger : t.text2 }}>{bad ? '¿Qué pasó? (obligatorio)' : '¿Qué te gustó?'}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {options.map((o) => <Chip key={o} c={chipC(t, !!chips[o])} aria-pressed={chips[o] ? 'true' : 'false'} onClick={() => a.patch({ chips: { ...chips, [o]: !chips[o] } })}>{chips[o] && <I name="check" size={16} />}{o}</Chip>)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
          <span style={{ font: `500 14px/20px ${R}`, letterSpacing: 0.1, color: t.text2 }}>Propina (opcional)</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[...D.tips, 'otro' as const].map((v) => {
              const on = tip === v;
              return <Chip key={String(v)} c={chipC(t, on)} aria-pressed={on ? 'true' : 'false'} onClick={() => a.patch({ tip: on ? 0 : v })}>{on && <I name="check" size={16} />}{v === 'otro' ? 'Otro' : fmt(v)}</Chip>;
            })}
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <FactList rows={[[`Viaje · ${dest.kmReal} km · ${dest.minReal} min`, fmt(price)], ['Propina', fmt(tipValue)]]} total={['Total', fmt(price + tipValue)]} />
        </div>
        <div style={{ height: 24 }} />
      </Body>
      <div style={{ flex: 'none', padding: '12px 20px 34px', background: t.cardBg, boxShadow: `0 -1px 0 ${t.line}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Btn onClick={a.sendRating}>Enviar calificación</Btn>
        <Btn kind="tertiary" onClick={() => a.toast('Te enviamos el recibo por correo')}>Ver recibo</Btn>
      </div>
    </Screen>
  );
}

/* ---------------- A11 · Actividad con todas las secciones ---------------- */
export function A11() {
  const { t, a, D, fmt, tripActive, dest } = useVM();
  return (
    <Screen id="A11">
      <StatusSpace />
      <div style={{ padding: '8px 20px 0' }}><h1 style={{ margin: 0, font: `700 28px/36px ${P}`, letterSpacing: -0.3 }}>Actividad</h1></div>
      <Body>
        <div style={{ display: 'flex', gap: 8, margin: '16px 0 24px', overflowX: 'auto' }}>
          {['Todo', 'Servicios', 'Auto', 'Market'].map((f, i) => <Chip key={f} c={chipC(t, i === 0)} aria-pressed={i === 0 ? 'true' : 'false'}>{i === 0 && <I name="check" size={16} />}{f}</Chip>)}
        </div>
        {tripActive && (
          <div style={{ marginBottom: 24 }}>
            <span style={{ display: 'block', margin: '0 0 8px', font: `500 12px/16px ${R}`, letterSpacing: 0.2, textTransform: 'uppercase', color: t.text2 }}>En curso</span>
            <LiveRequestCard title={`Tu viaje a ${dest.name}`} sub={`Conductor en camino · ${D.etaEco} min`} plate={D.driver.plate} car={D.driver.carShort} onClick={() => a.go('A6')} />
          </div>
        )}
        <span style={{ display: 'block', margin: '0 0 8px', font: `500 12px/16px ${R}`, letterSpacing: 0.2, textTransform: 'uppercase', color: t.text2 }}>Anteriores</span>
        <ListGroup>
          {D.history.map(([title, sub, amount, status, kind]: Any, i: number) => (
            <ListItem key={title} icon={kind === 'auto' ? 'car' : 'broom'} title={title} sub={sub} divider={i < D.history.length - 1}
              end={<span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}><span style={{ font: `500 15px/22px ${R}` }}>{amount ? fmt(amount) : 'Sin cargo'}</span><Badge tone={status === 'Cancelado' ? 'danger' : 'success'}>{status}</Badge></span>}
              onClick={() => a.toast('Te enviamos el recibo por correo')} />
          ))}
        </ListGroup>
        <div style={{ height: 140 }} />
      </Body>
    </Screen>
  );
}

/* ---------------- A10 · Detalles del viaje (hoja) ---------------- */
export function DetallesSheet() {
  const { t, a, D, dest, fmt, level, price, pay, sheet } = useVM();
  if (sheet !== 'detalles') return null;
  return (
    <div onClick={a.closeSheet} style={{ position: 'absolute', inset: 0, zIndex: 80, background: t.scrim, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div className="ig-sheet" role="dialog" aria-modal="true" aria-label="Detalles del viaje" onClick={(e) => e.stopPropagation()} style={{ maxHeight: 760, overflowY: 'auto', borderRadius: '24px 24px 0 0' }}>
        <SheetFrame title="Detalles del viaje" onClose={a.closeSheet}>
          <RouteFields from={D.origin} to={dest.name} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8 }}>
            {[['Distancia', `${dest.km} km`], ['Tiempo', `${dest.min} min`], ['Categoría', level === 'confort' ? 'Confort' : 'Económico']].map(([k, v]) => (
              <span key={k} style={{ borderRadius: 16, padding: 12, background: t.cardBg, boxShadow: t.shadow1, display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ font: `400 13px/18px ${R}`, color: t.text2 }}>{k}</span><b style={{ font: `700 16px/24px ${P}` }}>{v}</b></span>
            ))}
          </div>
          <FactList rows={D.fare.map(([k, v]: [string, number]) => [k, fmt(v)])} total={[`Total cerrado · ${pay.split(' · ')[0]}`, fmt(price)]} />
          <span style={{ font: `500 12px/16px ${R}`, letterSpacing: 0.2, textTransform: 'uppercase', color: t.text2 }}>Cómo va tu viaje</span>
          <StatusTimeline steps={[[D.driver.female ? 'Conductora asignada' : 'Conductor asignado', D.times.assigned, true], ['Llegó al punto', D.times.arrived, true], ['Viaje en curso', D.times.started, true], ['Llegada al destino', dest.arrive, false]]} />
        </SheetFrame>
      </div>
    </div>
  );
}
