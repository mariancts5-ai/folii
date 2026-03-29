using FoliiBuilder.Web.Models;

namespace FoliiBuilder.Web.Services;

public class ContentGenerator : IContentGenerator
{
    public SiteContent Generate(string themeId) => themeId switch
    {
        "cafenea" => BuildCafenea(),
        "frizerie" => BuildFrizerie(),
        "restaurant" => BuildRestaurant(),
        "auto" => BuildAuto(),
        "firma" => BuildFirma(),
        "salon" => BuildSalon(),
        "magazin" => BuildMagazin(),
        "medical" => BuildMedical(),
        _ => BuildGeneric()
    };

    private static SiteContent BuildCafenea() => new()
    {
        CompanyName = "Aroma Zilei",
        Tagline = "Cafenea de specialitate",
        Hero = new()
        {
            Title = "Savurează fiecare moment",
            Subtitle = "Cafenea de specialitate",
            Description = "O experiență unică de cafea în inima orașului. Boabe atent selecționate din cele mai bune plantații, preparate cu pasiune.",
            CtaPrimary = "Rezervă o masă",
            CtaSecondary = "Vezi meniul",
            Phone = "0712 345 678"
        },
        About = new()
        {
            Title = "Povestea noastră",
            Text = "Din 2018, Aroma Zilei aduce în cana ta cele mai fine sortimente de cafea din întreaga lume. Fiecare ceașcă este o poveste — de la boabele atent selecționate din plantațiile din Columbia și Etiopia, până la prepararea cu grijă în espressoarele noastre italiene. Credem că o cafea bună poate transforma o zi obișnuită într-una specială."
        },
        Services =
        [
            new() { Icon = "fa-mug-hot", Name = "Cafea de specialitate", Description = "Sortimente premium preparate de bariști certificați", Price = "de la 12 lei" },
            new() { Icon = "fa-cookie-bite", Name = "Patiserie artizanală", Description = "Deserturi proaspete făcute în casă zilnic", Price = "de la 15 lei" },
            new() { Icon = "fa-wifi", Name = "Spațiu de lucru", Description = "Internet rapid și priză la fiecare masă", Price = "Gratuit" },
            new() { Icon = "fa-calendar-check", Name = "Evenimente private", Description = "Organizăm evenimente și degustări de cafea", Price = "La cerere" }
        ],
        Gallery = BuildGalleryItems(["Interior cafenea", "Latte art", "Boabe de cafea", "Terasa noastră", "Espresso bar", "Prăjituri artizanale"], "#2a1a0a"),
        Menu =
        [
            new() { Category = "Cafele calde", Name = "Espresso", Description = "Shot intens de cafea", Price = "12 lei" },
            new() { Category = "Cafele calde", Name = "Cappuccino", Description = "Espresso cu spumă de lapte catifelată", Price = "16 lei" },
            new() { Category = "Cafele calde", Name = "Flat White", Description = "Dublu espresso cu lapte texturiat", Price = "19 lei" },
            new() { Category = "Cafele calde", Name = "Latte", Description = "Espresso cu lapte cremos", Price = "18 lei" },
            new() { Category = "Cafele reci", Name = "Iced Latte", Description = "Latte răcoritor cu gheață", Price = "20 lei" },
            new() { Category = "Cafele reci", Name = "Cold Brew", Description = "Cafea extrasă la rece 12 ore", Price = "18 lei" },
            new() { Category = "Cafele reci", Name = "Frappé", Description = "Cafea frappe cu gheață măcinată", Price = "22 lei" },
            new() { Category = "Deserturi", Name = "Cheesecake", Description = "Clasic, cu fructe de pădure", Price = "24 lei" },
            new() { Category = "Deserturi", Name = "Tiramisu", Description = "Rețetă tradițională italiană", Price = "22 lei" },
            new() { Category = "Deserturi", Name = "Brownie", Description = "Cu ciocolată belgiană și nuci", Price = "18 lei" }
        ],
        Testimonials =
        [
            new() { Text = "Cea mai bună cafea din oraș! Atmosfera e caldă și personalul foarte prietenos.", Author = "Maria P.", Rating = 5 },
            new() { Text = "Locul perfect pentru o pauză de cafea sau pentru a lucra liniștit la laptop.", Author = "Andrei M.", Rating = 5 },
            new() { Text = "Cheesecake-ul este absolut divin, iar cappuccino-ul — impecabil.", Author = "Elena D.", Rating = 4 }
        ],
        Contact = new()
        {
            Phone = "0712 345 678", Email = "contact@aromazilei.ro",
            Address = "Str. Victoriei 42, București",
            Schedule = "Lun–Vin: 07:00–21:00 | Sâm–Dum: 08:00–22:00"
        },
        Footer = new()
        {
            Description = "Aroma Zilei — cafenea de specialitate cu cele mai fine sortimente de cafea, în inima orașului.",
            Copyright = $"© {DateTime.Now.Year} Aroma Zilei. Toate drepturile rezervate.",
            Phone = "0712 345 678", Email = "contact@aromazilei.ro", Address = "Str. Victoriei 42, București"
        }
    };

