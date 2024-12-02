using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Models;
using ResumeBuilder;
using System.Linq;
using System.Threading.Tasks;
using System.IO;

namespace RsumeBuilder_Team_9_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeCreatingController : ControllerBase
    {
        private readonly AppDbContext _authContext;

        public ResumeCreatingController(AppDbContext appDbContext)
        {
            _authContext = appDbContext;
        }

        [HttpGet("submit/download/{id}/{templateID}")]
        public async Task<IActionResult> SubmitResumeCreating(int id, string templateID)
        {
            
            if (string.IsNullOrWhiteSpace(templateID))
            {
                return BadRequest("Template ID is required.");
            }

            // Define dynamic file path
            string directoryPath = @"C:\GeneratedPdfs";
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }
            string filePath = Path.Combine(directoryPath, $"Resume_{id}_{DateTime.Now:yyyyMMddHHmmss}.pdf");
            Console.WriteLine($"User ID: {id}, Template ID: {templateID}, File Path: {filePath}");

            try
            {
                // Retrieve user data from database
                var user = await _authContext.Users.FindAsync(id);
                if (user == null)
                    return NotFound("User not found.");

                var jobs = await _authContext.Jobs.Where(x => x.UserId == id).ToListAsync();
                var degrees = await _authContext.Degrees.Where(x => x.UserId == id).ToListAsync();
                var skillsLanguagesCertifications = await _authContext.SLC.Where(x => x.UserId == id).ToListAsync();
                var resumeInput = await _authContext.ResumeInputs.FirstOrDefaultAsync(x => x.UserId == id);

                if (resumeInput == null)
                    return BadRequest("No personal resume input found for this user.");

                // Extract variables for ResumeLayouts
                string name = $"{resumeInput.FirstName} {resumeInput.LastName}";
                string personDetails = $"{resumeInput.Email} | {resumeInput.PhoneNumber} | {resumeInput.Website}";
                string summary = resumeInput.Summary ?? "";

                string jobsContent = string.Join("\n\n", jobs.Select(job =>
                    $"{job.Position} at {job.CompanyName}\n" +
                    $"({job.StartDate} - {job.EndDate})\n" +
                    $"{job.JobResponsibilities}"));

                string educationContent = string.Join("\n", degrees.Select(degree =>
                    $"{degree.DegreeType} in {degree.DegreeName}\n" +
                    $"{degree.College} ({degree.YearGraduated})"));

                string certificationsContent = string.Join(", ", skillsLanguagesCertifications.Select(cert => cert.CertificationName));
                string languagesContent = string.Join(", ", skillsLanguagesCertifications.Select(lang => lang.LanguageName));
                string skillsContent = string.Join(", ", skillsLanguagesCertifications.Select(skill => skill.Skills));
                string personalProjectsContent = string.Join("\n", skillsLanguagesCertifications.Select(proj => proj.Projects));

                // Generate the PDF
                if (templateID == "1") // Template 1 Easy simple template
                {
                    var resumeLayout = new ResumeLayouts();
                    resumeLayout.ClassicLayout(filePath, name, personDetails, jobsContent, educationContent,
                        certificationsContent, personalProjectsContent, languagesContent, skillsContent, summary);
                }
                else if (templateID == "2") // Template 2 Easy simple red with middle header
                {
                    var resumeLayout2 = new ResumeLayouts2();
                    resumeLayout2.NewLayout(filePath, name, personDetails, jobsContent, educationContent,
                        certificationsContent, personalProjectsContent, languagesContent, skillsContent, summary);
                }
                else if (templateID == "3") // Temp Needs work
                {
                    var resumeLayout3 = new CustomResumeLayout3();
                    resumeLayout3.customResume3(filePath, name, personDetails, jobsContent, educationContent,
                        certificationsContent, personalProjectsContent, languagesContent, skillsContent, summary);
                }
                else if (templateID == "4") // Temp nmeeds work
                {
                    var resumeLayouts = new ResumeLayouts4();
                    resumeLayouts.customResume4(filePath, name, personDetails, jobsContent, educationContent,
                        certificationsContent, personalProjectsContent, languagesContent, skillsContent, summary);
                }
                else if (templateID == "5")
                {
                    var resumeLayout5 = new ResumeLayout5();
                    resumeLayout5.GenerateCustomResume(filePath, name, personDetails, jobsContent, educationContent,
                        certificationsContent, personalProjectsContent, languagesContent, skillsContent, summary);
                }
                else if (templateID == "6")
                {
                    var resumeLayout6 = new ResumesTemplate6();
                    resumeLayout6.ResumeLayout6(filePath, name, personDetails, jobsContent, educationContent,
                        certificationsContent, personalProjectsContent, languagesContent, skillsContent, summary);
                }
                else
                {
                    return BadRequest($"Invalid template ID!!: {templateID}");
                }

                // Handle response based on preview or download
                
                    byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);
                    return Ok(File(fileBytes, "application/pdf", Path.GetFileName(filePath)));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred: {ex.Message}");
                return StatusCode(500, "An error occurred while generating the PDF.");
            }
        }
        [HttpGet("get-resume/{id}/{fileName}")]
        public IActionResult GetResume(int id, string fileName)
        {
            // Define the server directory where resumes are stored
            string directoryPath = @"C:\GeneratedPdfs";
            string filePath = Path.Combine(directoryPath, fileName);

            try
            {
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound(new { Message = "File not found on the server." });
                }

                // Read the file and return it as a FileResult
                byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);
                return File(fileBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving file: {ex.Message}");
                return StatusCode(500, new { Message = "An error occurred while retrieving the file." });
            }
        }
    }
}
