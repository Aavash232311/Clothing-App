namespace ReactApp2.Server.Models
{
    public class ProductCheck
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public int qunaitity { get; set; }
        public decimal totalPrice { get; set; }
        public string size { get; set; } = string.Empty; // here we can add more options if we want
    }
}