    private static SiteContent BuildFrizerie() => new()
    {
        CompanyName = "BarberCraft",
        Tagline = "Frizerie & Barbershop",
        Hero = new()
        {
            Title = "Stil. Precizie. Atitudine.",
            Subtitle = "Frizerie & Barbershop",
            Description = "Experimentează un tuns de excepție într-un spațiu creat pentru bărbatul modern. Stil clasic, tehnici contemporane.",
            CtaPrimary = "Programare", CtaSecondary = "Servicii", Phone = "0723 456 789"
        },
        About = new()
        {
            Title = "Cine suntem",
            Text = "BarberCraft nu este doar o frizerie — este o experiență. Fondată în 2020, oferim servicii premium de barbering într-un ambient masculin și relaxant. Fiecare client primește atenție individualizată și un rezultat care reflectă personalitatea sa."
        },
        Services =
        [
            new() { Icon = "fa-scissors", Name = "Tuns clasic", Description = "Tuns profesional cu spălare și styling inclus", Price = "50 lei" },
            new() { Icon = "fa-user", Name = "Tuns + barbă", Description = "Pachet complet: tuns și aranjare barbă", Price = "80 lei" },
            new() { Icon = "fa-face-smile-beam", Name = "Aranjat barbă", Description = "Conturare, ras și îngrijire barbă", Price = "40 lei" },
            new() { Icon = "fa-child", Name = "Tuns copii", Description = "Tuns pentru copii până la 12 ani", Price = "35 lei" }
        ],
        Gallery = BuildGalleryItems(["Tuns clasic", "Fade modern", "Barbă sculptată", "Interior salon", "Detalii tuns", "Produse profesionale"], "#0a1520"),
        Team =
        [
            new() { Name = "Alex Marin", Role = "Master Barber", Bio = "15 ani experiență, specializat în fade-uri și tunsuri clasice", Initials = "AM" },
            new() { Name = "Radu Ionescu", Role = "Senior Barber", Bio = "Expert în barbă și conturare, pasionat de stilul vintage", Initials = "RI" },
            new() { Name = "Mihai Popa", Role = "Barber", Bio = "Tânăr și creativ, specializat în stiluri moderne și texturate", Initials = "MP" }
        ],
        Pricing =
        [
            new() { Name = "Basic", Price = "50", Period = "lei", Features = ["Tuns clasic", "Spălare", "Styling"], Highlighted = false },
            new() { Name = "Premium", Price = "80", Period = "lei", Features = ["Tuns + barbă", "Spălare", "Styling", "Masaj facial"], Highlighted = true },
            new() { Name = "VIP", Price = "120", Period = "lei", Features = ["Tuns + barbă", "Tratament păr", "Masaj", "Băutură inclusă"], Highlighted = false }
        ],
        Testimonials =
        [
            new() { Text = "Cel mai bun barbershop din zonă. Alex face minuni cu fiecare tuns!", Author = "Dragoș T.", Rating = 5 },
            new() { Text = "Atmosferă excelentă și rezultat impecabil de fiecare dată.", Author = "Victor L.", Rating = 5 },
            new() { Text = "Recomand cu căldură! Profesioniști adevărați.", Author = "Ionuț S.", Rating = 5 }
        ],
        Contact = new()
        {
            Phone = "0723 456 789", Email = "contact@barbercraft.ro",
            Address = "Bd. Unirii 15, București", Schedule = "Lun–Vin: 09:00–20:00 | Sâm: 09:00–18:00"
        },
        Footer = new()
        {
            Description = "BarberCraft — frizerie & barbershop premium pentru bărbatul modern.",
            Copyright = $"© {DateTime.Now.Year} BarberCraft. Toate drepturile rezervate.",
            Phone = "0723 456 789", Email = "contact@barbercraft.ro", Address = "Bd. Unirii 15, București"
        }
    };

