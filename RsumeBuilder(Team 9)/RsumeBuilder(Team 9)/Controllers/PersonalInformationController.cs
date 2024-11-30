using Microsoft.AspNetCore.Mvc;
using RsumeBuilder_Team_9_.Context;
using RsumeBuilder_Team_9_.Models;

namespace RsumeBuilder_Team_9_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonalInformationController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        public PersonalInformationController(AppDbContext appDbContext)
        {

            _authContext = appDbContext;
        }

        [HttpPost("submit/{id}")]
        public async Task<IActionResult> SubmitPersonalInfo([FromBody] ResumeInput personalObj, int id)
        {
            if (personalObj == null)
                return BadRequest();

            personalObj.UserId = id;

            await _authContext.ResumeInputs.AddAsync(personalObj);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "Input values added."
            });
        }

        
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditPersonalInfo([FromBody] ResumeInput inputObj, int id)
        {
            var input = _authContext.ResumeInputs.SingleOrDefault(x => x.UserId == id);

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
                Message = "Input values updated."
            });
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> getPersonalInfo(int id)
        {
            if (id == 0)
                return BadRequest("No ID given");

            var personalInfo = _authContext.ResumeInputs.SingleOrDefault(x => x.UserId == id);

            if (personalInfo == null)
                return BadRequest("User has no input");

            return Ok(personalInfo);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> deletePersonalInfo(int id)
        {
            if (id == 0)
                return BadRequest();

            var slcToRemove = _authContext.ResumeInputs.SingleOrDefault(x => x.Id == id);

            if (slcToRemove == null)
                return NotFound();

            _authContext.ResumeInputs.Remove(slcToRemove);
            await _authContext.SaveChangesAsync();

            return Ok(new { Message = "Skills, Languages, and Certifications successfully removed." });
        }
    }
}