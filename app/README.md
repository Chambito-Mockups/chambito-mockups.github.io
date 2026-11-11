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

- **Versions** (cards next to the phone, left of it): each way to navigate, seen on its own with its own colour, its bottom bar and how many screens it has. Choosing one applies its settings, opens its first screen and keeps previous / next inside it.
  - **Auto** · v1 *Pestaña Auto* (Chambito Auto v3) · v2 *Selector de sección* (Prototipo Auto: «Servicios ▾ / Auto ▾ / Market ▾», bar Inicio · Actividad · Perfil, X1 · X2 · MK · A11 unificada) · v3 *Navegación estable* (the proposals page).
  - **Market** · v1 *Tarjeta en Inicio* · v2 *Pestaña Tienda* · v3 *Market como sección* (with the selector).
  - Shared flows (the trip, the driver, buying and selling) are in every version.
- **Toolbar**: previous / next show the name of the screen they open, with a progress bar; big arrows on both sides of the phone do the same. **Phone theme** (Oscuro | Claro) sits next to the phone (`T`); the page theme stays in the top bar.
- **Index**: search and versions stay on top; only the group of the current screen is open («Abrir todos» opens the rest).

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
- **Online:** https://chambito-mockups.github.io/ — deployed by `.github/workflows/pages.yml` on every push to `main`, only if the tests pass.

## What's inside

- **Phone (390 × 844)** with every v3 screen: passenger A0–A11 (including the A8b SOS dialog and the A10 details modal), special states E1–E4, provider/driver D0–D9 (D4 is the IncomingOfferSheet, shown above any screen).
- **Sidebar**: theme (dark/light), country (Paraguay/Argentina), account (Cliente, Prestador without the Conductor trade, Conductor), simulation switches, and an index that jumps straight to any screen.
- **"Barra inferior"** and **"Componentes nuevos"** pages, matching the two showcase sheets of the canvas.
- **Notes panel**: each screen's "Usa / Cambia" notes, copied from the design.

### Interactions

- Passenger: type a destination, drag the map to move the pickup point, choose Económico or Confort, switch to cash (Paraguay only), then order. With "Viaje en tiempo real" on, the trip advances by itself: searching → on the way → arrived → in progress → finished. Also available: SOS, details, cancelling, rating (1–2 stars require a reason) and a tip with a custom amount.
- Driver: availability switch, demand-zone layer, an offer with a 15 s countdown, pickup navigation, PIN entry (`4827` in PY, `3156` in AR; keyboard works too), slide to finish, payment and wallet.
- New provider: "Sumate como conductor", then requirements with upload slots (tap to simulate uploading) and the review screen.

## App integrada (Servicios, Auto and Market in one app)

**App integrada** in the top bar (or `#integrada`) runs the whole app of `chambito-app.html` in one phone: 38 screens across Servicios (base), Market (buying and selling, Phase 1 and 2), Auto (client) and Socio/Conductor. The trip, the driver's offer and the protected purchase advance on their own (driver PIN `4827`).

- **Navigation by default: «Selector de sección»** (from Prototipo Auto). Each home (Servicios, Auto, Market) has the «Servicios ▾ / Auto ▾ / Market ▾» pill, which opens «Elegí qué querés hacer» (X2). The bar is Inicio · Actividad · Perfil in every section and Inicio reopens the last section used. The other bars (Explorar, Combinación 1 and 2, Tienda en la barra) stay as options.
- **Menu of screens** (right): the selector tour first (X1, X2 from each section, A0, MK, A11, Perfil), then every screen by module, with search. Previous / next above the phone and `←` `→` walk it; each screen has its link, `#integrada/<key>` (e.g. `#integrada/X2m`).
- **Design system:** colours, type scale, spacing and components follow the brief and the design system of 09/11/2026 (TOKENS.json v1.1.0): canvas `#F5F5F5 / #000000` with white / `#333333` cards, white text on green, selected chips, segments and radios in black, floating bottom bar of 72 (active `#2F7A33 / #7CCB7F`), side margin 20, sheets with radius 24 and padding 24 on a 50 % veil, chat with the outgoing bubble black (green in dark) and the brand pattern at 4 %, 4 s toasts and the press / sheet motion. `src/test/integrada.test.tsx` checks the rules on every screen in both themes.
- On the left are the demo settings (bottom bar, Market phase, start screen, phone theme, Tienda categories, Reiniciar).
- **Tienda categories:** circles in one row (default) or tiles (`CategoryTile` of the design system: two per row, icon in a circle of 40, the chosen one entirely black). Both stay; the menu has «Tienda con categorías en mosaicos».

