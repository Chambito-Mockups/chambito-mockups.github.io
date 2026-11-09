/** Auto v3 · conductor: D0 sumate, D1 requisitos, D2 documentos, D3 modo conductor, D4 oferta (hoja), D5–D8 el viaje y D9 billetera. */
import { useVM } from '../integrada/model';
import { Body, Btn, I, IconBtn, Screen, StatusSpace } from '../integrada/kit';
import { Avatar, Badge, Banner, ListGroup, ListItem, PinBoxes, ProgressBar, SectionLabel, SheetFrame, Switch } from '../integrada/ds';
import { AppBar, FactList, HeroPanel, Keypad, MapControl, MapScreen, P, PersonRow, R, SheetTitle, SlideToConfirm, SosButton, StatStrip, UploadSlot } from './parts';

/* ---------------- D0 · Sumate como conductor ---------------- */
export function D0() {
  const { a, D, fmt } = useVM();
  return (
    <Screen id="D0">
      <StatusSpace />
      <div style={{ padding: '8px 20px 0' }}><h1 style={{ margin: 0, font: `700 28px/36px ${P}`, letterSpacing: -0.3 }}>Sumate como conductor</h1></div>
      <Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 12 }}>
          <span style={{ font: `400 15px/22px ${R}` }}>Usá tu auto para ganar con Chambito, en los horarios que elijas.</span>
          <HeroPanel kicker={`Un viaje promedio en ${D.city} deja`} title={fmt(D.avg)} />
          <div>
            <SectionLabel>Qué necesitás</SectionLabel>
            <ListGroup>
              {['Licencia de conducir vigente', 'Auto con título o cédula verde', 'Seguro vigente'].map((x, i) => <ListItem key={x} icon="check" title={x} divider={i < 2} />)}
            </ListGroup>
          </div>
          <Btn onClick={() => a.go('D1')}>Empezar</Btn>
          <div style={{ height: 120 }} />
        </div>
      </Body>
    </Screen>
  );
}

/* ---------------- D1 · Requisitos de conductor ---------------- */
export function D1() {
  const { t, a, D, uploads } = useVM();
  const reqs: [string, string, boolean][] = [
    ['Licencia de conducir', 'Frente y dorso · vence 03/2029', true],
    ['Datos del vehículo', `${D.driver.car} ${D.driver.year} · ${D.driver.color} · ${D.driver.plate}`, true],
    ['Seguro vigente', 'Póliza · vence 16/11/2026', true],
    ['Título o cédula verde', uploads.titulo ? 'Subido · en revisión al enviar' : 'Subir foto o PDF', !!uploads.titulo],
  ];
  const photos = ['Frente', 'Lateral', 'Patente'];
  const photosDone = photos.every((p) => uploads[p]);
  const done = reqs.filter((r) => r[2]).length + (photosDone ? 1 : 0);
  return (
    <Screen id="D1">
      <StatusSpace />
      <AppBar title="Conductor" onBack={a.back} />
      <Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ font: `500 15px/22px ${R}` }}>{done} de 5 requisitos</span>
            <ProgressBar value={done / 5} />
          </div>
          <ListGroup>
            {reqs.map(([title, sub, ok], i) => (
              <ListItem key={title} title={title} sub={sub} divider={i < reqs.length - 1}
                end={ok ? <Badge tone="success">Listo</Badge> : <button onClick={() => a.upload('titulo')} style={{ color: t.link, font: `500 14px/20px ${R}` }}>Subir</button>} />
            ))}
          </ListGroup>
          <div>
            <SectionLabel>Fotos del auto</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8 }}>
              {photos.map((p) => <UploadSlot key={p} label={p} done={!!uploads[p]} onClick={() => a.upload(p)} />)}
            </div>
          </div>
        </div>
      </Body>
      <div style={{ flex: 'none', padding: '12px 20px 34px', background: t.cardBg, boxShadow: `0 -1px 0 ${t.line}` }}>
        <Btn aria-disabled={done < 5 ? 'true' : 'false'} onClick={() => (done < 5 ? a.toast('Completá los 5 requisitos para enviar') : a.go('D2'))}>Enviar a revisión</Btn>
      </div>
    </Screen>
  );
}

