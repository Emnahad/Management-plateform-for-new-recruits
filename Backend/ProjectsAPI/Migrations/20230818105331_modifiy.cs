using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectsAPI.Migrations
{
    /// <inheritdoc />
    public partial class modifiy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "contactmessages",
                newName: "Username");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "contactmessages",
                newName: "FullName");
        }
    }
}
