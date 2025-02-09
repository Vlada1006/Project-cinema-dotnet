using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cinema_project_dotnet.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddTwoNewFieldsInRoom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Rows",
                table: "Rooms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SeatsPerRow",
                table: "Rooms",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rows",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "SeatsPerRow",
                table: "Rooms");
        }
    }
}
