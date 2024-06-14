using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ReactApp2.Server.Data;

namespace ReactApp2.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PublicController : ControllerBase
    {
        public ApplicationDbContext context;
        public PublicController(ApplicationDbContext context)
        {
            this.context = context;
        }
        [Route("get-product")]
        [HttpGet]
        public IActionResult GetProduct(string id)
        {
            try
            {
                Guid getId = Guid.Parse(id);
                var product = context.Products.Where(x => x.Id == getId).FirstOrDefault();
                return new JsonResult(Ok(product));
            }
            catch (Exception ex)
            {
                return new JsonResult(BadRequest(new { message = ex.Message }));
            }
        }
        [Route("get-category-procuts")]
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
        }
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

    }
}
