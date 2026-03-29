using FoliiBuilder.Web.Models;

namespace FoliiBuilder.Web.Services;

/// <summary>
/// Renders a complete HTML page from a site configuration.
/// Used for both live preview (iframe) and export.
/// </summary>
public interface IPreviewRenderer
{
    /// <summary>Renders a self-contained HTML document with inline CSS and JS.</summary>
    string RenderInline(SiteConfiguration config);
}
