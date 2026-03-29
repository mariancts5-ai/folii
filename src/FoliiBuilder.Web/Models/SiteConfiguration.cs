namespace FoliiBuilder.Web.Models;

/// <summary>
/// Complete configuration for a user's site, sent from the builder UI.
/// Contains the selected theme, global params, enabled modules, module params, and content.
/// </summary>
public class SiteConfiguration
{
    public string ThemeId { get; set; } = "";
    public GlobalParams GlobalParams { get; set; } = new();
    public string[] EnabledModules { get; set; } = [];
    public Dictionary<string, Dictionary<string, object>> ModuleParams { get; set; } = new();
    public SiteContent Content { get; set; } = new();
}
