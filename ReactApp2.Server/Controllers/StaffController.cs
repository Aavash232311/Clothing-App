﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp2.Server.Data;
using ReactApp2.Server.Models;
namespace ReactApp2.Server.Controllers
{

    public class FeaturedDto
    {
        public string Name { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;
        public string Theme { get; set; } = string.Empty;
        public IFormFile? Image { get; set; }
    }
    public class ProductSub
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Brand { get; set; } = string.Empty;
        public decimal Discount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? Gender { get; set; } = string.Empty;
        public IFormFile[]? Images { get; set; }
        public string? ShippingNotes { get; set; } = string.Empty;
        public string? WarrantyInfo { get; set; } = string.Empty;
        public int Length { get; set; } = 0;
        public int Height { get; set; } = 0;
        public int Breadth { get; set; } = 0;
        public string? SKU { get; set; } = string.Empty;
        public Guid Category { get; set; }
        public List<String> Tags { get; set; } = new List<String>();
        public bool InStock { get; set; } = false;
    }

    public class OptionsStructureSearlized
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string type { get; set; } = string.Empty;
    }

    public class OverAllFormProduct {
        public ProductSub product { get; set; }
        public List<OptionStructureSear>? options { get; set; }
    }

    public class OptionStructureSear
    {
        public string Name { get; set; } = string.Empty;
        public IFormFile? Image { get; set; }
        public string? Description { get; set; } = string.Empty;
        public string? Price { get; set; } = string.Empty;
        public string type { get; set; } = string.Empty;
    }

    [Route("[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        public ApplicationDbContext context;
        public UserManager<ApplicationUser> userManager;
        public string[] arr = { "not verified", "completed", "set to delivery", "cancel" };
        public Helper helper;
        public StaffController(ApplicationDbContext contexnt, UserManager<ApplicationUser> userManager)
        {
            this.context = contexnt;
            this.userManager = userManager;
            this.helper = new Helper();
        }
        /*       [Route("test-product-seed")]
               [HttpGet]
               public async Task<IActionResult> SeedTable()
               {
                   Random random = new Random();
                   var user = await userManager.GetUserAsync(HttpContext.User);
                   for (int i = 0; i <= 40; i++)
                   {
                       Product product = new Product
                       {
                           Name = "Product " + i,
                           SKU = "",
                           Brand = "Nike",
                           Price = random.Next(5, 1000),
                           Images = new List<string>() { },
                           Description = "random description",
                           Gender = "male",
                           ShippingNotes = "careful!",
                           WarrantyInfo = "1 year international warranty",
                           InStock = true,
                           Length = 10,
                           Height = 15,
                           Breadth = 15,
                           Tags = new List<String>() { "shoes" },
                           Category = context.Categories.Where(x => x.Id == Guid.Parse("1314E450-F989-454A-FB0F-08DC9D3C49B9")).FirstOrDefault(),
                           User = user,
                           Options = new List<OptionsStructure>() {
                               new OptionsStructure {
                                   Name = "UK 5.5",
                                   type = "AvalibleSize"
                               }
                           },
                           Discount = 0
                       };
                       context.Products.Add(product);
                   }
                   await context.SaveChangesAsync();
                   return new JsonResult(Ok());
               }*/

        [Route("complex-product-form")]
        [Authorize(Roles = "superuser, staff")]
        [HttpPut]
        public async Task<IActionResult> SubmitPorudct([FromForm] OverAllFormProduct sear)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ProductSub? productFromFrontEnd = sear.product;
            var optionsFromFrontEnd = sear.options;
            if (productFromFrontEnd == null) return new JsonResult(BadRequest());
            List<String> SavedImages = new List<String>();
            // save product image

            foreach (var  img in productFromFrontEnd.Images)
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "images", img.FileName);
                var contentType = img.ContentType;
                var isImage = contentType.StartsWith("image/");
                if (!isImage) { return new JsonResult(BadRequest(new {errors = "Unsupported file"})); }
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await img.CopyToAsync(stream);
                }
                // images folder in the server is all the public images
                SavedImages.Add(Path.Combine("images", img.FileName));
            }
            Guid categoryId = productFromFrontEnd.Category;
            var getCategory = context.Categories.Where(x => x.Id == categoryId).FirstOrDefault();
            var user = await this.userManager.GetUserAsync(HttpContext.User);
            if (getCategory == null) return new JsonResult(BadRequest(new { errors = "Invalid entry for category" }));
            List<OptionsStructure> optionStructure = new List<OptionsStructure>();
            if (optionsFromFrontEnd != null)
            { 
                foreach (var i in optionsFromFrontEnd)
                {
                    // since we are iterating over that options
                    // first we need to save iamges in stream then 
                    var img = i.Image;
                    var ImagePathInServer = string.Empty;
                    if (img != null)
                    {
                        var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "images", img.FileName);
                        var contentType = img.ContentType;
                        var isImage = contentType.StartsWith("image/");
                        if (!isImage) { return new JsonResult(BadRequest(new { errors = "Unsupported file" })); }
                        using (var stream = new FileStream(imagePath, FileMode.Create))
                        {
                            await img.CopyToAsync(stream);
                        }
                        ImagePathInServer = Path.Combine("images", img.FileName);
                    }
                    decimal OptionPrice;
                    try
                    {
                        OptionPrice = decimal.Parse(i.Price);
                    }catch (Exception EX)
                    {
                        OptionPrice = 0;
                    }
                    var optionInstance = new OptionsStructure()
                    {
                        Name = i.Name,
                        Image = ImagePathInServer,
                        Description = i.Description,
                        Price = OptionPrice,
                        type = i.type
                    };
                    optionStructure.Add(optionInstance);
                }
            }
            context.Products.Add(new Product
            {
                Name = productFromFrontEnd.Name,
                SKU = productFromFrontEnd.SKU,
                Brand = productFromFrontEnd.Brand,
                Price = productFromFrontEnd.Price,
                Images = SavedImages,
                Description = productFromFrontEnd.Description,
                Gender = productFromFrontEnd.Gender,
                ShippingNotes = productFromFrontEnd.ShippingNotes,
                WarrantyInfo = productFromFrontEnd.WarrantyInfo,
                InStock = productFromFrontEnd.InStock,
                Length = productFromFrontEnd.Length,
                Height = productFromFrontEnd.Height,
                Breadth = productFromFrontEnd.Breadth,
                Tags = productFromFrontEnd.Tags,
                Category = getCategory,
                User = user,
                Options = optionStructure,
                Discount = productFromFrontEnd.Discount
            });
            await context.SaveChangesAsync();
            return new JsonResult(Ok(sear));
        }

        [Route("order-status")]
        [Authorize(Roles = "superuser, staff")]
        [HttpGet]
        public async Task<IActionResult> OrderStatus(string status, Guid id)
        {
            // not verified completed set to delivery
            if (Array.IndexOf(arr, status) == -1) { return new JsonResult(BadRequest()); }
            var getCheckout = context.Checkouts.Where(x => x.Id == id).FirstOrDefault();
            if (getCheckout == null) { return new JsonResult(BadRequest()); }
            getCheckout.Status = status;
            await context.SaveChangesAsync();
            return new JsonResult(Ok());
        }

        [Route("load-orders")]
        [Authorize(Roles = "superuser, staff")]
        [HttpGet]
        public IActionResult LoadOrders(int page, string filter)
        {
            if (page <= 0)
            {
                return BadRequest(new { message = "page cannot be less than or equal to 0" });
            }
            if (Array.IndexOf(arr, filter) == -1) { return new JsonResult(BadRequest()); }
            var orders = context.Checkouts
                .Include(x => x.products)
                    .ThenInclude(p => p.product)
                .Include(x => x.User)
                .Include(p => p.products)
                .ThenInclude(O => O.option)
                .Where(x => x.Status == filter)
                .OrderByDescending(x => x.CheckOutDate);
            int RecordPerPage = 4;
            var Partition = orders.Skip((page - 1) * RecordPerPage).Take(RecordPerPage);
            return new JsonResult(Ok(new {page = (int)Math.Ceiling((double)orders.Count() / RecordPerPage), orders = Partition }));
        }
        [Route("product-table")]
        [Authorize(Roles = "superuser, staff")]
        [HttpGet]
        public IActionResult GetProducts(int page)
        {
            if (page == 0)
            {
                return new JsonResult(BadRequest("!0"));
            }
            var product = context.Products.Include(o => o.Options).OrderByDescending(x => x.Added);
            int RecordPerPage = 4;
            var Partition = product.Skip((page - 1) * RecordPerPage).Take(RecordPerPage);
            if (product == null) return new JsonResult(NotFound());
            return new JsonResult(Ok(new {page = (int)Math.Ceiling((double)product.Count() / RecordPerPage), products = Partition }));
        }
        [Route("set-delivery-charge")]
        [Authorize(Roles = "superuser, staff")]
        [HttpPut] 
        public async Task<IActionResult> SetDeliveryCharge(decimal charge)
        {
            var getChargeModule = context.Deliveries.FirstOrDefault();
            if (getChargeModule == null) return new JsonResult(NotFound());
            getChargeModule.DeliveryAmount = charge;
            await context.SaveChangesAsync();
            return new JsonResult(Ok());
        }
        [Route("addHomePageCategory")]
        [Authorize(Roles = "superuser, staff")]
        [HttpGet]
        public async Task<IActionResult> AddHomePageCategory(string id, string action)
        {
            try
            {
                var countTotal = this.context.Categories.Where(x => x.Id == Guid.Parse(id) && x.Highlighted == true).Count();
                if (countTotal <= 5)
                {
                    var getElement = this.context.Categories.Where(x => x.Id == Guid.Parse(id)).FirstOrDefault();

                    if (getElement != null)
                    {
                        if (action == "checked")
                        {
                            getElement.Highlighted = true;
                            await context.SaveChangesAsync();
                            return new JsonResult(Ok());
                        }
                        getElement.Highlighted = false;
                        await context.SaveChangesAsync();
                        return new JsonResult(Ok());
                    }
                }
                return new JsonResult(BadRequest(new { error = "it should be less than five", code = 101 }));
            }
            catch (Exception ex)
            {
                return new JsonResult(BadRequest(new { error = ex, code = 201 }));
            }
        }

        [Route("getHomePageCategory")] // make this one public
        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetCategory()
        {
            var category = this.context.Categories.Where(x => x.Highlighted == true).Take(5);
            return new JsonResult(Ok(category));
        }

        [HttpPost]
        [Route("saveSlotsHomePage")]
        [Authorize(Roles = "superuser, staff")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PostFeatured([FromForm] FeaturedDto featuredDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "images", featuredDto.Image.FileName);
            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await featuredDto.Image.CopyToAsync(stream);
            }
            var featured = new Featured
            {
                Name = featuredDto.Name,
                Link = featuredDto.Link,
                Theme = featuredDto.Theme,
                Image = Path.Combine("images", featuredDto.Image.FileName)
            };

            context.Featureds.Add(featured);
            await context.SaveChangesAsync();

            return new JsonResult(Ok());
        }
        [Route("deleteSlots")]
        [Authorize(Roles = "superuser, staff")]
        [HttpGet]
        public async Task<IActionResult> DeleteSlots(int id)
        {
            var getItem = context.Featureds.Where(X => X.Id == id).FirstOrDefault();
            if (getItem == null) { return BadRequest(); }
            // delete img
            var path = Path.Combine(Directory.GetCurrentDirectory(), getItem.Image);
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }
            context.Featureds.Remove(getItem);
            await context.SaveChangesAsync();
            return new JsonResult(Ok());
        }
        [Route("getSlotsHomePage")]
        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetCategoryLoad() // public
        {
            var getSlots = context.Featureds.Include(x => x.Products).Take(5);
            var getRecent = context.Products.OrderBy(x => x.Added).Take(6);
            return new JsonResult(Ok(new {products = getSlots, recent = getRecent }));
        }
        [HttpPut]
        [Route("updateSlotsHomePage/{id}")]
        [Authorize(Roles = "superuser, staff")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateFeatured(int id, [FromForm] FeaturedDto featuredDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var existingFeatured = await context.Featureds.FindAsync(id);
            if (existingFeatured == null)
            {
                return NotFound();
            }
            if (featuredDto.Image != null)
            {
                string imageName = this.helper.GenerateImageName(featuredDto.Image.FileName);
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "images", imageName);
                // delete old path
                var oldPath = Path.Combine(Directory.GetCurrentDirectory(), existingFeatured.Image);
                if (System.IO.File.Exists(oldPath))
                {
                    System.IO.File.Delete(oldPath);
                }
                if (!featuredDto.Image.ContentType.StartsWith("image/")) return new JsonResult(BadRequest(new {message = "unsupported media :()"}));
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await featuredDto.Image.CopyToAsync(stream);
                    existingFeatured.Image = Path.Combine("images", imageName);
                }

            }

            existingFeatured.Name = featuredDto.Name;
            existingFeatured.Link = featuredDto.Link;
            existingFeatured.Theme = featuredDto.Theme;
            context.Featureds.Update(existingFeatured);
            await context.SaveChangesAsync();
            return new JsonResult(Ok());
        }

        [Route("get-procuts")]
        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetProductByName(string name)
        {
            var result = this.context.Products.Where(x => x.Name.Contains(name)).Take(10);
            return new JsonResult(Ok(result));
        }
        [Route("add-theme-product")]
        [Authorize(Roles = "superuser, staff")]
        [HttpGet]
        public async Task<IActionResult> AddFeaturedProducts(int themeId, string productId)
        {
            try
            {
                Guid existingProductId = Guid.Parse(productId);
                var getProductById = context.Products.Where(x => x.Id == existingProductId).FirstOrDefault();
                if (getProductById == null) return new JsonResult(NotFound(new { message = "product not found" }));
                var getTheme = context.Featureds.Where(x => x.Id == themeId).FirstOrDefault();
                if (getTheme == null) return new JsonResult(NotFound(new { message = "theme not found" }));

                var createCopyOfProducts = getTheme.Products;
                var checkForExisting = createCopyOfProducts.Where(x => x.Id == existingProductId).FirstOrDefault();
                if (checkForExisting == null)
                {
                    createCopyOfProducts.Add(getProductById);
                    getTheme.Products = createCopyOfProducts;
                    await context.SaveChangesAsync();
                    return new JsonResult(Ok());
                }

                return new JsonResult(NotFound("already exists"));
            }
            catch (Exception ex)
            {
                return new JsonResult(BadRequest(new { message = ex.Message }));
            }
        }
        [Route("get-temed-product")]
        [Authorize(Roles = "superuser, staff")]
        [HttpGet]
        public IActionResult GetProductsTeme(int themeId)
        {
            var getThemeProducts = context.Featureds.Include(x => x.Products).Where(x => x.Id == themeId).FirstOrDefault();
            return new JsonResult(Ok(getThemeProducts));
        }
        [Route("delete-theme-product")]
        [Authorize(Roles = "superuser, staff")]
        [HttpGet]
        public async Task<IActionResult> DeleteThemedProcuts(int themeId, string productId)
        {
            try
            {
                var getTheme = context.Featureds.Where(x => x.Id == themeId).FirstOrDefault();
                if (getTheme != null)
                {
                    Guid existingProductId = Guid.Parse(productId);
                    var getProduct = context.Products.Where(x => x.Id == existingProductId).FirstOrDefault();
                    if (getProduct == null) return new JsonResult(Ok("product not found"));
                    getTheme.Products.Remove(getProduct);
                    await context.SaveChangesAsync();
                    return new JsonResult(Ok(getTheme));
                }
                return new JsonResult(Ok("the id is incorrect"));
            }
            catch (Exception ex)
            {
                return new JsonResult(BadRequest(new { message = ex.Message }));
            }
        }
    }
}
