using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ReactApp2.Server.Models;

namespace ReactApp2.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :
            base(options)
        {
        }
        public DbSet<Product> Products { get; set; }
        public DbSet<ApplicationUser> User { get; set; }
        public DbSet<Details> Details { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Featured> Featureds { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }


    }
}
