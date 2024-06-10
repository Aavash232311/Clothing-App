using Microsoft.AspNetCore.Identity;
using Microsoft.Identity.Client;

namespace ReactApp2.Server
{
    public class User: IdentityUser
    {
        public string Contact { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string StreetCode { get; set; } = string.Empty;  
        public string ShipAddress { get; set; } = string.Empty;
    }
}
