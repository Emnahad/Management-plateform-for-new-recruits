using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectsAPI.Migrations
{
    /// <inheritdoc />
    public partial class upd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "users");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "users",
                newName: "FullName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "users",
                newName: "LastName");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "users",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
