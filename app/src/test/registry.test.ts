import { describe, expect, it } from 'vitest';
import { ALL_ENTRIES, GROUPS, MODULE_OF, MODULES, SCREENS, entriesOf } from '../registry';

describe('registry', () => {
  it('has unique entry keys', () => {
    const keys = ALL_ENTRIES.map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('points every entry to an existing screen', () => {
    for (const e of ALL_ENTRIES) expect(SCREENS[e.screen], e.key).toBeTypeOf('function');
  });

  it('assigns every group to Auto or Market', () => {
    for (const g of GROUPS) expect(['auto', 'market']).toContain(g.module);
  });

  it('splits the screens between both menus with nothing left out', () => {
    const auto = entriesOf('auto');
    const market = entriesOf('market');
    expect(auto.length).toBeGreaterThan(0);
    expect(market.length).toBeGreaterThan(0);
    expect(auto.length + market.length).toBe(ALL_ENTRIES.length);
    expect(auto.every((e) => MODULE_OF[e.key] === 'auto')).toBe(true);
    expect(market.every((e) => MODULE_OF[e.key] === 'market')).toBe(true);
  });

  it('opens each menu on one of its own screens', () => {
    for (const m of ['auto', 'market'] as const) expect(MODULE_OF[MODULES[m].first]).toBe(m);
  });

  it('documents what every screen uses and changes', () => {
    for (const e of ALL_ENTRIES) {
      expect(e.uses.length, e.key).toBeGreaterThan(5);
      expect(e.changes.length, e.key).toBeGreaterThan(5);
    }
  });
});
