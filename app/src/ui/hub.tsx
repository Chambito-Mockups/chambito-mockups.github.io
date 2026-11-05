/**
 * Stable-navigation pieces (Inicio · Explorar/Trabajo · Actividad · Perfil): a central catalogue,
 * one search for every module, one activity timeline and availability per module, so adding a
 * module never adds a tab.
 */
import { CSSProperties, ReactNode, useState } from 'react';
import { useApp } from '../store';
import { P, R } from '../theme';
import { Icon } from './icon';
import { MODULE_META, ModuleKey } from './home';

const pretty = { textWrap: 'pretty' } as CSSProperties;
const MODULES: ModuleKey[] = ['servicios', 'auto', 'market'];

/* ---------- What a card or a row belongs to ---------- */
export type Kind = ModuleKey | 'entrega' | 'venta' | 'pago' | 'calificacion';
export const KIND_META: Record<Kind, { label: string; icon: string }> = {
  servicios: { label: 'Servicio', icon: 'wrench' },
  auto: { label: 'Auto', icon: 'car' },
  market: { label: 'Market', icon: 'cart' },
  entrega: { label: 'Entrega', icon: 'cart' },
  venta: { label: 'Venta', icon: 'tag' },
  pago: { label: 'Pago', icon: 'wallet' },
  calificacion: { label: 'Calificación', icon: 'star' },
};
/** Module of each kind, for the filters. Payments and ratings only show under «Todo». */
export const KIND_MODULE: Record<Kind, ModuleKey | null> = { servicios: 'servicios', auto: 'auto', market: 'market', entrega: 'market', venta: 'market', pago: null, calificacion: null };

/** Icon + text, so the module never depends on colour alone. */
export function ModuleTag({ kind, prefix }: { kind: Kind; prefix?: string }) {
  const { t } = useApp();
  const m = KIND_META[kind];
  return (
    <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 4, height: 22, borderRadius: 11, padding: '0 8px', background: t.mChip, font: R(11, 500), color: t.text, letterSpacing: 0.4, whiteSpace: 'nowrap' }}>
      <Icon name={m.icon} size={12} color={t.success} />
      {prefix ? `${prefix} · ${m.label.toUpperCase()}` : m.label}
    </span>
  );
}

