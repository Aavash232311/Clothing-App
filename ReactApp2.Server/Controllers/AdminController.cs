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
    public class AdminController : ControllerBase
    {
        ApplicationDbContext context;
        public AdminController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [Route("addCategory")]
        [HttpPost]
        public async Task<IActionResult> AddCategory(CategorySearlized category)
        {
            if (category.Type == "") return new JsonResult(BadRequest());
            Category newCategory = new Category();
            if (category.Parent != "")
            {
                try
                {
                    var parent = this.context.Categories.Where(x => x.Id == Guid.Parse(category.Parent)).FirstOrDefault();
                    if (parent != null)
                    {
                        newCategory.Parent = parent;
                    }

                }
                catch (Exception ex) { return new JsonResult(BadRequest(new { error = ex })); }
            }
            newCategory.ProductCategory = category.Type;
            var ent = this.context.Add(newCategory);
            await this.context.SaveChangesAsync();
            return new JsonResult(Ok());
        }
        [Route("searchCategory")]
        [HttpGet]
        public  IActionResult GetSearchedCategory(string query)
        {
            if (query != null && query.Length > 2)
            {
                var result = this.context.Categories.Include(c => c.Parent).Where(x => x.ProductCategory.Contains(query)).Take(10);
                return new JsonResult(Ok(new { result = result }));
            }else
            {
                return new JsonResult(Ok(new { result = "" }));
            }
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
            }catch (Exception ex)
            {
                return new JsonResult(BadRequest(new { message = ex }));
            }
        }
        [Route("updateCategory")]
        [HttpPost]
        public async Task<IActionResult> UpdateCategory(string id, CategorySearlized category)
        {
            try
            {
                var getCategory = this.context.Categories.Where(x => x.Id == Guid.Parse(id)).FirstOrDefault();
                if (getCategory != null)
                {
                    getCategory.ProductCategory = category.Type;
                    if (category.Parent != "")
                    {
                        var getParent = this.context.Categories.Where(x => x.Id == Guid.Parse(category.Parent)).FirstOrDefault();
                        if (getParent != null && id != category.Parent)
                        {
                            getCategory.Parent = getParent;
                        }
                    }
                    await context.SaveChangesAsync();

                }
                return new JsonResult(Ok());
            }catch (Exception ex)
            {
                return new JsonResult(BadRequest(new {message = ex}));
            }
        }
    }

}
