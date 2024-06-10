using System.ComponentModel.DataAnnotations;

namespace ReactApp2.Server.Models
{
    public class Featured
    {
        public int Id { get; set; }
        [MaxLength(50)]
        [Required]
        public string Name { get; set; } = string.Empty;
        [MaxLength(3000)]
        [Required]
        public string Link { get; set; } = string.Empty;
        [MaxLength(100)]
        [Required]
        public string Theme { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public List<Product> Products { get; set; } = new List<Product>();
    }
}
