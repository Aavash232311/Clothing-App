using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApp2.Server.Migrations
{
    /// <inheritdoc />
    public partial class OrderCheckOutFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "size",
                table: "ProductCheckout");

            migrationBuilder.AddColumn<Guid>(
                name: "ProductCheckId",
                table: "optionsStructures",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_optionsStructures_ProductCheckId",
                table: "optionsStructures",
                column: "ProductCheckId");

            migrationBuilder.AddForeignKey(
                name: "FK_optionsStructures_ProductCheckout_ProductCheckId",
                table: "optionsStructures",
                column: "ProductCheckId",
                principalTable: "ProductCheckout",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_optionsStructures_ProductCheckout_ProductCheckId",
                table: "optionsStructures");

            migrationBuilder.DropIndex(
                name: "IX_optionsStructures_ProductCheckId",
                table: "optionsStructures");

            migrationBuilder.DropColumn(
                name: "ProductCheckId",
                table: "optionsStructures");

            migrationBuilder.AddColumn<string>(
                name: "size",
                table: "ProductCheckout",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
