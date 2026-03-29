# FoliiBuilder

Platformă SaaS pentru crearea de site-uri de prezentare. Utilizatorii aleg o temă, personalizează vizual în timp real, și descarcă site-ul gata de publicare.

## Arhitectură

```
FoliiBuilder.slnx                     ← Soluție .NET 10
├── src/FoliiBuilder.Web/             ← Proiect principal ASP.NET Core MVC
│   ├── Controllers/
│   │   ├── HomeController.cs         ← Landing page
│   │   ├── BuilderController.cs      ← Pagina builder
│   │   └── ApiController.cs          ← API endpoints (themes, preview, export)
│   ├── Models/
│   │   ├── ThemeDefinition.cs        ← Definiție temă + GlobalParams
│   │   ├── ModuleDefinition.cs       ← Definiție modul + parametri
│   │   ├── SiteConfiguration.cs      ← Config completă trimisă de builder
│   │   └── ContentModels.cs          ← Modele conținut (hero, servicii, meniu, etc.)
│   ├── Services/
│   │   ├── ThemeRegistry.cs          ← Registru teme și module (singleton)
│   │   ├── ContentGenerator.cs       ← Generare conținut fictiv per temă
│   │   ├── PreviewRenderer.cs        ← Generare HTML complet din config
│   │   └── ExportService.cs          ← Creare arhivă ZIP
│   ├── Views/
│   │   ├── Home/Index.cshtml         ← Landing page
│   │   ├── Builder/Index.cshtml      ← Builder interactiv
│   │   └── Shared/_Layout.cshtml     ← Layout comun
│   └── wwwroot/
│       ├── css/site.css              ← CSS platformă (landing)
│       ├── css/builder.css           ← CSS builder
│       └── js/builder.js             ← JS builder (state, preview, export)
├── tests/                            ← Playwright E2E tests
│   └── builder-customization.spec.js ← 24 teste: slidere, module, teme, export
└── (fișiere referință site existent) ← Site atelier auto original
```

## Comenzi

```bash
# Build
dotnet build src/FoliiBuilder.Web

# Run (development)
dotnet run --project src/FoliiBuilder.Web
# URL: http://localhost:5146

# Teste E2E (necesită server pornit sau se pornește automat)
npm test                    # headless
npm run test:headed         # cu browser vizibil
```

## Verificare

Înainte de a considera o sarcină completă, verifică:
- **Build**: `dotnet build src/FoliiBuilder.Web` — fără erori/warnings
- **E2E tests**: `npm test` — toate 24 testele trec
- **Manual spot-check**: dacă ai modificat UI, deschide `/builder` și verifică vizual

Când adaugi funcționalitate nouă, adaugă și teste Playwright corespunzătoare în `tests/`.

## Concepte cheie

### Teme
Definite în `ThemeRegistry.cs`. 8 teme: `cafenea`, `frizerie`, `restaurant`, `auto`, `firma`, `salon`, `magazin`, `medical`. Fiecare are module active implicit + parametri globali impliciți.

### Module
13 secțiuni toggleable: `nav`, `hero`, `about`, `services`, `gallery`, `menu`, `team`, `testimonials`, `pricing`, `faq`, `contact`, `footer`, `whatsapp`. Fiecare cu parametri proprii.

### Parametri globali
HSL-based: accent (hue+sat), fundal (hue+sat+lightness), text (lightness), borduri (alpha+radius), carduri (lightness), font (14 Google fonts), stil butoane (solid/outline/glass).

### Preview în timp real
1. Parametri globali → `postMessage` → CSS variables (instant)
2. Module/conținut → re-render complet via `POST /api/preview` cu debounce 400ms

### Export
`POST /api/export` → ZIP cu `index.html` self-contained.

## API Endpoints

| Method | Path | Descriere |
|--------|------|-----------|
| GET | `/api/themes` | Lista completă de teme |
| GET | `/api/themes/{id}` | Detalii temă |
| GET | `/api/modules` | Lista de module cu parametri |
| POST | `/api/content/generate` | Generează conținut fictiv |
| POST | `/api/preview` | Render HTML preview |
| POST | `/api/export` | Descarcă arhivă ZIP |

## Convenții

- **C#**: .NET 10, primary constructors, collection expressions, nullable reference types
- **CSS**: CSS variables pentru tematizare, no frameworks, responsive cu grid/flexbox
- **JS**: Vanilla JS, IIFE pattern, no frameworks, postMessage pentru comunicare cu iframe
- **Naming**: PascalCase (C#), camelCase (JS), kebab-case (CSS classes)
- **Servicii**: interfețe (I*) + implementări, injectate prin DI

## Ce să NU faci

- Nu adăuga frameworks JS (React, Vue, etc.) — proiectul e intentionat vanilla JS
- Nu modifica structura de CSS variables fără a actualiza și `builder.js` postMessage handler-ul din iframe
- Nu schimba portul 5146 fără a actualiza și `playwright.config.js`
- Checkbox-urile de module sunt vizual ascunse (custom toggle) — interacțiunea din teste trebuie făcută cu `force: true` sau via `evaluate`
- Nu adăuga dependințe npm la runtime — npm e doar pentru teste

## Extensibilitate

- **Temă nouă**: definiție în `ThemeRegistry.Themes` + conținut în `ContentGenerator`
- **Modul nou**: definiție în `ThemeRegistry.Modules` + renderer în `PreviewRenderer`
- **Parametru global nou**: `GlobalParams` + slider în `Builder/Index.cshtml` + CSS variable în `PreviewRenderer.BuildCss`
- **Parametru modul nou**: `ModuleDefinition.Parameters` + logică în renderer
