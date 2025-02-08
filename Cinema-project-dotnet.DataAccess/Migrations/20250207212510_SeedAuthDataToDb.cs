using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Cinema_project_dotnet.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SeedAuthDataToDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6816c544-8422-4d6f-a83e-dbf8d90539f4", "6816c544-8422-4d6f-a83e-dbf8d90539f4", "Admin", "ADMIN" },
                    { "8b2339d6-8db4-4696-924d-5d335c0475bf", "8b2339d6-8db4-4696-924d-5d335c0475bf", "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6816c544-8422-4d6f-a83e-dbf8d90539f4");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8b2339d6-8db4-4696-924d-5d335c0475bf");
        }
    }
}
