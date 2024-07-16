using Microsoft.EntityFrameworkCore;
using ReactApp2.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace ReactApp2.Server.Models
{
    public class Category
    {
        public Guid Id { get; set; }
        public string ProductCategory { get; set; } = string.Empty;
        public DateTime createdAt { get; set; } = DateTime.Now;
        public ICollection<Category> Children { get; set; }
        public bool Highlighted { get; set; } = false;
        public string? ParentId { get; set; } = string.Empty;
    }
}
