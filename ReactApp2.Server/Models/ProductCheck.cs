namespace ReactApp2.Server.Models
{
    public class ProductCheck
    {
        public Guid Id { get; set; }
        public int qty { get; set; }
        public decimal? totalPrice { get; set; } = 0; // we will calculate in the back end
        public ApplicationUser user { get; set; } = new ApplicationUser();
        public Product? product { get; set; }
        public List<OptionsStructure> option { get; set; } = new List<OptionsStructure>(); 
    }
}
