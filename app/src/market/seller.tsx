import { useEffect, useState } from 'react';
import { useApp } from '../store';
import { P, R } from '../theme';
import { Button, Icon } from '../ui/kit';
import { Category, CATEGORIES, CATEGORY_ATTRS, MY_TABS, MyListing, MyStatus, priceFor } from './data';
import { Draft, emptyDraft, PhotoState, useMarket } from './state';
import { RecibisNote } from './payouts';
import { catKey, limitOf, SHIP_LABEL } from '../commission';
import { EmptyBlock, FilterChip, InfoNote, MFooter, MScreen, MSheet, MTopBar, Photo, pretty, RoundBtn, StatusTag, UnderlineTabs, useMoney, useRequireLogin, Verified } from './kit';

const demoDraft = (): Draft => ({
  ...emptyDraft(),
  title: 'Bicicleta Trek rodado 29',
  category: 'Deportes',
  condition: 'Usado',
  price: '1.450.000',
  attrs: { Rodado: '29', Talle: 'M', Marca: 'Trek' },
  description: 'Poco uso, cambios Shimano de 21 velocidades. Incluye luces.',
});
const num = (s: string) => Number(s.replace(/\D/g, '')) || 0;
const fmt = (s: string) => s.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** «Vender»: welcome the first time → identity → limit → resume draft → Publicar 1. */
export function useVender() {
  const { go, setOverlay, settings } = useApp();
  const { welcomed, draft, mine } = useMarket();
  const gate = useRequireLogin();
  const proceed = useProceedToPublish();
  return () =>
    gate(() => {
      if (!welcomed) return go('V14');
      if (settings.sellerStatus !== 'verificado') return go('V15');
      if (settings.atLimit || mine.filter((m) => m.status === 'Activas').length >= 50) return setOverlay('limit');
      if (draft && draft.savedAt) return setOverlay('draft');
      proceed();
    }, 'publicar');
}
function useProceedToPublish() {
  const { go } = useApp();
  const { setDraft, mine } = useMarket();
  return () => {
    setDraft(mine.length > 9 ? emptyDraft() : demoDraft());
    go('V16');
  };
}

