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

        /// <summary>
        /// Submits a degree to the Degrees table in the database.
        /// </summary>
        /// <param name="degree"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("submit/degrees/{id}")]
        public async Task<IActionResult> SubmitDegreeList(Degree degree, string id)
        { 
            if (degree == null)
                return BadRequest();

            if (id == "0")
                return BadRequest();

            degree.UserId = int.Parse(id);
            await _authContext.Degrees.AddAsync(degree); 
            await _authContext.SaveChangesAsync();

            return Ok(new
            {
                Message = "Degree saved."
            });
        }
        /// <summary>
        /// Submits a job to the Jobs table in the database.
        /// </summary>
        /// <param name="job"></param>
        /// <param name="id"></param>
        /// <returns>Error message or primary key id of entered job</returns>
        [HttpPost("submit/jobs/{id}")]
        public async Task<IActionResult> SubmitJobList(Job job, string id)
        {
            if (job == null)
                return BadRequest();
            else if (id == "0")
                return BadRequest();

            if ((_authContext.Jobs.Where(x => x.UserId.ToString() == id)).ToList().Count < 3)
            {
                job.UserId = int.Parse(id);
                await _authContext.Jobs.AddAsync(job);
                await _authContext.SaveChangesAsync();

                int jobId = job.Id;

                return Ok(jobId);
            }
            else
            { 
                return BadRequest("Already three entries saved.");
            }
        }

        [HttpDelete("delete/jobs/{id}")]
        public async Task<IActionResult> RemoveJobFromList(int id)
        { 
            if (id == 0)
                return BadRequest();

            var jobToRemove = _authContext.Jobs.SingleOrDefault(x => x.Id == id);

            if (jobToRemove == null)
                return NotFound();

            _authContext.Jobs.Remove(jobToRemove);
            await _authContext.SaveChangesAsync();

            return Ok(new { Message = "Job successfully removed." });

        }

        private int FindResumeInputIdFromUserID(string id)
        {
            var input = _authContext.ResumeInputs.SingleOrDefault(x => x.UserId.ToString() == id);
            int resumeInputId = ((input == null) ? 0 : input.Id);

            return resumeInputId;
        }
    }
}