    private static SiteContent BuildRestaurant() => new()
    {
        CompanyName = "Casa Bună",
        Tagline = "Restaurant & Bistro",
        Hero = new()
        {
            Title = "Gustul autenticității",
            Subtitle = "Restaurant & Bistro",
            Description = "O călătorie culinară prin cele mai rafinate arome românești și internaționale, într-un cadru elegant.",
            CtaPrimary = "Rezervare", CtaSecondary = "Meniu", Phone = "0734 567 890"
        },
        About = new()
        {
            Title = "Filozofia noastră",
            Text = "La Casa Bună, fiecare preparat este o operă de artă. Folosim ingrediente proaspete, locale și de sezon pentru a crea meniuri care surprind și încântă. Chef-ul nostru combină tehnici clasice cu inovații moderne."
        },
        Services =
        [
            new() { Icon = "fa-utensils", Name = "Fine Dining", Description = "Experiență culinară rafinată cu meniu degustare", Price = "de la 150 lei" },
            new() { Icon = "fa-champagne-glasses", Name = "Evenimente", Description = "Organizare evenimente private și corporate", Price = "La cerere" },
            new() { Icon = "fa-truck", Name = "Catering", Description = "Servicii de catering pentru evenimente", Price = "de la 80 lei/pers" },
            new() { Icon = "fa-wine-glass", Name = "Degustări de vin", Description = "Seri tematice cu somelier profesionist", Price = "120 lei/pers" }
        ],
        Gallery = BuildGalleryItems(["Preparat signature", "Interior restaurant", "Desert artistic", "Terasa de vară", "Selecție vinuri", "Bucătăria deschisă"], "#1a0a0a"),
        Menu =
        [
            new() { Category = "Aperitive", Name = "Bruschette cu roșii", Description = "Pâine prăjită cu roșii cherry și busuioc", Price = "28 lei" },
            new() { Category = "Aperitive", Name = "Carpaccio de vită", Description = "Cu rucola, parmezan și sos trufe", Price = "45 lei" },
            new() { Category = "Feluri principale", Name = "Mușchi de vită", Description = "Gătit la temperatură joasă, cu sos demi-glace", Price = "89 lei" },
            new() { Category = "Feluri principale", Name = "Risotto cu trufe", Description = "Orez Arborio cu trufe negre și parmezan", Price = "65 lei" },
            new() { Category = "Feluri principale", Name = "Somon în crustă", Description = "Cu legume de sezon și sos beurre blanc", Price = "75 lei" },
            new() { Category = "Deserturi", Name = "Crème Brûlée", Description = "Cu vanilie Madagascar", Price = "32 lei" },
            new() { Category = "Deserturi", Name = "Fondant de ciocolată", Description = "Cu inimă lichidă și înghețată de vanilie", Price = "35 lei" }
        ],
        Testimonials =
        [
            new() { Text = "Mâncarea este excepțională, iar serviciul impecabil. O bijuterie gastronomică!", Author = "Cristina B.", Rating = 5 },
            new() { Text = "Cel mai bun risotto pe care l-am mâncat vreodată. Revin cu siguranță!", Author = "Adrian N.", Rating = 5 },
            new() { Text = "Atmosferă elegantă, perfect pentru o cină romantică.", Author = "Laura & Dan", Rating = 4 }
        ],
        Contact = new()
        {
            Phone = "0734 567 890", Email = "rezervari@casabuna.ro",
            Address = "Str. Lipscani 23, București", Schedule = "Lun–Dum: 12:00–23:00"
        },
        Footer = new()
        {
            Description = "Casa Bună — restaurant & bistro cu preparate rafinate din ingrediente locale.",
            Copyright = $"© {DateTime.Now.Year} Casa Bună. Toate drepturile rezervate.",
            Phone = "0734 567 890", Email = "rezervari@casabuna.ro", Address = "Str. Lipscani 23, București"
        }
    };

