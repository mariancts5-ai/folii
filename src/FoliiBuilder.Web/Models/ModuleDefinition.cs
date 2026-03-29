namespace FoliiBuilder.Web.Models;

/// <summary>
/// Defines a site module/section (e.g., hero, gallery, services).
/// Each module can be toggled on/off and has its own parameters.
/// </summary>
public class ModuleDefinition
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Icon { get; set; } = "";
    public bool AlwaysOn { get; set; } // nav and footer are always on
    public List<ModuleParameter> Parameters { get; set; } = [];
}

/// <summary>
/// A configurable parameter within a module.
/// </summary>
public class ModuleParameter
{
    public string Id { get; set; } = "";
    public string Label { get; set; } = "";
    public string Type { get; set; } = "toggle"; // range, select, toggle
    public object? DefaultValue { get; set; }
    public int? Min { get; set; }
    public int? Max { get; set; }
    public SelectOption[]? Options { get; set; }
}

public class SelectOption
{
    public string Value { get; set; } = "";
    public string Label { get; set; } = "";
}
