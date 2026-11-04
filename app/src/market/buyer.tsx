import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../store';
import { P, R } from '../theme';
import { Button, Icon } from '../ui/kit';
import { FloatingNav } from '../screens/common';
import { CATEGORIES, CATEGORY_ICON, CONSULTAS, Listing, LISTINGS, priceFor, QUICK_REPLIES, REPORT_REASONS, SELLERS } from './data';
import { DEFAULT_FILTERS, Filters, useMarket } from './state';
import {
  clamp2, EmptyBlock, FilterChip, HeartButton, InfoNote, ListingCard, listing, MFooter, MScreen, MSheet, MTopBar, Photo, pretty, RoundBtn,
  SectionHead, SellerRow, Skel, SoldStrip, StarRating, StatusTag, UnderlineTabs, useFirstLoad, useMoney, useRequireLogin, useZone, Verified,
} from './kit';
import { useVender } from './seller';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function useOpenListing() {
  const { go } = useApp();
  const { openListing } = useMarket();
  return (l: Listing | string) => {
    openListing(typeof l === 'string' ? l : l.id);
    go('M06');
  };
}

/* ================= M01 Inicio de la Tienda (M02 casi vacía, S1 cargando) ================= */
export function M01() {
  const { t, settings, go, back } = useApp();
  const { setQuery, setFilters, setActivityTab } = useMarket();
  const open = useOpenListing();
  const vender = useVender();
  const loading = useFirstLoad();
  const stacked = settings.tiendaEntry === 'card';
  const near = LISTINGS.filter((l) => ['trek', 'nike', 'silla'].includes(l.id));
  const recent = LISTINGS.filter((l) => l.recent && l.status === 'activa');
  const wide = LISTINGS.filter((l) => ['heladera', 'ventilador'].includes(l.id));
  const empty = settings.almostEmpty;
  const byCategory = (c: (typeof CATEGORIES)[number]) => {
    setQuery('');
    setFilters({ ...DEFAULT_FILTERS, category: c });
    go('M04');
  };
  const seeAll = () => {
    setQuery('');
    setFilters(DEFAULT_FILTERS);
    go('M04');
  };
  return (
    <>
      <MScreen style={{ paddingBottom: stacked ? 110 : 180 }}>
        <div style={{ padding: '4px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48 }}>
            {stacked && <RoundBtn icon="arrowLeft" label="Volver al Inicio" onClick={back} />}
            <span style={{ flex: 1, font: P(28) }}>Tienda</span>
            <RoundBtn icon="heart" label="Guardados" onClick={() => go('M11')} />
            <RoundBtn icon="messageCircle" label="Mis consultas" badge={1} onClick={() => { setActivityTab('Tienda'); go('A11'); }} />
          </div>
          <button className="press" onClick={() => go('M03')} style={{ height: 48, borderRadius: 24, background: t.mSurface, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
            <Icon name="search" size={20} color={t.text2} />
            <span style={{ font: R(15), color: t.text2 }}>Buscá en Chambito Market</span>
          </button>
        </div>
        <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {CATEGORIES.map((c, i) => (
              <button key={c} className="press" onClick={() => byCategory(c)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 62 }}>
                <span style={{ width: 56, height: 56, borderRadius: 28, background: t.ph[i % 3], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={CATEGORY_ICON[c]} size={22} />
                </span>
                <span style={{ font: R(12, 500) }}>{c}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <HomeSkeleton />
          ) : empty ? (
            <>
              <div style={{ background: t.mSurface, borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ width: 48, height: 48, borderRadius: 24, background: t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="tag" size={22} color={t.success} />
                </span>
                <span style={{ font: P(20), ...pretty }}>Sé de los primeros en vender en tu zona</span>
                <span style={{ font: R(14), color: t.text2, ...pretty }}>Publicar es gratis y lo ven tus vecinos en Chambito.</span>
                <Button icon="plus" onClick={vender}>Publicar gratis</Button>
              </div>
              <SectionHead title="Cerca tuyo" />
              <InfoNote>Hay pocas publicaciones cerca: ampliamos a 50 km</InfoNote>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '20px 12px' }}>
                {wide.map((l) => <ListingCard key={l.id} l={l} onOpen={open} />)}
              </div>
            </>
          ) : (
            <>
              <SectionHead title="Cerca tuyo" action="Ver todo" onAction={seeAll} />
              <div className="scroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '0 -20px', padding: '0 20px' }}>
                {near.map((l) => <ListingCard key={l.id} l={l} width={150} onOpen={open} />)}
              </div>
              <SectionHead title="Recién publicados" action="Ver todo" onAction={seeAll} />
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '20px 12px' }}>
                {recent.map((l) => <ListingCard key={l.id} l={l} onOpen={open} />)}
              </div>
            </>
          )}
        </div>
      </MScreen>
      {!empty && (
        <button className="press" onClick={vender} style={{ position: 'absolute', right: 20, bottom: stacked ? 40 : 108, height: 52, borderRadius: 26, background: t.green, color: '#000000', display: 'flex', alignItems: 'center', gap: 8, padding: '0 22px 0 18px', font: P(16), zIndex: 25, boxShadow: '0 6px 18px rgba(0,0,0,.18)' }}>
          <Icon name="plus" size={20} color="#000000" />
          Vender
        </button>
      )}
      {!stacked && <FloatingNav active="tienda" band />}
    </>
  );
}

function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Skel w={140} h={22} />
      <div style={{ display: 'flex', gap: 12 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 150, flex: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skel h={150} r={16} />
            <Skel w="70%" h={16} />
            <Skel h={14} />
            <Skel w="50%" h={12} />
          </div>
        ))}
      </div>
      <Skel w={180} h={22} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Skel h={160} r={16} />
        <Skel h={160} r={16} />
      </div>
    </div>
  );
}

/* ================= M03 Buscar ================= */
export function M03() {
  const { t, back, go } = useApp();
  const { query, setQuery, recentSearches, removeRecent, setFilters, filters } = useMarket();
  const [q, setQ] = useState(query || 'bici');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); }, []);
  const suggestions = useMemo(() => {
    if (!q.trim()) return [];
    const words = new Set<string>();
    LISTINGS.forEach((l) => {
      const title = l.title.split(',')[0].toLowerCase();
      if (norm(title).includes(norm(q.trim()))) words.add(title);
    });
    return [...words].slice(0, 4);
  }, [q]);
  const run = (text: string) => {
    setQuery(text);
    setFilters({ ...filters, category: null });
    go('M04', { replace: true });
  };
  const bold = (s: string) => {
    const i = norm(s).indexOf(norm(q.trim()));
    if (i < 0) return s;
    return (
      <>
        {s.slice(0, i)}
        <b style={{ fontWeight: 500 }}>{s.slice(i, i + q.trim().length)}</b>
        <span style={{ color: t.text2 }}>{s.slice(i + q.trim().length)}</span>
      </>
    );
  };
  return (
    <MScreen>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px' }}>
        <RoundBtn icon="arrowLeft" label="Atrás" onClick={back} />
        <label style={{ flex: 1, height: 48, borderRadius: 24, background: t.mSurface, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', outline: `2px solid ${t.green}`, outlineOffset: -2 }}>
          <Icon name="search" size={18} color={t.text2} />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && q.trim() && run(q)} aria-label="Buscar en la Tienda" placeholder="Buscá en Chambito Market" style={{ font: R(15, 500), color: t.text, caretColor: t.link }} />
          {q && <button aria-label="Borrar" onClick={() => setQ('')} style={{ display: 'flex' }}><Icon name="close" size={16} color={t.text2} /></button>}
        </label>
      </div>
      <div style={{ padding: '8px 20px 40px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {suggestions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ font: R(14, 500), color: t.text2, paddingBottom: 4 }}>Sugerencias</span>
            {suggestions.map((s) => (
              <button key={s} className="press" onClick={() => run(s)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', font: R(15) }}>
                <Icon name="search" size={18} color={t.text2} />
                <span>{bold(s)}</span>
              </button>
            ))}
          </div>
        )}
        {recentSearches.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ font: R(14, 500), color: t.text2, paddingBottom: 4 }}>Búsquedas recientes</span>
            {recentSearches.map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="press" onClick={() => run(s)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', font: R(15) }}>
                  <Icon name="clock" size={18} color={t.text2} />
                  {s}
                </button>
                <button aria-label={`Borrar ${s}`} onClick={() => removeRecent(s)} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="close" size={14} color={t.text2} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ font: R(14, 500), color: t.text2 }}>Categorías</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map((c) => (
              <FilterChip key={c} onClick={() => { setQuery(''); setFilters({ ...DEFAULT_FILTERS, category: c }); go('M04', { replace: true }); }}>{c}</FilterChip>
            ))}
          </div>
        </div>
      </div>
    </MScreen>
  );
}

