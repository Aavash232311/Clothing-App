using Microsoft.EntityFrameworkCore;
using ReactApp2.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace ReactApp2.Server.Models
{
    public class Category
    {
        public Guid Id { get; set; }

        public Category? Parent { get; set; } // Optional reference navigation to principal
        public string ProductCategory { get; set; } = string.Empty;
        public DateTime createdAt { get; set; } = DateTime.Now;
        public bool Highlighted { get; set; } = false;
    }
}
