using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectsAPI.Migrations
{
    /// <inheritdoc />
    public partial class addIm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Im",
                table: "users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Im",
                table: "users");
        }
    }
}
