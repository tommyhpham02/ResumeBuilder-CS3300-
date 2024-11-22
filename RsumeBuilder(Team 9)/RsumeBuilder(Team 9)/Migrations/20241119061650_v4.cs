using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RsumeBuilder_Team_9_.Migrations
{
    /// <inheritdoc />
    public partial class v4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ResumeInput",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Website = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResumeInput", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResumeInput_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Degree",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ResumeInputId = table.Column<int>(type: "int", nullable: false),
                    College = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CityAndState = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DegreeType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DegreeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    YearGraduated = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Degree", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Degree_ResumeInput_ResumeInputId",
                        column: x => x.ResumeInputId,
                        principalTable: "ResumeInput",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Degree_ResumeInputId",
                table: "Degree",
                column: "ResumeInputId");

            migrationBuilder.CreateIndex(
                name: "IX_ResumeInput_UserId",
                table: "ResumeInput",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Degree");

            migrationBuilder.DropTable(
                name: "ResumeInput");
        }
    }
}
