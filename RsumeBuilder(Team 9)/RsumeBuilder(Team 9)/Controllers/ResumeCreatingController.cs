using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Models;
using ResumeBuilder;
using System.Linq;
using System.Threading.Tasks;


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

        [HttpPost("submit/download/{id}")]
        public async Task<IActionResult> SubmitResumeCreating(int id, string templateID)
        {

            string filePath = "C:\\Users\\tarek\\Documents\\ResumeProjectTest\\Resume5.pdf";

           // if (string.IsNullOrWhiteSpace(id) /*|| string.IsNullOrWhiteSpace(templateType)*/)
             //   return BadRequest("User ID and template type are required.");

            // Parse the user ID
            //if (!int.TryParse(id, out int userId))
              //  return BadRequest("Invalid user ID.");

            // Retrieve data from all related tables
            var user = await _authContext.Users.FindAsync(id);
            if (user == null)
                return NotFound("User not found.");

            var jobs = await _authContext.Jobs.Where(x => x.UserId == id).ToListAsync();
            var degrees = await _authContext.Degrees.Where(x => x.UserId == id).ToListAsync();
            var skillsLanguagesCertifications = await _authContext.SLC.Where(x => x.UserId == id).ToListAsync();
            var resumeInput = await _authContext.ResumeInputs.Where(x => x.UserId == id).FirstOrDefaultAsync();

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

            if (templateID == "1")
            {
                // Call ClassicLayout
                var resumeLayout = new ResumeLayouts();
                resumeLayout.ClassicLayout(
                    filePath,
                    name,
                    personDetails,
                    jobsContent,
                    educationContent,
                    certificationsContent,
                    personalProjectsContent,
                    languagesContent,
                    skillsContent,
                    summary
                );
            }
            else if (templateID == "2")
            {
                // Call ClassicLayout
                var resumeLayouts = new ResumeLayouts2();
                resumeLayouts.NewLayout(
                    filePath,
                    name,
                    personDetails,
                    jobsContent,
                    educationContent,
                    certificationsContent,
                    personalProjectsContent,
                    languagesContent,
                    skillsContent,
                    summary
                );
            }
            else
            {
                Console.WriteLine($"Unhandled templateID = {templateID}");
            }
            

            return Ok(new { Message = "PDF successfully generated.", FilePath = filePath });
        }
    }
}