    private static SiteContent BuildAuto() => new()
    {
        CompanyName = "AutoPro Service",
        Tagline = "Service auto profesionist",
        Hero = new()
        {
            Title = "Grija perfectă pentru mașina ta",
            Subtitle = "Service auto profesionist",
            Description = "Servicii complete de întreținere și reparații auto cu echipamente de ultimă generație și mecanici certificați.",
            CtaPrimary = "Sună acum", CtaSecondary = "Servicii", Phone = "0745 678 901"
        },
        About = new()
        {
            Title = "De ce noi",
            Text = "Cu peste 10 ani de experiență, AutoPro Service oferă soluții profesionale pentru orice tip de vehicul. Echipa noastră de mecanici certificați folosește echipamente de ultimă generație și piese originale."
        },
        Services =
        [
            new() { Icon = "fa-oil-can", Name = "Schimb ulei & filtre", Description = "Revizie completă cu ulei și filtre premium", Price = "de la 200 lei" },
            new() { Icon = "fa-car-burst", Name = "Diagnoză computerizată", Description = "Identificarea exactă a problemelor electronice", Price = "100 lei" },
            new() { Icon = "fa-gears", Name = "Reparații mecanice", Description = "Reparații complete motor, transmisie, suspensie", Price = "La cerere" },
            new() { Icon = "fa-spray-can", Name = "Detailing auto", Description = "Curățare profesională interior și exterior", Price = "de la 300 lei" }
        ],
        Gallery = BuildGalleryItems(["Service modern", "Diagnoză auto", "Echipamente pro", "Detailing", "Zona de lucru", "Echipa noastră"], "#0a0e1a"),
        Testimonials =
        [
            new() { Text = "Profesioniști adevărați. Mi-au rezolvat problema rapid și la un preț corect.", Author = "George M.", Rating = 5 },
            new() { Text = "Singura firmă în care am încredere cu mașina mea.", Author = "Florin A.", Rating = 5 },
            new() { Text = "Comunicare excelentă și lucrare impecabilă.", Author = "Marian C.", Rating = 4 }
        ],
        Contact = new()
        {
            Phone = "0745 678 901", Email = "contact@autoproservice.ro",
            Address = "Șos. Fundeni 120, București", Schedule = "Lun–Vin: 08:00–18:00 | Sâm: 09:00–14:00"
        },
        Footer = new()
        {
            Description = "AutoPro Service — service auto profesionist cu echipamente moderne și mecanici certificați.",
            Copyright = $"© {DateTime.Now.Year} AutoPro Service. Toate drepturile rezervate.",
            Phone = "0745 678 901", Email = "contact@autoproservice.ro", Address = "Șos. Fundeni 120, București"
        }
    };

