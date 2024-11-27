using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using QuestPDF.Fluent;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.Tab;
using WordBody = DocumentFormat.OpenXml.Wordprocessing.Body;
using WordDocument = DocumentFormat.OpenXml.Wordprocessing.Document;

public class WordResumeBuilder
{
    public void ExportToWord(string filePath, string name, string personDetails, string jobs, string educations, string certifications, string personalProjects, string languages, string interests, string skills, string summary)
    {
        using (WordprocessingDocument wordDocument = WordprocessingDocument.Create(filePath, DocumentFormat.OpenXml.WordprocessingDocumentType.Document))
        {
            // Add a main document part.
            MainDocumentPart mainPart = wordDocument.AddMainDocumentPart();
            mainPart.Document = new WordDocument();
            WordBody body = mainPart.Document.AppendChild(new WordBody());

            // Add sections
            AddSection(body, "Name", name);
            AddSection(body, "Personal Details", personDetails);
            AddSection(body, "Summary", summary);
            AddSection(body, "Jobs", jobs);
            AddSection(body, "Educations", educations);
            AddSection(body, "Certifications", certifications);
            AddSection(body, "Personal Projects", personalProjects);
            AddSection(body, "Languages", languages);

            // Add Interests and Skills in a Row
            Table table = new Table();
            TableRow tableRow = new TableRow();

            TableCell interestsCell = new TableCell(new Paragraph(new Run(new Text("Interests:\n" + interests))));
            TableCell skillsCell = new TableCell(new Paragraph(new Run(new Text("Skills:\n" + skills))));

            tableRow.Append(interestsCell, skillsCell);
            table.Append(tableRow);

            body.Append(table);

            // Save the document
            mainPart.Document.Save();
        }
    }

    private void AddSection(WordBody body, string title, string content)
    {
        if (!string.IsNullOrEmpty(content))
        {
            // Title
            body.AppendChild(new Paragraph(new Run(new Text(title)) {/* Bold = OnOffValue.FromBoolean(true) */}));
            // Content
            body.AppendChild(new Paragraph(new Run(new Text(content))));
        }
    }
}
