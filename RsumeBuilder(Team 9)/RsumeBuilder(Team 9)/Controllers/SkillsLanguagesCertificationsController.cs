using Microsoft.AspNetCore.Mvc;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Models;

namespace RsumeBuilder_Team_9_.Controllers
{
    /// <summary>
    /// Controller for SkillsLanguagesCertifications entities in database
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsLanguagesCertificationsController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        public SkillsLanguagesCertificationsController(AppDbContext appDbContext)
        {

            _authContext = appDbContext;
        }

        /// <summary>
        /// For submitting a User's Skills, Languages, and Certifications 
        /// </summary>
        /// <param name="slcObj"></param>
        /// <param name="id"></param>
        /// <returns>Error or Confirmation message</returns>
        [HttpPost("submit/{id}")]
        public async Task<IActionResult> SubmitSLCInfo([FromBody] SkillsLanguagesCertifications slcObj, int id)
        {
            if (slcObj == null)
                return BadRequest();
            if (_authContext.Users.SingleOrDefault(x => x.Id == id) == null)
                return BadRequest("No User found.");

            slcObj.UserId = id;

            await _authContext.SLC.AddAsync(slcObj);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "Input values updated"
            });
        }

        /// <summary>
        /// For editing an SLC entity in the database.
        /// </summary>
        /// <param name="slcObj"></param>
        /// <param name="id"></param>
        /// <returns>Error or Confimration message</returns>
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> editSLCInfo([FromBody] SkillsLanguagesCertifications slcObj, int id)
        {
            var input = _authContext.SLC.SingleOrDefault(x => x.UserId == id);

            if (slcObj == null)
                return BadRequest("Incorrect Data Given.");
            else if (input == null)
                return BadRequest("No User found.");

            slcObj.Id = input.Id;
            slcObj.UserId = input.UserId;

            _authContext.Entry(input).CurrentValues.SetValues(slcObj);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "Input values updated"
            });
        }

        /// <summary>
        /// Gets 
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Error or SLC information</returns>
        [HttpGet("get/{id}")]
        public async Task<IActionResult> getSLC(int id)
        {
            if (_authContext.Users.SingleOrDefault(x => x.Id == id) == null)
                return BadRequest("No User found.");

            var slc = _authContext.SLC.SingleOrDefault(x => x.UserId == id);

            if (slc == null)
                return BadRequest("User has no input");

            return Ok(slc);
        }

        /// <summary>
        /// Deletes a specific enetiy from the SLC database.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Error or Confirmation message</returns>
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> deleteSLCInfo(int id)
        {
            if (_authContext.Users.SingleOrDefault(x => x.Id == id) == null)
                return BadRequest("No User found.");

            var slcToRemove = _authContext.SLC.SingleOrDefault(x => x.Id == id);

            if (slcToRemove == null)
                return NotFound();

            _authContext.SLC.Remove(slcToRemove);
            await _authContext.SaveChangesAsync();

            return Ok(new { Message = "Skills, Languages, and Certifications successfully removed." });
        }
    }
}
