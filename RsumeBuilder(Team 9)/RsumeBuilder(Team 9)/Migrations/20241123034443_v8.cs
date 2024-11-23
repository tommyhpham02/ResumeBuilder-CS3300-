using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RsumeBuilder_Team_9_.Migrations
{
    /// <inheritdoc />
    public partial class v8 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DatesWorked",
                table: "Job",
                newName: "StartDate");

            migrationBuilder.AddColumn<bool>(
                name: "CurrentJob",
                table: "Job",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "EndDate",
                table: "Job",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentJob",
                table: "Job");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Job");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "Job",
                newName: "DatesWorked");
        }
    }
}