    private static SiteContent BuildFirma() => new()
    {
        CompanyName = "TechVision",
        Tagline = "Soluții digitale inovatoare",
        Hero = new()
        {
            Title = "Transformăm ideile în soluții digitale",
            Subtitle = "Soluții digitale inovatoare",
            Description = "Dezvoltăm software la comandă, aplicații web și mobile care accelerează creșterea afacerii tale.",
            CtaPrimary = "Solicită ofertă", CtaSecondary = "Portofoliu", Phone = "0756 789 012"
        },
        About = new()
        {
            Title = "Despre TechVision",
            Text = "Suntem o echipă de dezvoltatori pasionați cu peste 8 ani de experiență în industria IT. Livrăm proiecte software de calitate superioară pentru startup-uri și corporații, folosind cele mai noi tehnologii și metodologii agile."
        },
        Services =
        [
            new() { Icon = "fa-code", Name = "Dezvoltare Web", Description = "Aplicații web moderne, responsive și performante", Price = "de la 3.000€" },
            new() { Icon = "fa-mobile-screen", Name = "Aplicații Mobile", Description = "Aplicații native și cross-platform iOS/Android", Price = "de la 5.000€" },
            new() { Icon = "fa-cloud", Name = "Cloud & DevOps", Description = "Infrastructură cloud scalabilă și automatizare CI/CD", Price = "de la 1.500€/lună" },
            new() { Icon = "fa-shield-halved", Name = "Securitate IT", Description = "Audit de securitate și implementare politici de protecție", Price = "La cerere" }
        ],
        Gallery = BuildGalleryItems(["Birou modern", "Echipa la lucru", "Workshop tehnic", "Prezentare client", "Sala de conferințe", "Team building"], "#0a0e18"),
        Team =
        [
            new() { Name = "Alexandru Dumitrescu", Role = "CEO & Co-fondator", Bio = "15 ani experiență în managementul proiectelor IT", Initials = "AD" },
            new() { Name = "Ioana Popescu", Role = "CTO", Bio = "Expertă în arhitecturi cloud și microservicii", Initials = "IP" },
            new() { Name = "Bogdan Stanciu", Role = "Lead Developer", Bio = "Full-stack developer cu pasiune pentru code quality", Initials = "BS" },
            new() { Name = "Diana Radu", Role = "UX Designer", Bio = "Creează experiențe digitale intuitive și frumoase", Initials = "DR" }
        ],
        Testimonials =
        [
            new() { Text = "Au livrat proiectul la timp și peste așteptări. Comunicare excelentă pe tot parcursul.", Author = "CEO, StartupX", Rating = 5 },
            new() { Text = "Partenerul ideal pentru transformarea digitală a companiei noastre.", Author = "Director IT, Corp SA", Rating = 5 },
            new() { Text = "Echipă profesionistă, soluții tehnice solide.", Author = "Fondator, AppDream", Rating = 4 }
        ],
        Faq =
        [
            new() { Question = "Cât durează dezvoltarea unui proiect?", Answer = "Depinde de complexitate. Un site de prezentare: 2-4 săptămâni. O aplicație complexă: 2-6 luni. Oferim estimări detaliate după analiza cerințelor." },
            new() { Question = "Ce tehnologii folosiți?", Answer = "Lucrăm cu .NET, React, Angular, Flutter, AWS, Azure și multe altele. Alegem stack-ul optim pentru fiecare proiect." },
            new() { Question = "Oferiți suport post-lansare?", Answer = "Da, oferim pachete de mentenanță și suport tehnic continuu pentru toate proiectele livrate." }
        ],
        Contact = new()
        {
            Phone = "0756 789 012", Email = "office@techvision.ro",
            Address = "Str. IT Park 8, Cluj-Napoca", Schedule = "Lun–Vin: 09:00–18:00"
        },
        Footer = new()
        {
            Description = "TechVision — soluții digitale inovatoare pentru afaceri ambițioase.",
            Copyright = $"© {DateTime.Now.Year} TechVision SRL. Toate drepturile rezervate.",
            Phone = "0756 789 012", Email = "office@techvision.ro", Address = "Str. IT Park 8, Cluj-Napoca"
        }
    };

