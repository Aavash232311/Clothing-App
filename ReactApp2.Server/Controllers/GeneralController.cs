using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ReactApp2.Server.Data;
using ReactApp2.Server.Models;
namespace ReactApp2.Server.Controllers
{
    public class Registor
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get;set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }
    public class Email
    {
        public string mail { get; set; } = string.Empty;
        public int code { get; set; }
    }
    [Route("[controller]")]
    [Authorize]
    [ApiController]
    public class GeneralController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public ApplicationDbContext context;

        public GeneralController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            this.context = context;
        }

        [Route("getClient")]
        [HttpGet]
        public async Task<IActionResult> GetUserInfo()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            // we need to make some abstraction
            // the info we might be giving is password hash and otp 
            return new JsonResult(Ok(user));
        }
        [Route("getRls")]
        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
      
            if (user == null) return new JsonResult(BadRequest("user not found"));
            var userRole = await _userManager.GetRolesAsync(user);
            
            return new JsonResult(Ok(userRole));
        }
        [Route("activate")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> ActivateAccount(Email userInfo)
        {
            var user = await _userManager.FindByEmailAsync(userInfo.mail) as ApplicationUser;
            if (user == null) { return new JsonResult(BadRequest(new {message = "No"})); }
            int code = userInfo.code;
            if (code == user.EmailConformCode)
            {
                user.EmailConfirmed = true;
                await context.SaveChangesAsync();
                return new JsonResult(Ok());
            }
            return new JsonResult(BadRequest());
        }
    }
}
