using ReactApp2.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using ReactApp2.Server.Services;
using ReactApp2.Server.Models;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<ApplicationUser>(options => options.SignIn.RequireConfirmedEmail = false) // later in production set it to true
     .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
     .AddDefaultTokenProviders();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("dbs"))
);
builder.Services.AddScoped<UserManager<ApplicationUser>, CustomUserManager<ApplicationUser>>();



var app = builder.Build();
app.MapIdentityApi<ApplicationUser>();
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors(builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
});


using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    // seed default roles

    string[] roles = new[] { "superuser", "Client", "staff" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
    // create superuser
    var adminEmail = "aavash2005@gmail.com";
    var getUser = await userManager.FindByEmailAsync(adminEmail);
    if (getUser == null)
    {
        var user = new ApplicationUser() { Email = adminEmail, UserName = "aavash2005@gmail.com" };
        var status = await userManager.CreateAsync(user, "Admin!9841");
        if (status.Succeeded)
        {
            var userId = user.Id;
            await userManager.RemoveFromRoleAsync(user, "Client");
            await userManager.AddToRoleAsync(user, "superuser");
        }
    }
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "images")),
    RequestPath = "/images"
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
