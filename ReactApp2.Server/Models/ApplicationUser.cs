using Microsoft.AspNetCore.Identity;

namespace ReactApp2.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public int EmailConformCode { get; set; }
    }
}
