using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using ResumeBuilder.Properties;

namespace ResumeBuilder.Controllers
{
    internal class ResumeLayouts
    {

        
        SqlControllers sqlControllers = new SqlControllers();
        public string[] titles = { "", "", "", "", "", "", "" };

        public void ClassicLayout(string path, string name, string personDetails, string jobs, string educations, string certifications, string personalProjects, string languages, string interests, string skills, string summary)
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
                        page.DefaultTextStyle(x => x.FontSize(Settings.Default.detailFontSize));
                        page.Header().Row(row =>
                        {
                            row.Spacing(15);
                            if (!string.IsNullOrEmpty(sqlControllers.getPicture()))
                            {
                                row.ConstantItem(Settings.Default.pictureSize).Image(sqlControllers.getPicture());
                            }
                            row.RelativeItem().Column(column =>
                            {
                                if (name != "") column.Item().Text(name).FontSize(18).FontColor(Colors.Blue.Medium).Bold();
                                if (personDetails != "") column.Item().Text(personDetails);
                                if (summary != "") column.Item().Text(summary);
                            });
                        }
                        );
                        page.Content()
                            .PaddingVertical(1, Unit.Centimetre)
                            .Column(x =>
                            {
                                x.Spacing(5);
                                if (jobs != "")
                                {
                                    x.Item().Text(titles[0]).Bold().FontSize(13);
                                    x.Item().Text(jobs);
                                }
                                if (educations != "")
                                {
                                    x.Item().PaddingVertical(5).LineHorizontal(1).LineColor(Colors.Grey.Medium);
                                    x.Item().Text(titles[1]).Bold().FontSize(13);
                                    x.Item().Text(educations);
                                }
                                if (certifications != "")
                                {
                                    x.Item().PaddingVertical(5).LineHorizontal(1).LineColor(Colors.Grey.Medium);

                                    x.Item().Text(titles[2]).Bold().FontSize(13);
                                    x.Item().Text(certifications);
                                }
                                if (personalProjects != "")
                                {
                                    x.Item().PaddingVertical(5).LineHorizontal(1).LineColor(Colors.Grey.Medium);
                                    x.Item().Text(titles[3]).Bold().FontSize(13);
                                    x.Item().Text(personalProjects);
                                }
                                if (languages != "")
                                {
                                    x.Item().PaddingVertical(5).LineHorizontal(1).LineColor(Colors.Grey.Medium);
                                    x.Item().Text(titles[4]).Bold().FontSize(13);
                                    x.Item().Text(languages);
                                }
                                if (interests != "")
                                {
                                    x.Item().PaddingVertical(5).LineHorizontal(1).LineColor(Colors.Grey.Medium);
                                    x.Item().Text(titles[5]).Bold().FontSize(13);
                                    x.Item().Text(interests);
                                }
                                if (skills != "")
                                {
                                    x.Item().PaddingVertical(5).LineHorizontal(1).LineColor(Colors.Grey.Medium);
                                    x.Item().Text(titles[6]).Bold().FontSize(13);
                                    x.Item().Text(skills);
                                }
                            });
                    });
                })
                    .GeneratePdf(path);
            }
            catch (IOException ex)
            {
                MessageBox.Show(ex.Message + "Please close file and retry!");
            }
        }

    }
}