- `src/integrada/screens/{base,market,auto,socio}.tsx`: one component per screen.
- `src/integrada/kit.tsx`: shared pieces (Screen, Header, Title, Body, Footer, Btn, IconBtn, Chip, SectionPill, Pattern, I…).
- `src/integrada/chrome.tsx`: bottom bar with the live card, the explorer (X2), SOS and offer sheets, toast and status bar.
- `src/integrada/model.ts`: state and logic ported from the design (`buildModel` → the view model read with `useVM()`).
- `src/integrada/IntegradaPhone.tsx` (state, timers, screen map) and `IntegradaPage.tsx` (the viewer page). Icons live in `integrada.css`, scoped under `.ig`.
- `src/test/integrada.test.tsx`: every screen in both themes, the trip, chat, protected purchase and driver flows, and the viewer page.

## Sistema de diseño

**Sistema de diseño** in the top bar (or `#sistema/<section>`, e.g. `#sistema/botones`) puts the whole design system of 09/11/2026 (brief + SISTEMA-DE-DISENO, TOKENS.json v1.1.0) in one menu, with full width (the Auto / Market side menu is hidden there):

- **Fundamentos:** colours (palette, derived, every semantic token in light and dark, read from `src/integrada/tokens.ts`, the same values the screens use), type scale, spacing and radii, elevation, motion and the icon set.
- **Componentes:** live, in light and dark side by side: buttons, icon button, chips and segmented control, badges and avatar, fields and search, switch / radio / checkbox / stars, cards and lists, progress and empty state, bottom bar, section selector and app bar, sheet, banner and toast, chat, vehicle card / plate / PIN, category tiles.
- **Patrones:** the rules (what is not allowed) and voice and formats.
- **Referencias anteriores:** «Navegación por versión» opens the previous design references (`#componentes` still works).
- Components: `src/integrada/kit.tsx` and `src/integrada/ds.tsx`; page: `src/integrada/DesignSystemPage.tsx`.

## Auto v3 (navigable mockups, a version of its own)

**Auto v3** in the top bar (or `#autov3/<code>`, e.g. `#autov3/A6`) turns the canvas «Chambito Auto v3» into navigable mockups, apart from the App integrada and built only with the design-system components and tokens. 34 entries: Explorador (X1, X2, V3, V4), Viaje · Moto · Envío (V1, V2), Pasajero (A0–A11 with A0b, A5b, A8b SOS and A10 details), Estados especiales (E1 guest, E2 location off, E3 offline, E4 service in progress) and Conductor (D0–D9, D4 offer as a sheet).

- Settings: country (Paraguay / Argentina: plates, prices, Mercado Pago, PIN 4827 / 3156), phone theme, and «Simular el viaje y las ofertas» (the trip advances on its own from «Buscando conductor»; online, an offer arrives and expires in 12 s).
- Same viewer as the App integrada: menu with search, previous / next and `←` `→`.
- What changes from the canvas to follow the design system: no call button (A7 offers the chat), the bottom bar is the floating one with the active item in `#2F7A33 / #7CCB7F`, the logo stays out of the explorer, map controls are the white / `#1A1A1A` circles.
- Code: `src/autov3/` (model, parts, pasajero, conductor, phone, page); tests in `src/test/autov3.test.tsx`.

## Componentes (design references)

**Componentes** in the top bar (or `#componentes`; the old `#navegacion` still works) gathers every design reference, with the **version cards on the side** as on the screens. Each version shows its own references: v1 the bar of Auto v3, its new components and «Probalo»; v2 the explorer pieces and its fixed bar; v3 the Inicio proposals, the architecture and the 4 vs 5 tabs bar. Three sections: **Navegación**, **Componentes** and **Barra inferior**:

- **Diseños de Inicio**: provider and client phones side by side. *Recomendada · navegación estable* is navigable (Inicio · Explorar/Trabajo · Actividad · Perfil, plus Chambito Auto, Market and Disponibilidad with a back arrow), with a fixed or floating bar and light/dark theme. Also the Opciones 1, 2 y 3 proposals and the module switcher in Inicio, to compare.
- **Opciones de barra** (A–F with pros, cons and when to use each), **Arquitectura** (what lives in each of the four tabs, 4 vs 5 tabs), **Componentes** (catalogue and the mockup palette with contrast), **Probalo** and **Reglas** (usability, performance, gradual activation).
- Pieces: `src/ui/home.tsx` (Inicio from the proposals), `src/ui/hub.tsx` (unified search, module filter, feed, activity timeline, availability), `src/ui/modules.tsx` (from the «Cliente y Prestador» mockup); screens in `src/stableNav.tsx` and `src/proposals.tsx`; page in `src/integration.tsx`.

