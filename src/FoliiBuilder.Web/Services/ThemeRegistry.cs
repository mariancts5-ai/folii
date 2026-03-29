using FoliiBuilder.Web.Models;

namespace FoliiBuilder.Web.Services;

public class ThemeRegistry : IThemeRegistry
{
    private static readonly string[] Fonts =
    [
        "Inter", "Space Grotesk", "Montserrat", "Raleway", "Barlow",
        "Playfair Display", "Nunito", "DM Sans", "Outfit", "Figtree",
        "Plus Jakarta Sans", "Sora", "Poppins", "Roboto"
    ];

    private static readonly List<ModuleDefinition> Modules =
    [
        new()
        {
            Id = "nav", Name = "Navigare", Description = "Bara de navigare principală",
            Icon = "fa-bars", AlwaysOn = true,
            Parameters = []
        },
        new()
        {
            Id = "hero", Name = "Hero", Description = "Secțiunea principală cu titlu și CTA",
            Icon = "fa-flag",
            Parameters =
            [
                new() { Id = "layout", Label = "Layout", Type = "select", DefaultValue = "centered",
                    Options = [new() { Value = "centered", Label = "Centrat" }, new() { Value = "split", Label = "Împărțit (text + imagine)" }] },
                new() { Id = "showSubtitle", Label = "Arată subtitlu", Type = "toggle", DefaultValue = true },
                new() { Id = "showCta", Label = "Arată butoane CTA", Type = "toggle", DefaultValue = true }
            ]
        },
        new()
        {
            Id = "about", Name = "Despre noi", Description = "Secțiune cu descrierea afacerii",
            Icon = "fa-info-circle",
            Parameters =
            [
                new() { Id = "showImage", Label = "Arată imagine", Type = "toggle", DefaultValue = true }
            ]
        },
        new()
        {
            Id = "services", Name = "Servicii", Description = "Carduri cu serviciile oferite",
            Icon = "fa-concierge-bell",
            Parameters =
            [
                new() { Id = "columns", Label = "Coloane", Type = "range", DefaultValue = 2, Min = 1, Max = 4 },
                new() { Id = "showPrices", Label = "Arată prețuri", Type = "toggle", DefaultValue = true },
                new() { Id = "showIcons", Label = "Arată iconițe", Type = "toggle", DefaultValue = true }
            ]
        },
        new()
        {
            Id = "gallery", Name = "Galerie", Description = "Galerie foto cu imagini",
            Icon = "fa-images",
            Parameters =
            [
                new() { Id = "columns", Label = "Coloane", Type = "range", DefaultValue = 3, Min = 2, Max = 4 },
                new() { Id = "showCaptions", Label = "Arată descrieri", Type = "toggle", DefaultValue = true }
            ]
        },
        new()
        {
            Id = "menu", Name = "Meniu / Produse", Description = "Lista de produse sau meniu",
            Icon = "fa-utensils",
            Parameters =
            [
                new() { Id = "showDescriptions", Label = "Arată descrieri", Type = "toggle", DefaultValue = true },
                new() { Id = "showPrices", Label = "Arată prețuri", Type = "toggle", DefaultValue = true },
                new() { Id = "groupByCategory", Label = "Grupează pe categorii", Type = "toggle", DefaultValue = true }
            ]
        },
        new()
        {
            Id = "team", Name = "Echipă", Description = "Membrii echipei",
            Icon = "fa-users",
            Parameters =
            [
                new() { Id = "columns", Label = "Coloane", Type = "range", DefaultValue = 3, Min = 2, Max = 4 },
                new() { Id = "showBio", Label = "Arată biografie", Type = "toggle", DefaultValue = true },
                new() { Id = "photoStyle", Label = "Stil foto", Type = "select", DefaultValue = "circle",
                    Options = [new() { Value = "circle", Label = "Cerc" }, new() { Value = "square", Label = "Pătrat" }] }
            ]
        },
        new()
        {
            Id = "testimonials", Name = "Recenzii", Description = "Recenziile clienților",
            Icon = "fa-quote-right",
            Parameters =
            [
                new() { Id = "showRating", Label = "Arată rating (stele)", Type = "toggle", DefaultValue = true }
            ]
        },
        new()
        {
            Id = "pricing", Name = "Prețuri", Description = "Tabele de prețuri",
            Icon = "fa-tags",
            Parameters =
            [
                new() { Id = "columns", Label = "Coloane", Type = "range", DefaultValue = 3, Min = 2, Max = 3 },
                new() { Id = "highlightPopular", Label = "Evidențiază planul popular", Type = "toggle", DefaultValue = true }
            ]
        },
        new()
        {
            Id = "faq", Name = "Întrebări frecvente", Description = "Secțiune FAQ",
            Icon = "fa-question-circle",
            Parameters =
            [
                new() { Id = "style", Label = "Stil", Type = "select", DefaultValue = "accordion",
                    Options = [new() { Value = "accordion", Label = "Acordeon" }, new() { Value = "list", Label = "Listă" }] }
            ]
        },
        new()
        {
            Id = "contact", Name = "Contact", Description = "Informații de contact și hartă",
            Icon = "fa-envelope",
            Parameters =
            [
                new() { Id = "showMap", Label = "Arată harta", Type = "toggle", DefaultValue = true },
                new() { Id = "showPhone", Label = "Arată telefon", Type = "toggle", DefaultValue = true },
                new() { Id = "showEmail", Label = "Arată email", Type = "toggle", DefaultValue = true }
            ]
        },
        new()
        {
            Id = "footer", Name = "Footer", Description = "Subsolul paginii",
            Icon = "fa-grip-lines", AlwaysOn = true,
            Parameters = []
        },
        new()
        {
            Id = "whatsapp", Name = "Buton WhatsApp", Description = "Buton flotant WhatsApp",
            Icon = "fa-brands fa-whatsapp",
            Parameters =
            [
                new() { Id = "position", Label = "Poziție", Type = "select", DefaultValue = "right",
                    Options = [new() { Value = "left", Label = "Stânga" }, new() { Value = "right", Label = "Dreapta" }] }
            ]
        }
    ];

