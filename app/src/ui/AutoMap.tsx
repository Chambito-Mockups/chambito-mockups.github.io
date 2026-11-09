import { CSSProperties } from 'react';
import { useAppTheme } from '../store';
import { GREEN, Theme } from '../theme';

// Port of AutoMapa.dc.html: a sober map mock (not a real map) with the route in green.
export type MapVariant = 'none' | 'base' | 'origin' | 'route' | 'driver' | 'arrived' | 'trip' | 'search' | 'heat';

const PIN = 'M0,0 C-3,-7 -12,-13 -12,-24 A12,12 0 1 1 12,-24 C12,-13 3,-7 0,0Z';

/** `palette` lets a page outside the prototype's theme (Auto v3) pass its own map colours. */
export function AutoMap({ variant, drop, offsetY = 0, heat, panX = 0, panY = 0, style, palette }: { variant: MapVariant; drop?: boolean; offsetY?: number; heat?: boolean; panX?: number; panY?: number; style?: CSSProperties; palette?: Theme['map'] }) {
  const theme = useAppTheme();
  const c = palette ?? theme!.map;
  const v = variant;
  const hasOrigin = ['route', 'driver', 'arrived', 'search', 'base', 'origin'].includes(v);
  const o = ['search', 'base'].includes(v) ? { x: 165, y: 280 } : { x: 100, y: 350 };
  const hasDest = ['route', 'trip'].includes(v);
  const cars: Record<string, string> = { driver: 'translate(295,140) rotate(-90)', arrived: 'translate(100,312) rotate(180)', trip: 'translate(230,215)', heat: 'translate(165,350)' };
  const showHeat = heat ?? v === 'heat';
  return (
    <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', ...style }}>
      <rect width="390" height="844" fill={c.bg} />
      <g transform={`translate(${panX},${panY})`}>
        <g transform="translate(-390,-844)">
          {/* tile the base layer so panning never shows an edge */}
          {[0, 1, 2].map((ix) =>
            [0, 1, 2].map((iy) => (
              <g key={`${ix}-${iy}`} transform={`translate(${ix * 390},${iy * 844})`}>
                <path d="M0,760 C80,735 150,790 185,844 L0,844 Z" fill={c.water} />
                <rect x="172" y="147" width="51" height="56" rx="6" fill={c.park} />
                <rect x="302" y="567" width="51" height="56" rx="6" fill={c.park} />
                <path d="M35,0V844M100,0V844M165,0V844M230,0V844M295,0V844M360,0V844M0,70H390M0,140H390M0,210H390M0,280H390M0,350H390M0,490H390M0,560H390M0,630H390M0,700H390M0,770H390" stroke={c.street} strokeWidth="7" fill="none" />
                <path d="M-20,720 L410,330 M0,420 H390" stroke={c.avenue} strokeWidth="14" fill="none" />
              </g>
            )),
          )}
        </g>
      </g>
      <g transform={`translate(0,${offsetY})`}>
        {showHeat && (
          <g className="fade-in">
            <path d="M100,140H230V280H100Z" fill={GREEN} fillOpacity="0.2" stroke={GREEN} strokeOpacity="0.6" strokeWidth="1.5" />
            <path d="M230,490H360V630H230Z" fill={GREEN} fillOpacity="0.12" stroke={GREEN} strokeOpacity="0.4" strokeWidth="1.5" />
            <path d="M35,560H165V700H35Z" fill={GREEN} fillOpacity="0.12" stroke={GREEN} strokeOpacity="0.4" strokeWidth="1.5" />
          </g>
        )}
        {v === 'route' && <path className="draw" d="M100,350V280H230V140H295V70" stroke={GREEN} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        {v === 'driver' && <path d="M295,140H230V280H100V350" stroke={GREEN} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        {v === 'trip' && (
          <>
            <path d="M100,350V280H230V210" stroke={c.traveled} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M230,210V140H295V70" stroke={GREEN} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        {v === 'search' && (
          <g>
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={165} cy={280} r={120} fill={GREEN} fillOpacity={0.12} stroke={GREEN} strokeWidth={1.5} style={{ transformOrigin: '165px 280px', animation: `amPulse 2.7s ${i * 0.9}s ease-out infinite`, opacity: 0 }} />
            ))}
          </g>
        )}
        {(v === 'base' || v === 'arrived') && <circle cx={o.x} cy={o.y} r="22" fill={GREEN} fillOpacity="0.2" />}
        {cars[v] && (
          <g transform={cars[v]}>
            <g className={v === 'driver' || v === 'trip' ? 'car-bob' : undefined}>
              <rect x="-8" y="-13" width="16" height="26" rx="5" fill={c.car} />
              <rect x="-6" y="-8" width="12" height="6" rx="2" fill={c.bg} />
            </g>
          </g>
        )}
        {hasOrigin && !drop && <circle cx={o.x} cy={o.y} r="9" fill={GREEN} stroke={c.bg} strokeWidth="4" />}
        {hasOrigin && drop && (
          <g transform={`translate(${o.x},${o.y})`}>
            <path d={PIN} fill={GREEN} stroke={c.bg} strokeWidth="2" />
            <circle cx="0" cy="-24" r="4.5" fill="#FFFFFF" />
          </g>
        )}
        {hasDest && !drop && <rect x="288" y="63" width="14" height="14" rx="2" fill={c.dest} stroke={c.bg} strokeWidth="3" />}
        {hasDest && drop && (
          <g transform="translate(295,70)">
            <path d={PIN} fill={c.dest} stroke={c.bg} strokeWidth="2" />
            <rect x="-4.5" y="-28.5" width="9" height="9" rx="1.5" fill={c.bg} />
          </g>
        )}
      </g>
    </svg>
  );
}

export function MapPinSvg({ kind, stroke }: { kind: 'origin' | 'dest'; stroke: string }) {
  const t = useAppTheme()!;
  return (
    <svg width="28" height="42" viewBox="-14 -40 28 42" style={{ display: 'block' }}>
      <path d={PIN} fill={kind === 'origin' ? GREEN : t.map.dest} stroke={stroke} strokeWidth="2" />
      {kind === 'origin' ? <circle cx="0" cy="-24" r="4.5" fill="#FFFFFF" /> : <rect x="-4.5" y="-28.5" width="9" height="9" rx="1.5" fill={stroke} />}
    </svg>
  );
}
