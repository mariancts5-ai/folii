using System.IO.Compression;
using System.Text;
using FoliiBuilder.Web.Models;

namespace FoliiBuilder.Web.Services;

public class ExportService(IPreviewRenderer previewRenderer) : IExportService
{
    public byte[] GenerateArchive(SiteConfiguration config)
    {
        var html = previewRenderer.RenderInline(config);
        var siteName = config.Content.CompanyName.Replace(" ", "-").ToLowerInvariant();

        using var ms = new MemoryStream();
        using (var archive = new ZipArchive(ms, ZipArchiveMode.Create, leaveOpen: true))
        {
            // Main HTML file
            AddEntry(archive, "index.html", html);

            // README with basic instructions
            AddEntry(archive, "README.txt", $"""
                {config.Content.CompanyName} — Site de prezentare
                ================================================

                Generat cu FoliiBuilder.

                Fișiere:
                  index.html — Pagina principală (tot site-ul într-un singur fișier)

                Cum folosești:
                  1. Deschide index.html în browser
                  2. Încarcă fișierele pe un hosting (Netlify, Vercel, sau orice hosting static)
                  3. Înlocuiește imaginile placeholder cu imaginile tale reale

                Fonturi și iconițe sunt încărcate de pe Google Fonts și Font Awesome CDN.
                """);
        }

        return ms.ToArray();
    }

    private static void AddEntry(ZipArchive archive, string path, string content)
    {
        var entry = archive.CreateEntry(path, CompressionLevel.Optimal);
        using var writer = new StreamWriter(entry.Open(), Encoding.UTF8);
        writer.Write(content);
    }
}
