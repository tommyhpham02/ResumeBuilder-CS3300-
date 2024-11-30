using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;

namespace ResumeBuilder
{
    public class CustomResumeLayout3
    {
        private readonly string[] sectionTitles = { "Summary", "Experience", "Education", "Certifications", "Projects", "Languages", "Skills" };

        public void customResume3(
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
                            content.Spacing(15); // Add spacing between sections

                            // Add name and contact information as the first section
                            content.Item().Column(column =>
                            {
                                if (!string.IsNullOrEmpty(name)) column.Item().Text(name).FontSize(18).FontColor(Colors.Blue.Medium).Bold();
                                if (!string.IsNullOrEmpty(personDetails)) column.Item().Text(personDetails);
                                column.Spacing(15);
                                if (!string.IsNullOrEmpty(summary)) column.Item().Text(summary);
                            });

                            // Add dynamic sections
                            AddSection(content, sectionTitles[0], summary);         // Summary
                            AddSection(content, sectionTitles[1], jobs);            // Experience
                            AddSection(content, sectionTitles[2], educations);       // Education
                            AddSection(content, sectionTitles[3], certifications);  // Certifications
                            AddSection(content, sectionTitles[4], personalProjects);        // Projects
                            AddSection(content, sectionTitles[5], languages);       // Languages
                            AddSection(content, sectionTitles[6], skills);          // Skills
                        });

                        // Footer on all pages
                        page.Footer().PaddingTop(10).Column(footer =>
                        {
                            footer.Item().LineHorizontal(1).LineColor(Colors.Grey.Medium);
                            footer.Item().AlignCenter().Text("Generated with QuestPDF").FontSize(9).FontColor(Colors.Grey.Darken2);
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

        private void AddSection(ColumnDescriptor container, string title, string content)
        {
            if (!string.IsNullOrEmpty(content))
            {
                container.Item().Column(column =>
                {
                    // Title of the section with padding applied to its container
                    column.Item().Text(title)
                        .Bold()
                        .FontSize(14)
                        .FontColor(Colors.Blue.Medium);
                    column.Item().PaddingBottom(5); // Padding after the title

                    // Content of the section with padding applied to its container
                    column.Item().Text(content);
                    column.Item().PaddingBottom(10); // Padding after the content
                });
            }
        }
    }
}
