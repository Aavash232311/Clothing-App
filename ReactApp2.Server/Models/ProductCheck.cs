namespace ReactApp2.Server.Models
{
    public class ProductCheck
    {
        public Guid Id { get; set; }
        public int qty { get; set; }
        public decimal? totalPrice { get; set; } = 0; // we will calculate in the back end
        public string? size { get; set; } = string.Empty; // here we can add more options if we want
        public ApplicationUser user { get; set; } = new ApplicationUser();
        public Product? product { get; set; }
    }
}
