using Microsoft.AspNetCore.Mvc;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Models;
using System.Text.Json;

namespace RsumeBuilder_Team_9_.Controllers
{
    /// <summary>
    /// Controller for enitiies in Degree table in database.
    /// </summary>
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
        public async Task<IActionResult> SubmitDegree([FromBody] Degree degree, int id)
        {
            if (degree == null)
                return BadRequest();
            if (_authContext.Users.SingleOrDefault(x => x.Id == id) == null)
                return BadRequest("No User found.");

            if ((_authContext.Degrees.Where(x => x.Id == id)).ToList().Count < 3)
            {
                degree.UserId = id;
                await _authContext.Degrees.AddAsync(degree);
                await _authContext.SaveChangesAsync();

                int jobId = degree.Id;

                return Ok(jobId);
            }
            else
            {
                return BadRequest("Already three entries saved.");
            }
        }

        /// <summary>
        /// For deleting a certain degree, needs the Id of the degree.
        /// </summary>
        /// <param name="degreeId"></param>
        /// <returns></returns>
        [HttpDelete("delete/{degreeId}")]
        public async Task<IActionResult> RemoveDegreeFromList(int degreeId)
        {
            if (_authContext.Degrees.SingleOrDefault(x => x.Id == degreeId) == null)
                return BadRequest("No Degree found.");

            var degreeToRemove = _authContext.Degrees.SingleOrDefault(x => x.Id == degreeId);

            if (degreeToRemove == null)
                return NotFound();

            _authContext.Degrees.Remove(degreeToRemove);
            await _authContext.SaveChangesAsync();

            return Ok(new { Message = "Degree successfully removed." });

        }

        /// <summary>
        /// Fir getting a list of all degrees associated with a User.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>List of degrees as JSON strings</returns>
        [HttpGet("get/all/{id}")]
        public IActionResult GetDegreesFromList(int id)
        {
            if (_authContext.Users.SingleOrDefault(x => x.Id == id) == null)
                return BadRequest("No User found.");

            List<Degree> degreeListToGet = _authContext.Degrees.Where(x => x.UserId == id).ToList();
            List<string> jsonStrings = new List<string>();

            if (degreeListToGet.Count > 0)
            {
                foreach (Degree degree in degreeListToGet)
                {
                    string jsonString = JsonSerializer.Serialize<Degree>(degree);
                    jsonStrings.Add(jsonString);
                }

                return Ok(jsonStrings);
            }
            else
            {
                return Ok(new { Message = "No degrees required getting" });
            }
        }

        /// <summary>
        /// For editing a certain degree in the database.
        /// </summary>
        /// <param name="degreeObj"></param>
        /// <param name="degreeId"></param>
        /// <returns>Error or confirmation message</returns>
        [HttpPut("edit/{degreeId}")]
        public async Task<IActionResult> editDegreeInfo([FromBody] Degree degreeObj, int degreeId)
        {
            if (_authContext.Degrees.SingleOrDefault(x => x.Id == degreeId) == null)
                return BadRequest("No Degree found.");

            var degree = _authContext.Degrees.SingleOrDefault(x => x.Id == degreeId);

            if (degreeObj == null)
                return BadRequest();
            else if (degree == null)
                return BadRequest();

            degreeObj.Id = degree.Id;
            degreeObj.UserId = degree.UserId;

            _authContext.Entry(degree).CurrentValues.SetValues(degreeObj);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "Degree values updated"
            });
        }
    }
}