/* ================= V14 Vender · bienvenida ================= */
export function V14() {
  const { t, back, go, settings } = useApp();
  const { setWelcomed } = useMarket();
  const proceed = useProceedToPublish();
  const points: [string, string, string][] = [
    ['tag', 'Publicar es gratis', 'No cobramos comisión en esta etapa.'],
    ['shield', 'Sólo vendedores verificados', 'Por eso los compradores confían.'],
    ['messageCircle', 'Hablás por el chat de Chambito', 'Sin dar tu teléfono ni tu dirección.'],
  ];
  return (
    <MScreen
      footer={
        <MFooter gap={10}>
          <Button onClick={() => { setWelcomed(true); if (settings.sellerStatus !== 'verificado') go('V15', { replace: true }); else proceed(); }}>Empezar</Button>
          <button className="press" onClick={() => go('C3')} style={{ font: R(14, 500), color: t.link, alignSelf: 'center', minHeight: 40 }}>Ver membresías y comisiones</button>
          <span style={{ font: R(13), color: t.text2, textAlign: 'center' }}>Te lleva menos de 2 minutos</span>
        </MFooter>
      }
    >
      <MTopBar onBack={back} backIcon="close" />
      <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ width: 64, height: 64, borderRadius: 32, background: t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="tag" size={30} color={t.success} /></span>
          <span style={{ font: P(28), ...pretty }}>Vendé en Chambito Market</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {points.map(([icon, title, text]) => (
            <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ width: 44, height: 44, borderRadius: 22, background: t.mSurface, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={icon} size={20} /></span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ font: P(16) }}>{title}</span>
                <span style={{ font: R(14), color: t.text2 }}>{text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MScreen>
  );
}

/* ================= V15 Verificá tu identidad / en revisión / suspendida ================= */
export function V15() {
  const { t, back, go, settings, set, showToast } = useApp();
  const proceed = useProceedToPublish();
  const s = settings.sellerStatus;
  if (s === 'en-revision')
    return (
      <MScreen footer={<MFooter><Button onClick={proceed}>Preparar mi publicación</Button><Button kind="secondary" onClick={() => go('M01', { replace: true })}>Volver a la Tienda</Button></MFooter>}>
        <MTopBar onBack={back} />
        <div style={{ padding: '40px 20px 0' }}>
          <EmptyBlock icon="clock" title="Estamos revisando tu cuenta" text="Suele tardar menos de 24 horas y te avisamos por notificación. Mientras, podés dejar tu publicación lista." />
        </div>
      </MScreen>
    );
  if (s === 'suspendido')
    return (
      <MScreen footer={<MFooter><Button kind="secondary" onClick={() => showToast('Abre las normas de la Tienda')}>Ver normas de la Tienda</Button><Button kind="secondary" onClick={() => showToast('Abre el chat con Soporte')}>Escribir a soporte</Button></MFooter>}>
        <MTopBar onBack={back} />
        <div style={{ padding: '40px 20px 0' }}>
          <EmptyBlock icon="error" tone="error" title="Tu cuenta de vendedor está suspendida" text="Publicaste productos que no están permitidos. Podés seguir comprando y pidiendo servicios." />
        </div>
      </MScreen>
    );
  return (
    <MScreen
      footer={
        <MFooter>
          <Button onClick={() => { set({ sellerStatus: 'verificado' }); showToast('Identidad verificada'); proceed(); }}>Verificar identidad</Button>
          <Button kind="secondary" onClick={back}>Ahora no</Button>
        </MFooter>
      }
    >
      <MTopBar onBack={back} />
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <span style={{ width: 64, height: 64, borderRadius: 32, background: t.mSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="shield" size={30} /></span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: P(26), ...pretty }}>Verificá tu identidad para vender</span>
          <span style={{ font: R(15), color: t.text2, ...pretty }}>Es la misma verificación que usás para pedir servicios. Tarda unos 3 minutos.</span>
        </div>
        {['Tu cédula, frente y dorso', 'Una selfie'].map((x) => (
          <div key={x} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 28, height: 28, borderRadius: 14, background: t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={16} color={t.success} /></span>
            <span style={{ font: R(15, 500) }}>{x}</span>
          </div>
        ))}
      </div>
    </MScreen>
  );
}

/* Publish header: close + «Publicar» + step + segmented progress */
function PublishHeader({ step }: { step: 1 | 2 | 3 }) {
  const { t, go, showToast } = useApp();
  const { setDraft } = useMarket();
  return (
    <>
      <MTopBar
        title="Publicar"
        onBack={() => { setDraft((d) => ({ ...d, savedAt: Date.now() })); go('M01', { replace: true }); showToast('Guardamos tu borrador'); }}
        backIcon="close"
        sub={<span style={{ font: R(13, 500), color: t.text2 }}>Paso {step} de 3</span>}
      />
      <div style={{ padding: '0 20px 12px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4 }}>
        {[1, 2, 3].map((i) => <span key={i} style={{ height: 4, borderRadius: 2, background: i <= step ? t.green : t.mChip, transition: 'background .3s' }} />)}
      </div>
    </>
  );
}

/* ================= V16 Publicar 1 · Fotos ================= */
export function V16() {
  const { t, go } = useApp();
  const { draft, setDraft } = useMarket();
  const [count, setCount] = useState(0);
  const photos = draft?.photos ?? [];
  const setState = (id: number, state: PhotoState) => setDraft((d) => ({ ...d, photos: d.photos.map((p) => (p.id === id ? { ...p, state } : p)) }));
  const upload = (replaceId?: number) => {
    const id = Date.now() + Math.random();
    const n = count + 1;
    setCount(n);
    const flagged = n === 4 && !replaceId; // the 4th photo shows the «no permitida» state once
    setDraft((d) => {
      const item = { id, state: 'subiendo' as PhotoState, ph: (n % 3) as 0 | 1 | 2 };
      const list = replaceId ? d.photos.map((p) => (p.id === replaceId ? item : p)) : [...d.photos, item];
      return { ...d, photos: list };
    });
    window.setTimeout(() => setState(id, 'procesando'), 700);
    window.setTimeout(() => setState(id, flagged ? 'no-permitida' : 'lista'), 1400);
  };
  const makeCover = (id: number) => setDraft((d) => ({ ...d, photos: [d.photos.find((p) => p.id === id)!, ...d.photos.filter((p) => p.id !== id)] }));
  const remove = (id: number) => setDraft((d) => ({ ...d, photos: d.photos.filter((p) => p.id !== id) }));
  const ready = photos.some((p) => p.state === 'lista') && !photos.some((p) => p.state === 'no-permitida' || p.state === 'subiendo' || p.state === 'procesando');
  const blocked = photos.some((p) => p.state === 'no-permitida');
  return (
    <MScreen footer={<MFooter><Button kind={ready ? 'primary' : 'disabled'} onClick={() => { setDraft((d) => ({ ...d, step: 2 })); go('V17', { replace: true }); }}>Continuar</Button></MFooter>}>
      <PublishHeader step={1} />
      <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span style={{ font: P(22) }}>Agregá fotos</span>
        <span style={{ font: R(15), color: t.text2, ...pretty }}>Hasta 10. La primera es la portada. Tocá una foto lista para hacerla portada.</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8 }}>
          {photos.map((p, i) => (
            <div key={p.id} style={{ position: 'relative', aspectRatio: '1', borderRadius: 14, overflow: 'hidden', border: p.state === 'no-permitida' ? `2px solid ${t.error}` : 'none', boxSizing: 'border-box' }}>
              {p.state === 'no-permitida' ? (
                <div style={{ position: 'absolute', inset: 0, background: t.name === 'dark' ? 'rgba(255,107,107,0.12)' : 'rgba(183,28,28,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <Icon name="warning" size={22} color={t.error} />
                  <span style={{ font: R(12, 500), color: t.error }}>No permitida</span>
                  <button onClick={() => upload(p.id)} style={{ font: R(12, 500), color: t.link, padding: 4 }}>Reemplazar</button>
                </div>
              ) : (
                <button aria-label={i === 0 ? 'Portada' : 'Hacer portada'} onClick={() => p.state === 'lista' && i > 0 && makeCover(p.id)} style={{ position: 'absolute', inset: 0 }}>
                  <Photo ph={p.ph} radius={0} iconSize={22} style={{ height: '100%' }} />
                </button>
              )}
              {(p.state === 'subiendo' || p.state === 'procesando') && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, pointerEvents: 'none' }}>
                  {p.state === 'procesando' && <Icon name="loader" size={22} color="#FFFFFF" style={{ animation: 'spin 1.4s linear infinite' }} />}
                  <span style={{ font: R(12, 500), color: '#FFFFFF' }}>{p.state === 'subiendo' ? 'Subiendo…' : 'Procesando'}</span>
                  {p.state === 'subiendo' && <span style={{ position: 'absolute', left: 10, right: 10, bottom: 10, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)', overflow: 'hidden' }}><span className="grow" style={{ display: 'block', height: '100%', background: t.green }} /></span>}
                </div>
              )}
              {i === 0 && p.state === 'lista' && <span style={{ position: 'absolute', left: 6, bottom: 6, font: P(12), color: t.onGreen, background: t.green, borderRadius: 8, padding: '2px 7px', pointerEvents: 'none' }}>Portada</span>}
              {i > 0 && p.state === 'lista' && <span style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, background: t.green, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}><Icon name="check" size={12} color={t.onGreen} /></span>}
              {p.state === 'lista' && <button aria-label="Quitar foto" onClick={() => remove(p.id)} style={{ position: 'absolute', top: 4, left: 4, width: 28, height: 28, borderRadius: 14, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={12} color="#FFFFFF" /></button>}
            </div>
          ))}
          {photos.length < 10 && (
            <button className="press" onClick={() => upload()} style={{ aspectRatio: '1', borderRadius: 14, border: `1.5px dashed ${t.dashed}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, boxSizing: 'border-box' }}>
              <Icon name="plus" size={22} />
              <span style={{ font: R(12, 500) }}>Agregar</span>
            </button>
          )}
        </div>
        <span style={{ font: R(13), color: t.text2 }}>{photos.length} de 10 fotos</span>
        {blocked && <InfoNote icon="warning" tone="error">Una foto no está permitida porque muestra datos personales. Reemplazala para seguir.</InfoNote>}
      </div>
    </MScreen>
  );
}

/* Shared form fields for Publicar 2 and Editar */
function Field({ label, children, hint, counter }: { label: string; children: React.ReactNode; hint?: string; counter?: string }) {
  const { t } = useApp();
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', font: R(14, 500), color: t.text2 }}>{label}{counter && <span style={{ font: R(12) }}>{counter}</span>}</span>
      {children}
      {hint && <span style={{ font: R(12), color: t.text2 }}>{hint}</span>}
    </label>
  );
}
function useInputStyle() {
  const { t } = useApp();
  return { minHeight: 52, borderRadius: 14, background: t.mSurface, padding: '0 14px', font: R(15, 500), color: t.text, display: 'flex', alignItems: 'center' } as React.CSSProperties;
}

function DataForm({ d, onChange }: { d: Draft; onChange: (p: Partial<Draft>) => void }) {
  const { t, d: cd, settings } = useApp();
  const { cobros } = useMarket();
  const input = useInputStyle();
  const cur = cd.currency(0).replace(/\s?0$/, '');
  const cat = CATEGORY_ATTRS[d.category];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Field label="Título" counter={`${d.title.length}/60`}>
        <input value={d.title} maxLength={60} onChange={(e) => onChange({ title: e.target.value })} placeholder="Ej.: Bicicleta Trek rodado 29" style={input} />
      </Field>
      <Field label="Categoría">
        <div style={{ ...input, position: 'relative', padding: 0 }}>
          <select value={d.category} onChange={(e) => onChange({ category: e.target.value as Category, attrs: {} })} aria-label="Categoría" style={{ appearance: 'none', background: 'transparent', border: 0, width: '100%', height: 52, padding: '0 40px 0 14px', font: R(15, 500), color: t.text, cursor: 'pointer' }}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_ATTRS[c].sub}</option>)}
          </select>
          <Icon name="chevronDown" size={18} color={t.text2} style={{ position: 'absolute', right: 14, pointerEvents: 'none' }} />
        </div>
      </Field>
      <Field label="Estado">
        <div style={{ display: 'flex', gap: 8 }}>
          {(['Nuevo', 'Usado'] as const).map((c) => <FilterChip key={c} selected={d.condition === c} onClick={() => onChange({ condition: c })}>{c}</FilterChip>)}
        </div>
      </Field>
      <Field label="Precio">
        <div style={{ ...input, gap: 6 }}>
          <span style={{ color: t.text2 }}>{cur}</span>
          <input inputMode="numeric" value={d.price} onChange={(e) => onChange({ price: fmt(e.target.value) })} placeholder="0" aria-label="Precio" style={{ font: R(15, 500), color: t.text }} />
        </div>
      </Field>
      {cobros.feePreview && num(d.price) > 0 && <RecibisNote priceGs={settings.country === 'PY' ? num(d.price) : num(d.price) * 10} category={catKey(d.category)} />}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(3, cat.attrs.length)},minmax(0,1fr))`, gap: 8 }}>
        {cat.attrs.map((a) => (
          <Field key={a} label={a}>
            <input value={d.attrs[a] ?? ''} onChange={(e) => onChange({ attrs: { ...d.attrs, [a]: e.target.value } })} placeholder="—" style={input} />
          </Field>
        ))}
      </div>
      <Field label="Stock" hint="Unidades que tenés para vender. Cada venta descuenta una.">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" aria-label="Restar una unidad" className="press" onClick={() => onChange({ stock: Math.max(1, (d.stock ?? 1) - 1) })} style={{ width: 44, height: 44, borderRadius: 22, background: t.mSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="minus" size={18} /></button>
          <span aria-live="polite" style={{ font: P(20), minWidth: 32, textAlign: 'center' }}>{d.stock ?? 1}</span>
          <button type="button" aria-label="Sumar una unidad" className="press" onClick={() => onChange({ stock: (d.stock ?? 1) + 1 })} style={{ width: 44, height: 44, borderRadius: 22, background: t.mSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={18} /></button>
          <span style={{ font: R(14), color: t.text2 }}>{(d.stock ?? 1) === 1 ? 'unidad' : 'unidades'}</span>
        </div>
      </Field>
      <Field label="¿Quién paga el envío?" hint="El comprador lo ve en la publicación antes de comprar.">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <FilterChip selected={(d.shipping ?? 'comprador') === 'comprador'} onClick={() => onChange({ shipping: 'comprador' })}>Lo paga el comprador</FilterChip>
          <FilterChip selected={d.shipping === 'vendedor'} onClick={() => onChange({ shipping: 'vendedor' })}>Lo pago yo (envío gratis)</FilterChip>
        </div>
      </Field>
      <Field label="Descripción">
        <textarea value={d.description} onChange={(e) => onChange({ description: e.target.value })} rows={3} placeholder="Contá el estado, qué incluye y por qué lo vendés." style={{ ...input, padding: 14, resize: 'none', border: 0, outline: 'none', fontFamily: 'Roboto, sans-serif' }} />
      </Field>
      <Field label="Zona" hint="Mostramos sólo la zona aproximada">
        <div style={{ ...input, gap: 8 }}><Icon name="mapPin" size={18} color={t.text2} />{d.zone}</div>
      </Field>
    </div>
  );
}

/* ================= V17 Publicar 2 · Datos ================= */
export function V17() {
  const { go } = useApp();
  const { draft, setDraft } = useMarket();
  if (!draft) return null;
  const ok = draft.title.trim().length >= 3 && num(draft.price) > 0;
  return (
    <MScreen footer={<MFooter><Button kind={ok ? 'primary' : 'disabled'} onClick={() => { setDraft((d) => ({ ...d, step: 3 })); go('V18', { replace: true }); }}>Continuar</Button></MFooter>}>
      <PublishHeader step={2} />
      <div style={{ padding: '0 20px 24px' }}>
        <DataForm d={draft} onChange={(p) => setDraft((d) => ({ ...d, ...p }))} />
      </div>
    </MScreen>
  );
}

/* ================= V18 Publicar 3 · Revisión ================= */
export function V18() {
  const { t, go, settings, d: cd } = useApp();
  const { draft, setDraft, setMine, setLastPublished } = useMarket();
  if (!draft) return null;
  const price = num(draft.price);
  const publish = () => {
    const review = settings.manualReview;
    const gs = settings.country === 'PY' ? price : price * 10;
    setMine((m) => [{ id: 'n' + Date.now(), title: draft.title, price: gs, status: review ? 'En revisión' : 'Activas', views: 0, questions: 0, ph: draft.photos[0]?.ph ?? 0, stock: draft.stock ?? 1 }, ...m]);
    setLastPublished({ title: draft.title, price: gs, review });
    setDraft(null);
    go('V19', { replace: true });
  };
  const attrs = Object.entries(draft.attrs).filter(([, v]) => v);
  return (
    <MScreen footer={<MFooter><Button onClick={publish}>Publicar</Button></MFooter>}>
      <PublishHeader step={3} />
      <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span style={{ font: P(22) }}>Así la van a ver los compradores</span>
        <div style={{ borderRadius: 20, border: `1px solid ${t.name === 'dark' ? '#333333' : '#E0E0E0'}`, overflow: 'hidden' }}>
          <Photo ph={draft.photos[0]?.ph ?? 0} cat={draft.category} radius={0} height={190} iconSize={36} />
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ font: P(22) }}>{cd.currency(price)}</span>
              <span style={{ font: R(12, 500), background: t.mChip, borderRadius: 10, padding: '3px 8px' }}>{draft.condition}</span>
            </div>
            <span style={{ font: R(16, 500) }}>{draft.title}</span>
            <span style={{ font: R(13), color: t.text2, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="mapPin" size={14} color={t.text2} />{draft.zone} · zona aproximada</span>
            <span style={{ font: R(13), color: t.text2 }}>Stock: {draft.stock ?? 1} · {SHIP_LABEL[draft.shipping ?? 'comprador']}</span>
            {attrs.length > 0 && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{attrs.map(([k, v]) => <span key={k} style={{ font: R(12, 500), background: t.mSurface, borderRadius: 10, padding: '3px 8px' }}>{k} {v}</span>)}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4 }}>
              <span style={{ width: 32, height: 32, borderRadius: 16, background: t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center', font: P(12) }}>LG</span>
              <span style={{ font: P(14) }}>Vos</span>
              <Verified />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <button className="press" onClick={() => go('V16', { replace: true })} style={{ display: 'flex', alignItems: 'center', gap: 6, font: R(15, 500), color: t.link, minHeight: 44 }}><Icon name="edit" size={16} color={t.link} />Editar fotos</button>
          <button className="press" onClick={() => go('V17', { replace: true })} style={{ display: 'flex', alignItems: 'center', gap: 6, font: R(15, 500), color: t.link, minHeight: 44 }}><Icon name="edit" size={16} color={t.link} />Editar datos</button>
        </div>
        <InfoNote>Revisamos cada publicación antes de mostrarla. Suele tardar unos minutos.</InfoNote>
      </div>
    </MScreen>
  );
}

/* ================= V19 Publicado / En revisión ================= */
export function V19() {
  const { t, go } = useApp();
  const { lastPublished: lp, setMyTab, setDraft } = useMarket();
  const money = useMoney();
  const review = !!lp?.review;
  return (
    <MScreen
      footer={
        <MFooter>
          <Button onClick={() => { setMyTab(review ? 'En revisión' : 'Activas'); go('V21', { replace: true }); }}>{review ? 'Ir a Mis publicaciones' : 'Ver publicación'}</Button>
          <Button kind="secondary" onClick={() => { setDraft(emptyDraft()); go('V16', { replace: true }); }}>Publicar otra</Button>
        </MFooter>
      }
    >
      <MTopBar onBack={() => go('M01', { replace: true })} backIcon="close" />
      <div style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center' }}>
        <span className="pop-in" style={{ width: 80, height: 80, borderRadius: 40, background: review ? 'rgba(255,181,71,0.16)' : t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={review ? 'clock' : 'check'} size={36} color={review ? t.warn : t.success} />
        </span>
        <span style={{ font: P(26) }}>{review ? 'Lo estamos revisando' : '¡Publicado!'}</span>
        <span style={{ font: R(15), color: t.text2, ...pretty }}>{review ? 'Te avisamos cuando esté activa. Suele tardar menos de una hora.' : 'Ya está en la Tienda y la ven tus vecinos.'}</span>
        {lp && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: t.mSurface, borderRadius: 16, padding: 10, width: '100%', textAlign: 'left', marginTop: 8 }}>
            <div style={{ width: 56, flex: 'none' }}><Photo ph={0} radius={10} iconSize={18} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ font: R(15, 500) }}>{lp.title}</span>
              <span style={{ font: P(15) }}>{money(lp.price)}</span>
            </div>
          </div>
        )}
      </div>
    </MScreen>
  );
}

/* ================= V21 Mis publicaciones (S7 vacío, S8 sin conexión) ================= */
const statusLabel: Record<MyStatus, string> = { Activas: 'Activa', Pausadas: 'Pausada', 'En revisión': 'En revisión', Vendidas: 'Vendida', Rechazadas: 'Rechazada' };

export function V21() {
  const { t, back, go, settings, setOverlay, showToast } = useApp();
  const { mine, setMine, myTab, setMyTab, setActionsFor, setDraft } = useMarket();
  const money = useMoney();
  const vender = useVender();
  const offline = settings.offline;
  const counts = Object.fromEntries(MY_TABS.map((k) => [k, mine.filter((m) => m.status === k).length])) as Record<MyStatus, number>;
  const rows = mine.filter((m) => m.status === myTab);
  const setStock = (m: MyListing, n: number) => {
    const v = Math.max(0, n);
    setMine((all) => all.map((x) => (x.id === m.id ? { ...x, stock: v } : x)));
    if (v === 0) showToast('Sin stock: no se puede comprar hasta que cargues más');
  };
  const move = (id: string, status: MyStatus, msg: string) => { setMine((m) => m.map((x) => (x.id === id ? { ...x, status } : x))); showToast(msg); };
  const edit = (m: MyListing) => {
    setDraft({ ...emptyDraft(), title: m.title, price: fmt(String(priceFor(m.price, settings.country))), editing: m.id, photos: [0, 1, 2, 3].map((i) => ({ id: i, state: 'lista', ph: ((m.ph + i) % 3) as 0 | 1 | 2 })) });
    go('V22');
  };
  const inline = (label: string, onClick: () => void) => (
    <button disabled={offline} className="press" onClick={onClick} style={{ flex: 1, height: 40, borderRadius: 20, background: t.mChip, font: R(14, 500), color: offline ? t.text3 : t.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{label}</button>
  );
  return (
    <MScreen>
      <MTopBar title="Mis publicaciones" onBack={back} right={<RoundBtn icon="plus" label="Publicar" onClick={vender} />} />
      {offline && <div style={{ padding: '0 20px 8px' }}><InfoNote icon="warning" tone="warn">Sin conexión. Te mostramos lo último que cargamos.</InfoNote></div>}
      <div style={{ padding: '0 20px' }}>
        <UnderlineTabs tabs={MY_TABS} value={myTab} onChange={setMyTab} counts={counts} />
      </div>
      <div style={{ padding: '14px 20px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {mine.length === 0 ? (
          <EmptyBlock icon="tag" title="Publicá tu primer producto" text="Es gratis y te lleva menos de 2 minutos. Lo ven tus vecinos verificados.">
            <Button icon="plus" onClick={vender}>Publicar gratis</Button>
          </EmptyBlock>
        ) : rows.length === 0 ? (
          <span style={{ font: R(14), color: t.text2, textAlign: 'center', padding: '32px 0' }}>No tenés publicaciones {statusLabel[myTab].toLowerCase()}s.</span>
        ) : (
          <>
            {myTab === 'Activas' && <span style={{ font: R(13), color: t.text2 }}>{limitOf(settings.sellerPlan ?? 'comision') == null ? `${counts.Activas} publicaciones activas · sin límite con tu membresía` : `${counts.Activas} de ${limitOf(settings.sellerPlan ?? 'comision')} publicaciones activas`}. Con stock 0 se ven «Sin stock».</span>}
            {rows.map((m) => (
              <div key={m.id} style={{ background: t.mSurface, borderRadius: 18, padding: 12, display: 'flex', flexDirection: 'column', gap: 12, opacity: offline ? 0.8 : 1 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 72, flex: 'none' }}><Photo ph={m.ph} radius={12} iconSize={20} dim={m.status === 'Pausadas' || m.status === 'Vendidas'} /></div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                    <StatusTag status={m.status === 'Activas' && m.stock === 0 ? 'Sin stock' : statusLabel[m.status]} />
                    <span style={{ font: R(14, 500), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</span>
                    <span style={{ font: P(15) }}>{money(m.price)}</span>
                    <span style={{ font: R(12), color: t.text2 }}>
                      {m.status === 'Rechazadas' ? `Rechazada el ${m.rejectedOn}` : m.status === 'En revisión' ? 'Te avisamos cuando esté activa' : `${m.views} vistas${m.questions ? ` · ${m.questions} ${m.questions === 1 ? 'consulta' : 'consultas'}` : ''}`}
                    </span>
                  </div>
                  <button aria-label="Más acciones" disabled={offline} onClick={() => { setActionsFor(m.id); setOverlay('actions'); }} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: -6, marginRight: -6 }}>
                    <Icon name="more" size={20} color={t.text2} />
                  </button>
                </div>
                {m.status === 'Rechazadas' && (
                  <>
                    <InfoNote tone="error">Motivo: {m.reason}</InfoNote>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {inline('Corregir', () => edit(m))}
                      {inline('Eliminar', () => { setActionsFor(m.id); setOverlay('actions'); })}
                    </div>
                    <span style={{ font: R(12), color: t.text2 }}>Cuando la corregís, la revisamos de nuevo.</span>
                  </>
                )}
                {(m.status === 'Activas' || m.status === 'Pausadas') && (
                  <div role="group" aria-label={`Stock de ${m.title}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ flex: 1, font: R(14, 500), color: m.stock === 0 ? t.warn : t.text }}>Stock: {m.stock ?? 1} {(m.stock ?? 1) === 1 ? 'unidad' : 'unidades'}</span>
                    <button aria-label={`Restar una unidad de ${m.title}`} disabled={offline} className="press" onClick={() => setStock(m, (m.stock ?? 1) - 1)} style={{ width: 36, height: 36, borderRadius: 18, background: t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="minus" size={16} /></button>
                    <button aria-label={`Sumar una unidad de ${m.title}`} disabled={offline} className="press" onClick={() => setStock(m, (m.stock ?? 1) + 1)} style={{ width: 36, height: 36, borderRadius: 18, background: t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={16} /></button>
                  </div>
                )}
                {m.status === 'Activas' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    {inline('Pausar', () => move(m.id, 'Pausadas', 'Publicación pausada'))}
                    {inline('Marcar vendida', () => move(m.id, 'Vendidas', '¡Felicitaciones por la venta!'))}
                    {inline('Editar', () => edit(m))}
                  </div>
                )}
                {m.status === 'Pausadas' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    {inline('Reanudar', () => move(m.id, 'Activas', 'Publicación activa otra vez'))}
                    {inline('Editar', () => edit(m))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </MScreen>
  );
}

/* ================= V22 Editar publicación ================= */
export function V22() {
  const { t, back, settings, showToast } = useApp();
  const { draft, setDraft, mine, setMine } = useMarket();
  const money = useMoney();
  const [orig] = useState(draft);
  if (!draft || !orig) return null;
  const m = mine.find((x) => x.id === draft.editing);
  const lowered = num(draft.price) < num(orig.price);
  const changed = draft.title !== orig.title || draft.price !== orig.price || draft.photos.length !== orig.photos.length;
  const save = () => {
    const gs = settings.country === 'PY' ? num(draft.price) : num(draft.price) * 10;
    setMine((list) => list.map((x) => (x.id === draft.editing ? { ...x, title: draft.title, price: gs, status: changed ? 'En revisión' : x.status === 'Rechazadas' ? 'En revisión' : x.status } : x)));
    showToast(changed || m?.status === 'Rechazadas' ? 'Guardado. La revisamos de nuevo' : 'Cambios guardados');
    setDraft(null);
    back();
  };
  return (
    <MScreen footer={<MFooter><Button onClick={save}>Guardar cambios</Button></MFooter>}>
      <MTopBar title="Editar publicación" onBack={() => { setDraft(null); back(); }} />
      <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <InfoNote icon="warning" tone="warn">Si cambiás título, precio o fotos, la revisamos de nuevo antes de mostrarla.</InfoNote>
        {m?.status === 'Rechazadas' && <InfoNote tone="error">Motivo del rechazo: {m.reason}</InfoNote>}
        <div className="scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {draft.photos.map((p, i) => (
            <div key={p.id} style={{ width: 76, flex: 'none', position: 'relative', outline: m?.status === 'Rechazadas' && i === 0 ? `2px solid ${t.error}` : 'none', outlineOffset: -2, borderRadius: 12 }}>
              <Photo ph={p.ph} radius={12} iconSize={18} />
              <button aria-label="Quitar foto" onClick={() => setDraft((d) => ({ ...d, photos: d.photos.filter((x) => x.id !== p.id) }))} style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: 12, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={10} color="#FFFFFF" /></button>
            </div>
          ))}
          <button className="press" onClick={() => setDraft((d) => ({ ...d, photos: [...d.photos, { id: Date.now(), state: 'lista', ph: 1 }] }))} style={{ width: 76, height: 76, flex: 'none', borderRadius: 12, border: `1.5px dashed ${t.dashed}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }} aria-label="Agregar foto">
            <Icon name="plus" size={20} />
          </button>
        </div>
        <DataForm d={draft} onChange={(p) => setDraft((d) => ({ ...d, ...p }))} />
        {lowered && <span style={{ font: R(13), color: t.success, marginTop: -8 }}>Antes {money(settings.country === 'PY' ? num(orig.price) : num(orig.price) * 10)}. Les avisamos a quienes la guardaron.</span>}
      </div>
    </MScreen>
  );
}

/* ================= Overlays: V20 borrador, V21c acciones, V23 límite ================= */
export function DraftSheet() {
  const { t, setOverlay, go, showToast } = useApp();
  const { draft, setDraft } = useMarket();
  const [confirm, setConfirm] = useState(false);
  const mins = draft?.savedAt ? Math.max(1, Math.round((Date.now() - draft.savedAt) / 60000)) : 120;
  return (
    <MSheet onClose={() => setOverlay(null)} label="Retomar borrador">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 64, flex: 'none' }}><Photo ph={draft?.photos[0]?.ph ?? 0} cat={draft?.category} radius={12} iconSize={20} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ font: P(20) }}>{confirm ? '¿Descartar el borrador?' : '¿Seguís con tu publicación?'}</span>
          <span style={{ font: R(14), color: t.text2 }}>{confirm ? 'Se borran las fotos y los datos.' : `${draft?.title || 'Sin título'} · paso ${draft?.step ?? 1} de 3 · hace ${mins < 60 ? `${mins} min` : '2 h'}`}</span>
        </div>
      </div>
      {confirm ? (
        <>
          <Button kind="danger" onClick={() => { setDraft(null); setOverlay(null); showToast('Borrador descartado'); }}>Sí, descartar</Button>
          <Button kind="secondary" onClick={() => setConfirm(false)}>Volver</Button>
        </>
      ) : (
        <>
          <Button onClick={() => { setOverlay(null); go(draft?.step === 3 ? 'V18' : draft?.step === 2 ? 'V17' : 'V16'); }}>Seguir</Button>
          <Button kind="secondary" onClick={() => setConfirm(true)}>Descartar</Button>
        </>
      )}
    </MSheet>
  );
}

export function ActionsSheet() {
  const { t, setOverlay, showToast, go, settings } = useApp();
  const { mine, setMine, actionsFor, setDraft } = useMarket();
  const [confirm, setConfirm] = useState(false);
  const m = mine.find((x) => x.id === actionsFor);
  useEffect(() => { if (!m) setOverlay(null); }, [m, setOverlay]);
  if (!m) return null;
  const close = () => setOverlay(null);
  const move = (status: MyStatus, msg: string) => { setMine((l) => l.map((x) => (x.id === m.id ? { ...x, status } : x))); showToast(msg); close(); };
  const row = (icon: string, label: string, onClick: () => void, danger?: boolean) => (
    <button className="press" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 52, font: R(16, 500), color: danger ? t.error : t.text }}>
      <Icon name={icon} size={20} color={danger ? t.error : t.icon} />
      {label}
    </button>
  );
  return (
    <MSheet onClose={close} label="Acciones de la publicación">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 52, flex: 'none' }}><Photo ph={m.ph} radius={10} iconSize={18} /></div>
        <span style={{ font: P(16) }}>{m.title}</span>
      </div>
      {confirm ? (
        <>
          <span style={{ font: R(15), color: t.text2 }}>¿Eliminar «{m.title}»? No se puede deshacer.</span>
          <Button kind="danger" onClick={() => { setMine((l) => l.filter((x) => x.id !== m.id)); showToast('Publicación eliminada'); close(); }}>Eliminar</Button>
          <Button kind="secondary" onClick={() => setConfirm(false)}>Cancelar</Button>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {m.status === 'Activas' && row('clock', 'Pausar publicación', () => move('Pausadas', 'Publicación pausada'))}
          {m.status === 'Pausadas' && row('refresh', 'Reanudar publicación', () => move('Activas', 'Publicación activa otra vez'))}
          {(m.status === 'Activas' || m.status === 'Pausadas') && row('check', 'Marcar como vendida', () => move('Vendidas', 'Avisamos a quienes la guardaron'))}
          {m.status !== 'Vendidas' && m.status !== 'En revisión' &&
            row('edit', 'Editar', () => {
              setDraft({ ...emptyDraft(), title: m.title, price: fmt(String(priceFor(m.price, settings.country))), editing: m.id, photos: [0, 1, 2].map((i) => ({ id: i, state: 'lista', ph: ((m.ph + i) % 3) as 0 | 1 | 2 })) });
              close();
              go('V22');
            })}
          {row('share', 'Compartir', () => { showToast('Link de la publicación copiado'); close(); })}
          {row('trash', 'Eliminar', () => setConfirm(true), true)}
        </div>
      )}
    </MSheet>
  );
}

export function LimitSheet() {
  const { t, setOverlay, go } = useApp();
  const { setMyTab } = useMarket();
  return (
    <MSheet onClose={() => setOverlay(null)} label="Límite alcanzado">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center', padding: '8px 0' }}>
        <span style={{ width: 56, height: 56, borderRadius: 28, background: 'rgba(255,181,71,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="warning" size={26} color={t.warn} /></span>
        <span style={{ font: P(22) }}>Llegaste a 50 publicaciones activas</span>
        <span style={{ font: R(15), color: t.text2, ...pretty }}>Pausá o marcá vendida alguna para publicar otra.</span>
      </div>
      <Button onClick={() => { setMyTab('Activas'); setOverlay(null); go('V21'); }}>Ir a Mis publicaciones</Button>
      <Button kind="secondary" onClick={() => setOverlay(null)}>Cerrar</Button>
    </MSheet>
  );
}
