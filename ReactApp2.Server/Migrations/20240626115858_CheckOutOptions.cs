using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApp2.Server.Migrations
{
    /// <inheritdoc />
    public partial class CheckOutOptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Checkouts_Products_ProductId",
                table: "Checkouts");

            migrationBuilder.DropIndex(
                name: "IX_Checkouts_ProductId",
                table: "Checkouts");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "Checkouts");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Checkouts");

            migrationBuilder.DropColumn(
                name: "ShippingCost",
                table: "Checkouts");

            migrationBuilder.RenameColumn(
                name: "TotalAmount",
                table: "Checkouts",
                newName: "NetTotalAmount");

            migrationBuilder.AlterColumn<string>(
                name: "ZipCode",
                table: "Checkouts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Province",
                table: "Checkouts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "userId",
                table: "Checkouts",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProductCheckout",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    qunaitity = table.Column<int>(type: "int", nullable: false),
                    totalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    size = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CheckoutId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCheckout", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductCheckout_Checkouts_CheckoutId",
                        column: x => x.CheckoutId,
                        principalTable: "Checkouts",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Checkouts_userId",
                table: "Checkouts",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductCheckout_CheckoutId",
                table: "ProductCheckout",
                column: "CheckoutId");

            migrationBuilder.AddForeignKey(
                name: "FK_Checkouts_AspNetUsers_userId",
                table: "Checkouts",
                column: "userId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Checkouts_AspNetUsers_userId",
                table: "Checkouts");

            migrationBuilder.DropTable(
                name: "ProductCheckout");

            migrationBuilder.DropIndex(
                name: "IX_Checkouts_userId",
                table: "Checkouts");

            migrationBuilder.DropColumn(
                name: "userId",
                table: "Checkouts");

            migrationBuilder.RenameColumn(
                name: "NetTotalAmount",
                table: "Checkouts",
                newName: "TotalAmount");

            migrationBuilder.AlterColumn<string>(
                name: "ZipCode",
                table: "Checkouts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Province",
                table: "Checkouts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ProductId",
                table: "Checkouts",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "Quantity",
                table: "Checkouts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShippingCost",
                table: "Checkouts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Checkouts_ProductId",
                table: "Checkouts",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Checkouts_Products_ProductId",
                table: "Checkouts",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
