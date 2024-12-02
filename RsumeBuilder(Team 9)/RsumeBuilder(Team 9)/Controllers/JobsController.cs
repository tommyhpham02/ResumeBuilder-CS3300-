using Microsoft.AspNetCore.Mvc;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Models;
using System.Text.Json;

namespace RsumeBuilder_Team_9_.Controllers
{
    /// <summary>
    /// Controller for entities in Jobs table in database
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        public JobsController(AppDbContext appDbContext)
        {

            _authContext = appDbContext;
        }

        /// <summary>
        /// Submits a job to the Jobs table in the database.
        /// </summary>
        /// <param name="job"></param>
        /// <param name="id"></param>
        /// <returns>Error message or primary key id of entered job</returns>
        [HttpPost("submit/{id}")]
        public async Task<IActionResult> SubmitJob([FromBody] Job job, int id)
        {
            if (job == null)
                return BadRequest("Incorrect Data Given.");
            if (_authContext.Users.SingleOrDefault(x => x.Id == id) == null)
                return BadRequest("No User found.");

            if ((_authContext.Jobs.Where(x => x.UserId == id)).ToList().Count < 3)
            {
                job.UserId = id;
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

        /// <summary>
        /// Removes a certain job from the database with the jobId.
        /// </summary>
        /// <param name="jobId"></param>
        /// <returns>Error or COnfimration message</returns>
        [HttpDelete("delete/{jobId}")]
        public async Task<IActionResult> RemoveJobFromList(int jobId)
        {
            if (_authContext.Jobs.SingleOrDefault(x => x.Id == jobId) == null)
                return BadRequest("No Job found.");

            var jobToRemove = _authContext.Jobs.SingleOrDefault(x => x.Id == jobId);

            if (jobToRemove == null)
                return NotFound();

            _authContext.Jobs.Remove(jobToRemove);
            await _authContext.SaveChangesAsync();

            return Ok(new { Message = "Job successfully removed." });

        }

        /// <summary>
        /// Gets a list of all jobs associated with the User.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>List of jobs as JSON strings</returns>
        [HttpGet("get/all/{id}")]
        public IActionResult GetJobsFromList(int id)
        {
            if (_authContext.Users.SingleOrDefault(x => x.Id == id) == null)
                return BadRequest("No User found.");

            List<Job> jobListToGet = _authContext.Jobs.Where(x => x.UserId == id).ToList();
            List<string> jsonStrings = new List<string>();

            if (jobListToGet.Count > 0)
            {
                foreach (Job job in jobListToGet)
                {
                    string jsonString = JsonSerializer.Serialize<Job>(job);
                    jsonStrings.Add(jsonString);
                }

                return Ok(jsonStrings);
            }
            else
            {
                return Ok(new { Message = "No jobs required getting." });
            }
        }

        /// <summary>
        /// Edits a certain job in the database.
        /// </summary>
        /// <param name="jobObj"></param>
        /// <param name="jobId"></param>
        /// <returns>Error or confirmation message</returns>
        [HttpPut("edit/{jobId}")]
        public async Task<IActionResult> editJobInfo([FromBody] Job jobObj, int jobId)
        {
            if (_authContext.Jobs.SingleOrDefault(x => x.Id == jobId) == null)
                return BadRequest("No Job found.");

            var job = _authContext.Jobs.SingleOrDefault(x => x.Id == jobId);

            if (jobObj == null)
                return BadRequest();
            else if (job == null)
                return BadRequest();

            jobObj.Id = job.Id;
            jobObj.UserId = job.UserId;

            _authContext.Entry(job).CurrentValues.SetValues(jobObj);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "Job values updated"
            });
        }
    }
}
