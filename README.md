# Chambito · mockups

Prototipo navegable de **Chambito Auto** (viajes: pasajero y conductor) y **Chambito Market** (Tienda: comprar y vender), con datos de prueba y sin backend.

**Ver en línea:** https://chambito-mockups.github.io/

- Dos menús, **Auto** y **Market**, cada uno con sus pantallas, ajustes y situaciones para simular.
- **Presentar** (tecla `P`): teléfono a pantalla completa, con recorridos guiados que avanzan solos.
- Enlaces directos a cada pantalla (`#A6`, `#M06`…), tema claro u oscuro para la página y para el teléfono, y lo que hacés en la demo se guarda en el navegador.

El código está en [`app/`](app/) (React + Vite + TypeScript). Detalles y cómo correrlo: [`app/README.md`](app/README.md).

Cada push a `main` corre los tests, compila y publica en GitHub Pages ([`.github/workflows/pages.yml`](.github/workflows/pages.yml)). Si un test falla, no se publica.
