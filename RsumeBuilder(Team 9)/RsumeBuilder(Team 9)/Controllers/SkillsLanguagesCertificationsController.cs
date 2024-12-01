using Microsoft.AspNetCore.Mvc;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Models;

namespace RsumeBuilder_Team_9_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsLanguagesCertificationsController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        public SkillsLanguagesCertificationsController(AppDbContext appDbContext)
        {

            _authContext = appDbContext;
        }

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

        [HttpGet("get/{id}")]
        public async Task<IActionResult> getPersonalInfo(int id)
        {
            if (_authContext.Users.SingleOrDefault(x => x.Id == id) == null)
                return BadRequest("No User found.");

            var personalInfo = _authContext.SLC.SingleOrDefault(x => x.UserId == id);

            if (personalInfo == null)
                return BadRequest("User has no input");

            return Ok(personalInfo);
        }

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
