namespace ReactApp2.Server.Models
{
    public class Checkout
    {
        public Guid Id { get; set; }    
        public string Address { get; set; } = string.Empty;    
        public string? Province { get; set; } = string.Empty;
        public string? ZipCode { get; set; } = string.Empty; 
        public List<ProductCheck>? products { get; set; } = new List<ProductCheck>();       
        public decimal? NetTotalAmount { get; set; } // set copy of price from serverside of the time of saving
        public ApplicationUser? User { get; set; } = new ApplicationUser();
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Street { get; set; } = string.Empty;  
        public DateTime CheckOutDate { get; set; } = DateTime.Now;  
        public string? Status { get; set; } = string.Empty;
        public bool IsApproved { get; set; } = false; 
        // required things on upload from user
        // address, PhoneNumber
    }
}
