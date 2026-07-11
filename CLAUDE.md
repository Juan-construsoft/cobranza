# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este proyecto

Aplicación web interna para un despacho de abogados que gestiona cobranza de cartera vencida (contexto legal colombiano: tipos de identificación C.C./NIT, actividades procesales como "Auto Admisorio", "Medida Cautelar Decretada", etc.). React 17 + TypeScript con Create React App (`react-scripts` 4).

**Estado actual: es un andamiaje (scaffold) generado, nunca instalado ni ejecutado.** No hay `node_modules` ni lockfile, no es repositorio git, y el código tiene dependencias y archivos faltantes (ver "Problemas conocidos"). Antes de correr nada hay que ejecutar `npm install` y resolver esas brechas.

## Estructura: tres copias idénticas

El proyecto existe por triplicado — las tres carpetas tienen contenido byte-a-byte idéntico:

- `law-office-debt-management/` ← **copia canónica, trabajar SOLO aquí**
- `law-office-debt-management/law-office-debt-management/` (duplicado anidado)
- `law-office-debt-management/law-office-debt-management-1/` (duplicado)

No editar los duplicados; cualquier cambio debe hacerse en la copia raíz. Si el usuario lo pide, los duplicados pueden eliminarse sin pérdida.

## Comandos

Ejecutar desde `law-office-debt-management/`:

```
npm install        # requerido primero; no hay node_modules
npm start          # servidor de desarrollo CRA
npm run build      # build de producción
npm test           # tests en modo watch (Jest vía react-scripts)
npm test -- --testPathPattern=NombreArchivo   # un solo archivo de test
```

No hay linter configurado más allá del ESLint embebido en CRA. No existen tests escritos aún.

## Arquitectura

Organización por módulos de dominio bajo `src/modules/`, cada uno correspondiente a un módulo funcional del README:

- `cases/` — recepción y gestión de casos. `CaseService.ts` es la capa de datos: un array **en memoria** (sin persistencia; los datos se pierden al recargar). CRUD sobre la interfaz `Case`.
- `demands/` — generación de borradores de demanda. Sustituye placeholders `{{nombre_deudor}}`-style en plantillas de texto (`templates/sample-template.txt`) con datos del caso, y descarga como TXT.
- `tracking/` — historial de actividades y alertas de plazos. `AlertService.ts` marca alertas cuando `nextStepDeadline` está vencido o a ≤3 días; el envío de email es un stub (`console.log`).
- `reports/` — dashboard y exportación. `ExportService.ts` exporta a CSV (json2csv + file-saver) y Excel (xlsx).

`src/types/index.ts` centraliza los tipos de dominio (`Case`, `Activity`, `Report`) — las uniones literales ahí definen los valores válidos de negocio (tipos de garantía, tipos de actividad procesal, acreedores). Al agregar acreedores o tipos de actividad, se modifican esas uniones.

`src/components/` tiene componentes genéricos compartidos (Table, FileUpload, Notification). El ruteo está en `src/App.tsx` con react-router v5 (`Switch`/`component` props).

## Problemas conocidos (brechas del scaffold)

Cualquier intento de compilar fallará hasta resolver esto:

1. **Dependencias usadas pero ausentes de `package.json`**: `react-router-dom` (v5 por la sintaxis), `file-saver`, `json2csv`, `xlsx`.
2. **Archivos importados que no existen**: `DemandGenerator.tsx` importa `./DemandService` y `./TemplateSelector` — hay que crearlos.
3. **`ExportService.ts` usa `XLSX` sin importarlo.**
4. **Inconsistencias de campos**: `DemandGenerator` usa `caseData.amountOwed` pero el tipo `Case` define `initialAmount`; `AlertService` usa `caseItem.nextStepDueDate` pero el campo está en `Activity` como `nextStepDeadline`. Al tocar estos módulos, alinear con `src/types/index.ts`.
5. Varios componentes (`AlertService`, `DemandGenerator`) están escritos como JavaScript sin tipos dentro de archivos `.ts`/`.tsx` — `strict: true` en tsconfig los rechazará.

## Convenciones

- Textos de UI en español; código (identificadores, tipos) en inglés.
- Servicios como módulos de funciones exportadas (no clases), componentes como funciones con hooks.