## Chambito Market (Tienda)

- **Entry**: by default *combination 2* from the design (Market card in Inicio, Tienda stacked with a back arrow, Auto keeps its tab). The sidebar switches to *combination 1* (Tienda as a tab; Equipos moves to Perfil when it doesn't fit).
- **Buyer**: Tienda home (and the almost-empty version), search, results (Productos | Servicios), filters, product detail (sold, unavailable, error, cross-sell marked Phase 2), seller profile, consult chat, Guardados, report and guest sheets.
- **Seller**: welcome, identity (verified, unverified, under review, suspended), Publicar 1–3, published or under review, resume a draft, My listings with tabs and actions, edit, limit of 50.
- **Actividad**: Servicios | Tienda selector (Mis consultas + Mis pedidos, Phase 2). **Notificaciones**: the 4 of the brief.
- Phase 2 (protected purchase) is not built for the buyer here: the design marks it «después». The seller side of Phase 2 is (below).

### Seller side of Phase 2: products, stock, shipping, plans and payouts (example business rules)

Classic Market (groups «Vendedor · productos, stock y envío» ST1–ST7 and «Vendedor · ventas y cobros» C1–C9) and App Unificada (groups «Market · productos, stock y envío» S1–S6 and «Market · ventas y cobros» C1–C9; they switch the phone to Phase 2):

- **Publicar**: photos, name, description, price, category, **stock** and **who pays shipping** (seller = free shipping, or buyer). Under the price, how much you receive.
- **Stock**: the seller sees and edits units in Mis publicaciones (− / +). At 0 the listing shows «Sin stock» and can't be bought («Avisarme cuando haya»).
- **Business profile**: business name, category, description, owner, hours, zone and its products; opened from any product detail.
- **Shipping**: the product detail says who pays shipping before buying; the cart charges it only when the buyer pays.
- **Search**: search and results screens (existing), with «Sin stock» on cards.
- **Cómo pagás** (plans screen) to choose between the two options:

| Option | Rule |
|---|---|
| A · Membership, no commission | Emprendedor USD 20/month (15 active listings) · Comercio USD 45 (50) · Negocio USD 80 (no limit). No sale pays commission. Charged in USD to the card |
| B · Commission per sale | No fixed cost, 10 active listings. Tecnología 8 %, Deportes 8 %, Hogar 10 %, Otros 10 %, Ropa 12 %; min Gs. 5.000, cap Gs. 300.000; first 3 sales free |

Common rules: moving to a membership or up a tier applies now, down or back to commission at month end; failed membership payment = 7 days grace, then back to commission; commission only on protected purchases, base is product price, shipping goes to the seller, IVA 10 % included; money pending until the buyer confirms or 5 days after delivery; no dispatch in 48 h cancels the sale; claims hold money up to 10 days; payouts only to the seller's own account, min Gs. 50.000, 1 free per week. The sidebar's **Cobro al vendedor** sets the starting option. Logic and rules: `src/commission.ts` (tested in `src/test/commission.test.ts` and `src/test/cobros.test.tsx`).

### Brand (guide of 05/11/2026 + `design-system/TOKENS.json` v1.27.0; where they differ, TOKENS wins)

- **Text and icons on green are white** (COL-03), in bold or ≥ 16. One green button per screen; green is the signal, not decoration.
- **Bottom bar**: floating island of 72, radius 16, with outline (TOKENS `bottomNav`). Icon 24 and name on every tab; the active one in `icon.brand` (#2F7A33 light / #7CCB7F dark), no pill and no sliding.
- **Buttons**: primary 56, green with white text, no glow; secondary on the surface with a border; chips and segmented selection inverted (black/white), never green.
- **Switches** 52 × 32 with a white thumb, on #2F7A33 (light) / #4BAC4F (dark).
- **Cards** radius 16, on the surface with a very soft shadow in light and none in dark; icon boxes of 40 (radius 12); list items 56 / 72.
- **Icons**: the official set of the brand kit (86, `public/ic`). Not in the set yet, to validate: `car`, `wrench`, `bolt`, `roller`.
- **Logo**: the official horizontal one (`public/brand`), only in Inicio. **Fonts**: the official TTFs (Poppins Bold; Roboto Light, Regular, Medium), nothing under 12.
- **Chat**: my bubble solid green with white text, the brand pattern at 4 % behind the thread, system messages in a grey pill.
- **Not in Chambito** and removed: call buttons (contact is by chat; «Llamar al 911» stays in SOS), promotional banners, emojis in titles, gradients.
- `src/test/brand.test.tsx` checks these rules on every screen.

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
