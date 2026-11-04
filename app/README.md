# Chambito · prototipo web (Auto v3 + Market)

Clickable React prototype of `project/Chambito Auto v3.dc.html` (Auto as its own bottom-bar tab) and `Chambito Market.dc.html` (Tienda, Phase 1). Built with mock data and no backend calls.

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # static build in dist/ (relative paths, can be hosted anywhere)
npm test         # Vitest: registry, navigation, every screen in both themes/countries, viewer and interactions
```

## Navigating the prototype

- **Two menus, Auto and Market**, switched from the top bar. Each one has its own sidebar: only its screens, its account selector and its simulation switches. Coming back to a menu reopens the last screen you saw there.
- **Search** (`/`) filters the current menu by code or title; Enter opens the first result. If the match is in the other menu, a link takes you there.
- **Toolbar** above the phone: where you are, position in the menu, previous / next (`←` `→`) and **Reiniciar** (`R`), which reloads the screen with its initial state.
- **Deep links**: the URL keeps the screen (`#A6`, `#M06`…), so you can share a specific screen.
- Country and phone theme live in the top bar. Below 900 px the sidebar becomes a drawer (☰).

## Presenting and sharing

- **Presentar** (`P`, or the green button above the phone): the phone alone, full screen, with a floating bar. `←` `→` move, `Esc` exits. `?presentar` in the URL opens straight in this mode; phones (< 600 px) always start in it.
- **Recorridos guiados** in the side menu: *Pedir un viaje*, *Manejar con Chambito*, *Comprar* and *Vender en la Tienda*. They play every 6 s (`Space` pauses); the dots jump to any step. The trip simulation pauses while a flow plays and comes back after.
- **Saved between visits** (localStorage): theme, country, simulation switches, Guardados, my listings, drafts, consult chats and the places added in Auto. *Restablecer demo* (bottom of the side menu) wipes it.
- **Page theme** (☾ / ☀ in the top bar) is separate from the phone theme (phone icon).
- **Installable** as an app (manifest + icons in `public/pwa`).
- **Online:** https://esfot26.github.io/chambito-mockups/ — deployed by `.github/workflows/pages.yml` on every push to `main`, only if the tests pass.

## What's inside

- **Phone (390 × 844)** with every v3 screen: passenger A0–A11 (including the A8b SOS dialog and the A10 details modal), special states E1–E4, provider/driver D0–D9 (D4 is the IncomingOfferSheet, shown above any screen).
- **Sidebar**: theme (dark/light), country (Paraguay/Argentina), account (Cliente, Prestador without the Conductor trade, Conductor), simulation switches, and an index that jumps straight to any screen.
- **"Barra inferior"** and **"Componentes nuevos"** pages, matching the two showcase sheets of the canvas.
- **Notes panel**: each screen's "Usa / Cambia" notes, copied from the design.

### Interactions

- Passenger: type a destination, drag the map to move the pickup point, choose Económico or Confort, switch to cash (Paraguay only), then order. With "Viaje en tiempo real" on, the trip advances by itself: searching → on the way → arrived → in progress → finished. Also available: SOS, details, cancelling, rating (1–2 stars require a reason) and a tip with a custom amount.
- Driver: availability switch, demand-zone layer, an offer with a 15 s countdown, pickup navigation, PIN entry (`4827` in PY, `3156` in AR; keyboard works too), slide to finish, payment and wallet.
- New provider: "Sumate como conductor", then requirements with upload slots (tap to simulate uploading) and the review screen.

## Chambito Market (Tienda)

- **Entry**: by default *combination 2* from the design (Market card in Inicio, Tienda stacked with a back arrow, Auto keeps its tab). The sidebar switches to *combination 1* (Tienda as a tab; Equipos moves to Perfil when it doesn't fit).
- **Buyer**: Tienda home (and the almost-empty version), search, results (Productos | Servicios), filters, product detail (sold, unavailable, error, cross-sell marked Phase 2), seller profile, consult chat, Guardados, report and guest sheets.
- **Seller**: welcome, identity (verified, unverified, under review, suspended), Publicar 1–3, published or under review, resume a draft, My listings with tabs and actions, edit, limit of 50.
- **Actividad**: Servicios | Tienda selector (Mis consultas + Mis pedidos, Phase 2). **Notificaciones**: the 4 of the brief.
- Phase 2 (protected purchase) is not built: the design marks it «después».

### Changes from the design (improvements to validate)

- Active tab: solid green with black icon and label, for both Auto and Tienda (the Integración proposal, applied to Auto too).
- One button system: 52 px height everywhere (Tienda used 48) and 20 px side margins (Tienda used 16).
- One solid green per screen: my chat bubbles are soft green instead of solid; the send button is the only solid green and stays grey while the field is empty.
- Categories use set icons instead of the generic image placeholder.
- Content fades under the floating bar on scrolling screens.

## Structure

| File | Contents |
|---|---|
| `src/theme.ts` | Dark and light tokens from the brief / DESIGN_SYSTEM v1.6.0 |
| `src/data.ts` | Mock data for PY and AR |
| `src/store.tsx` | Navigation, trip state, simulation flags |
| `src/ui/kit.tsx` | Shared components (Sheet, Plate/VehicleCard, PinBoxes, SosButton, SlideToConfirm…); re-exports nav and Icon |
| `src/ui/nav.tsx` | Navigation shared by Auto and Market: BottomNavBar (with badges), TopBar, NavIconButton, MenuGroup/MenuItem, QuickAccess |
| `src/ui/sheets.tsx` | BottomSheet (Escape closes), QuickChatSheet, ChoiceList, SwitchRow |
| `src/shell/*` | Viewer: TopNav (Auto · Market), SideMenu, ScreenPanel (toolbar + notes), Phone, controls |
| `src/persist.ts` | localStorage helpers (`usePersistent`, `clearDemo`) |
| `src/shell/Presenter.tsx` | Presentation bar and guided flows (`TOURS` live in `registry.tsx`) |
| `src/test/*` | Vitest + Testing Library: registry, navigation, all 63 screens × 2 themes/countries, icon files (exact case), viewer, interactions, persistence, presentation |
| `src/ui/AutoMap.tsx` | Port of `AutoMapa.dc.html` (mock map with its variants) |
| `src/screens/*` | Passenger, special-state and driver screens |
| `src/market/*` | Tienda: data, state, components, buyer, seller and entry screens |
| `src/registry.tsx` | Screen index, jump presets and design notes |

## Not in the canvas (filled in here, needs validation)

- Argentina: the expanded-radius price, the fare breakdown, the final distance, commission at 14 % (chosen so that $ 8.500 → $ 7.300 matches LD4), the D8 close for Mercado Pago payments (no cash) and the wallet without debt.
- Results while typing in A2, the alternative pickup addresses, the "¿Cancelar el viaje?" confirmation and the negative rating reasons.
- Equipos is a placeholder. Inicio shows the services request as in the design (tapping a trade explains it opens the current Chambito flow), plus the Market card.
