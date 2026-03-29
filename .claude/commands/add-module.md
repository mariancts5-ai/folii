Adaugă un modul nou în FoliiBuilder.

Argumentul este numele modulului (ex: `/add-module blog`).

Pași:
1. Adaugă definiția modulului în `ThemeRegistry.Modules` cu: Id, Name, Icon, parametri specifici
2. Adaugă renderer-ul în `PreviewRenderer` (metoda `RenderModule{Name}`)
3. Adaugă model de conținut dacă e necesar în `ContentModels.cs`
4. Adaugă conținut fictiv în `ContentGenerator` pentru toate temele existente
5. Verifică build-ul: `dotnet build src/FoliiBuilder.Web`
6. Testează vizual în builder
7. Adaugă teste Playwright pentru noul modul în `tests/builder-customization.spec.js`
8. Rulează `npm test`
