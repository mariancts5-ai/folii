using Microsoft.AspNetCore.Mvc;
using FoliiBuilder.Web.Models;
using FoliiBuilder.Web.Services;

namespace FoliiBuilder.Web.Controllers;

[Route("api")]
[ApiController]
public class ApiController(
    IThemeRegistry themeRegistry,
    IContentGenerator contentGenerator,
    IPreviewRenderer previewRenderer,
    IExportService exportService) : ControllerBase
{
    /// <summary>GET /api/themes — all theme definitions</summary>
    [HttpGet("themes")]
    public IActionResult GetThemes()
    {
        return Ok(themeRegistry.GetAllThemes());
    }

    /// <summary>GET /api/themes/{id} — single theme with defaults</summary>
    [HttpGet("themes/{id}")]
    public IActionResult GetTheme(string id)
    {
        var theme = themeRegistry.GetTheme(id);
        if (theme == null) return NotFound();
        return Ok(theme);
    }

    /// <summary>GET /api/modules — all module definitions</summary>
    [HttpGet("modules")]
    public IActionResult GetModules()
    {
        return Ok(themeRegistry.GetAllModules());
    }

    /// <summary>POST /api/content/generate — generate content for a theme</summary>
    [HttpPost("content/generate")]
    public IActionResult GenerateContent([FromBody] GenerateContentRequest request)
    {
        var content = contentGenerator.Generate(request.ThemeId);
        return Ok(content);
    }

    /// <summary>POST /api/preview — render the preview HTML</summary>
    [HttpPost("preview")]
    public IActionResult RenderPreview([FromBody] SiteConfiguration config)
    {
        var html = previewRenderer.RenderInline(config);
        return Content(html, "text/html");
    }

    /// <summary>POST /api/export — download the site as a ZIP archive</summary>
    [HttpPost("export")]
    public IActionResult Export([FromBody] SiteConfiguration config)
    {
        var zip = exportService.GenerateArchive(config);
        var filename = (config.Content.CompanyName ?? "site").Replace(" ", "-").ToLowerInvariant() + ".zip";
        return File(zip, "application/zip", filename);
    }
}

public class GenerateContentRequest
{
    public string ThemeId { get; set; } = "";
}
