namespace ReactApp2.Server.Models
{
    public class Checkout
    {
        public Guid Id { get; set; }    
        public string FullName { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;    
        public string Province { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty; 
        public Product Product { get; set; }
        public string Quantity { get; set; } = string.Empty;    
        public string ShippingCost { get; set; } = string.Empty;    
        public string TotalAmount { get; set; } = string.Empty; // set copy of price from serverside of the time of saving
        public DateTime CheckOutDate { get; set; } = DateTime.Now;  
    }
}
