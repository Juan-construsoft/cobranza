# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este proyecto

Aplicación web interna para un despacho de abogados que gestiona cobranza de cartera vencida (contexto legal colombiano: tipos de identificación C.C./NIT, actividades procesales como "Auto Admisorio", "Medida Cautelar Decretada", etc.). React 17 + TypeScript con Create React App (`react-scripts` 4).

El proyecto vive en la raíz del repositorio (`src/`, `package.json`). Compila limpio: `npm run build` y `npx tsc --noEmit` pasan con `strict: true`.

## Comandos

```
npm install        # primera vez; hay package-lock.json
npm start          # servidor de desarrollo CRA
npm run build      # build de producción
npm test           # tests en modo watch (Jest vía react-scripts)
npm test -- --testPathPattern=NombreArchivo   # un solo archivo de test
npx tsc --noEmit   # typecheck estricto sin compilar
```

Los scripts usan `cross-env NODE_OPTIONS=--openssl-legacy-provider` porque webpack 4 (react-scripts 4) no funciona con el OpenSSL de Node moderno sin ese flag.

No hay linter configurado más allá del ESLint embebido en CRA. No existen tests escritos aún.

## Gotchas de build (CRA 4)

- El campo `eslintConfig` de `package.json` (`extends: ["react-app", "react-app/jest"]`) es **obligatorio**. Sin él, eslint-webpack-plugin usa solo `eslint-config-react-app/base`, que parsea `.tsx` con `babel-eslint` (sin TypeScript) y el build falla con `Syntax error: Unexpected token` en casts `as`.
- Un "Syntax error" en el build de CRA puede venir de ESLint y no de babel-loader; para aislar, probar con `DISABLE_ESLINT_PLUGIN=true npm run build`.
- Cache de build en `node_modules/.cache`; borrarla si el build se comporta raro tras cambiar configuración.

## Arquitectura

Organización por módulos de dominio bajo `src/modules/`, cada uno correspondiente a un módulo funcional del README:

- `cases/` — recepción y gestión de casos. `CaseService.ts` es la capa de datos: un array **en memoria** (sin persistencia; los datos se pierden al recargar). CRUD sobre la interfaz `Case`.
- `demands/` — generación de borradores de demanda. `DemandService.ts` sustituye placeholders `{{nombre_deudor}}`-style en plantillas de texto con datos del caso; `TemplateSelector.tsx` elige plantilla y `DemandGenerator.tsx` descarga el borrador como TXT.
- `tracking/` — historial de actividades y alertas de plazos. `AlertService.ts` marca alertas cuando `nextStepDeadline` está vencido o a ≤3 días; el envío de email es un stub (`console.log`).
- `reports/` — dashboard y exportación. `ExportService.ts` exporta a CSV (json2csv + file-saver) y Excel (xlsx).

`src/types/index.ts` centraliza los tipos de dominio (`Case`, `Activity`, `Report`) — las uniones literales ahí definen los valores válidos de negocio (tipos de garantía, tipos de actividad procesal, acreedores). Al agregar acreedores o tipos de actividad, se modifican esas uniones.

`src/components/` tiene componentes genéricos compartidos (Table, FileUpload, Notification). El ruteo está en `src/App.tsx` con react-router v5 (`Switch`/`component` props).

## Convenciones

- Textos de UI en español; código (identificadores, tipos) en inglés.
- Servicios como módulos de funciones exportadas (no clases), componentes como funciones con hooks.
