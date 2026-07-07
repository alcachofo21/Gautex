# Gautex Medica — Web

Rediseño moderno de [gautex.com](https://gautex.com/) con escaparate e-commerce, catálogo de productos sanitarios y campañas personalizadas.

## Stack

- Next.js 15 + TypeScript + Tailwind CSS v4
- Zustand (carrito) + Framer Motion + Embla Carousel
- Deploy: Render (free tier)

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Tests

```bash
npm run test              # unitarios + integración (Vitest)
npm run test:coverage     # cobertura (~87% lib/API)
npm run test:e2e          # E2E (Playwright, requiere build)
npm run lint
```

CI en GitHub Actions ejecuta lint, tests con cobertura y E2E en PRs a `main`.

## Variables de entorno

Copia `.env.example` a `.env.local` y configura las variables necesarias.

## Deploy en Render

1. Push a GitHub (`main`)
2. Conectar repo en Render o usar Blueprint `render.yaml`
3. Build: `npm install && npm run build`
4. Start: `npm start`
