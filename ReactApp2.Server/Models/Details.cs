namespace ReactApp2.Server.Models
{
    public class Details
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Profile { get; set; } = string.Empty; 
        public ApplicationUser User { get; set; }

    }
}
