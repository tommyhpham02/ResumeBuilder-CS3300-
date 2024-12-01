using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;

namespace ResumeBuilderAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResumeController : ControllerBase
    {
        private readonly ResumeLayouts _resumeLayouts;

        public ResumeController(ResumeLayouts resumeLayouts)
        {
            _resumeLayouts = resumeLayouts;
        }

        [HttpPost("generate")]
        public IActionResult GenerateResume([FromBody] ResumeData resumeData)
        {
            try
            {
                string directory = Path.Combine(Directory.GetCurrentDirectory(), "GeneratedResumes");
                Directory.CreateDirectory(directory);

                string filePath = Path.Combine(directory, $"{resumeData.FullName}_Resume.pdf");

                _resumeLayouts.ClassicLayout(
                    filePath,
                    resumeData.FullName,
                    resumeData.PersonalDetails,
                    resumeData.JobHistory,
                    resumeData.Education,
                    resumeData.Certifications,
                    resumeData.Projects,
                    resumeData.Languages,
                    resumeData.Hobbies,
                    resumeData.Skills,
                    resumeData.Summary
                );

                return Ok(new { FilePath = $"GeneratedResumes/{resumeData.FullName}_Resume.pdf" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }

    public class ResumeData
    {
        public string FullName { get; set; }
        public string PersonalDetails { get; set; }
        public string JobHistory { get; set; }
        public string Education { get; set; }
        public string Certifications { get; set; }
        public string Projects { get; set; }
        public string Languages { get; set; }
        public string Hobbies { get; set; }
        public string Skills { get; set; }
        public string Summary { get; set; }
    }
}
