using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Security;
using MimeKit.Text;
using MailKit.Net.Smtp;
using ReactApp2.Server.Models;
using ReactApp2.Server.Data;
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
                int code = module.Next(1000, 9999);
                var defaultRole = "Client";
                await AddToRoleAsync(user, defaultRole);

                // now send conformation email 
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse("aavash2005@gmail.com"));
                email.To.Add(MailboxAddress.Parse(getUserEmail));
                email.Subject = "Email verification";
                email.Body = new TextPart(TextFormat.Html)
                {
                    Text = $"Hi we would like to comform your" +
                    $" login your code is: {code}" +
                    $" -VINTAGE STEP team, SR ER Aavash Lamichhane"
                };

                using var smtp = new SmtpClient();
                smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                smtp.Authenticate("aavash2005@gmail.com", ""); // your own app password and email or mail password
                var actualUser = await base.FindByEmailAsync(getUserEmail);
                if (actualUser != null)
                {
                    actualUser.EmailConformCode = code;
                    await base.UpdateAsync(actualUser);
                    smtp.Send(email);
                    smtp.Disconnect(true);
                }
            }
            return result;
        }
    }
}

