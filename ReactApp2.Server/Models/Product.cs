using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ReactApp2.Server.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public decimal Price { get; set;} = decimal.Zero;
        public decimal Discount { get; set; } = decimal.Zero;
        public List<String>  Images { get; set;} = new List<String>();
        public string Description { get; set; } = string.Empty;
        public List<String> AvalibleSize { get; set; } = new List<String>();
        public List<String> Category { get; set; } = new List<String>();
        public string Gender { get; set; } = string.Empty;
        public DateTime Added { get; set; } = DateTime.Now;
        public ApplicationUser User { get; set; }
    }
}