/* ---------- Todo · Servicios · Auto · Market ---------- */
export type Filter = 'todo' | ModuleKey;
/** Filter used inside Explorar, Trabajo and Actividad, never as the app's navigation. */
export function ModuleFilter({ value, onChange, counts, label = 'Filtrar por módulo' }: { value: Filter; onChange: (f: Filter) => void; counts?: Partial<Record<Filter, number>>; label?: string }) {
  const { t } = useApp();
  const opts: Filter[] = ['todo', ...MODULES];
  return (
    <div role="tablist" aria-label={label} className="scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', flex: 'none' }}>
      {opts.map((f) => {
        const on = f === value;
        const n = counts?.[f];
        return (
          <button key={f} role="tab" aria-selected={on} className="press" onClick={() => onChange(f)}
            style={{ height: 36, borderRadius: 18, padding: '0 12px', flex: 'none', display: 'flex', alignItems: 'center', gap: 6, background: on ? t.chipSelBg : t.card, color: on ? t.chipSelText : t.text, font: R(14, 500) }}>
            {f !== 'todo' && <Icon name={MODULE_META[f].icon} size={15} color={on ? t.chipSelText : t.success} />}
            {f === 'todo' ? 'Todo' : MODULE_META[f].label}
            {!!n && <span style={{ font: R(12, 500), opacity: 0.7 }}>{n}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- One search for the three modules ---------- */
export interface SearchHit { kind: ModuleKey; title: string; hint: string }
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const INDEX: (SearchHit & { words: string })[] = [
  { kind: 'servicios', title: 'Plomería', hint: '12 plomeros cerca tuyo', words: 'plomero plomeria caño agua perdida' },
  { kind: 'servicios', title: 'Electricidad', hint: '8 electricistas disponibles hoy', words: 'electricista electricidad luz enchufe' },
  { kind: 'servicios', title: 'Limpieza del hogar', hint: 'Desde Gs. 60.000 por hora', words: 'limpieza limpiar casa hogar' },
  { kind: 'servicios', title: 'Pintura', hint: 'Pintores verificados', words: 'pintor pintura pared' },
  { kind: 'auto', title: 'Costanera de Asunción', hint: 'Destino · a 4,1 km', words: 'costanera rio' },
  { kind: 'auto', title: 'Paseo La Galería', hint: 'Destino · a 6,3 km', words: 'paseo galeria shopping' },
  { kind: 'auto', title: 'Aeropuerto Silvio Pettirossi', hint: 'Destino · a 14 km', words: 'aeropuerto avion' },
  { kind: 'market', title: 'Ventilador de pie', hint: 'Gs. 280.000 · Villa Morra', words: 'ventilador calor' },
  { kind: 'market', title: 'Bicicleta Trek rodado 29', hint: 'Gs. 1.450.000 · Recoleta', words: 'bicicleta bici trek' },
  { kind: 'market', title: 'Silla de escritorio', hint: 'Gs. 390.000 · Centro', words: 'silla escritorio oficina' },
];
export function searchAll(q: string): SearchHit[] {
  const n = norm(q.trim());
  if (n.length < 2) return [];
  return INDEX.filter((h) => norm(`${h.title} ${h.words}`).includes(n));
}

/** «plomero» → Servicios, «Costanera» → Auto, «ventilador» → Market, grouped by module. */
export function UnifiedSearch({ placeholder = 'Buscar servicios, destinos o productos', onPick }: { placeholder?: string; onPick?: (h: SearchHit) => void }) {
  const { t } = useApp();
  const [q, setQ] = useState('');
  const hits = searchAll(q);
  const groups = MODULES.map((k) => [k, hits.filter((h) => h.kind === k)] as const).filter(([, l]) => l.length);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ height: 48, borderRadius: 24, background: t.card, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', outline: q ? `2px solid ${t.green}` : 'none', outlineOffset: -2 }}>
        <Icon name="search" size={18} color={t.text2} />
        <input aria-label={placeholder} value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', font: R(15), color: t.text }} />
        {q && <button aria-label="Borrar búsqueda" onClick={() => setQ('')}><Icon name="close" size={16} color={t.text2} /></button>}
      </label>
      {q.trim().length >= 2 && (
        <div aria-label="Resultados" style={{ background: t.card, borderRadius: 18, padding: 6, display: 'flex', flexDirection: 'column' }}>
          {groups.length === 0 && <span style={{ font: R(13), color: t.text2, padding: 10, ...pretty }}>Sin resultados. Probá «plomero», «Costanera» o «ventilador».</span>}
          {groups.map(([k, list]) => (
            <section key={k} aria-label={`Resultados de ${MODULE_META[k].label}`} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ font: R(11, 500), color: t.text2, padding: '8px 10px 2px', letterSpacing: 0.6 }}>{MODULE_META[k].label.toUpperCase()}</span>
              {list.map((h) => (
                <button key={h.title} className="press" onClick={() => onPick?.(h)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 12, textAlign: 'left', width: '100%' }}>
                  <Icon name={MODULE_META[k].icon} size={18} color={t.success} />
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ font: R(14, 500) }}>{h.title}</span>
                    <span style={{ font: R(12), color: t.text2 }}>{h.hint}</span>
                  </span>
                </button>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Provider: opportunities feed ---------- */
export interface FeedItem { id: string; kind: Kind; status: 'NUEVO' | 'DISPONIBLE'; title: string; meta: string; price: string; /** «Hace 2 min» */ ago?: string }
/** Tag (icon + text) and time on top; module icon, title, distance and price; round arrow to open it. */
export function FeedCard({ item, onClick }: { item: FeedItem; onClick?: () => void }) {
  const { t } = useApp();
  const tag = KIND_MODULE[item.kind] === 'market' && item.kind !== 'market' ? `Market · ${KIND_META[item.kind].label}` : KIND_META[item.kind].label;
  return (
    <button className="press" onClick={onClick} aria-label={`${tag}, ${item.status.toLowerCase()}: ${item.title}, ${item.meta}, ${item.price}`} style={{ borderRadius: 18, background: t.card, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left', width: '100%' }}>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 22, borderRadius: 11, padding: '0 8px', background: t.greenSoft, color: t.success, font: R(12, 500) }}>
          <Icon name={KIND_META[item.kind].icon} size={12} color={t.success} />{tag}
        </span>
        <span style={{ font: R(12), color: t.text2 }}>{item.ago ?? (item.status === 'NUEVO' ? 'Nuevo' : 'Disponible')}</span>
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
        <span style={{ width: 44, height: 44, borderRadius: 14, background: t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={KIND_META[item.kind].icon} size={22} color={t.success} /></span>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span style={{ font: P(16) }}>{item.title}</span>
          <span style={{ font: R(13), color: t.text2 }}>{item.meta} · <b style={{ color: t.text, fontWeight: 500 }}>{item.price}</b></span>
        </span>
        <span aria-hidden style={{ width: 34, height: 34, borderRadius: 17, background: t.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <Icon name="arrowLeft" size={16} color="#000000" style={{ transform: 'rotate(180deg)' }} />
        </span>
      </span>
    </button>
  );
}

/* ---------- One activity timeline for every module ---------- */
export interface ActivityItem { id: string; kind: Kind; title: string; meta: string; when: string }
export function ActivityTimeline({ items, onOpen }: { items: ActivityItem[]; onOpen?: (a: ActivityItem) => void }) {
  const { t } = useApp();
  if (!items.length) return <span style={{ font: R(14), color: t.text2, padding: '12px 4px' }}>Nada por acá todavía.</span>;
  const days = [...new Set(items.map((i) => i.when))];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {days.map((d) => (
        <section key={d} aria-label={d} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h4 style={{ margin: 0, font: R(13, 500), color: t.text2 }}>{d}</h4>
          <div style={{ background: t.card, borderRadius: 18, overflow: 'hidden' }}>
            {items.filter((i) => i.when === d).map((a, idx) => (
              <button key={a.id} className="press" onClick={() => onOpen?.(a)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', width: '100%', textAlign: 'left', borderTop: idx ? `1px solid ${t.name === 'dark' ? '#262626' : '#E6E6E6'}` : 'none' }}>
                <span style={{ width: 36, height: 36, borderRadius: 12, background: t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={KIND_META[a.kind].icon} size={18} color={t.success} /></span>
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span style={{ font: R(14, 500) }}>{a.title}</span>
                  <span style={{ font: R(12), color: t.text2 }}>{KIND_META[a.kind].label} · {a.meta}</span>
                </span>
                <Icon name="chevronRight" size={16} color={t.text2} />
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ---------- Availability per module (not one switch for everything) ---------- */
export type Availability = Record<ModuleKey, boolean>;
const AVAIL: Record<ModuleKey, [onLabel: string, title: string, onText: string, offText: string]> = {
  servicios: ['Disponible', 'Servicios', 'Recibís solicitudes de tus rubros', 'No recibís solicitudes'],
  auto: ['Conectado', 'Auto', 'Recibís viajes cerca tuyo', 'No estás recibiendo viajes'],
  market: ['Recibiendo pedidos', 'Entregas del Market', 'Recibís pedidos cercanos', 'No recibís pedidos'],
};

/** «Disponible en 2 de 3 módulos»; opens the per-module switches. */
export function AvailabilitySummary({ value, open, onToggle }: { value: Availability; open: boolean; onToggle: () => void }) {
  const { t } = useApp();
  const on = MODULES.filter((k) => value[k]);
  return (
    <button aria-expanded={open} onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', width: '100%', textAlign: 'left' }}>
      <span aria-hidden style={{ width: 10, height: 10, borderRadius: 5, background: on.length ? t.green : t.text3, flex: 'none' }} />
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ font: R(15, 500) }}>{on.length ? `Disponible en ${on.length} de 3 módulos` : 'No disponible'}</span>
        <span style={{ font: R(13), color: t.text2 }}>{on.map((k) => MODULE_META[k].label).join(' · ') || 'No recibís oportunidades'}</span>
      </span>
      <Icon name="chevronDown" size={18} color={t.text2} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
    </button>
  );
}

export function AvailabilityPanel({ value, onChange }: { value: Availability; onChange: (v: Availability) => void }) {
  const { t } = useApp();
  return (
    <div role="group" aria-label="Disponibilidad por módulo" style={{ display: 'flex', flexDirection: 'column', padding: '0 8px 8px' }}>
      {MODULES.map((k) => {
        const on = value[k];
        const [onLabel, title, onText, offText] = AVAIL[k];
        return (
          <button key={k} role="switch" aria-checked={on} aria-label={title} onClick={() => onChange({ ...value, [k]: !on })} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 14, textAlign: 'left', width: '100%' }}>
            <Icon name={MODULE_META[k].icon} size={20} color={on ? t.success : t.text3} />
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ font: R(14, 500) }}>{title}{on && <span style={{ color: t.success }}> · {onLabel}</span>}</span>
              <span style={{ font: R(12), color: t.text2 }}>{on ? onText : offText}</span>
            </span>
            <span aria-hidden style={{ width: 44, height: 26, borderRadius: 13, background: on ? t.green : t.mChip, position: 'relative', transition: 'background .2s', flex: 'none' }}>
              <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: 10, background: '#FFFFFF', transition: 'left .2s' }} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Profile: a module not activated yet ---------- */
export function ActivateModuleCard({ icon, title, text, cta = 'Activar módulo', tag, onClick }: { icon: string; title: string; text: string; cta?: string; tag?: string; onClick?: () => void }) {
  const { t } = useApp();
  return (
    <div style={{ borderRadius: 20, background: t.card, padding: 14, display: 'flex', alignItems: 'center', gap: 12, outline: `1px dashed ${t.green}`, outlineOffset: -1 }}>
      <span style={{ width: 44, height: 44, borderRadius: 14, background: t.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={icon} size={22} color={t.success} /></span>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ font: R(15, 500), display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>{title}{tag && <span style={{ font: R(11, 500), color: t.success, background: t.greenSoft, borderRadius: 8, padding: '1px 7px' }}>{tag}</span>}</span>
        <span style={{ font: R(12), color: t.text2, ...pretty }}>{text}</span>
      </span>
      <button className="press" onClick={onClick} style={{ height: 34, borderRadius: 17, padding: '0 12px', background: t.green, color: '#000000', font: R(13, 500), flex: 'none' }}>{cta}</button>
    </div>
  );
}

/** Large title for Explorar, Trabajo, Actividad and Perfil inside the frame. */
export function PageTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <h2 style={{ flex: 1, margin: 0, font: P(28) }}>{children}</h2>
      {right}
    </div>
  );
}
