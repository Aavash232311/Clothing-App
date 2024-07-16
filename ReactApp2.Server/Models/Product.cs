using Microsoft.AspNetCore.Identity;
using MimeKit.Tnef;
using System.ComponentModel.DataAnnotations;

namespace ReactApp2.Server.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public decimal Price { get; set;} = decimal.Zero;
        public decimal Discount { get; set; } = decimal.Zero;
        public List<String>  Images { get; set;} = new List<String>();
        public string Description { get; set; } = string.Empty;
        public List<OptionsStructure>? Options { get; set; } = new List<OptionsStructure>();
        public string? Gender { get; set; } = string.Empty;
        public DateTime Added { get; set; } = DateTime.Now;
        public string ShippingNotes { get; set; } = string.Empty;
        public string WarrantyInfo { get; set; } = string.Empty;
        public bool InStock { get; set; } = true;
        public int Length { get; set; } = 0;
        public int Height { get; set; } = 0;
        public int Breadth { get; set; } = 0;
        public List<String> Tags { get; set; } = new List<String>();
        public Category Category { get; set; } = new Category();
        public Guid? CategoryId { get; set; }
        public string SKU { get; set; } = string.Empty;
        public ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }
    }
}