    private static readonly List<ThemeDefinition> Themes =
    [
        new()
        {
            Id = "cafenea", Name = "Cafenea", Description = "Perfectă pentru cafenele și ceainării",
            Icon = "fa-mug-hot",
            DefaultModules = ["nav", "hero", "about", "menu", "gallery", "testimonials", "contact", "footer", "whatsapp"],
            DefaultGlobalParams = new() { AccentHue = 30, AccentSat = 70, BgHue = 30, BgSat = 20, BgLightness = 5, FontFamily = "Playfair Display", ButtonStyle = "solid" }
        },
        new()
        {
            Id = "frizerie", Name = "Frizerie / Barbershop", Description = "Stil modern pentru frizerii",
            Icon = "fa-scissors",
            DefaultModules = ["nav", "hero", "services", "gallery", "team", "pricing", "contact", "footer", "whatsapp"],
            DefaultGlobalParams = new() { AccentHue = 210, AccentSat = 50, BgHue = 210, BgSat = 30, BgLightness = 5, FontFamily = "Space Grotesk", ButtonStyle = "outline" }
        },
        new()
        {
            Id = "restaurant", Name = "Restaurant", Description = "Elegant, pentru restaurante și bistro-uri",
            Icon = "fa-utensils",
            DefaultModules = ["nav", "hero", "about", "menu", "gallery", "testimonials", "contact", "footer", "whatsapp"],
            DefaultGlobalParams = new() { AccentHue = 350, AccentSat = 55, BgHue = 350, BgSat = 15, BgLightness = 5, FontFamily = "Playfair Display", ButtonStyle = "glass" }
        },
        new()
        {
            Id = "auto", Name = "Atelier Auto", Description = "Pentru service-uri auto și detailing",
            Icon = "fa-car",
            DefaultModules = ["nav", "hero", "services", "gallery", "about", "contact", "footer", "whatsapp"],
            DefaultGlobalParams = new() { AccentHue = 42, AccentSat = 61, BgHue = 222, BgSat = 58, BgLightness = 5, FontFamily = "Inter", ButtonStyle = "outline" }
        },
        new()
        {
            Id = "firma", Name = "Firmă / Corporate", Description = "Profesional, pentru firme IT și consultanță",
            Icon = "fa-building",
            DefaultModules = ["nav", "hero", "about", "services", "team", "testimonials", "faq", "contact", "footer"],
            DefaultGlobalParams = new() { AccentHue = 220, AccentSat = 70, BgHue = 225, BgSat = 35, BgLightness = 5, FontFamily = "DM Sans", ButtonStyle = "solid" }
        },
        new()
        {
            Id = "salon", Name = "Salon Înfrumusețare", Description = "Delicat, pentru saloane beauty",
            Icon = "fa-spa",
            DefaultModules = ["nav", "hero", "services", "gallery", "team", "pricing", "testimonials", "contact", "footer", "whatsapp"],
            DefaultGlobalParams = new() { AccentHue = 330, AccentSat = 55, BgHue = 280, BgSat = 20, BgLightness = 5, FontFamily = "Raleway", ButtonStyle = "glass" }
        },
        new()
        {
            Id = "magazin", Name = "Magazin / Showroom", Description = "Vitrina ideală pentru produse",
            Icon = "fa-store",
            DefaultModules = ["nav", "hero", "menu", "gallery", "about", "faq", "contact", "footer", "whatsapp"],
            DefaultGlobalParams = new() { AccentHue = 160, AccentSat = 60, BgHue = 200, BgSat = 25, BgLightness = 5, FontFamily = "Outfit", ButtonStyle = "solid" }
        },
        new()
        {
            Id = "medical", Name = "Cabinet Medical", Description = "Profesional, pentru cabinete și clinici",
            Icon = "fa-stethoscope",
            DefaultModules = ["nav", "hero", "about", "services", "team", "faq", "contact", "footer"],
            DefaultGlobalParams = new() { AccentHue = 180, AccentSat = 45, BgHue = 200, BgSat = 20, BgLightness = 5, FontFamily = "Nunito", ButtonStyle = "solid" }
        }
    ];

    public IReadOnlyList<ThemeDefinition> GetAllThemes() => Themes;
    public ThemeDefinition? GetTheme(string themeId) => Themes.Find(t => t.Id == themeId);
    public IReadOnlyList<ModuleDefinition> GetAllModules() => Modules;
    public ModuleDefinition? GetModule(string moduleId) => Modules.Find(m => m.Id == moduleId);
    public IReadOnlyList<string> GetAvailableFonts() => Fonts;
}
