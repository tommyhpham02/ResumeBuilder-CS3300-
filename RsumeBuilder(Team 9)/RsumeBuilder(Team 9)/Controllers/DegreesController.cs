using Microsoft.AspNetCore.Mvc;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Models;
using System.Text.Json;

namespace RsumeBuilder_Team_9_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DegreesController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        public DegreesController(AppDbContext appDbContext)
        {

            _authContext = appDbContext;
        }
        /// <summary>
        /// Submits a degree to the Degrees table in the database.
        /// </summary>
        /// <param name="degree"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("submit/{id}")]
        public async Task<IActionResult> SubmitDegree(Degree degree, string id)
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

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> RemoveDegreeFromList(int id)
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
        public async Task<IActionResult> RemoveDegreesFromList(int id)
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
                return Ok(new { Message = "No jobs required getting" });
            }
        }
    }
}