/* ---------------- D2 · Revisión y vencimientos ---------------- */
export function D2() {
  const { t, a } = useVM();
  const rows: [string, string, 'success' | 'neutral' | 'danger', string?][] = [
    ['Licencia de conducir', 'Aprobado', 'success'], ['Datos del vehículo', 'Aprobado', 'success'], ['Título o cédula verde', 'En revisión', 'neutral'],
    ['Fotos del auto', 'Rechazado', 'danger', 'Motivo: en la foto de la patente no se leen los números.'],
  ];
  return (
    <Screen id="D2">
      <StatusSpace />
      <AppBar title="Mis documentos" onBack={a.back} />
      <Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Banner tone="warning" title="Tu seguro vence en 12 días">Subí la póliza nueva antes del 16/11 para seguir recibiendo viajes.</Banner>
          <ListGroup>
            {rows.map(([title, status, tone, why], i) => (
              <ListItem key={title} title={title} divider sub={why && <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ color: t.danger }}>{why}</span><button onClick={() => a.toast('Abre la cámara para la foto de la patente')} style={{ alignSelf: 'flex-start', color: t.link, font: `500 14px/20px ${R}` }}>Volver a enviar</button></span>}
                end={<Badge tone={tone}>{status}</Badge>} />
            ))}
            <ListItem title="Seguro vigente" sub="Vence el 16/11/2026" end={<button onClick={() => a.toast('Subí la póliza nueva')} style={{ color: t.link, font: `500 14px/20px ${R}` }}>Actualizar</button>} />
          </ListGroup>
        </div>
      </Body>
    </Screen>
  );
}

/* ---------------- D3 · Modo conductor ---------------- */
export function D3() {
  const { t, a, D, online, fmt } = useVM();
  return (
    <MapScreen id="D3" variant="heat" heat={online} tabs top={<><span style={{ flex: 1 }} /><MapControl icon="wallet" label="Billetera" onClick={() => a.go('D9')} /><MapControl icon="shield" label="Mis documentos" onClick={() => a.go('D2')} /></>}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: `400 13px/18px ${R}`, color: t.text2 }}>Tu estado</span>
          <h1 style={{ margin: 0, font: `700 18px/26px ${P}` }}>{online ? 'Disponible para viajes' : 'Desconectado'}</h1>
          <span style={{ font: `400 13px/18px ${R}`, color: t.text2 }}>{online ? 'Buscando pasajeros cerca tuyo' : 'Conectate para recibir viajes'}</span>
        </span>
        <Switch on={online} label="Disponible para viajes" onChange={(v) => (v ? a.connect() : a.disconnect())} />
      </div>
      <div style={{ borderRadius: 16, padding: '12px 0', background: t.cardBg, boxShadow: t.shadow1 }}>
        <StatStrip compact items={[['×1,4', 'Demanda'], [String(D.todayTrips), 'Viajes de hoy'], [fmt(D.todayEarn), 'Ganancias de hoy']]} />
      </div>
      <ListGroup><ListItem icon="mappin" title="Zonas con demanda" sub={`Más en ${D.zone} · 2,1 km`} /></ListGroup>
      {online && <Btn kind="secondary" onClick={() => a.sheet('offer')}>Simular un viaje nuevo</Btn>}
    </MapScreen>
  );
}

