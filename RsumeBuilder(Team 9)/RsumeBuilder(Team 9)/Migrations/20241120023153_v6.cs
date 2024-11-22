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
            migrationBuilder.CreateTable(
                name: "Job",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ResumeInputId = table.Column<int>(type: "int", nullable: false),
                    CompanyName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Position = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatesWorked = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JobResponsibilities = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Job", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Job_ResumeInput_ResumeInputId",
                        column: x => x.ResumeInputId,
                        principalTable: "ResumeInput",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Job_ResumeInputId",
                table: "Job",
                column: "ResumeInputId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Job");
        }
    }
}
