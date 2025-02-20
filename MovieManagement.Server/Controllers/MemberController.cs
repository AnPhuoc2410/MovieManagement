using AutoMapper;
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
        private readonly IMapper _mapper;
        public MemberController(IMemberService memberService, IMapper mapper)
        {
            _memberService = memberService;
            _mapper = mapper;
        }
        [HttpGet]
        [Route("all")]
        public async Task<ActionResult> GetAllMembers()
        {
            var members = _mapper.Map<List<MemberDto>>(await _memberService.GetAllMembersAsync());
            return Ok(members);
        }
        [HttpGet]
        [Route("{id:guid}")]
        public async Task<ActionResult<MemberDto>> GetMemberById(Guid id)
        {
            return _mapper.Map<MemberDto>(await _memberService.GetMemberByIdAsync(id));
        }
        [HttpPost]
        public async Task<ActionResult<MemberDto>> RegisterMember([FromBody] MemberDto memberDto)
        {
            return _mapper.Map<MemberDto>(await _memberService.CreateMemberAsync(_mapper.Map<Member>(memberDto)));
        }
        [HttpPut]
        public async Task<ActionResult<MemberDto>> UpdateMemberById(Guid id, [FromBody] MemberDto memberDto)
        {
            return _mapper.Map<MemberDto>(await _memberService.UpdateMemberAsync(id, _mapper.Map<Member>(memberDto)));
        }
        [HttpDelete]
        public async Task<bool> DeleteMemberById(Guid id)
        {
            return await _memberService.DeleteMemberAsync(id);
        }
    }
}
