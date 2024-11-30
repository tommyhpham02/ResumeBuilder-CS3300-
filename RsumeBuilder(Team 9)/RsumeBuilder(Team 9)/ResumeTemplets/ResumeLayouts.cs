using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.IO;


namespace ResumeBuilder
{
    internal class ResumeLayouts
    {
        public string[] titles = { "Work Experaince", "Education", "Certificates", "Projects", "Languages", "Skills"};

        public void ClassicLayout(
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
                        page.Size(PageSizes.A4);
                        page.Margin(1, Unit.Centimetre);
                        page.PageColor(Colors.White);
                        page.DefaultTextStyle(x => x.FontSize(12)); // Default font size set to 12
                        page.Header().Row(row =>
                        {
                            row.Spacing(15);
                            row.RelativeItem().Column(column =>
                            {
                                if (!string.IsNullOrEmpty(name)) column.Item().Text(name).FontSize(18).FontColor(Colors.Blue.Medium).Bold();
                                if (!string.IsNullOrEmpty(personDetails)) column.Item().Text(personDetails);
                                column.Spacing(15);
                                if (!string.IsNullOrEmpty(summary)) column.Item().Text(summary);
                            });
                        });

                        page.Content().PaddingVertical(1, Unit.Centimetre).Column(x =>
                        {
                            x.Spacing(5);

                            // Add sections if they are not empty
                            AddSection(x, titles[0], jobs);
                            AddSection(x, titles[1], educations);
                            AddSection(x, titles[2], certifications);
                            AddSection(x, titles[3], personalProjects);
                            AddSection(x, titles[4], languages);
                            AddSection(x, titles[5], skills);
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
                container.Item().PaddingVertical(5).LineHorizontal(1).LineColor(Colors.Grey.Medium);
                container.Item().Text(title).Bold().FontSize(13);
                container.Item().Text(content);
            }
        }

    }
}
