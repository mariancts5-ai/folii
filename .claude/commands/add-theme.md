Adaugă o temă nouă în FoliiBuilder.

Argumentul este numele temei (ex: `/add-theme florarie`).

Pași:
1. Adaugă definiția temei în `ThemeRegistry.Themes` cu: Id, Name, Description, Icon (FontAwesome), DefaultModules, DefaultGlobalParams
2. Adaugă conținut pentru temă în `ContentGenerator` (texte relevante pentru domeniu, servicii, FAQ, etc.)
3. Verifică build-ul: `dotnet build src/FoliiBuilder.Web`
4. Pornește serverul și testează: selectează tema din builder, verifică că preview-ul se renderizează corect
5. Rulează testele E2E: `npm test`
