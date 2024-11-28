using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RsumeBuilder_Team_9_.Migrations
{
    /// <inheritdoc />
    public partial class v6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Language");

            migrationBuilder.AlterColumn<string>(
                name: "YearGraduated",
                table: "Degree",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateTable(
                name: "SkillsLanguagesCertifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    LanguageName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Proficiency = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CertificationName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CertificationDate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Skills = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Projects = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkillsLanguagesCertifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SkillsLanguagesCertifications_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SkillsLanguagesCertifications_UserId",
                table: "SkillsLanguagesCertifications",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SkillsLanguagesCertifications");

            migrationBuilder.AlterColumn<int>(
                name: "YearGraduated",
                table: "Degree",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "Language",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LanguageName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LanguageProficiency = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Language", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Language_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Language_UserId",
                table: "Language",
                column: "UserId");
        }
    }
}
