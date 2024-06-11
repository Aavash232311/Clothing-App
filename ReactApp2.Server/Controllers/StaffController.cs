using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Packaging;
using ReactApp2.Server.Data;
using ReactApp2.Server.Models;
using System.ComponentModel.DataAnnotations;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace ReactApp2.Server.Controllers
{

    public class FeaturedDto
    {
        [MaxLength(50)]
        [Required]
        public string Name { get; set; } = string.Empty;

        [MaxLength(3000)]
        [Required]
        public string Link { get; set; } = string.Empty;

        [MaxLength(100)]
        [Required]
        public string Theme { get; set; } = string.Empty;
        public IFormFile? Image { get; set; }
    }

    public class ProductSear
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public string Brand { get; set; } = string.Empty;
        public List<String> AvalibleSize { get; set; } = new List<String>();
        public List<String>? addedCategory { get; set; } = new List<String>();
        public string Description { get; set; } = string.Empty;
        public IFormFile[]? image { get; set; }
        public string gender { get; set; } = string.Empty;
    }

    [Route("[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        public ApplicationDbContext context;
        public UserManager<ApplicationUser> userManager;
        public Helper helper;
        public StaffController(ApplicationDbContext contexnt, UserManager<ApplicationUser> userManager)
        {
            this.context = contexnt;
            this.userManager = userManager;
            this.helper = new Helper();
        }
        [Route("addHomePageCategory")]
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
        [HttpGet]
        public IActionResult GetCategory()
        {
            var category = this.context.Categories.Where(x => x.Highlighted == true).Take(5);
            return new JsonResult(Ok(category));
        }

        [HttpPost]
        [Route("saveSlotsHomePage")]
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
        [HttpGet]
        public IActionResult GetCategoryLoad() // public
        {
            var getSlots = context.Featureds.Include(x => x.Products).Take(5);
            return new JsonResult(Ok(getSlots));
        }
        [HttpPut]
        [Route("updateSlotsHomePage/{id}")]
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
        [HttpPut]
        [Route("complex-form")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> DynamicFormProballyWillHurt([FromForm] ProductSear productSearlized)
        {
            if (!ModelState.IsValid)
            {
                return new JsonResult(BadRequest(ModelState));
            }
            var images = productSearlized.image;
            List<String> SavedImages = new List<String>();
            // here there are n number of images (since fancy dyanamic form is made)
            foreach (var img in images)
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "images", img.FileName);
                var contentType = img.ContentType;
                var isImage = contentType.StartsWith("image/");
                if (!isImage) { return new JsonResult(BadRequest("Unsupported file ")); }
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await img.CopyToAsync(stream);
                }
                // images folder in the server is all the public images
                SavedImages.Add(Path.Combine("images", img.FileName));
            }   
            if (productSearlized.addedCategory == null || productSearlized.addedCategory.Count() == 0) {
                return new JsonResult(BadRequest("Category cannot be null"));
            }
            var product = new Product
            {
                Name = productSearlized.Name,
                Price = productSearlized.Price,
                Discount = productSearlized.Discount,
                Brand = productSearlized.Brand,
                AvalibleSize = productSearlized.AvalibleSize,
                Images = SavedImages,
                Category = productSearlized.addedCategory,
                Description = productSearlized.Description,
            };
            context.Products.Add(product);
            await context.SaveChangesAsync();
            return new JsonResult(Ok(product));
        }
        [Route("get-procuts")]
        [HttpGet]
        public IActionResult GetProductByName(string name)
        {
            var result = this.context.Products.Where(x => x.Name.Contains(name)).Take(10);
            return new JsonResult(Ok(result));
        }
        [Route("add-theme-product")]
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
        [HttpGet]
        public IActionResult GetProductsTeme(int themeId)
        {
            var getThemeProducts = context.Featureds.Include(x => x.Products).Where(x => x.Id == themeId).FirstOrDefault();
            return new JsonResult(Ok(getThemeProducts));
        }
        [Route("delete-theme-product")]
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
