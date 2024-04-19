using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectsAPI.Migrations
{
    /// <inheritdoc />
    public partial class downloaddoc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DocumentFileName",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DocumentFileName",
                table: "Projects");
        }
    }
}
