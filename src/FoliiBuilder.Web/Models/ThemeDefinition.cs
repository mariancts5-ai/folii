namespace FoliiBuilder.Web.Models;

/// <summary>
/// Defines a site theme/niche (e.g., coffee shop, barber, restaurant).
/// Each theme has default modules, global params, and content suggestions.
/// </summary>
public class ThemeDefinition
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Icon { get; set; } = ""; // Font Awesome class
    public string[] DefaultModules { get; set; } = [];
    public GlobalParams DefaultGlobalParams { get; set; } = new();
}

/// <summary>
/// Global visual parameters applied across the entire site.
/// Inspired by HSL-based theming from the reference auto workshop site.
/// </summary>
public class GlobalParams
{
    // Accent color
    public int AccentHue { get; set; } = 35;
    public int AccentSat { get; set; } = 70;

    // Background
    public int BgHue { get; set; } = 222;
    public int BgSat { get; set; } = 40;
    public int BgLightness { get; set; } = 5;

    // Text & borders
    public int TextLightness { get; set; } = 90;
    public int BorderAlpha { get; set; } = 15;

    // Cards
    public int CardLightness { get; set; } = 9;

    // Style
    public int BorderRadius { get; set; } = 10;
    public string FontFamily { get; set; } = "Inter";
    public string ButtonStyle { get; set; } = "outline"; // solid, outline, glass
}
