using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;


namespace ResumeBuilder
{
    public class ResumeLayout5
    {
        private readonly string[] sectionTitles = { "Summary", "Experience", "Education", "Certifications", "Skills", "Languages", "Projects" };

        public void GenerateCustomResume(string path, string name, string contactInfo, string jobs, string education, string certifications, string languages, string projects, string skills, string summary)
        {
            try
            {
                Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        // Page settings
                        page.Size(PageSizes.A4);
                        page.Margin(1.5f, Unit.Centimetre);
                        page.PageColor(Colors.White);

                        // Main content
                        page.Content().Column(content =>
                        {
                            content.Spacing(20);

                            // Header: Name and Contact Information
                            content.Item().Column(column =>
                            {
                                column.Item().Text(name)
                                    .FontSize(26)
                                    .Bold()
                                    .FontColor(Colors.Green.Medium);
                                column.Item().Text(contactInfo)
                                    .FontSize(12)
                                    .Italic()
                                .FontColor(Colors.Grey.Darken3);

                                column.Spacing(15);
                                // Horizontal line below the header
                                column.Item().LineHorizontal(1).LineColor(Colors.Grey.Darken2);
                            });

                            // Main Body: Multi-Column Layout
                            content.Item().Row(row =>
                            {
                                // Left Column
                                row.RelativeItem(2).Column(column =>
                                {
                                    AddSection(column, sectionTitles[0], summary, Colors.Green.Accent3);  // Summary
                                    AddSection(column, sectionTitles[1], jobs, Colors.Green.Accent3);  // Experience
                                    AddSection(column, sectionTitles[2], education, Colors.Green.Accent3); // Education
                                    AddSection(column, sectionTitles[3], certifications, Colors.Green.Accent3); // Certifications
                                    AddSection(column, sectionTitles[7], projects, Colors.Green.Accent3); // Projects
                                });

                                // Right Column
                                row.RelativeItem(1).Column(column =>
                                {
                                    AddSection(column, sectionTitles[4], skills, Colors.Green.Accent3); // Skills
                                    AddSection(column, sectionTitles[5], languages, Colors.Green.Accent3); // Languages
                                });
                            });
                        });

                        // Footer on all pages
                        page.Footer().PaddingTop(10).Column(footer =>
                        {
                            footer.Item().LineHorizontal(1).LineColor(Colors.Grey.Darken2);
                            footer.Item().AlignCenter().Text("Generated with QuestPDF").FontSize(9).FontColor(Colors.Grey.Darken3);
                        });
                    });
                }).GeneratePdf(path);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                throw;
            }
        }

        private void AddSection(ColumnDescriptor container, string title, string content, string color)
        {
            if (!string.IsNullOrEmpty(content))
            {
                container.Item().Column(column =>
                {
                    // Title of the section
                    column.Item().Element(e =>
                    {
                        e.Text(title)
                            .Bold()
                            .FontSize(14)
                            .FontColor(color);
                    });

                    // Add content
                    column.Item().PaddingTop(5).Element(e =>
                    {
                        e.Text(content)
                            .FontSize(11)
                            .FontColor(Colors.Grey.Darken3);
                    });

                    // Add spacing below each section
                    column.Item().PaddingBottom(15);
                });
            }
        }
    }
}
