using Microsoft.AspNetCore.Mvc;
using FoliiBuilder.Web.Services;

namespace FoliiBuilder.Web.Controllers;

public class HomeController(IThemeRegistry themeRegistry) : Controller
{
    public IActionResult Index()
    {
        ViewBag.Themes = themeRegistry.GetAllThemes();
        return View();
    }
}
