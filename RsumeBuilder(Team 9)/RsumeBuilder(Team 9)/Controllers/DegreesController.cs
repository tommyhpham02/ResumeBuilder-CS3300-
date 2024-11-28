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
        public async Task<IActionResult> SubmitDegree([FromBody] Degree degree, string id)
        {
            if (degree == null)
                return BadRequest();
            else if (id == "0")
                return BadRequest();

            if ((_authContext.Degrees.Where(x => x.UserId.ToString() == id)).ToList().Count < 3)
            {
                degree.UserId = int.Parse(id);
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

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> RemoveDegreeFromList(int id)
        {
            if (id == 0)
                return BadRequest();

            var degreeToRemove = _authContext.Degrees.SingleOrDefault(x => x.Id == id);

            if (degreeToRemove == null)
                return NotFound();

            _authContext.Degrees.Remove(degreeToRemove);
            await _authContext.SaveChangesAsync();

            return Ok(new { Message = "Degree successfully removed." });

        }

        [HttpDelete("delete/all/{id}")]
        public async Task<IActionResult> RemoveDegreesFromList(int id)
        {
            List<Degree> degreeListToDelete = _authContext.Degrees.Where(x => x.UserId == id).ToList();

            if (degreeListToDelete.Count > 0)
            {
                foreach (Degree degree in degreeListToDelete)
                {
                    _authContext.Degrees.Remove(degree);
                }
                await _authContext.SaveChangesAsync();

                return Ok(new { Message = "Degrees were found and removed" });
            }
            else
            {
                return Ok(new { Message = "No Degrees required removing" });
            }
        }

        [HttpGet("get/all/{id}")]
        public IActionResult GetDegreesFromList(int id)
        {
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

        [HttpPut("edit/{degreeId}")]
        public async Task<IActionResult> editDegreeInfo([FromBody] Degree degreeObj, int degreeId)
        {
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
