using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.IO;

namespace ResumeBuilder
{
    public class ResumeLayouts2
    {
        public string[] titles = { "Work Experience", "Education", "Certificates", "Projects", "Languages", "Skills" };

        public void NewLayout(
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
                var document = Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(1, Unit.Centimetre);
                        page.PageColor(Colors.White);
                        page.DefaultTextStyle(x => x.FontSize(12));

                        page.Content().Column(content =>
                        {
                            content.Spacing(15);

                            // Add name and contact information
                            content.Item().Column(column =>
                            {
                                if (!string.IsNullOrEmpty(name))
                                    column.Item().Text(name).FontSize(18).FontColor(Colors.Blue.Medium).Bold();

                                if (!string.IsNullOrEmpty(personDetails))
                                    column.Item().Text(personDetails);

                                if (!string.IsNullOrEmpty(summary))
                                    column.Item().Text(summary);
                            });

                            // Add sections dynamically
                            AddSection(content, titles[0], jobs);
                            AddSection(content, titles[1], educations);
                            AddSection(content, titles[2], certifications);
                            AddSection(content, titles[3], personalProjects);

                            content.Item().Row(row =>
                            {
                                row.Spacing(15);

                                row.RelativeItem().Column(column =>
                                {
                                    AddSection(column, titles[4], languages);
                                });

                                row.RelativeItem().Column(column =>
                                {
                                    AddSection(column, titles[5], skills);
                                });
                            });
                        });
                    });
                });

                GeneratePdfOrPreview(document, path);
            }
            catch (IOException ex)
            {
                Console.WriteLine("Error: " + ex.Message);
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

        private void GeneratePdfOrPreview(IDocument document, string path)
        {
            document.GeneratePdf(path);
            Console.WriteLine($"PDF has been saved to {path}");
        }
    }
}
