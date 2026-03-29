using FoliiBuilder.Web.Models;

namespace FoliiBuilder.Web.Services;

/// <summary>
/// Generates realistic placeholder content based on theme type.
/// </summary>
public interface IContentGenerator
{
    SiteContent Generate(string themeId);
}