    private static SiteContent BuildSalon() => new()
    {
        CompanyName = "Belle Beauté",
        Tagline = "Salon de înfrumusețare",
        Hero = new()
        {
            Title = "Frumusețea ta, pasiunea noastră",
            Subtitle = "Salon de înfrumusețare",
            Description = "Descoperă servicii premium de beauty într-un ambient relaxant. Tratamente personalizate pentru fiecare client.",
            CtaPrimary = "Programare online", CtaSecondary = "Servicii", Phone = "0767 890 123"
        },
        About = new()
        {
            Title = "Povestea Belle Beauté",
            Text = "Fondat din pasiune pentru frumusețe, Belle Beauté este locul unde te poți relaxa și te poți transforma. Folosim produse premium și tehnici moderne pentru rezultate impecabile."
        },
        Services =
        [
            new() { Icon = "fa-scissors", Name = "Coafură & Styling", Description = "Tuns, vopsit, coafat și tratamente capilare", Price = "de la 80 lei" },
            new() { Icon = "fa-hand-sparkles", Name = "Manichiură & Pedichiură", Description = "Îngrijire și design unghii cu gel sau semipermanent", Price = "de la 100 lei" },
            new() { Icon = "fa-face-smile", Name = "Tratamente faciale", Description = "Curățare, hidratare și anti-aging profesional", Price = "de la 150 lei" },
            new() { Icon = "fa-spa", Name = "Masaj & Relaxare", Description = "Masaje terapeutice și de relaxare", Price = "de la 120 lei" }
        ],
        Gallery = BuildGalleryItems(["Salon interior", "Manichiură artistică", "Coafură elegantă", "Tratament facial", "Zona de relaxare", "Produse premium"], "#180a18"),
        Team =
        [
            new() { Name = "Ana Vasilescu", Role = "Owner & Hair Stylist", Bio = "20 ani experiență, formată la academii internaționale", Initials = "AV" },
            new() { Name = "Bianca Florea", Role = "Nail Artist", Bio = "Specialistă în nail art și tehnici avansate de manichiură", Initials = "BF" },
            new() { Name = "Cosmina Dobre", Role = "Cosmetician", Bio = "Expertă în tratamente faciale și dermato-cosmetică", Initials = "CD" }
        ],
        Pricing =
        [
            new() { Name = "Essential", Price = "80", Period = "de la", Features = ["Tuns simplu", "Spălare", "Styling basic"], Highlighted = false },
            new() { Name = "Glam", Price = "200", Period = "de la", Features = ["Tuns + vopsit", "Tratament", "Styling", "Manichiură simplă"], Highlighted = true },
            new() { Name = "Royal", Price = "400", Period = "de la", Features = ["Tuns + vopsit", "Tratament premium", "Manichiură gel", "Masaj relaxare"], Highlighted = false }
        ],
        Testimonials =
        [
            new() { Text = "Cel mai frumos salon din oraș! Ana este o artistă adevărată.", Author = "Simona R.", Rating = 5 },
            new() { Text = "Mă simt ca nouă de fiecare dată când ies de la Belle Beauté.", Author = "Ioana M.", Rating = 5 },
            new() { Text = "Servicii excelente, ambient relaxant. Super recomand!", Author = "Andreea C.", Rating = 5 }
        ],
        Contact = new()
        {
            Phone = "0767 890 123", Email = "contact@bellebeaute.ro",
            Address = "Str. Florilor 7, Timișoara", Schedule = "Lun–Sâm: 09:00–20:00"
        },
        Footer = new()
        {
            Description = "Belle Beauté — salon de înfrumusețare premium cu servicii personalizate.",
            Copyright = $"© {DateTime.Now.Year} Belle Beauté. Toate drepturile rezervate.",
            Phone = "0767 890 123", Email = "contact@bellebeaute.ro", Address = "Str. Florilor 7, Timișoara"
        }
    };

