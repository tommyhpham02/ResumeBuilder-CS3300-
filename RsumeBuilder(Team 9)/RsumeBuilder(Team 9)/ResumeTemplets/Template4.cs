using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;

namespace ResumeBuilder
{
    public class ResumeLayouts4
    {
        public string[] titles = { "Summary", "Experience", "Education", "Certifications", "Skills", "Languages", "Projects" };

        public void customResume4(
            string path,
            string name,
            string personDetails,
            string jobs,
            string educations,
            string certifications,
            string personalProjects,
            string languages,
            string skills,
            string summary)
        {
            try
            {
                Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(1, Unit.Centimetre);
                        page.PageColor(Colors.White);
                        page.DefaultTextStyle(x => x.FontSize(12));

                        // Simple Header
                        page.Header().Column(header =>
                        {
                            if (!string.IsNullOrEmpty(name))
                                header.Item().Text(name).FontSize(18).Bold().FontColor(Colors.Green.Medium);

                            if (!string.IsNullOrEmpty(personDetails))
                                header.Item().Text(personDetails).FontSize(12).Italic().FontColor(Colors.Grey.Darken3);

                            header.Item().PaddingVertical(10).LineHorizontal(1).LineColor(Colors.Grey.Darken2);
                        });

                        // Simple Content
                        page.Content().Column(content =>
                        {
                            content.Spacing(10);

                            AddSection(content, titles[0], summary);
                            AddSection(content, titles[1], jobs);
                            AddSection(content, titles[2], educations);
                            AddSection(content, titles[3], certifications);
                            AddSection(content, titles[4], skills);
                            AddSection(content, titles[5], languages);
                            AddSection(content, titles[6], personalProjects);
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
                container.Item().PaddingVertical(5).LineHorizontal(1).LineColor(Colors.Grey.Medium);
                container.Item().Text(title).Bold().FontSize(13);
                container.Item().Text(content);
            }
        }
    }
}
