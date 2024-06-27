using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApp2.Server.Migrations
{
    /// <inheritdoc />
    public partial class CheckOutForm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Checkouts_AspNetUsers_userId",
                table: "Checkouts");

            migrationBuilder.RenameColumn(
                name: "userId",
                table: "Checkouts",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "Checkouts",
                newName: "PhoneNumber");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "Checkouts",
                newName: "Address");

            migrationBuilder.RenameIndex(
                name: "IX_Checkouts_userId",
                table: "Checkouts",
                newName: "IX_Checkouts_UserId");

            migrationBuilder.AddColumn<string>(
                name: "userId",
                table: "ProductCheckout",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "NetTotalAmount",
                table: "Checkouts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Street",
                table: "Checkouts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductCheckout_userId",
                table: "ProductCheckout",
                column: "userId");

            migrationBuilder.AddForeignKey(
                name: "FK_Checkouts_AspNetUsers_UserId",
                table: "Checkouts",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductCheckout_AspNetUsers_userId",
                table: "ProductCheckout",
                column: "userId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Checkouts_AspNetUsers_UserId",
                table: "Checkouts");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductCheckout_AspNetUsers_userId",
                table: "ProductCheckout");

            migrationBuilder.DropIndex(
                name: "IX_ProductCheckout_userId",
                table: "ProductCheckout");

            migrationBuilder.DropColumn(
                name: "userId",
                table: "ProductCheckout");

            migrationBuilder.DropColumn(
                name: "Street",
                table: "Checkouts");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Checkouts",
                newName: "userId");

            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "Checkouts",
                newName: "FullName");

            migrationBuilder.RenameColumn(
                name: "Address",
                table: "Checkouts",
                newName: "City");

            migrationBuilder.RenameIndex(
                name: "IX_Checkouts_UserId",
                table: "Checkouts",
                newName: "IX_Checkouts_userId");

            migrationBuilder.AlterColumn<string>(
                name: "NetTotalAmount",
                table: "Checkouts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Checkouts_AspNetUsers_userId",
                table: "Checkouts",
                column: "userId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