/* ================= M04 Resultados (S2 sin resultados) ================= */
export function applyFilters(f: Filters, q: string, country: 'PY' | 'AR') {
  let r = LISTINGS.filter((l) => l.status === 'activa' && l.km <= f.km);
  if (q.trim()) {
    const words = norm(q).split(/\s+/).filter(Boolean);
    r = r.filter((l) => words.every((w) => norm(l.title + ' ' + l.category).includes(w.slice(0, Math.max(4, w.length - 1)))));
  }
  if (f.category) r = r.filter((l) => l.category === f.category);
  if (f.condition !== 'Todos') r = r.filter((l) => l.condition === f.condition);
  const num = (s: string) => Number(s.replace(/\D/g, '')) || 0;
  if (f.min) r = r.filter((l) => priceFor(l.price, country) >= num(f.min));
  if (f.max) r = r.filter((l) => priceFor(l.price, country) <= num(f.max));
  const sorters: Record<Filters['sort'], (a: Listing, b: Listing) => number> = {
    'Más recientes': (a, b) => Number(!!b.recent) - Number(!!a.recent),
    'Menor precio': (a, b) => a.price - b.price,
    'Mayor precio': (a, b) => b.price - a.price,
    'Más cerca': (a, b) => a.km - b.km,
  };
  return [...r].sort(sorters[f.sort]);
}
export const filterCount = (f: Filters) => (f.category ? 1 : 0) + (f.condition !== 'Todos' ? 1 : 0) + (f.min || f.max ? 1 : 0) + 1;

