﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using ReactApp2.Server.Data;
using ReactApp2.Server.Models;
namespace ReactApp2.Server.Controllers
{
    public class Ids
    {
        public Guid[] id { get; set; }
    }
    public class ProductAndQuantity
    {
        public Guid ProductId { get; set; }
        public int qty { get; set; }
        public decimal? totalPrice { get; set; } = 0;
        public List<Guid> option { get; set; } = new List<Guid>();
    }
    public class SearlizedCheckout
    {
        public string Address { get; set; } = string.Empty;
        public string? Province { get; set; } = string.Empty;
        public string? ZipCode { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Street { get; set; } = string.Empty;
        public List<ProductAndQuantity> CheckOutProducts { get; set; } = new List<ProductAndQuantity>();
    }

    [Route("[controller]")]
    [ApiController]
    public class PublicController : ControllerBase
    {
        public ApplicationDbContext context;
        public UserManager<ApplicationUser> userManager;
        public PublicController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }
        [Route("order-by-id")]
        [HttpGet]
        public IActionResult OrderGet(Guid id)
        {
            var getOrder = context.Checkouts.Include(p => p.products).Where(x => x.Id == id).FirstOrDefault();
            return new JsonResult(Ok(getOrder));
        }
        [Route("deliveryCharge")]
        [HttpGet]
        public IActionResult GetDeliveryCharge()
        {
            return new JsonResult(Ok(context.Deliveries.FirstOrDefault()));
        }
        // later after fixing bug in auth add authorize 
        [Route("checkout-product")]
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CheckOutPorudct(SearlizedCheckout CheckOutProduct)
        {
            decimal Total = 0;
            List<ProductCheck> product = new List<ProductCheck>();
            var user = await userManager.GetUserAsync(HttpContext.User) as ApplicationUser;
            if (user == null)
            {
                return Unauthorized(new { message = "Unauthorized access." });
            }
            foreach (var i in CheckOutProduct.CheckOutProducts)
            {
                // since we don't want to be dependent upon prcie for frontend
                var getProduct = context.Products.Where(x => x.Id == i.ProductId).FirstOrDefault();
                if (getProduct == null) { return new JsonResult(BadRequest(new { message = "something went wrong :(" })); }
                Total += getProduct.Price * i.qty;
                // we need to fetch list of options that user has selected
                List<OptionsStructure> optionsStructures = new List<OptionsStructure>();
                foreach (var j in i.option)
                {
                    var getOptions = context.optionsStructures.Where(x => x.Id == j).FirstOrDefault();
                    if (getOptions != null)
                    {
                        optionsStructures.Add(getOptions);
                    }
                }
                product.Add(new ProductCheck
                {
                    qty = i.qty,
                    totalPrice = getProduct.Price * i.qty,
                    user = user,
                    product = getProduct,
                    option = optionsStructures 
                });
                var additionalCharge = context.Deliveries.FirstOrDefault();
                if (additionalCharge != null)
                {
                    Total += additionalCharge.DeliveryAmount;
                }
            }
            var checkout = new Checkout()
            {
                Address = CheckOutProduct.Address,
                ZipCode = CheckOutProduct.ZipCode,
                PhoneNumber = CheckOutProduct.PhoneNumber,
                Province = CheckOutProduct.Province,
                Street = CheckOutProduct.Street,
                Status = "not verified",
                NetTotalAmount = Total,
                products = product,
                User = user
            };
            context.Checkouts.Add(checkout);
            await context.SaveChangesAsync();
            return new JsonResult(Ok(checkout));
        }
        [Route("get-product")]
        [HttpGet]
        public IActionResult GetProduct(string id)
        {
            try
            {
                Guid getId = Guid.Parse(id);
                var product = context.Products.Include(o => o.Options).Where(x => x.Id == getId).FirstOrDefault();
                return new JsonResult(Ok(product));
            }
            catch (Exception ex)
            {
                return new JsonResult(BadRequest(new { message = ex.Message }));
            }
        }
 /*       [Route("get-category-procuts")]
        [HttpGet]
        public IActionResult GetCategoryProduct(string id, int page)
        {
            if (page < 1)
            {
                return new JsonResult(NotFound());
            }
            try
            {
                Random random = new Random();
                Guid getId = Guid.Parse(id); // we need to if the id is valid guid or not despite we are comparing from string
                                             // skip record(x) = page size * (page number - 1)
                                             // example x =    5 * (2 - 1) = 5 (skpils the next 5 record which has already been displayed in previous respose)
                                             // total number of page(n) = total items / items per page (round up to nearest number)
                var result = context.Products.Where(x => x.Category.Contains(id)).ToList();
                result = result.OrderBy(p => random.Next()).ToList();
                int numberOfRecords = result.Count();
                var take = result.Skip(18 * (page - 1)).Take(18).ToList();
                decimal n = numberOfRecords / 18;
                int range = (int)Math.Ceiling(n);
                return new JsonResult(Ok(new {value = take, page= range + 1}));
            }
            catch (Exception ex) { return new JsonResult(BadRequest(new {message = ex.Message})); }
        }*/
        [Route("get-category-by-id")]
        [HttpGet]
        public IActionResult GetCategoryByName(string id)
        {
            try
            {
                Guid CategoryId = Guid.Parse(id);
                var get = context.Categories.Where(x => x.Id == CategoryId).FirstOrDefault();
                return new JsonResult(Ok(get));
            }catch(Exception ex)
            {
                return new JsonResult(BadRequest(new { message = ex.Message }));
            }
        }
        [Route("product-by-array")]
        [HttpPost]
        public IActionResult GetProductByArray(Ids items)
        {
            Guid[] arr = items.id;
            if (arr != null && arr.Length > 0 && arr.Length <= 20)
            {
             var products = context.Products.Include(o => o.Options).Where(x => arr.Contains(x.Id));
             return new JsonResult(Ok(products));
            }
            return new JsonResult(BadRequest(new {message = "invalid entry"}));
        }
        [Route("category-hierarchy-intial-first-order")]
        [HttpGet]
        public IActionResult GetCategoryHierarchy()
        {

            return new JsonResult(Ok(context.Categories.Where(x => x.ParentId == string.Empty).Include(p => p.Children).ToList().Take(10)));
        }
        [Route("search-category-all-orders")]
        [HttpGet]
        public IActionResult GetResult(string search)
        {
            var categories = context.Categories.Include(c => c.Children).Take(5);
            return new JsonResult(Ok(categories));
        }
        [Route("category-depthin")]
        [HttpGet]
        public IActionResult ChildrenSeatch(Guid parentId)
        {
            var res = context.Categories.Where(x => x.Id == parentId).Include(c => c.Children).FirstOrDefault();
            return new JsonResult(Ok(res));
        }
    }
}
