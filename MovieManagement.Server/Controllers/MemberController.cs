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
            var members = await _memberService.GetAllMembersAsync();
            return Ok(members);
        }
        [HttpGet]
        [Route("{id:guid}")]
        public async Task<ActionResult<Member>> GetMemberById(Guid id)
        {
            return await _memberService.GetMemberByIdAsync(id);
        }
        [HttpPost]
        public async Task<ActionResult<Member>> RegisterMember([FromBody] MemberDto memberDto)
        {
            return await _memberService.CreateMemberAsync(memberDto);
        }
        [HttpPut]
        public async Task<ActionResult<Member>> UpdateMemberById(Guid id, [FromBody] MemberDto memberDto)
        {
            return await _memberService.UpdateMemberAsync(id, memberDto);
        }
        [HttpDelete]
        public async Task<bool> DeleteMemberById(Guid id)
        {
            return await _memberService.DeleteMemberAsync(id);
        }
    }
}
