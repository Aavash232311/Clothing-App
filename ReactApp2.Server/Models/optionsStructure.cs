using NuGet.Protocol.Plugins;

namespace ReactApp2.Server.Models
{
    public class OptionsStructure
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string type { get; set; } = string.Empty;
    }
}