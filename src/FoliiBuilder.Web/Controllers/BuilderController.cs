using Microsoft.AspNetCore.Mvc;
using FoliiBuilder.Web.Services;

namespace FoliiBuilder.Web.Controllers;

public class BuilderController(IThemeRegistry themeRegistry) : Controller
{
    public IActionResult Index(string? theme)
    {
        ViewBag.Themes = themeRegistry.GetAllThemes();
        ViewBag.Modules = themeRegistry.GetAllModules();
        ViewBag.Fonts = themeRegistry.GetAvailableFonts();
        ViewBag.SelectedTheme = theme ?? "cafenea";
        return View();
    }
}
