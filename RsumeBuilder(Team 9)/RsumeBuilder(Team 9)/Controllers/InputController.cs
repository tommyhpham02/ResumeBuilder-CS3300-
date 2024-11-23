using Microsoft.AspNetCore.Mvc;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Models;

namespace RsumeBuilder_Team_9_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InputController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        public InputController(AppDbContext appDbContext)
        {

            _authContext = appDbContext;
        }

        [HttpPut("submit/personalInfo/{id}")]
        public async Task<IActionResult> SubmitPersonlInfo([FromBody] ResumeInput inputObj, string id)
        {
            var input = _authContext.ResumeInputs.SingleOrDefault(x => x.UserId.ToString() == id);

            if (inputObj == null)
                return BadRequest();
            else if (input == null)
                return BadRequest();

            inputObj.Id = input.Id;
            inputObj.UserId = input.UserId;

            _authContext.Entry(input).CurrentValues.SetValues(inputObj);
            await _authContext.SaveChangesAsync(); 
            return Ok(new
            {
                Message = "Input values updated"
            });
        }

        [HttpPost("submit/degrees/{id}")]
        public async Task<IActionResult> SubmitDegreeList(List<Degree> degrees, string id)
        { 
            int inputId = FindResumeInputIdFromUserID(id);

            if (inputId == 0)
                return BadRequest();

            foreach (Degree degree in degrees) 
            {
                degree.ResumeInputId = inputId;
                await _authContext.Degrees.AddAsync(degree); 
            }
            await _authContext.SaveChangesAsync();

            return Ok(new
            {
                Message = "Degrees saved."
            });
        }

        [HttpPost("submit/jobs/{id}")]
        public async Task<IActionResult> SubmitJobList(List<Job> jobs, string id)
        {
            int inputId = FindResumeInputIdFromUserID(id);

            if (inputId == 0)
                return BadRequest();

            foreach (Job job in jobs)
            {
                job.ResumeInputId = inputId;
                await _authContext.Jobs.AddAsync(job);
            }
            await _authContext.SaveChangesAsync();

            return Ok(new
            {
                Message = "Jobs saved."
            });
        }

        private int FindResumeInputIdFromUserID(string id)
        {
            var input = _authContext.ResumeInputs.SingleOrDefault(x => x.UserId.ToString() == id);
            int resumeInputId = ((input == null) ? 0 : input.Id);

            return resumeInputId;
        }
    }
}

