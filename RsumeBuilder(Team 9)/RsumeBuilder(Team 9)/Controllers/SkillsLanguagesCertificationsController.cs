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
                return BadRequest();
            else if (input == null)
                return BadRequest();

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
            if (id == 0)
                return BadRequest("No ID given");

            var personalInfo = _authContext.SLC.SingleOrDefault(x => x.UserId == id);

            if (personalInfo == null)
                return BadRequest("User has no input");

            return Ok(personalInfo);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> deleteSLCInfo(int id)
        {
            if (id == 0)
                return BadRequest();

            var slcToRemove = _authContext.SLC.SingleOrDefault(x => x.Id == id);

            if (slcToRemove == null)
                return NotFound();

            _authContext.SLC.Remove(slcToRemove);
            await _authContext.SaveChangesAsync();

            return Ok(new { Message = "Skills, Languages, and Certifications successfully removed." });
        }
    }
}
