using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;
using System.Linq;
using ReactApp2.Server.Models;

#nullable disable

namespace ReactApp2.Server.Migrations
{
    public partial class SeedDatabaseWithProducts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var random = new Random();

            for (int i = 0; i < 50; i++)
            {
                var product = new Product
                {
                    Id = Guid.NewGuid(),
                    Name = $"Product {i + 1}",
                    Brand = "Random Brand",
                    Price = random.Next(10, 1000),
                    Discount = random.Next(0, 50),
                    Images = new List<string> { "images\\\test.png" },
                    Description = "Random description",
                    AvalibleSize = new List<string> { "S", "M", "L" },
                    Category = GenerateRandomCategoryIds(random),
                    Gender = random.Next(0, 2) == 0 ? "Male" : "Female",
                    Added = DateTime.Now
                };

                migrationBuilder.InsertData(
                    table: "Products",
                    columns: new[] { "Id", "Name", "Brand", "Price", "Discount", "Images", "Description", "AvalibleSize", "Category", "Gender", "Added" },
                    values: new object[]
                    {
                        product.Id,
                        product.Name,
                        product.Brand,
                        product.Price,
                        product.Discount,
                        $"[{ '"' + string.Join(",", product.Images) + '"'}]",
                        // database does not directly saves array oka so
                        // asp.net on the inside handles this inside
                        // and while sending to client it itself converts to array
                        product.Description,
                        $"[{ '"' + string.Join(",", product.AvalibleSize) + '"'}]",
                        $"[{ '"' + string.Join(",", product.Category) + '"'}]",
                        product.Gender,
                        product.Added
                    });
            }
        }

        private List<string> GenerateRandomCategoryIds(Random random)
        {
            var categoryIds = new List<string>
            {
                "E3D73535-6EF8-41AA-DFEE-08DC83E9E6A0",
                "78FC1C50-74BA-4E12-DFEF-08DC83E9E6A0",
                "8ADC9E76-3E5F-4509-DFF0-08DC83E9E6A0",
                "AC9DFC31-C46F-4F24-DFF1-08DC83E9E6A0",
                "9F73F4DB-9736-4152-DFF2-08DC83E9E6A0"
            };

            return categoryIds.OrderBy(x => random.Next()).Take(4).ToList();
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Optionally add code to delete the seeded data if needed
        }
    }
}

