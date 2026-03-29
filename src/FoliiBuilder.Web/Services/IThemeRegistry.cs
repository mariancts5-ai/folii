using FoliiBuilder.Web.Models;

namespace FoliiBuilder.Web.Services;

/// <summary>
/// Registry of all available themes and modules.
/// </summary>
public interface IThemeRegistry
{
    IReadOnlyList<ThemeDefinition> GetAllThemes();
    ThemeDefinition? GetTheme(string themeId);
    IReadOnlyList<ModuleDefinition> GetAllModules();
    ModuleDefinition? GetModule(string moduleId);
    IReadOnlyList<string> GetAvailableFonts();
}
