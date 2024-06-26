namespace ReactApp2.Server.Models
{
    public class Checkout
    {
        public Guid Id { get; set; }    
        public string FullName { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;    
        public string? Province { get; set; } = string.Empty;
        public string? ZipCode { get; set; } = string.Empty; 
        public List<ProductCheck> products { get; set; } = new List<ProductCheck>();       
        public string NetTotalAmount { get; set; } = string.Empty; // set copy of price from serverside of the time of saving
        public ApplicationUser user { get; set; } = new ApplicationUser();
        public DateTime CheckOutDate { get; set; } = DateTime.Now;  
    }
}
