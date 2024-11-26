using Microsoft.AspNetCore.Mvc;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Models;
using System.Text.Json;

namespace RsumeBuilder_Team_9_.Controllers
{
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
        public async Task<IActionResult> SubmitJob(Job job, string id)
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

        [HttpDelete("delete/{id}")]
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

        [HttpDelete("delete/all/{id}")]
        public async Task<IActionResult> RemoveJobsFromList(int id)
        {
            List<Job> jobListToDelete = _authContext.Jobs.Where(x => x.UserId == id).ToList();

            if (jobListToDelete.Count > 0)
            {
                foreach (Job job in jobListToDelete)
                {
                    _authContext.Jobs.Remove(job);
                }
                await _authContext.SaveChangesAsync();

                return Ok(new { Message = "Jobs were found and removed" });
            }
            else
            {
                return Ok(new { Message = "No jobs required removing" });
            }
        }

        [HttpGet("get/all/{id}")]
        public IActionResult GetJobsFromList(int id)
        {
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

        [HttpPut("edit/{jobId}")]
        public async Task<IActionResult> SubmitPersonlInfo([FromBody] Job inputObj, int jobId)
        {
            var input = _authContext.Jobs.SingleOrDefault(x => x.Id == jobId);

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
                Message = "Job values updated"
            });
        }
    }
}
