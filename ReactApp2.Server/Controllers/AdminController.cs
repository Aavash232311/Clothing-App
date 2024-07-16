using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp2.Server.Data;
using ReactApp2.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace ReactApp2.Server.Controllers
{

    public class CategorySearlized
    {
        public string Parent { get; set; } = null;
        public string Type { get; set; } = string.Empty;
    }

    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "superuser, staff")]
    public class AdminController : ControllerBase
    {
        ApplicationDbContext context;
        public AdminController(ApplicationDbContext context)
        {
            this.context = context;
        }
        [Route("createCategory")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateCategory(string newCategory)
        {
            context.Categories.Add(new Category() { ProductCategory = newCategory });
            await context.SaveChangesAsync();
            return new JsonResult(Ok());
        }
        [Route("categoryHierarchy")]
        [HttpPost]
        [AllowAnonymous] // for test :(
        public async Task<IActionResult> CategoryHierarchy(Guid parentId, string newCategory)
        {
            var getParent = context.Categories.Where(x => x.Id == parentId).Include(c => c.Children).FirstOrDefault();
            if (getParent == null) { return new JsonResult(BadRequest()); }
            Category category = new Category()
            {
                ProductCategory = newCategory,
                ParentId = getParent.Id.ToString()
            };
            getParent.Children.Add(category);
            await context.SaveChangesAsync();
            return new JsonResult(Ok());
        }

        [Route("InitinalCategory")]
        [HttpGet]
        public IActionResult GetInitialCategory()
        {
            var result = this.context.Categories.Take(5);
            return new JsonResult(Ok(result));
        }
        [Route("deleteCategory")]
        [HttpGet]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            try
            {
                var getCategory = context.Categories.Where(x => x.Id == Guid.Parse(id)).FirstOrDefault();
                if (getCategory != null)
                {
                    context.Categories.Remove(getCategory);
                    await context.SaveChangesAsync();
                }
                return new JsonResult(Ok());
            }
            catch (Exception ex)
            {
                return new JsonResult(BadRequest(new { message = ex }));
            }
        }
    }

}