const PROVIDERS = [
  { initials: 'RB', name: 'Rodrigo Benítez', job: 'Técnico de bicicletas', rating: '4,9', from: 80000 },
  { initials: 'SA', name: 'Silvia Acosta', job: 'Arreglo de ropa', rating: '4,8', from: 40000 },
  { initials: 'JG', name: 'Javier Gómez', job: 'Armado de muebles', rating: '5,0', from: 120000 },
];

export function M04() {
  const { t, back, go, settings, showToast } = useApp();
  const { query, filters, setFilters, resultsTab, setResultsTab } = useMarket();
  const open = useOpenListing();
  const vender = useVender();
  const money = useMoney();
  const results = applyFilters(filters, query, settings.country);
  const label = query || filters.category || 'Todo';
  return (
    <MScreen>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px' }}>
        <RoundBtn icon="arrowLeft" label="Atrás" onClick={back} />
        <button className="press" onClick={() => go('M03')} style={{ flex: 1, height: 48, borderRadius: 24, background: t.mSurface, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', minWidth: 0 }}>
          <Icon name="search" size={18} color={t.text2} />
          <span style={{ font: R(15, 500), flex: 1, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        </button>
        <RoundBtn icon="filter" label="Filtros" badge={filterCount(filters)} onClick={() => go('M05')} />
      </div>
      <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <UnderlineTabs tabs={['Productos', 'Servicios'] as const} value={resultsTab} onChange={setResultsTab} />
        {resultsTab === 'Servicios' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ font: R(13), color: t.text2 }}>Prestadores verificados cerca tuyo</span>
            {PROVIDERS.map((p) => (
              <button key={p.name} className="press" onClick={() => showToast('Abre el pedido de servicio actual de Chambito')} style={{ background: t.mSurface, borderRadius: 16, padding: 12, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                <span style={{ width: 44, height: 44, borderRadius: 22, background: t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center', font: P(15), flex: 'none' }}>{p.initials}</span>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ font: P(15) }}>{p.name}</span>
                  <span style={{ font: R(13), color: t.text2 }}>{p.job} · desde {money(p.from)}</span>
                  <div style={{ display: 'flex', gap: 8 }}><Verified /><StarRating value={p.rating} /></div>
                </div>
                <Icon name="chevronRight" size={18} color={t.text2} />
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -20px', padding: '0 20px' }}>
              {filters.category && <FilterChip selected removable onClick={() => setFilters({ ...filters, category: null })}>{filters.category}</FilterChip>}
              {filters.condition !== 'Todos' && <FilterChip selected removable onClick={() => setFilters({ ...filters, condition: 'Todos' })}>{filters.condition}</FilterChip>}
              {(filters.min || filters.max) && <FilterChip selected removable onClick={() => setFilters({ ...filters, min: '', max: '' })}>Precio</FilterChip>}
              <FilterChip selected removable={filters.km !== 25} onClick={() => setFilters({ ...filters, km: 25 })}>Hasta {filters.km} km</FilterChip>
              <FilterChip icon="chevronDown" onClick={() => go('M05')}>{filters.sort}</FilterChip>
            </div>
            {results.length === 0 ? (
              <EmptyBlock icon="search" title={`No hay «${label}» a ${filters.km} km`} text="Ampliá la distancia o publicá una vos: lo primero que se publica en una zona se ve más.">
                {filters.km < 50 && <Button onClick={() => setFilters({ ...filters, km: 50 })}>Ampliar a 50 km</Button>}
                <Button kind={filters.km < 50 ? 'secondary' : 'primary'} onClick={vender}>Publicar algo</Button>
              </EmptyBlock>
            ) : (
              <>
                <span style={{ font: R(13), color: t.text2 }}>{results.length} {results.length === 1 ? 'resultado' : 'resultados'} a {filters.km} km</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '20px 12px' }}>
                  {results.map((l) => <ListingCard key={l.id} l={l} onOpen={open} />)}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </MScreen>
  );
}

/* ================= M05 Filtros ================= */
export function M05() {
  const { t, back, settings, d } = useApp();
  const { filters, setFilters, query } = useMarket();
  const [f, setF] = useState<Filters>(filters);
  const count = applyFilters(f, query, settings.country).length;
  const cur = d.currency(0).replace(/\s?0$/, '');
  const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ font: P(16) }}>{title}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>
    </div>
  );
  const priceField = (k: 'min' | 'max', label: string) => (
    <label style={{ flex: 1, background: t.mSurface, borderRadius: 14, padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ font: R(12), color: t.text2 }}>{label}</span>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ font: R(15, 500), color: t.text2 }}>{cur}</span>
        <input inputMode="numeric" value={f[k]} placeholder="—" onChange={(e) => setF({ ...f, [k]: e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') })} aria-label={label} style={{ font: R(15, 500), color: t.text }} />
      </div>
    </label>
  );
  return (
    <MScreen
      footer={
        <MFooter>
          <Button kind={count ? 'primary' : 'secondary'} onClick={() => { setFilters(f); back(); }}>{count ? `Ver ${count} ${count === 1 ? 'resultado' : 'resultados'}` : 'Sin resultados con estos filtros'}</Button>
        </MFooter>
      }
    >
      <MTopBar title="Filtros" onBack={back} backIcon="close" right={<button className="press" onClick={() => setF({ ...DEFAULT_FILTERS })} style={{ font: R(15, 500), color: t.link }}>Limpiar</button>} />
      <div style={{ padding: '8px 20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Group title="Categoría">
          {CATEGORIES.map((c) => <FilterChip key={c} selected={f.category === c} onClick={() => setF({ ...f, category: f.category === c ? null : c })}>{c}</FilterChip>)}
        </Group>
        <Group title="Estado">
          {(['Todos', 'Nuevo', 'Usado'] as const).map((c) => <FilterChip key={c} selected={f.condition === c} onClick={() => setF({ ...f, condition: c })}>{c}</FilterChip>)}
        </Group>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ font: P(16) }}>Precio</span>
          <div style={{ display: 'flex', gap: 8 }}>{priceField('min', 'Mínimo')}{priceField('max', 'Máximo')}</div>
        </div>
        <Group title="Distancia">
          {([5, 10, 25, 50] as const).map((k) => <FilterChip key={k} selected={f.km === k} onClick={() => setF({ ...f, km: k })}>{k} km</FilterChip>)}
        </Group>
        <Group title="Ordenar por">
          {(['Más recientes', 'Menor precio', 'Mayor precio', 'Más cerca'] as const).map((k) => <FilterChip key={k} selected={f.sort === k} onClick={() => setF({ ...f, sort: k })}>{k}</FilterChip>)}
        </Group>
      </div>
    </MScreen>
  );
}

/* ================= M06 Detalle (M06b venta cruzada, M07 vendido, M08 no disponible, S3 error) ================= */
export function M06() {
  const { t, back, go, setOverlay, showToast } = useApp();
  const { listingId, setSellerId, setChatListing, setFilters, setQuery } = useMarket();
  const l = listing(listingId);
  const money = useMoney();
  const zone = useZone();
  const gate = useRequireLogin();
  const [photo, setPhoto] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const loading = useFirstLoad(350);

  if (l.status === 'no-disponible') {
    return (
      <MScreen>
        <MTopBar onBack={back} />
        <div style={{ padding: '60px 20px 0' }}>
          <EmptyBlock icon="info" title="Esta publicación ya no está disponible" text="El vendedor la borró o la estamos revisando. Hay más cosas parecidas en la Tienda.">
            <Button onClick={() => go('M01', { replace: true })}>Volver a la Tienda</Button>
          </EmptyBlock>
        </div>
      </MScreen>
    );
  }
  if (l.status === 'error') {
    return (
      <MScreen>
        <MTopBar onBack={back} />
        <div style={{ padding: '60px 20px 0' }}>
          {retrying ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} aria-busy="true"><Skel h={260} r={16} /><Skel w="50%" h={26} /><Skel h={18} /></div>
          ) : (
            <EmptyBlock icon="refresh" title="No pudimos cargar la publicación" text="Revisá tu conexión e intentá de nuevo.">
              <Button onClick={() => { setRetrying(true); window.setTimeout(() => { setRetrying(false); showToast('Seguimos sin poder cargarla'); }, 900); }}>Reintentar</Button>
            </EmptyBlock>
          )}
        </div>
      </MScreen>
    );
  }

  const sold = l.status === 'vendida';
  const crossSell = l.category === 'Hogar' || l.category === 'Tecnología';
  const consult = () => gate(() => { setChatListing(l.id); go('M10'); });
  return (
    <MScreen
      footer={
        <MFooter>
          {sold ? (
            <Button onClick={() => { setQuery(''); setFilters({ ...DEFAULT_FILTERS, category: l.category }); go('M04'); }}>Ver parecidos</Button>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="shield" size={16} color={t.text2} />
                <span style={{ font: R(13), color: t.text2 }}>Nunca pagues por adelantado fuera de Chambito</span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <HeartButton id={l.id} size={52} onSurface />
                <Button icon="messageCircle" style={{ flex: 1 }} onClick={consult}>Consultar</Button>
              </div>
            </>
          )}
        </MFooter>
      }
    >
      <div style={{ position: 'relative' }}>
        <Photo ph={(l.ph + photo) % 3} cat={l.category} radius={0} height={300} iconSize={44} dim={sold}>
          {sold && <SoldStrip />}
        </Photo>
        {!sold && l.photos > 1 && (
          <>
            <button aria-label="Foto anterior" onClick={() => setPhoto((p) => (p + l.photos - 1) % l.photos)} style={{ position: 'absolute', left: 0, top: 70, bottom: 50, width: '35%' }} />
            <button aria-label="Foto siguiente" onClick={() => setPhoto((p) => (p + 1) % l.photos)} style={{ position: 'absolute', right: 0, top: 70, bottom: 50, width: '35%' }} />
          </>
        )}
        <div style={{ position: 'absolute', top: 12, left: 20, right: 20, display: 'flex', gap: 8 }}>
          <RoundBtn icon="arrowLeft" label="Atrás" bg={t.mBg} onClick={back} />
          <span style={{ flex: 1 }} />
          <RoundBtn icon="share" label="Compartir" bg={t.mBg} onClick={() => showToast('Abre la hoja de compartir del sistema')} />
          {!sold && <RoundBtn icon="more" label="Más opciones" bg={t.mBg} onClick={() => gate(() => setOverlay('report'), 'denunciar')} />}
        </div>
        {!sold && <span style={{ position: 'absolute', right: 20, bottom: 12, height: 28, borderRadius: 14, background: t.mBg, display: 'flex', alignItems: 'center', padding: '0 10px', font: R(12, 500) }}>{photo + 1} / {l.photos}</span>}
      </div>
      {loading ? (
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }} aria-busy="true"><Skel w="55%" h={28} /><Skel h={18} /><Skel w="60%" h={14} /><Skel h={56} r={12} /></div>
      ) : (
        <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ font: P(26) }}>{money(l.price)}</span>
            <span style={{ font: R(12, 500), background: t.mChip, borderRadius: 10, padding: '3px 8px' }}>{l.condition}</span>
          </div>
          <span style={{ font: R(17, 500), ...pretty }}>{l.title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="mapPin" size={16} color={t.text2} />
            <span style={{ font: R(14), color: t.text2 }}>{zone(l)} · zona aproximada</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8 }}>
            {l.attrs.map(([k, v]) => (
              <div key={k} style={{ background: t.mSurface, borderRadius: 12, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ font: R(12), color: t.text2 }}>{k}</span>
                <span style={{ font: R(15, 500), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</span>
              </div>
            ))}
          </div>
          {l.description && <span style={{ font: R(14), color: t.text2, ...pretty }}>{l.description}</span>}
          {crossSell && !sold && (
            <button className="press" onClick={() => showToast('Fase 2: abre el pedido de servicio con el rubro sugerido')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, border: `1.5px dashed ${t.dashed}`, textAlign: 'left' }}>
              <span style={{ width: 40, height: 40, borderRadius: 20, background: t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name="settings" size={20} /></span>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ font: R(15, 500) }}>¿Necesitás que {l.category === 'Hogar' ? 'la instalen' : 'lo configuren'}?</span>
                <span style={{ font: R(14, 500), color: t.link }}>Pedí un técnico</span>
              </div>
              <span style={{ font: R(12, 500), color: '#000000', background: t.warn, borderRadius: 10, padding: '2px 8px' }}>Fase 2</span>
            </button>
          )}
          <SellerRow id={l.seller} onClick={() => { setSellerId(l.seller); go('M09'); }} />
        </div>
      )}
    </MScreen>
  );
}

/* ================= M09 Perfil del vendedor (S4 cargando) ================= */
export function M09() {
  const { t, back, setOverlay } = useApp();
  const { sellerId } = useMarket();
  const s = SELLERS[sellerId];
  const open = useOpenListing();
  const gate = useRequireLogin();
  const loading = useFirstLoad();
  const items = LISTINGS.filter((l) => l.seller === sellerId && (l.status === 'activa' || l.status === 'vendida'));
  return (
    <MScreen>
      <MTopBar onBack={back} right={<RoundBtn icon="more" label="Denunciar usuario" onClick={() => gate(() => setOverlay('report'), 'denunciar')} />} />
      {loading ? (
        <div style={{ padding: '8px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }} aria-busy="true">
          <Skel w={80} h={80} r={40} /><Skel w={160} h={22} /><Skel w={200} h={14} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, width: '100%' }}><Skel h={64} r={14} /><Skel h={64} r={14} /><Skel h={64} r={14} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}><Skel h={160} r={16} /><Skel h={160} r={16} /></div>
        </div>
      ) : (
        <div style={{ padding: '8px 20px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
            <span style={{ width: 80, height: 80, borderRadius: 40, background: t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center', font: P(26) }}>{s.initials}</span>
            <span style={{ font: P(22) }}>{s.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Verified size={13} />
              <StarRating value={s.rating} />
              <span style={{ font: R(13), color: t.text2 }}>· {s.reviews} calificaciones</span>
            </div>
            <span style={{ font: R(13), color: t.text2 }}>En Chambito desde {s.since}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {[[String(s.listings), 'publicaciones'], [String(s.sold), 'vendidas'], [s.responds, 'para responder']].map(([v, k]) => (
              <div key={k} style={{ background: t.mSurface, borderRadius: 14, padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ font: P(18) }}>{v}</span>
                <span style={{ font: R(12), color: t.text2 }}>{k}</span>
              </div>
            ))}
          </div>
          <span style={{ font: P(18) }}>Publicaciones ({s.listings})</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '20px 12px' }}>
            {items.map((l) => <ListingCard key={l.id} l={l} onOpen={open} />)}
          </div>
        </div>
      )}
    </MScreen>
  );
}

/* ================= M10 Chat de consulta ================= */
export function M10() {
  const { t, back, setOverlay } = useApp();
  const { chatListing, chats, sendMsg } = useMarket();
  const l = listing(chatListing);
  const s = SELLERS[l.seller];
  const money = useMoney();
  const open = useOpenListing();
  const [text, setText] = useState('');
  const msgs = chats[chatListing] ?? [];
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = end.current?.closest('.scroll') as HTMLElement | null;
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
  }, [msgs.length]);
  const send = () => {
    if (!text.trim()) return;
    sendMsg(chatListing, text.trim());
    setText('');
  };
  const theirBg = t.name === 'dark' ? '#262626' : '#F0F0F0';
  return (
    <MScreen
      footer={
        <div style={{ flex: 'none', padding: '8px 20px 34px', background: t.mBg, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -20px', padding: '0 20px' }}>
            {QUICK_REPLIES.map((q) => <FilterChip key={q} onClick={() => setText(q)}>{q}</FilterChip>)}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <label style={{ flex: 1, height: 48, borderRadius: 24, background: t.mSurface, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
              <Icon name="camera" size={20} color={t.text2} />
              <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Escribí un mensaje" aria-label="Mensaje" style={{ font: R(15), color: t.text }} />
            </label>
            <button aria-label="Enviar" className="press" onClick={send} style={{ width: 48, height: 48, borderRadius: 24, background: text.trim() ? t.green : t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}>
              <Icon name="send" size={20} color={text.trim() ? '#000000' : t.text3} />
            </button>
          </div>
        </div>
      }
    >
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px' }}>
        <RoundBtn icon="arrowLeft" label="Atrás" onClick={back} />
        <span style={{ width: 40, height: 40, borderRadius: 20, background: t.mChip, display: 'flex', alignItems: 'center', justifyContent: 'center', font: P(14), flex: 'none' }}>{s.initials}</span>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: P(15) }}>{s.name}</span>
          <Verified />
        </div>
        <RoundBtn icon="more" label="Denunciar" onClick={() => setOverlay('report')} />
      </div>
      <div style={{ padding: '0 20px' }}>
        <button className="press" onClick={() => open(l)} style={{ width: '100%', padding: 10, borderRadius: 16, background: t.mSurface, display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left' }}>
          <div style={{ width: 52, flex: 'none' }}><Photo ph={l.ph} cat={l.category} radius={10} iconSize={18} /></div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ font: R(14, 500), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</span>
            <span style={{ font: P(15) }}>{money(l.price)}</span>
          </div>
          <Icon name="chevronRight" size={18} color={t.text2} />
        </button>
      </div>
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ alignSelf: 'center', font: R(12, 500), color: t.text2, background: t.mSurface, borderRadius: 10, padding: '3px 10px' }}>Hoy</span>
        {msgs.map((m, i) =>
          m.from === 'system' ? (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '4px 8px' }}>
              <Icon name="shield" size={16} color={t.text2} />
              <span style={{ font: R(13), color: t.text2, ...pretty }}>{m.text}</span>
            </div>
          ) : (
            <div key={i} className="pop-in" style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '78%', background: m.from === 'me' ? t.greenSoft : theirBg, borderRadius: m.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ font: R(15), ...pretty }}>{m.text}</span>
              <span style={{ font: R(11), color: t.text2, alignSelf: 'flex-end' }}>{m.time}</span>
            </div>
          ),
        )}
        <div ref={end} />
      </div>
    </MScreen>
  );
}

/* ================= M11 Guardados (S5 vacío, S6 cargando) ================= */
export function M11() {
  const { t, back, go, showToast } = useApp();
  const { saved, toggleSaved } = useMarket();
  const money = useMoney();
  const zone = useZone();
  const open = useOpenListing();
  const loading = useFirstLoad();
  const items = LISTINGS.filter((l) => saved.has(l.id));
  const [undo, setUndo] = useState<string | null>(null);
  return (
    <MScreen>
      <MTopBar title="Guardados" onBack={back} />
      <div style={{ padding: '8px 20px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {loading ? (
          [0, 1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }} aria-busy="true">
              <Skel w={88} h={88} r={14} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}><Skel w="40%" h={16} /><Skel h={14} /><Skel w="50%" h={12} /></div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div style={{ paddingTop: 60 }}>
            <EmptyBlock icon="heart" title="Tocá ♥ en un producto para guardarlo" text="Lo encontrás acá cuando quieras volver a verlo, y te avisamos si baja de precio.">
              <Button onClick={() => go('M01', { replace: true })}>Ir a la Tienda</Button>
            </EmptyBlock>
          </div>
        ) : (
          items.map((l) => {
            const sold = l.status === 'vendida';
            return (
              <div key={l.id} role="link" tabIndex={0} className="press" onClick={() => open(l)} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
                <div style={{ width: 88, flex: 'none' }}><Photo ph={l.ph} cat={l.category} radius={14} iconSize={22} dim={sold} /></div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, opacity: sold ? 0.6 : 1 }}>
                  {l.oldPrice && <StatusTag status="Bajó de precio" />}
                  {sold && <StatusTag status="Vendida" />}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ font: P(16) }}>{money(l.price)}</span>
                    {l.oldPrice && <span style={{ font: R(13), color: t.text3, textDecoration: 'line-through' }}>{money(l.oldPrice)}</span>}
                  </div>
                  <span style={{ font: R(14), ...clamp2 }}>{l.title}</span>
                  <span style={{ font: R(13), color: t.text2 }}>{zone(l)}</span>
                </div>
                <button
                  aria-label="Quitar de Guardados"
                  onClick={(e) => { e.stopPropagation(); toggleSaved(l.id); setUndo(l.id); showToast('Lo quitaste de Guardados'); }}
                  style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}
                >
                  <Icon name="heart" size={20} color={t.error} />
                </button>
              </div>
            );
          })
        )}
        {undo && !saved.has(undo) && (
          <button className="press" onClick={() => { toggleSaved(undo); setUndo(null); }} style={{ alignSelf: 'center', font: R(14, 500), color: t.link, padding: 8 }}>Deshacer</button>
        )}
      </div>
    </MScreen>
  );
}

