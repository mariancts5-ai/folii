using FoliiBuilder.Web.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

// Register application services
builder.Services.AddSingleton<IThemeRegistry, ThemeRegistry>();
builder.Services.AddSingleton<IContentGenerator, ContentGenerator>();
builder.Services.AddTransient<IPreviewRenderer, PreviewRenderer>();
builder.Services.AddTransient<IExportService, ExportService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}

app.UseRouting();
app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();