/* ---------------- D4 · Oferta de viaje (hoja encima de cualquier pantalla) ---------------- */
export function OfferSheetV3() {
  const { t, a, D, fmt, sheet, offerSecs } = useVM();
  if (sheet !== 'offer') return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 85, background: t.scrim, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div className="ig-sheet" role="alertdialog" aria-label="Nuevo viaje">
        <SheetFrame title={`Nuevo viaje · Económico`} onClose={a.rejectOffer}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ font: `400 13px/18px ${R}`, color: t.text2 }}>Vas a ganar</span>
              <span style={{ font: `700 32px/40px ${P}`, letterSpacing: -0.5 }}>{fmt(D.earn)}</span>
              <span style={{ font: `400 13px/18px ${R}`, color: t.text2 }}>{D.offer.pay}</span>
            </span>
            <Badge tone="warning">Vence en 0:{String(offerSecs).padStart(2, '0')}</Badge>
          </div>
          <ProgressBar value={offerSecs / 12} />
          <div style={{ borderRadius: 16, padding: '12px 0', background: t.cardBg, boxShadow: t.shadow1 }}><StatStrip items={[['3 min', 'Llegás en'], [`${D.dests[0].min} min`, 'Duración del viaje']]} /></div>
          <ListGroup>
            <ListItem title={D.offer.from} sub={`Hasta el punto de encuentro · ${D.offer.fromKm} km`} divider />
            <ListItem title={D.offer.to} sub={`${D.offer.toKm} km de viaje`} />
          </ListGroup>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ flex: 1 }}><Btn kind="secondary" onClick={a.rejectOffer}>Ahora no</Btn></span>
            <span style={{ flex: 1.4 }}><Btn onClick={a.acceptOffer}>Aceptar</Btn></span>
          </div>
        </SheetFrame>
      </div>
    </div>
  );
}

/** Indicación de navegación por voz sobre el mapa. */
function NavHint({ dist, text }: { dist: string; text: string }) {
  const { t } = useVM();
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, background: t.inverse, color: t.onInverse, boxShadow: '0 8px 24px #0000001F' }}>
      <span style={{ width: 40, height: 40, borderRadius: 12, background: t.brand, color: t.onBrand, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><I name="navigation" size={24} /></span>
      <span style={{ display: 'flex', flexDirection: 'column' }}><b style={{ font: `700 18px/26px ${P}` }}>{dist}</b><span style={{ font: `400 13px/18px ${R}`, opacity: 0.8 }}>{text}</span></span>
    </div>
  );
}

/* ---------------- D5 · Ir a buscar ---------------- */
export function D5() {
  const { a, D } = useVM();
  return (
    <MapScreen id="D5" variant="driver" top={<NavHint dist="200 m" text="Girá a la izquierda en Av. Brasilia" />}>
      <PersonRow ini={D.passenger.ini} name={`Buscá a ${D.passenger.name}`} sub={`${D.origin} · 3 min`} action={<IconBtn icon="chat" label={`Chat con ${D.passenger.name}`} onClick={() => a.toast(`Abrimos el chat con ${D.passenger.name}`)} />} />
      <h1 className="ig-sr">Ir a buscar</h1>
      <Banner>Referencia: portón negro, frente a la farmacia</Banner>
      <Btn onClick={a.arrived}>Llegué</Btn>
    </MapScreen>
  );
}

/* ---------------- D6 · PIN de inicio ---------------- */
export function D6() {
  const { t, a, D, pin, pinErr } = useVM();
  const shown = (pin + '····').slice(0, 4);
  return (
    <Screen id="D6">
      <StatusSpace />
      <AppBar title="Inicio del viaje" onBack={a.back} />
      <Body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingTop: 8, textAlign: 'center' }}>
          <SheetTitle title={`Pedile el PIN a ${D.passenger.name}`} sub="Son 4 dígitos que ve en su app. Así confirmás que subió la persona correcta." />
          <PinBoxes digits={shown.replace(/[0-9]/g, '•')} label="PIN ingresado" />
          {pinErr && <span role="alert" style={{ display: 'flex', alignItems: 'center', gap: 6, font: `400 13px/18px ${R}`, color: t.danger }}><I name="alert" size={16} />El PIN no coincide. Pedíselo de nuevo.</span>}
          <span style={{ font: `400 13px/18px ${R}`, color: t.text2 }}>Demo: el PIN de {D.passenger.name} es {D.pinCode}</span>
        </div>
      </Body>
      <div style={{ flex: 'none', padding: '12px 20px 34px' }}><Keypad onKey={a.press} onErase={a.erase} /></div>
    </Screen>
  );
}