/* ================= Overlays: M12 Denunciar, M13 Invitado ================= */
export function ReportSheet() {
  const { t, setOverlay, screen } = useApp();
  const [reason, setReason] = useState<string | null>(null);
  const [detail, setDetail] = useState('');
  const [done, setDone] = useState(false);
  const close = () => setOverlay(null);
  const what = screen === 'M09' ? 'usuario' : 'publicación';
  if (done)
    return (
      <MSheet onClose={close} label="Denuncia enviada">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center', padding: '8px 0' }}>
          <span style={{ width: 56, height: 56, borderRadius: 28, background: t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={26} color={t.success} /></span>
          <span style={{ font: P(22) }}>Gracias, lo vamos a revisar</span>
          <span style={{ font: R(15), color: t.text2, ...pretty }}>Si confirmamos el problema, damos de baja la {what}. Tu denuncia es anónima.</span>
        </div>
        <Button onClick={close}>Listo</Button>
      </MSheet>
    );
  return (
    <MSheet onClose={close} label={`Denunciar ${what}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: P(20) }}>Denunciar {what}</span>
        <span style={{ font: R(14), color: t.text2 }}>No le avisamos al vendedor.</span>
      </div>
      <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column' }}>
        {REPORT_REASONS.map((r) => (
          <button key={r} role="radio" aria-checked={reason === r} onClick={() => setReason(r)} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 44, font: R(15) }}>
            <span style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${reason === r ? t.green : t.dashed}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', flex: 'none' }}>
              {reason === r && <span style={{ width: 10, height: 10, borderRadius: 5, background: t.green }} />}
            </span>
            {r}
          </button>
        ))}
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: R(14, 500), color: t.text2 }}>Detalle (opcional)</span>
        <input value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Ej.: pide que le transfiera antes de verla" style={{ height: 52, borderRadius: 14, background: t.mSurface, padding: '0 14px', font: R(15), color: t.text }} />
      </label>
      <Button kind={reason ? 'primary' : 'disabled'} onClick={() => setDone(true)}>Enviar denuncia</Button>
    </MSheet>
  );
}

export function GuestSheet() {
  const { t, setOverlay, set, showToast } = useApp();
  const { pendingAction, pendingVerb, setPendingAction } = useMarket();
  const close = () => { setOverlay(null); setPendingAction(null); };
  const login = (msg: string) => {
    set({ guest: false });
    setOverlay(null);
    showToast(msg);
    const a = pendingAction;
    setPendingAction(null);
    if (a) window.setTimeout(a, 50); // back to what they wanted to do
  };
  return (
    <MSheet onClose={close} label="Ingresá">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center', padding: '8px 0' }}>
        <span style={{ width: 56, height: 56, borderRadius: 28, background: t.mSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="lock" size={24} /></span>
        <span style={{ font: P(22) }}>Ingresá para {pendingVerb}</span>
        <span style={{ font: R(15), color: t.text2, ...pretty }}>Podés mirar la Tienda sin cuenta. Para consultar, guardar, publicar o denunciar, ingresá con tu cuenta de Chambito.</span>
      </div>
      <Button onClick={() => login('Sesión iniciada')}>Ingresar</Button>
      <Button kind="secondary" onClick={() => login('Cuenta creada')}>Crear cuenta</Button>
      <button onClick={close} style={{ alignSelf: 'center', font: R(15, 500), color: t.text2, padding: 8 }}>Seguir mirando</button>
    </MSheet>
  );
}

/* Mis consultas list (used inside Actividad › Tienda) */
export function ConsultasList() {
  const { t, go } = useApp();
  const { setChatListing, chats } = useMarket();
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {CONSULTAS.map((c) => {
        const l = listing(c.listing);
        const s = SELLERS[c.who];
        const msgs = chats[c.listing];
        const last = msgs && msgs.length ? msgs[msgs.length - 1] : null;
        return (
          <button key={c.listing} className="press" onClick={() => { setChatListing(c.listing); go('M10'); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', textAlign: 'left', width: '100%' }}>
            <div style={{ width: 52, flex: 'none' }}><Photo ph={l.ph} cat={l.category} radius={12} iconSize={18} /></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ font: P(15) }}>{s.name}</span>
                <span style={{ font: R(11, 500), color: t.text2, background: t.mChip, borderRadius: 8, padding: '1px 6px' }}>Tienda</span>
              </div>
              <span style={{ font: R(13, 500), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title.split(',')[0]}</span>
              <span style={{ font: R(13), color: t.text2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{last && last.from !== 'system' ? (last.from === 'me' ? 'Vos: ' : '') + last.text : c.last}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <span style={{ font: R(12), color: t.text2 }}>{c.time}</span>
              {!!c.unread && <span style={{ minWidth: 20, height: 20, borderRadius: 10, background: t.green, color: '#000000', font: P(11), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.unread}</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
