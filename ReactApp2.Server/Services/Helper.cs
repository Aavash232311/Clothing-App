using MimeKit;
using MailKit.Security;
using MimeKit.Text;
using MailKit.Net.Smtp;

namespace ReactApp2.Server {
    public class Helper
    { 
        Random random = new Random();
        public string GenerateImageName(string fileNameWithExtension)
        {
            return Guid.NewGuid().ToString() + random.Next(0, 10000) + fileNameWithExtension;
        }
        public void SendEmail(string Email, int code)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("aavash2005@gmail.com"));
            email.To.Add(MailboxAddress.Parse(Email));
            email.Subject = "Email verification";
            email.Body = new TextPart(TextFormat.Html)
            {
                Text = $"Hi we would like to comform your" +
                $" login your code is: {code}" +
                $" -VINTAGE STEP team, SR ER Aavash Lamichhane"
            };

            using var smtp = new SmtpClient();
            smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate("aavash2005@gmail.com", "biplzzijfnzywptb"); // your own app password and email or mail password
            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}