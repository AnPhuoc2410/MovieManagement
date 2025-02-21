using Microsoft.AspNetCore.Mvc;
using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using MovieManagement.Server.Services.MemberService;

namespace MovieManagement.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberController : Controller
    {
        private readonly IMemberService _memberService;
        public MemberController(IMemberService memberService)
        {
            _memberService = memberService;
        }
        [HttpGet]
        [Route("all")]
        public async Task<ActionResult> GetAllMembers()
        {
            var members = await _memberService.GetAllMembers();
            return Ok(members);
        }
        [HttpGet]
        [Route("{id:guid}")]
        public async Task<ActionResult<Member>> GetMemberById(Guid id)
        {
            var member = await _memberService.GetMemberById(id);
            return Ok(member);
        }
        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<Member>> RegisterMember([FromBody] Member memberDto)
        {
            var newMember = await _memberService.CreateMember(memberDto);
            return Ok(newMember);
        }
        [HttpPut]
        public async Task<ActionResult<Member>> UpdateMemberById(Guid id, [FromBody] Member memberDto)
        {
            return await _memberService.UpdateMember(id, memberDto);
        }
        [HttpDelete]
        public async Task<bool> DeleteMemberById(Guid id)
        {
            return await _memberService.DeleteMember(id);
        }
    }
}
