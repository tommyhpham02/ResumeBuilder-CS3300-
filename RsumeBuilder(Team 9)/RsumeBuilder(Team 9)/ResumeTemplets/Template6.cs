using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.IO;
using System.Linq;

namespace ResumeBuilder
{
    internal class ResumesTemplate6
    {
        public string[] titles = { "Work Experience", "Education", "Certificates", "Projects", "Languages", "Skills" };

        public void ResumeLayout6(
            string path,
            string name,
            string personDetails,
            string jobs,
            string educations,
            string certifications,
            string personalProjects,
            string languages,
            string skills,
            string summary
            )
        {
            try
            {
                QuestPDF.Fluent.Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(1, Unit.Centimetre);
                        page.PageColor(QuestPDF.Helpers.Colors.White);
                        page.DefaultTextStyle(x => x.FontSize(12)); // Default font size set to 12
                        page.Header().Row(row =>
                        {
                            row.Spacing(15);
                            row.RelativeItem().Column(column =>
                            {
                                if (!string.IsNullOrEmpty(name)) column.Item().Text(name).FontSize(30).FontColor(QuestPDF.Helpers.Colors.Blue.Medium).Bold();
                                if (!string.IsNullOrEmpty(personDetails)) column.Item().Text(personDetails);
                                column.Item().PaddingVertical(5);
                                if (!string.IsNullOrEmpty(summary)) column.Item().Text(summary);
                            });
                        });

                        // Body content with MultiColumn layout
                        page.Content().PaddingVertical(0.8f, Unit.Centimetre).Row(row =>
                        {
                            // First column
                            row.RelativeItem(0.199f).Column(column =>
                            {
                                AddSection(column, titles[4], languages);
                                AddSection(column, titles[5], skills);
                                AddSection(column, titles[2], certifications);
                            });

                            // Vertical line between columns
                            // Vertical line between columns
                            row.RelativeItem(0.04f).Column(column =>
                            {
                                // Adding the line with no height, it will automatically extend to the row's height
                                column.Item().BorderRight(1) // Border as a thin vertical line
                                    .BorderColor(QuestPDF.Helpers.Colors.Grey.Medium);
                            });
                            // Second column
                            row.RelativeItem(0.80f).Column(column =>
                            {
                                AddSection(column, titles[0], jobs);
                                AddSection(column, titles[1], educations);
                                AddSection(column, titles[3], personalProjects);
                            });
                        });
                    });
                }).GeneratePdf(path);
            }
            catch (IOException ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                throw; // Re-throw the exception for debugging.
                //MessageBox.Show(ex.Message + " Please close the file and retry!");
            }
        }

        private void AddSection(ColumnDescriptor container, string title, string content)
        {
            if (!string.IsNullOrEmpty(content))
            {
                container.Item().PaddingVertical(5).LineHorizontal(1).LineColor(QuestPDF.Helpers.Colors.Grey.Medium);
                container.Item().Text(title).Bold().FontSize(13);
                container.Item().Text(content);
            }
        }
    }
}
