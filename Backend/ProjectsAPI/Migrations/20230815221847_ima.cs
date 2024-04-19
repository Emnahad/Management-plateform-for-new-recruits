using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectsAPI.Migrations
{
    /// <inheritdoc />
    public partial class ima : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Image",
                table: "users",
                newName: "Im");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Im",
                table: "users",
                newName: "Image");
        }
    }
}
