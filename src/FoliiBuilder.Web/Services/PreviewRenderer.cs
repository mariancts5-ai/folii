using System.Text;
using System.Text.Json;
using FoliiBuilder.Web.Models;

namespace FoliiBuilder.Web.Services;

/// <summary>
/// Generates a complete, self-contained HTML page from a SiteConfiguration.
/// The output is designed for iframe preview and static export.
/// </summary>
public class PreviewRenderer : IPreviewRenderer
{
    public string RenderInline(SiteConfiguration config)
    {
        var sb = new StringBuilder();
        var p = config.GlobalParams;
        var c = config.Content;
        var enabled = new HashSet<string>(config.EnabledModules);
        var mp = config.ModuleParams;

        sb.AppendLine("<!DOCTYPE html>");
        sb.AppendLine("<html lang=\"ro\">");
        sb.AppendLine("<head>");
        sb.AppendLine("<meta charset=\"UTF-8\">");
        sb.AppendLine("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
        sb.AppendLine($"<title>{Esc(c.CompanyName)}</title>");
        sb.AppendLine($"<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">");
        sb.AppendLine($"<link href=\"https://fonts.googleapis.com/css2?family={Uri.EscapeDataString(p.FontFamily)}:wght@300;400;500;600;700&display=swap\" rel=\"stylesheet\">");
        sb.AppendLine("<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css\">");
        sb.AppendLine("<style>");
        sb.AppendLine(BuildCss(p));
        sb.AppendLine("</style>");
        sb.AppendLine("</head>");
        sb.AppendLine("<body>");

        // Render modules in order
        foreach (var moduleId in config.EnabledModules)
        {
            var moduleParams = mp.TryGetValue(moduleId, out var v) ? v : new Dictionary<string, object>();
            sb.AppendLine(moduleId switch
            {
                "nav" => RenderNav(c),
                "hero" => RenderHero(c, p, moduleParams),
                "about" => RenderAbout(c, moduleParams),
                "services" => RenderServices(c, moduleParams),
                "gallery" => RenderGallery(c, moduleParams),
                "menu" => RenderMenu(c, moduleParams),
                "team" => RenderTeam(c, moduleParams),
                "testimonials" => RenderTestimonials(c, moduleParams),
                "pricing" => RenderPricing(c, moduleParams),
                "faq" => RenderFaq(c, moduleParams),
                "contact" => RenderContact(c, moduleParams),
                "footer" => RenderFooter(c),
                "whatsapp" => RenderWhatsApp(c, moduleParams),
                _ => ""
            });
        }

        sb.AppendLine(BuildScript(config));
        sb.AppendLine("</body>");
        sb.AppendLine("</html>");
        return sb.ToString();
    }

    // --- Module renderers ---

    private static string RenderNav(SiteContent c) => $@"
<nav class=""nav"" id=""module-nav"">
  <div class=""nav-inner"">
    <a href=""#"" class=""nav-logo"">{Esc(c.CompanyName)}</a>
    <button class=""nav-toggle"" aria-label=""Meniu"" onclick=""document.body.classList.toggle('menu-open')"">
      <i class=""fas fa-bars""></i>
    </button>
    <div class=""nav-links"">
      <a href=""#hero"">Acasă</a>
      <a href=""#about"">Despre</a>
      <a href=""#services"">Servicii</a>
      <a href=""#gallery"">Galerie</a>
      <a href=""#contact"">Contact</a>
    </div>
  </div>
</nav>
<div class=""mobile-menu"" id=""mobile-menu"">
  <button class=""mobile-close"" onclick=""document.body.classList.remove('menu-open')""><i class=""fas fa-times""></i></button>
  <a href=""#hero"" onclick=""document.body.classList.remove('menu-open')"">Acasă</a>
  <a href=""#about"" onclick=""document.body.classList.remove('menu-open')"">Despre</a>
  <a href=""#services"" onclick=""document.body.classList.remove('menu-open')"">Servicii</a>
  <a href=""#gallery"" onclick=""document.body.classList.remove('menu-open')"">Galerie</a>
  <a href=""#contact"" onclick=""document.body.classList.remove('menu-open')"">Contact</a>
</div>";

    private static string RenderHero(SiteContent c, GlobalParams p, Dictionary<string, object> mp)
    {
        var layout = GetParam(mp, "layout", "centered");
        var showSub = GetParamBool(mp, "showSubtitle", true);
        var showCta = GetParamBool(mp, "showCta", true);

        var subtitle = showSub ? $@"<p class=""hero-tag"">{Esc(c.Hero.Subtitle)}</p>" : "";
        var cta = showCta ? $@"
      <div class=""hero-cta"">
        <a href=""tel:{Esc(c.Hero.Phone)}"" class=""btn btn-primary"">{Esc(c.Hero.CtaPrimary)}</a>
        <a href=""#contact"" class=""btn btn-secondary"">{Esc(c.Hero.CtaSecondary)}</a>
      </div>" : "";

        return $@"
<section class=""hero hero--{layout}"" id=""module-hero"">
  <div class=""hero-content reveal"">
    {subtitle}
    <h1 class=""hero-title"">{Esc(c.Hero.Title)}</h1>
    <p class=""hero-desc"">{Esc(c.Hero.Description)}</p>
    {cta}
  </div>
</section>";
    }

    private static string RenderAbout(SiteContent c, Dictionary<string, object> mp)
    {
        var showImage = GetParamBool(mp, "showImage", true);
        var imageBlock = showImage
            ? @"<div class=""about-image""><div class=""about-image-placeholder""><i class=""fas fa-image""></i></div></div>"
            : "";
        return $@"
<section class=""section about"" id=""module-about"">
  <div class=""section-inner"">
    <div class=""about-grid {(showImage ? "" : "about-grid--full")}"">
      <div class=""about-text reveal"">
        <p class=""section-label"">Despre noi</p>
        <h2 class=""section-title"">{Esc(c.About.Title)}</h2>
        <p>{Esc(c.About.Text)}</p>
      </div>
      {imageBlock}
    </div>
  </div>
</section>";
    }

    private static string RenderServices(SiteContent c, Dictionary<string, object> mp)
    {
        var cols = GetParamInt(mp, "columns", 2);
        var showPrices = GetParamBool(mp, "showPrices", true);
        var showIcons = GetParamBool(mp, "showIcons", true);

        var cards = new StringBuilder();
        foreach (var s in c.Services)
        {
            var icon = showIcons ? $@"<div class=""service-icon""><i class=""fas {Esc(s.Icon)}""></i></div>" : "";
            var price = showPrices ? $@"<span class=""service-price"">{Esc(s.Price)}</span>" : "";
            cards.AppendLine($@"
      <div class=""service-card reveal"">
        {icon}
        <h3>{Esc(s.Name)}</h3>
        <p>{Esc(s.Description)}</p>
        {price}
      </div>");
        }

        return $@"
<section class=""section services"" id=""module-services"">
  <div class=""section-inner"">
    <p class=""section-label"">Servicii</p>
    <h2 class=""section-title"">Ce oferim</h2>
    <div class=""services-grid cols-{cols}"">
      {cards}
    </div>
  </div>
</section>";
    }

    private static string RenderGallery(SiteContent c, Dictionary<string, object> mp)
    {
        var cols = GetParamInt(mp, "columns", 3);
        var showCaptions = GetParamBool(mp, "showCaptions", true);

        var items = new StringBuilder();
        foreach (var g in c.Gallery)
        {
            var wideCls = g.Wide ? " gallery-item--wide" : "";
            var caption = showCaptions ? $@"<div class=""gallery-caption"">{Esc(g.Caption)}</div>" : "";
            items.AppendLine($@"
      <div class=""gallery-item{wideCls}"" style=""background-color:{Esc(g.Color)}"">
        <div class=""gallery-placeholder""><i class=""fas fa-camera""></i><span>{Esc(g.Caption)}</span></div>
        {caption}
      </div>");
        }

        return $@"
<section class=""section gallery"" id=""module-gallery"">
  <div class=""section-inner"">
    <p class=""section-label"">Galerie</p>
    <h2 class=""section-title"">Portofoliu</h2>
    <div class=""gallery-grid cols-{cols}"">
      {items}
    </div>
  </div>
</section>";
    }

    private static string RenderMenu(SiteContent c, Dictionary<string, object> mp)
    {
        var showDesc = GetParamBool(mp, "showDescriptions", true);
        var showPrices = GetParamBool(mp, "showPrices", true);
        var groupBy = GetParamBool(mp, "groupByCategory", true);

        var sb = new StringBuilder();
        if (groupBy)
        {
            var groups = c.Menu.GroupBy(m => m.Category);
            foreach (var group in groups)
            {
                sb.AppendLine($@"<div class=""menu-category reveal""><h3>{Esc(group.Key)}</h3>");
                foreach (var item in group)
                {
                    var desc = showDesc ? $@"<span class=""menu-desc"">{Esc(item.Description)}</span>" : "";
                    var price = showPrices ? $@"<span class=""menu-price"">{Esc(item.Price)}</span>" : "";
                    sb.AppendLine($@"
        <div class=""menu-item"">
          <div class=""menu-item-info""><span class=""menu-name"">{Esc(item.Name)}</span>{desc}</div>
          {price}
        </div>");
                }
                sb.AppendLine("</div>");
            }
        }
        else
        {
            foreach (var item in c.Menu)
            {
                var desc = showDesc ? $@"<span class=""menu-desc"">{Esc(item.Description)}</span>" : "";
                var price = showPrices ? $@"<span class=""menu-price"">{Esc(item.Price)}</span>" : "";
                sb.AppendLine($@"
      <div class=""menu-item reveal"">
        <div class=""menu-item-info""><span class=""menu-name"">{Esc(item.Name)}</span>{desc}</div>
        {price}
      </div>");
            }
        }

        return $@"
<section class=""section menu"" id=""module-menu"">
  <div class=""section-inner"">
    <p class=""section-label"">Meniu</p>
    <h2 class=""section-title"">Produsele noastre</h2>
    <div class=""menu-list"">
      {sb}
    </div>
  </div>
</section>";
    }

    private static string RenderTeam(SiteContent c, Dictionary<string, object> mp)
    {
        var cols = GetParamInt(mp, "columns", 3);
        var showBio = GetParamBool(mp, "showBio", true);
        var photoStyle = GetParam(mp, "photoStyle", "circle");

        var cards = new StringBuilder();
        foreach (var t in c.Team)
        {
            var bio = showBio ? $@"<p class=""team-bio"">{Esc(t.Bio)}</p>" : "";
            cards.AppendLine($@"
      <div class=""team-card reveal"">
        <div class=""team-photo team-photo--{photoStyle}"">{Esc(t.Initials)}</div>
        <h3>{Esc(t.Name)}</h3>
        <span class=""team-role"">{Esc(t.Role)}</span>
        {bio}
      </div>");
        }

        return $@"
<section class=""section team"" id=""module-team"">
  <div class=""section-inner"">
    <p class=""section-label"">Echipa</p>
    <h2 class=""section-title"">Cine suntem</h2>
    <div class=""team-grid cols-{cols}"">
      {cards}
    </div>
  </div>
</section>";
    }

    private static string RenderTestimonials(SiteContent c, Dictionary<string, object> mp)
    {
        var showRating = GetParamBool(mp, "showRating", true);

        var cards = new StringBuilder();
        foreach (var t in c.Testimonials)
        {
            var stars = "";
            if (showRating)
            {
                var sb2 = new StringBuilder("<div class=\"testimonial-stars\">");
                for (int i = 0; i < t.Rating; i++) sb2.Append("<i class=\"fas fa-star\"></i>");
                for (int i = t.Rating; i < 5; i++) sb2.Append("<i class=\"far fa-star\"></i>");
                sb2.Append("</div>");
                stars = sb2.ToString();
            }
            cards.AppendLine($@"
      <div class=""testimonial-card reveal"">
        <i class=""fas fa-quote-left testimonial-quote""></i>
        <p>{Esc(t.Text)}</p>
        {stars}
        <span class=""testimonial-author"">— {Esc(t.Author)}</span>
      </div>");
        }

        return $@"
<section class=""section testimonials"" id=""module-testimonials"">
  <div class=""section-inner"">
    <p class=""section-label"">Recenzii</p>
    <h2 class=""section-title"">Ce spun clienții</h2>
    <div class=""testimonials-grid"">
      {cards}
    </div>
  </div>
</section>";
    }

    private static string RenderPricing(SiteContent c, Dictionary<string, object> mp)
    {
        var cols = GetParamInt(mp, "columns", 3);
        var highlight = GetParamBool(mp, "highlightPopular", true);

        var cards = new StringBuilder();
        foreach (var plan in c.Pricing)
        {
            var hlClass = (plan.Highlighted && highlight) ? " pricing-card--highlighted" : "";
            var features = new StringBuilder();
            foreach (var f in plan.Features)
                features.AppendLine($"<li><i class=\"fas fa-check\"></i> {Esc(f)}</li>");

            cards.AppendLine($@"
      <div class=""pricing-card{hlClass} reveal"">
        <h3>{Esc(plan.Name)}</h3>
        <div class=""pricing-price"">{Esc(plan.Price)} <span>{Esc(plan.Period)}</span></div>
        <ul>{features}</ul>
        <a href=""#contact"" class=""btn btn-primary"">Alege</a>
      </div>");
        }

        return $@"
<section class=""section pricing"" id=""module-pricing"">
  <div class=""section-inner"">
    <p class=""section-label"">Prețuri</p>
    <h2 class=""section-title"">Pachete & Tarife</h2>
    <div class=""pricing-grid cols-{cols}"">
      {cards}
    </div>
  </div>
</section>";
    }

    private static string RenderFaq(SiteContent c, Dictionary<string, object> mp)
    {
        var style = GetParam(mp, "style", "accordion");

        var items = new StringBuilder();
        foreach (var f in c.Faq)
        {
            items.AppendLine($@"
      <div class=""faq-item reveal"" onclick=""this.classList.toggle('open')"">
        <div class=""faq-question"">
          <span>{Esc(f.Question)}</span>
          <i class=""fas fa-chevron-down""></i>
        </div>
        <div class=""faq-answer""><p>{Esc(f.Answer)}</p></div>
      </div>");
        }

        return $@"
<section class=""section faq"" id=""module-faq"">
  <div class=""section-inner"">
    <p class=""section-label"">FAQ</p>
    <h2 class=""section-title"">Întrebări frecvente</h2>
    <div class=""faq-list faq--{style}"">
      {items}
    </div>
  </div>
</section>";
    }

    private static string RenderContact(SiteContent c, Dictionary<string, object> mp)
    {
        var showMap = GetParamBool(mp, "showMap", true);
        var showPhone = GetParamBool(mp, "showPhone", true);
        var showEmail = GetParamBool(mp, "showEmail", true);

        var phone = showPhone ? $@"<div class=""contact-item""><i class=""fas fa-phone""></i><span>{Esc(c.Contact.Phone)}</span></div>" : "";
        var email = showEmail ? $@"<div class=""contact-item""><i class=""fas fa-envelope""></i><span>{Esc(c.Contact.Email)}</span></div>" : "";
        var map = showMap ? @"<div class=""contact-map""><div class=""map-placeholder""><i class=""fas fa-map-marked-alt""></i><span>Harta va fi afișată aici</span></div></div>" : "";

        return $@"
<section class=""section contact"" id=""module-contact"">
  <div class=""section-inner"">
    <p class=""section-label"">Contact</p>
    <h2 class=""section-title"">Ia legătura cu noi</h2>
    <div class=""contact-grid"">
      <div class=""contact-info reveal"">
        {phone}
        {email}
        <div class=""contact-item""><i class=""fas fa-location-dot""></i><span>{Esc(c.Contact.Address)}</span></div>
        <div class=""contact-item""><i class=""fas fa-clock""></i><span>{Esc(c.Contact.Schedule)}</span></div>
      </div>
      {map}
    </div>
  </div>
</section>";
    }

    private static string RenderFooter(SiteContent c) => $@"
<footer class=""footer"" id=""module-footer"">
  <div class=""footer-inner"">
    <div class=""footer-grid"">
      <div class=""footer-col"">
        <h4>{Esc(c.CompanyName)}</h4>
        <p>{Esc(c.Footer.Description)}</p>
      </div>
      <div class=""footer-col"">
        <h4>Contact</h4>
        <p><i class=""fas fa-phone""></i> {Esc(c.Footer.Phone)}</p>
        <p><i class=""fas fa-envelope""></i> {Esc(c.Footer.Email)}</p>
        <p><i class=""fas fa-location-dot""></i> {Esc(c.Footer.Address)}</p>
      </div>
    </div>
    <div class=""footer-bottom"">
      <p>{Esc(c.Footer.Copyright)}</p>
    </div>
  </div>
</footer>";

    private static string RenderWhatsApp(SiteContent c, Dictionary<string, object> mp)
    {
        var position = GetParam(mp, "position", "right");
        var phone = c.Contact.Phone.Replace(" ", "");
        return $@"
<a href=""https://wa.me/4{Esc(phone)}"" target=""_blank"" class=""whatsapp-float whatsapp--{position}"" id=""module-whatsapp"" aria-label=""WhatsApp"">
  <i class=""fab fa-whatsapp""></i>
</a>";
    }

    // --- CSS Generation ---

    private static string BuildCss(GlobalParams p) => $@"
:root {{
  --accent-h: {p.AccentHue};
  --accent-s: {p.AccentSat}%;
  --bg-h: {p.BgHue};
  --bg-s: {p.BgSat}%;
  --bg-l: {p.BgLightness}%;
  --text-l: {p.TextLightness}%;
  --card-l: {p.CardLightness}%;
  --border-a: {p.BorderAlpha};
  --radius: {p.BorderRadius}px;
  --font: '{p.FontFamily}', sans-serif;
  --btn-style: {p.ButtonStyle};

  --bg: hsl(var(--bg-h), var(--bg-s), var(--bg-l));
  --accent: hsl(var(--accent-h), var(--accent-s), 55%);
  --accent-dim: hsla(var(--accent-h), var(--accent-s), 55%, 0.12);
  --accent-glow: hsla(var(--accent-h), var(--accent-s), 55%, 0.25);
  --text: hsl(0, 0%, var(--text-l));
  --text-sec: hsl(var(--bg-h), 15%, calc(var(--text-l) - 30%));
  --text-muted: hsl(var(--bg-h), 10%, calc(var(--text-l) - 50%));
  --card: hsl(var(--bg-h), var(--bg-s), var(--card-l));
  --surface: hsl(var(--bg-h), var(--bg-s), calc(var(--card-l) + 4%));
  --border: hsla(var(--accent-h), var(--accent-s), 50%, calc(var(--border-a) / 100));
}}

*, *::before, *::after {{ margin: 0; padding: 0; box-sizing: border-box; }}
html {{ scroll-behavior: smooth; }}
body {{ font-family: var(--font); background: var(--bg); color: var(--text); line-height: 1.7; overflow-x: hidden; }}
img {{ max-width: 100%; display: block; }}
a {{ color: var(--accent); text-decoration: none; }}

/* --- NAVIGATION --- */
.nav {{ position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: hsla(var(--bg-h), var(--bg-s), var(--bg-l), 0.85); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }}
.nav-inner {{ max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 64px; }}
.nav-logo {{ font-weight: 700; font-size: 1.2rem; color: var(--text); letter-spacing: -0.02em; }}
.nav-links {{ display: flex; gap: 2rem; }}
.nav-links a {{ color: var(--text-sec); font-size: 0.9rem; font-weight: 500; transition: color 0.3s; }}
.nav-links a:hover {{ color: var(--accent); }}
.nav-toggle {{ display: none; background: none; border: none; color: var(--text); font-size: 1.3rem; cursor: pointer; }}

/* --- MOBILE MENU --- */
.mobile-menu {{ position: fixed; inset: 0; z-index: 200; background: var(--bg); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; opacity: 0; pointer-events: none; transition: opacity 0.3s; }}
body.menu-open .mobile-menu {{ opacity: 1; pointer-events: all; }}
.mobile-menu a {{ color: var(--text); font-size: 1.4rem; font-weight: 600; }}
.mobile-close {{ position: absolute; top: 1.2rem; right: 1.5rem; background: none; border: none; color: var(--text); font-size: 1.5rem; cursor: pointer; }}

/* --- HERO --- */
.hero {{ min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 6rem 2rem 4rem; text-align: center; position: relative; }}
.hero--split {{ text-align: left; }}
.hero-content {{ max-width: 720px; }}
.hero-tag {{ color: var(--accent); font-size: 0.85rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1rem; }}
.hero-title {{ font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 700; line-height: 1.1; margin-bottom: 1.2rem; letter-spacing: -0.03em; }}
.hero-desc {{ font-size: 1.1rem; color: var(--text-sec); max-width: 560px; margin: 0 auto 2rem; line-height: 1.8; }}
.hero--split .hero-desc {{ margin: 0 0 2rem; }}

/* --- BUTTONS --- */
.hero-cta {{ display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }}
.hero--split .hero-cta {{ justify-content: flex-start; }}
.btn {{ display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.8rem 2rem; border-radius: var(--radius); font-weight: 600; font-size: 0.95rem; transition: all 0.3s; cursor: pointer; border: 2px solid transparent; text-decoration: none; }}
.btn-primary {{ background: var(--accent); color: hsl(var(--bg-h), var(--bg-s), 5%); border-color: var(--accent); }}
.btn-primary:hover {{ filter: brightness(1.15); transform: translateY(-2px); }}
.btn-secondary {{ background: transparent; color: var(--accent); border-color: var(--accent); }}
.btn-secondary:hover {{ background: var(--accent-dim); transform: translateY(-2px); }}

/* --- SECTIONS --- */
.section {{ padding: 5rem 2rem; }}
.section-inner {{ max-width: 1100px; margin: 0 auto; }}
.section-label {{ color: var(--accent); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.5rem; }}
.section-title {{ font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 700; margin-bottom: 2.5rem; letter-spacing: -0.02em; }}

/* --- ABOUT --- */
.about-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }}
.about-grid--full {{ grid-template-columns: 1fr; }}
.about-text p:not(.section-label):not(.section-title) {{ color: var(--text-sec); line-height: 1.9; }}
.about-image-placeholder {{ aspect-ratio: 4/3; background: var(--card); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 2.5rem; border: 1px solid var(--border); }}

/* --- SERVICES --- */
.services-grid {{ display: grid; gap: 1.5rem; }}
.services-grid.cols-1 {{ grid-template-columns: 1fr; }}
.services-grid.cols-2 {{ grid-template-columns: repeat(2, 1fr); }}
.services-grid.cols-3 {{ grid-template-columns: repeat(3, 1fr); }}
.services-grid.cols-4 {{ grid-template-columns: repeat(4, 1fr); }}
.service-card {{ background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem; transition: transform 0.3s, border-color 0.3s; }}
.service-card:hover {{ transform: translateY(-4px); border-color: var(--accent-glow); }}
.service-icon {{ width: 48px; height: 48px; border-radius: 12px; background: var(--accent-dim); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-bottom: 1rem; }}
.service-card h3 {{ font-size: 1.1rem; margin-bottom: 0.5rem; }}
.service-card p {{ color: var(--text-sec); font-size: 0.9rem; margin-bottom: 0.8rem; }}
.service-price {{ color: var(--accent); font-weight: 600; font-size: 0.9rem; }}

/* --- GALLERY --- */
.gallery-grid {{ display: grid; gap: 1rem; }}
.gallery-grid.cols-2 {{ grid-template-columns: repeat(2, 1fr); }}
.gallery-grid.cols-3 {{ grid-template-columns: repeat(3, 1fr); }}
.gallery-grid.cols-4 {{ grid-template-columns: repeat(4, 1fr); }}
.gallery-item {{ position: relative; aspect-ratio: 4/3; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); }}
.gallery-item--wide {{ grid-column: span 2; }}
.gallery-placeholder {{ position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.85rem; }}
.gallery-placeholder i {{ font-size: 2rem; }}
.gallery-caption {{ position: absolute; bottom: 0; left: 0; right: 0; padding: 1rem; background: linear-gradient(transparent, hsla(var(--bg-h), var(--bg-s), 3%, 0.9)); color: var(--text); font-size: 0.85rem; font-weight: 500; }}

/* --- MENU / PRODUCTS --- */
.menu-list {{ max-width: 700px; margin: 0 auto; }}
.menu-category h3 {{ color: var(--accent); font-size: 1.1rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border); margin-top: 2rem; }}
.menu-category:first-child h3 {{ margin-top: 0; }}
.menu-item {{ display: flex; justify-content: space-between; align-items: flex-start; padding: 0.8rem 0; border-bottom: 1px dashed hsla(var(--accent-h), 10%, 50%, 0.1); }}
.menu-item-info {{ flex: 1; }}
.menu-name {{ font-weight: 600; }}
.menu-desc {{ display: block; color: var(--text-sec); font-size: 0.85rem; margin-top: 0.2rem; }}
.menu-price {{ color: var(--accent); font-weight: 700; white-space: nowrap; margin-left: 1.5rem; }}

/* --- TEAM --- */
.team-grid {{ display: grid; gap: 1.5rem; }}
.team-grid.cols-2 {{ grid-template-columns: repeat(2, 1fr); }}
.team-grid.cols-3 {{ grid-template-columns: repeat(3, 1fr); }}
.team-grid.cols-4 {{ grid-template-columns: repeat(4, 1fr); }}
.team-card {{ text-align: center; padding: 2rem; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); }}
.team-photo {{ width: 80px; height: 80px; margin: 0 auto 1rem; background: var(--accent-dim); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.3rem; }}
.team-photo--circle {{ border-radius: 50%; }}
.team-photo--square {{ border-radius: var(--radius); }}
.team-card h3 {{ font-size: 1rem; margin-bottom: 0.3rem; }}
.team-role {{ color: var(--accent); font-size: 0.85rem; font-weight: 500; }}
.team-bio {{ color: var(--text-sec); font-size: 0.85rem; margin-top: 0.8rem; }}

/* --- TESTIMONIALS --- */
.testimonials-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }}
.testimonial-card {{ background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem; position: relative; }}
.testimonial-quote {{ color: var(--accent-dim); font-size: 1.5rem; position: absolute; top: 1rem; right: 1.5rem; opacity: 0.4; }}
.testimonial-card p {{ color: var(--text-sec); font-style: italic; margin-bottom: 1rem; line-height: 1.7; }}
.testimonial-stars {{ color: var(--accent); font-size: 0.85rem; margin-bottom: 0.5rem; }}
.testimonial-stars .far {{ opacity: 0.3; }}
.testimonial-author {{ color: var(--text); font-weight: 600; font-size: 0.9rem; }}

/* --- PRICING --- */
.pricing-grid {{ display: grid; gap: 1.5rem; align-items: start; }}
.pricing-grid.cols-2 {{ grid-template-columns: repeat(2, 1fr); }}
.pricing-grid.cols-3 {{ grid-template-columns: repeat(3, 1fr); }}
.pricing-card {{ background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 2.5rem 2rem; text-align: center; transition: transform 0.3s; }}
.pricing-card:hover {{ transform: translateY(-4px); }}
.pricing-card--highlighted {{ border-color: var(--accent); position: relative; }}
.pricing-card--highlighted::before {{ content: 'Popular'; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--accent); color: hsl(var(--bg-h), var(--bg-s), 5%); font-size: 0.75rem; font-weight: 700; padding: 0.2rem 1rem; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em; }}
.pricing-card h3 {{ font-size: 1.1rem; margin-bottom: 0.5rem; }}
.pricing-price {{ font-size: 2.5rem; font-weight: 700; color: var(--accent); margin-bottom: 1.5rem; }}
.pricing-price span {{ font-size: 0.9rem; color: var(--text-sec); font-weight: 400; }}
.pricing-card ul {{ list-style: none; margin-bottom: 2rem; }}
.pricing-card li {{ padding: 0.4rem 0; color: var(--text-sec); font-size: 0.9rem; }}
.pricing-card li i {{ color: var(--accent); margin-right: 0.5rem; }}

/* --- FAQ --- */
.faq-list {{ max-width: 700px; margin: 0 auto; }}
.faq-item {{ border-bottom: 1px solid var(--border); }}
.faq-question {{ display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 0; cursor: pointer; font-weight: 600; }}
.faq-question i {{ color: var(--accent); transition: transform 0.3s; font-size: 0.85rem; }}
.faq-item.open .faq-question i {{ transform: rotate(180deg); }}
.faq-answer {{ max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.3s; }}
.faq-item.open .faq-answer {{ max-height: 300px; padding-bottom: 1.2rem; }}
.faq-answer p {{ color: var(--text-sec); line-height: 1.8; }}
.faq--list .faq-answer {{ max-height: none; padding-bottom: 1.2rem; }}
.faq--list .faq-question i {{ display: none; }}

/* --- CONTACT --- */
.contact-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }}
.contact-info {{ display: flex; flex-direction: column; gap: 1.5rem; }}
.contact-item {{ display: flex; align-items: flex-start; gap: 1rem; }}
.contact-item i {{ color: var(--accent); font-size: 1.1rem; margin-top: 0.3rem; }}
.contact-item span {{ color: var(--text-sec); }}
.contact-map, .map-placeholder {{ aspect-ratio: 4/3; background: var(--card); border-radius: var(--radius); border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; color: var(--text-muted); }}
.map-placeholder i {{ font-size: 2rem; }}

/* --- FOOTER --- */
.footer {{ border-top: 1px solid var(--border); padding: 3rem 2rem 1.5rem; }}
.footer-inner {{ max-width: 1100px; margin: 0 auto; }}
.footer-grid {{ display: grid; grid-template-columns: 2fr 1fr; gap: 3rem; margin-bottom: 2rem; }}
.footer-col h4 {{ margin-bottom: 1rem; font-size: 1rem; }}
.footer-col p {{ color: var(--text-sec); font-size: 0.9rem; margin-bottom: 0.5rem; }}
.footer-col p i {{ color: var(--accent); margin-right: 0.5rem; width: 16px; }}
.footer-bottom {{ border-top: 1px solid var(--border); padding-top: 1.5rem; text-align: center; }}
.footer-bottom p {{ color: var(--text-muted); font-size: 0.8rem; }}

/* --- WHATSAPP BUTTON --- */
.whatsapp-float {{ position: fixed; bottom: 2rem; z-index: 90; width: 56px; height: 56px; background: #25d366; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; box-shadow: 0 4px 20px rgba(37,211,102,0.3); transition: transform 0.3s, box-shadow 0.3s; }}
.whatsapp--right {{ right: 2rem; }}
.whatsapp--left {{ left: 2rem; }}
.whatsapp-float:hover {{ transform: scale(1.1); box-shadow: 0 6px 28px rgba(37,211,102,0.45); color: #fff; }}

/* --- REVEAL ANIMATION --- */
.reveal {{ opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }}
.reveal.visible {{ opacity: 1; transform: translateY(0); }}

/* --- RESPONSIVE --- */
@media (max-width: 900px) {{
  .nav-links {{ display: none; }}
  .nav-toggle {{ display: block; }}
  .hero {{ min-height: 80vh; padding: 5rem 1.5rem 3rem; }}
  .about-grid, .contact-grid {{ grid-template-columns: 1fr; }}
  .services-grid.cols-3, .services-grid.cols-4,
  .team-grid.cols-3, .team-grid.cols-4,
  .pricing-grid.cols-3,
  .gallery-grid.cols-3, .gallery-grid.cols-4 {{ grid-template-columns: repeat(2, 1fr); }}
  .gallery-item--wide {{ grid-column: span 1; }}
  .footer-grid {{ grid-template-columns: 1fr; }}
}}
@media (max-width: 560px) {{
  .services-grid.cols-2, .services-grid.cols-3, .services-grid.cols-4,
  .team-grid.cols-2, .team-grid.cols-3, .team-grid.cols-4,
  .gallery-grid.cols-2, .gallery-grid.cols-3, .gallery-grid.cols-4,
  .pricing-grid.cols-2, .pricing-grid.cols-3 {{ grid-template-columns: 1fr; }}
  .hero-title {{ font-size: 2rem; }}
  .hero-cta {{ flex-direction: column; }}
  .btn {{ width: 100%; justify-content: center; }}
}}
";

    // --- Script ---

    private static string BuildScript(SiteConfiguration config) => @"
<script>
// Scroll reveal
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^=""#""]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// PostMessage listener for real-time updates from builder
window.addEventListener('message', (e) => {
  const msg = e.data;
  if (!msg || !msg.type) return;

  switch (msg.type) {
    case 'updateGlobalParams': {
      const r = document.documentElement;
      const p = msg.data;
      if (p.accentHue !== undefined) r.style.setProperty('--accent-h', p.accentHue);
      if (p.accentSat !== undefined) r.style.setProperty('--accent-s', p.accentSat + '%');
      if (p.bgHue !== undefined) r.style.setProperty('--bg-h', p.bgHue);
      if (p.bgSat !== undefined) r.style.setProperty('--bg-s', p.bgSat + '%');
      if (p.bgLightness !== undefined) r.style.setProperty('--bg-l', p.bgLightness + '%');
      if (p.textLightness !== undefined) r.style.setProperty('--text-l', p.textLightness + '%');
      if (p.cardLightness !== undefined) r.style.setProperty('--card-l', p.cardLightness + '%');
      if (p.borderAlpha !== undefined) r.style.setProperty('--border-a', p.borderAlpha);
      if (p.borderRadius !== undefined) r.style.setProperty('--radius', p.borderRadius + 'px');
      if (p.fontFamily !== undefined) {
        r.style.setProperty('--font', ""'"" + p.fontFamily + ""', sans-serif"");
        // Load font dynamically
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(p.fontFamily) + ':wght@300;400;500;600;700&display=swap';
        document.head.appendChild(link);
      }
      break;
    }
    case 'toggleModule': {
      const el = document.getElementById('module-' + msg.data.id);
      if (el) el.style.display = msg.data.enabled ? '' : 'none';
      break;
    }
    case 'reload':
      window.location.reload();
      break;
  }
});

// Signal to parent that preview is ready
if (window.parent !== window) {
  window.parent.postMessage({ type: 'previewReady' }, '*');
}
</script>";

    // --- Helpers ---

    private static string Esc(string s) => System.Net.WebUtility.HtmlEncode(s ?? "");

    private static string GetParam(Dictionary<string, object> mp, string key, string defaultVal)
    {
        if (mp.TryGetValue(key, out var v))
        {
            if (v is JsonElement je) return je.GetString() ?? defaultVal;
            return v?.ToString() ?? defaultVal;
        }
        return defaultVal;
    }

    private static bool GetParamBool(Dictionary<string, object> mp, string key, bool defaultVal)
    {
        if (mp.TryGetValue(key, out var v))
        {
            if (v is JsonElement je) return je.ValueKind == JsonValueKind.True || (je.ValueKind == JsonValueKind.String && je.GetString() == "true");
            if (v is bool b) return b;
            return bool.TryParse(v?.ToString(), out var r) ? r : defaultVal;
        }
        return defaultVal;
    }

    private static int GetParamInt(Dictionary<string, object> mp, string key, int defaultVal)
    {
        if (mp.TryGetValue(key, out var v))
        {
            if (v is JsonElement je && je.TryGetInt32(out var i)) return i;
            if (v is int iv) return iv;
            return int.TryParse(v?.ToString(), out var r) ? r : defaultVal;
        }
        return defaultVal;
    }
}
