using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApp2.Server.Migrations
{
    /// <inheritdoc />
    public partial class productOptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "ProductCheckout",
                newName: "productId");

            migrationBuilder.AlterColumn<Guid>(
                name: "productId",
                table: "ProductCheckout",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.CreateIndex(
                name: "IX_ProductCheckout_productId",
                table: "ProductCheckout",
                column: "productId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductCheckout_Products_productId",
                table: "ProductCheckout",
                column: "productId",
                principalTable: "Products",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductCheckout_Products_productId",
                table: "ProductCheckout");

            migrationBuilder.DropIndex(
                name: "IX_ProductCheckout_productId",
                table: "ProductCheckout");

            migrationBuilder.RenameColumn(
                name: "productId",
                table: "ProductCheckout",
                newName: "ProductId");

            migrationBuilder.AlterColumn<Guid>(
                name: "ProductId",
                table: "ProductCheckout",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);
        }
    }
}
