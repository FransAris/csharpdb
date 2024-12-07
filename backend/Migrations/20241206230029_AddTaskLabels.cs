using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskLabels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LabelId",
                table: "Tasks",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TaskLabels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskLabels", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_LabelId",
                table: "Tasks",
                column: "LabelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_TaskLabels_LabelId",
                table: "Tasks",
                column: "LabelId",
                principalTable: "TaskLabels",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_TaskLabels_LabelId",
                table: "Tasks");

            migrationBuilder.DropTable(
                name: "TaskLabels");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_LabelId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "LabelId",
                table: "Tasks");
        }
    }
}