    private static SiteContent BuildMagazin() => new()
    {
        CompanyName = "Urban Store",
        Tagline = "Magazin & Showroom",
        Hero = new()
        {
            Title = "Produse care fac diferența",
            Subtitle = "Magazin & Showroom",
            Description = "Descoperă colecția noastră atent selectată de produse premium. Calitate, stil și funcționalitate într-un singur loc.",
            CtaPrimary = "Explorează", CtaSecondary = "Contactează-ne", Phone = "0778 901 234"
        },
        About = new()
        {
            Title = "Despre Urban Store",
            Text = "Urban Store este mai mult decât un magazin — este o experiență. Selectăm cu grijă fiecare produs din portofoliu, colaborând cu branduri de încredere pentru a-ți oferi numai ce e mai bun."
        },
        Gallery = BuildGalleryItems(["Showroom", "Colecția nouă", "Detalii produs", "Ambalaj premium", "Interior magazin", "Experiența client"], "#0a1510"),
        Menu =
        [
            new() { Category = "Accesorii", Name = "Rucsac urban", Description = "Material impermeabil, compartiment laptop 15\"", Price = "249 lei" },
            new() { Category = "Accesorii", Name = "Portofel din piele", Description = "Piele naturală italiană, slim design", Price = "189 lei" },
            new() { Category = "Gadgets", Name = "Stație de încărcare", Description = "Wireless, compatibil cu toate telefoanele", Price = "149 lei" },
            new() { Category = "Gadgets", Name = "Căști wireless", Description = "Sunet premium, noise cancelling activ", Price = "349 lei" },
            new() { Category = "Home", Name = "Lampă smart", Description = "Control WiFi, 16 milioane de culori", Price = "199 lei" },
            new() { Category = "Home", Name = "Difuzor aromatic", Description = "Ultrasonic, cu LED ambient", Price = "129 lei" }
        ],
        Faq =
        [
            new() { Question = "Cum pot comanda?", Answer = "Ne poți contacta telefonic sau prin email. Livrăm în toată țara prin curier rapid." },
            new() { Question = "Care este politica de retur?", Answer = "Acceptăm returnarea produselor în 30 de zile de la achiziție, în ambalajul original." },
            new() { Question = "Oferiți garanție?", Answer = "Da, toate produsele au garanție de minim 2 ani conform legislației." }
        ],
        Contact = new()
        {
            Phone = "0778 901 234", Email = "comenzi@urbanstore.ro",
            Address = "Calea Victoriei 88, București", Schedule = "Lun–Sâm: 10:00–20:00 | Dum: 11:00–18:00"
        },
        Footer = new()
        {
            Description = "Urban Store — magazin & showroom cu produse premium atent selectate.",
            Copyright = $"© {DateTime.Now.Year} Urban Store. Toate drepturile rezervate.",
            Phone = "0778 901 234", Email = "comenzi@urbanstore.ro", Address = "Calea Victoriei 88, București"
        }
    };

