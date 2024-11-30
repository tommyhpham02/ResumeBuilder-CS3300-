using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.IO;

namespace ResumeBuilder
{
    public class ResumeLayouts2
    {
        internal string[] titles = { "", "", "", "", "", "", "" };

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
            string summary,
            string previewOrDownload)
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

                        page.Header().Row(row =>
                        {
                            row.Spacing(15);
                            row.RelativeItem().AlignCenter().Column(column =>
                            {
                                if (!string.IsNullOrEmpty(name))
                                    column.Item().Text(name).FontSize(30).FontColor(Colors.Red.Lighten4).Bold().AlignCenter();

                                if (!string.IsNullOrEmpty(personDetails))
                                    column.Item().Text(personDetails).AlignCenter();

                                column.Item().PaddingVertical(10);
                                if (!string.IsNullOrEmpty(summary))
                                    column.Item().EnsureSpace(100).Text(summary).AlignCenter();
                            });
                        });

                        page.Content().PaddingVertical(1, Unit.Centimetre).Column(x =>
                        {
                            x.Spacing(5);

                            AddSection(x, titles[0], jobs);
                            AddSection(x, titles[1], educations);
                            AddSection(x, titles[2], certifications);
                            AddSection(x, titles[3], personalProjects);

                            x.Item().Row(row =>
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

                GeneratePdfOrPreview(document, path, previewOrDownload);
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

        private void GeneratePdfOrPreview(IDocument document, string path, string previewOrDownload)
        {
            if (previewOrDownload == "1") // Download
            {
                document.GeneratePdf(path);
                Console.WriteLine($"PDF has been saved to {path}");
            }
            else if (previewOrDownload == "2") // Preview
            {
                using (var stream = new MemoryStream())
                {
                    document.GeneratePdf(stream);
                    stream.Seek(0, SeekOrigin.Begin);
                    File.WriteAllBytes(path, stream.ToArray()); // Save to path for debugging or further use
                }
            }
            else
            {
                throw new ArgumentException("Invalid previewOrDownload value. Must be '1' (download) or '2' (preview).");
            }
        }

        private void GeneratePdfAndShow(IDocument document)
        {
            using (var stream = new MemoryStream())
            {
                document.GeneratePdf(stream);

                var tempFile = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.pdf");
                File.WriteAllBytes(tempFile, stream.ToArray());

                var process = new System.Diagnostics.Process
                {
                    StartInfo = new System.Diagnostics.ProcessStartInfo
                    {
                        FileName = tempFile,
                        UseShellExecute = true
                    }
                };
                process.Start();
            }
        }
    }
}
