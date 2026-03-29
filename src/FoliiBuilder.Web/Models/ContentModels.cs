namespace FoliiBuilder.Web.Models;

/// <summary>
/// All textual and structured content for a generated site.
/// </summary>
public class SiteContent
{
    public string CompanyName { get; set; } = "";
    public string Tagline { get; set; } = "";

    public HeroContent Hero { get; set; } = new();
    public AboutContent About { get; set; } = new();
    public List<ServiceItem> Services { get; set; } = [];
    public List<GalleryItem> Gallery { get; set; } = [];
    public List<MenuItem> Menu { get; set; } = [];
    public List<TeamMember> Team { get; set; } = [];
    public List<TestimonialItem> Testimonials { get; set; } = [];
    public List<PricingPlan> Pricing { get; set; } = [];
    public List<FaqItem> Faq { get; set; } = [];
    public ContactContent Contact { get; set; } = new();
    public FooterContent Footer { get; set; } = new();
}

public class HeroContent
{
    public string Title { get; set; } = "";
    public string Subtitle { get; set; } = "";
    public string Description { get; set; } = "";
    public string CtaPrimary { get; set; } = "";
    public string CtaSecondary { get; set; } = "";
    public string Phone { get; set; } = "";
}

public class AboutContent
{
    public string Title { get; set; } = "";
    public string Text { get; set; } = "";
    public string ImagePlaceholder { get; set; } = "";
}

public class ServiceItem
{
    public string Icon { get; set; } = "fa-star";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Price { get; set; } = "";
}

public class GalleryItem
{
    public string Caption { get; set; } = "";
    public string Color { get; set; } = "#1a1a2e"; // placeholder bg color
    public bool Wide { get; set; }
}

public class MenuItem
{
    public string Category { get; set; } = "";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Price { get; set; } = "";
}

public class TeamMember
{
    public string Name { get; set; } = "";
    public string Role { get; set; } = "";
    public string Bio { get; set; } = "";
    public string Initials { get; set; } = "";
}

public class TestimonialItem
{
    public string Text { get; set; } = "";
    public string Author { get; set; } = "";
    public int Rating { get; set; } = 5;
}

public class PricingPlan
{
    public string Name { get; set; } = "";
    public string Price { get; set; } = "";
    public string Period { get; set; } = "";
    public string[] Features { get; set; } = [];
    public bool Highlighted { get; set; }
}

public class FaqItem
{
    public string Question { get; set; } = "";
    public string Answer { get; set; } = "";
}

public class ContactContent
{
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public string Address { get; set; } = "";
    public string Schedule { get; set; } = "";
    public string MapEmbedUrl { get; set; } = "";
}

public class FooterContent
{
    public string Description { get; set; } = "";
    public string Copyright { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
    public string Address { get; set; } = "";
}
