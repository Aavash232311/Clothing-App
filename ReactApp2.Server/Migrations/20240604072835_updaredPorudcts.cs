using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactApp2.Server.Migrations
{
    /// <inheritdoc />
    public partial class updaredPorudcts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Products");
        }
    }
}