    private static SiteContent BuildMedical() => new()
    {
        CompanyName = "MedCare Plus",
        Tagline = "Cabinet medical",
        Hero = new()
        {
            Title = "Sănătatea ta, prioritatea noastră",
            Subtitle = "Cabinet medical",
            Description = "Servicii medicale de calitate superioară cu medici specialiști dedicați. Echipamente moderne, abordare personalizată.",
            CtaPrimary = "Programare", CtaSecondary = "Servicii", Phone = "0789 012 345"
        },
        About = new()
        {
            Title = "Despre MedCare Plus",
            Text = "MedCare Plus este un cabinet medical modern, dedicat sănătății și confortului pacienților. Echipa noastră de medici specialiști oferă consultații, investigații și tratamente bazate pe cele mai recente protocoale medicale."
        },
        Services =
        [
            new() { Icon = "fa-stethoscope", Name = "Medicină generală", Description = "Consultații, controale de rutină și tratamente", Price = "150 lei" },
            new() { Icon = "fa-heart-pulse", Name = "Cardiologie", Description = "EKG, ecografie cardiacă și monitorizare", Price = "250 lei" },
            new() { Icon = "fa-microscope", Name = "Analize de laborator", Description = "Analize complete de sânge și urină", Price = "de la 50 lei" },
            new() { Icon = "fa-x-ray", Name = "Imagistică medicală", Description = "Ecografie, radiografie și RMN", Price = "de la 200 lei" }
        ],
        Gallery = BuildGalleryItems(["Cabinet modern", "Echipamente medicale", "Sala de consultații", "Recepție", "Laborator", "Echipa medicală"], "#0a1218"),
        Team =
        [
            new() { Name = "Dr. Andrei Marinescu", Role = "Medic primar", Bio = "25 ani experiență, specialist în medicină internă", Initials = "AM" },
            new() { Name = "Dr. Elena Gheorghe", Role = "Cardiolog", Bio = "Specialist cardiolog cu competențe în ecografie cardiacă", Initials = "EG" },
            new() { Name = "Dr. Maria Stoica", Role = "Medic generalist", Bio = "Abordare holistică, concentrată pe medicina preventivă", Initials = "MS" }
        ],
        Faq =
        [
            new() { Question = "Am nevoie de trimitere de la medicul de familie?", Answer = "Nu, puteți programa o consultație direct la specialistul dorit, fără trimitere." },
            new() { Question = "Lucrați cu casa de asigurări?", Answer = "Da, avem contract cu CNAS. Vă recomandăm să aduceți cardul de sănătate și buletinul." },
            new() { Question = "Cum mă pot programa?", Answer = "Telefonic la numărul de contact, prin email sau direct la recepția cabinetului." }
        ],
        Contact = new()
        {
            Phone = "0789 012 345", Email = "programari@medcareplus.ro",
            Address = "Str. Sănătății 12, Iași", Schedule = "Lun–Vin: 08:00–20:00 | Sâm: 08:00–14:00"
        },
        Footer = new()
        {
            Description = "MedCare Plus — cabinet medical modern cu servicii de calitate superioară.",
            Copyright = $"© {DateTime.Now.Year} MedCare Plus. Toate drepturile rezervate.",
            Phone = "0789 012 345", Email = "programari@medcareplus.ro", Address = "Str. Sănătății 12, Iași"
        }
    };

    private static SiteContent BuildGeneric() => new()
    {
        CompanyName = "Afacerea Mea",
        Tagline = "Descriere scurtă",
        Hero = new()
        {
            Title = "Bine ai venit",
            Subtitle = "Descrierea afacerii tale",
            Description = "Completează aici o descriere scurtă și atractivă a afacerii tale.",
            CtaPrimary = "Contactează-ne", CtaSecondary = "Află mai multe", Phone = "07XX XXX XXX"
        },
        About = new()
        {
            Title = "Despre noi",
            Text = "Adaugă aici povestea afacerii tale — cine ești, ce faci și de ce ar trebui clienții să te aleagă pe tine."
        },
        Services =
        [
            new() { Icon = "fa-star", Name = "Serviciul 1", Description = "Descrierea serviciului", Price = "Preț" },
            new() { Icon = "fa-star", Name = "Serviciul 2", Description = "Descrierea serviciului", Price = "Preț" }
        ],
        Contact = new()
        {
            Phone = "07XX XXX XXX", Email = "contact@afacerea-mea.ro",
            Address = "Adresa ta", Schedule = "Lun–Vin: 09:00–18:00"
        },
        Footer = new()
        {
            Description = "Descrierea afacerii tale.",
            Copyright = $"© {DateTime.Now.Year} Afacerea Mea. Toate drepturile rezervate.",
            Phone = "07XX XXX XXX", Email = "contact@afacerea-mea.ro", Address = "Adresa ta"
        }
    };

    private static List<GalleryItem> BuildGalleryItems(string[] captions, string baseColor)
    {
        var items = new List<GalleryItem>();
        for (int i = 0; i < captions.Length; i++)
        {
            items.Add(new GalleryItem
            {
                Caption = captions[i],
                Color = baseColor,
                Wide = i == 0 || i == 3 // first and fourth items are wide
            });
        }
        return items;
    }
}
