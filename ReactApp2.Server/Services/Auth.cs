using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using ReactApp2.Server.Models;
using ReactApp2.Server.Data;
using ReactApp2.Server.Services;
namespace ReactApp2.Server.Services
{

    public class CustomUserManager<TUser> : UserManager<TUser> where TUser : ApplicationUser
    {
        ApplicationDbContext context;
        public CustomUserManager(IUserStore<TUser> store, IOptions<IdentityOptions> optionsAccessor, IPasswordHasher<TUser> passwordHasher,
            IEnumerable<IUserValidator<TUser>> userValidators, IEnumerable<IPasswordValidator<TUser>> passwordValidators, ILookupNormalizer keyNormalizer,
            IdentityErrorDescriber errors, IServiceProvider services, ILogger<UserManager<TUser>> logger, ApplicationDbContext context)
            : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
            this.context = context;
        }

        public override async Task<IdentityResult> CreateAsync(TUser user, string password)
        {
            var result = await base.CreateAsync(user, password);
            var getUserEmail = await base.GetEmailAsync(user);

            if (result.Succeeded && getUserEmail != null)
            {
                Random module = new Random();
                var defaultRole = "Client";
                await AddToRoleAsync(user, defaultRole);
                int code = module.Next(1000, 9999);
                // now send conformation email 
                var helper = new Helper();
                helper.SendEmail(getUserEmail, code);
                var actualUser = await base.FindByEmailAsync(getUserEmail);
                if (actualUser != null)
                {
                    actualUser.EmailConformCode = code;
                    await base.UpdateAsync(actualUser);
                }
            }
            return result;
        }
    }
}