/* ---------------- D7 · En viaje ---------------- */
export function D7() {
  const { a, D, dest, fmt, price } = useVM();
  return (
    <MapScreen id="D7" variant="trip" floating={<SosButton onClick={() => a.sheet('sos')} />} top={<NavHint dist="800 m" text="Seguí por Av. Santa Teresa" />}>
      <SheetTitle title={`Hacia ${dest.name}`} sub={`Llegás ${dest.arrive} · ${dest.tripLeft}`} size={18} />
      <PersonRow ini={D.passenger.ini} name={`${D.passenger.name} a bordo`} sub={`${D.payCash.split(' · ')[0]} · ${fmt(price)}`} />
      <SlideToConfirm label="Deslizá para finalizar el viaje" onConfirm={a.finish} />
    </MapScreen>
  );
}

/* ---------------- D8 · Cierre y cobro ---------------- */
export function D8() {
  const { t, a, D, dest, fmt, price, country } = useVM();
  const commission = price - D.earn;
  return (
    <Screen id="D8">
      <StatusSpace />
      <Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>
          <Badge tone="success">Viaje terminado · {dest.name}</Badge>
          <h1 style={{ margin: 0, font: `700 22px/30px ${P}`, letterSpacing: -0.2 }}>{country === 'AR' ? 'Cobrado con Mercado Pago' : `Cobrá ${fmt(price)} en efectivo`}</h1>
          <FactList rows={[['Tarifa cerrada', fmt(price)], [`Comisión Chambito (${D.commission} %)`, `− ${fmt(commission)}`]]} total={['Tu ganancia', fmt(D.earn)]} />
          <Banner>{D.debt ? 'La comisión se suma a tu deuda y se descuenta en la próxima liquidación.' : 'La comisión se descuenta del cobro: no suma deuda.'}</Banner>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar ini={D.passenger.ini} size={40} />
            <span style={{ flex: 1, font: `500 15px/22px ${R}` }}>¿Cómo fue viajar con {D.passenger.name}?</span>
          </div>
        </div>
      </Body>
      <div style={{ flex: 'none', padding: '12px 20px 34px', background: t.cardBg, boxShadow: `0 -1px 0 ${t.line}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Btn onClick={a.collected}>Cobré · volver a disponible</Btn>
        <Btn kind="tertiary" onClick={() => a.toast('Abrimos el chat con Soporte')}>Reportar un problema</Btn>
      </div>
    </Screen>
  );
}

/* ---------------- D9 · Billetera ---------------- */
export function D9() {
  const { t, a, D, fmt } = useVM();
  return (
    <Screen id="D9">
      <StatusSpace />
      <AppBar title="Billetera" onBack={a.back} />
      <Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <HeroPanel kicker="Ganancias de la semana" title={fmt(D.week)}><span style={{ font: `400 14px/20px ${R}` }}>Próxima liquidación: {D.payout}</span></HeroPanel>
          {D.debtCap ? (
            <div style={{ borderRadius: 16, padding: 16, background: t.cardBg, boxShadow: t.shadow1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ font: `500 15px/22px ${R}` }}>Deuda de comisión</span><b style={{ font: `700 18px/26px ${P}` }}>{fmt(D.debt)}</b></span>
              <ProgressBar value={D.debt / D.debtCap} onCard />
              <span style={{ font: `400 13px/18px ${R}`, color: t.text2 }}>Tope {fmt(D.debtCap)}. Si lo alcanzás, dejás de recibir viajes en efectivo.</span>
            </div>
          ) : (
            <Banner tone="success">Sin deuda de comisión: cobrás con Mercado Pago y se descuenta en el momento.</Banner>
          )}
          <div>
            <SectionLabel>Movimientos</SectionLabel>
            <ListGroup>
              {D.moves.map(([title, sub, amount]: [string, string, number], i: number) => (
                <ListItem key={title} icon={amount < 0 ? 'wallet' : 'car'} title={title} sub={sub} divider={i < D.moves.length - 1}
                  end={<span style={{ font: `500 15px/22px ${R}`, fontVariantNumeric: 'tabular-nums', color: amount < 0 ? t.text : t.success }}>{amount < 0 ? `− ${fmt(-amount)}` : `+ ${fmt(amount)}`}</span>} />
              ))}
            </ListGroup>
          </div>
        </div>
      </Body>
    </Screen>
  );
}
