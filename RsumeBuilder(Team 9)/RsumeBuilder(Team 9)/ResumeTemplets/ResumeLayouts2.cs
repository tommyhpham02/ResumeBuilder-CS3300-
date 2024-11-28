using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.IO;
//using System.Windows.Forms;

namespace ResumeBuilder
{
    public class ResumeLayouts2
    {
        internal string[] titles = { "", "", "", "", "", "", "" };

        public void NewLayout(string path, string name, string personDetails, string jobs, string educations, string certifications, string personalProjects, string languages, string skills, string summary)
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
                            row.RelativeItem().AlignCenter().Column(column =>
                            {
                                //column.AlignCenter(); // Center the entire column content

                                if (!string.IsNullOrEmpty(name))
                                    column.Item().Text(name).FontSize(30).FontColor(Colors.Red.Lighten4).Bold().AlignCenter(); // Center the name

                                if (!string.IsNullOrEmpty(personDetails))
                                    column.Item().Text(personDetails).AlignCenter(); // Center the personal details
                                column.Item().PaddingVertical(10);
                                if (!string.IsNullOrEmpty(summary))
                                    column.Item().EnsureSpace(100).Text(summary).AlignCenter(); // Center the summary
                            });
                        });

                        page.Content().PaddingVertical(1, Unit.Centimetre).Column(x =>
                        {
                            x.Spacing(5);

                            // Add main content sections
                            AddSection(x, titles[0], jobs);
                            AddSection(x, titles[1], educations);
                            AddSection(x, titles[2], certifications);
                            AddSection(x, titles[3], personalProjects);

                            // Add the last two sections in a row
                            x.Item().Row(row =>
                            {
                                row.Spacing(15);

                                // Left column for 'interests'
                                row.RelativeItem().Column(column =>
                                {
                                    AddSection(column, titles[4], languages);
                                });

                                // Right column for 'skills'
                                row.RelativeItem().Column(column =>
                                {
                                    AddSection(column, titles[5], skills);
                                });
                            });
                        });
                        page.Footer().Row(row =>
                        {
                            
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
