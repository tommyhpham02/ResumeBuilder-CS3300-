using Microsoft.AspNetCore.Mvc;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Models;

namespace RsumeBuilder_Team_9_.Controllers
{
    public class SkillsLanguagesCertificationsController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        public SkillsLanguagesCertificationsController(AppDbContext appDbContext)
        {

            _authContext = appDbContext;
        }

        [HttpPost("submit/{id}")]
        public async Task<IActionResult> SubmitSLCInfo([FromBody] SkillsLanguagesCertifications slcObj, string id)
        {
            if (slcObj == null)
                return BadRequest();

            await _authContext.SLC.AddAsync(slcObj);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "Input values updated"
            });
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> editSLCInfo([FromBody] SkillsLanguagesCertifications slcObj, string id)
        {
            var input = _authContext.SLC.SingleOrDefault(x => x.UserId.ToString() == id);

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
