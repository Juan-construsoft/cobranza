# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este proyecto

Aplicación web interna para un despacho de abogados que gestiona cobranza de cartera vencida (contexto legal colombiano: tipos de identificación C.C./NIT, actuaciones procesales como "Auto Admisorio", "Medida Cautelar Decretada", etc.).

**Stack:** React 17 + TypeScript 4.9 + CRA (`react-scripts` 5) + react-router-dom **v5** (`Switch`/`component`/`useHistory`) + MUI v5 + Supabase (Postgres, Auth, Storage). Desplegada en Vercel (proyecto `cobranza`).

## Comandos

```
npm install        # primera vez; hay package-lock.json
npm start          # servidor de desarrollo CRA
npm run build      # build de producción
npm test           # tests en modo watch (Jest vía react-scripts)
npx tsc --noEmit   # typecheck estricto sin compilar
```

Requiere `.env.local` con `REACT_APP_SUPABASE_URL` y `REACT_APP_SUPABASE_ANON_KEY` (ver `.env.example`); sin ellas `supabaseClient.ts` lanza error al arrancar. En Vercel van como Environment Variables.

No existen tests escritos aún. No usar paquetes `@mui/x-*` (incompatibles con React 17).

## Arquitectura

- **Datos:** Supabase Postgres. Esquema versionado en `supabase/schema.sql` (tablas `cases` y `activities` con FK on delete cascade, enums, trigger `activities_touch_case` que actualiza `last_activity_date` al insertar actuación, RLS solo-authenticated, bucket privado `case-documents`). **Las uniones literales de `src/types/index.ts` y los enums del SQL son espejo: cualquier cambio se hace en ambos** (enum existente: `ALTER TYPE ... ADD VALUE`).
- **Mapeo:** DB snake_case ↔ front camelCase vía `src/lib/mappers.ts`. Fechas como string (`YYYY-MM-DD` para date, ISO para timestamptz) — nunca `Date` en los tipos de dominio.
- **Auth:** Supabase Auth email/password sin signup público (usuarios los crea el admin en el dashboard). `AuthContext` + `ProtectedRoute` (todas las rutas menos `/login`). RLS: sin sesión, la anon key no ve nada.
- **Patrón async:** hook `src/lib/useAsync.ts` (`{data, loading, error, reload}`) para lecturas; mutaciones con try/catch + `useNotification` + `reload()`. Sin react-query.
- **UI:** MUI v5, tema en `src/theme.ts`, layout con AppBar en `src/components/Layout.tsx`, notificaciones globales con `useNotification()` (`src/context/NotificationContext.tsx`). Textos de UI en español.

Módulos bajo `src/modules/`:

- `cases/` — CRUD completo sobre Supabase (`CaseService.ts`). `CaseFields.tsx` comparte los campos entre apertura (`CaseForm`) y detalle (`CaseDetail`, que además monta actuaciones y documentos). Conteos del Dashboard como funciones puras (`countActiveCases`, `countByStatus`).
- `tracking/` — `ActivityService.ts` (crear/por caso/todas), `ActivityForm` (se monta en el detalle del caso), `ActivityHistory` (componente puro, chips amarillo/rojo por deadline). `AlertService.ts`: una alerta por caso con el nivel más severo; rojo = día límite terminado, amarillo = ≤3 días. Sin envío de email (fase futura).
- `demands/` — `DemandService.generateDemand` sustituye placeholders `{{...}}` de la plantilla con datos del caso; descarga TXT. Plantilla única hardcodeada en `TemplateSelector`.
- `documents/` — `DocumentService.ts` sobre Storage (subir a `cases/{caseId}/`, listar, URL firmada 1h, eliminar); `DocumentsSection` en el detalle del caso.
- `reports/` — `Dashboard` (tarjetas, alertas con link al caso, exportar) y `ExportService` (CSV/Excel con xlsx + file-saver, encabezados en español).

`src/types/index.ts` centraliza tipos de dominio: `Case`, `Activity`, `CaseStatus` (unión en inglés + `CASE_STATUS_LABELS` en español), `ACTIVITY_TYPES`, `CREDITOR_OPTIONS`, `NewCase`/`NewActivity`. Acreedores y abogados se editan en `CREDITOR_OPTIONS` (types) y `LAWYER_OPTIONS` (`CaseFields.tsx`).

## Convenciones

- Textos de UI en español; código (identificadores, tipos) en inglés. Estados de caso: unión en inglés, label en español.
- Servicios como módulos de funciones exportadas (no clases), componentes como funciones con hooks.
- Servicios lanzan `Error` con mensaje en español; los componentes lo muestran vía `notify(..., 'error')` o `Alert`.

## Gotchas

- El campo `eslintConfig` de `package.json` es obligatorio; sin él el build falla con "Syntax error" en casts `as` de `.tsx` (el plugin ESLint de CRA parsea sin TypeScript).
- Un "Syntax error" en el build de CRA puede venir de ESLint y no de babel; aislar con `DISABLE_ESLINT_PLUGIN=true npm run build`.
- Cache de build en `node_modules/.cache`; borrarla si el build se comporta raro tras cambiar configuración.
- No agregar deps que importen módulos core de Node (p. ej. json2csv): webpack 5 no los polyfillea.
