using FoliiBuilder.Web.Models;

namespace FoliiBuilder.Web.Services;

/// <summary>
/// Generates a downloadable ZIP archive containing the user's customized site.
/// </summary>
public interface IExportService
{
    byte[] GenerateArchive(SiteConfiguration config);
}
