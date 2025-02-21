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
            var members = _mapper.Map<List<MemberDto>>(await _memberService.GetAllMembers());
            return Ok(members);
        }
        [HttpGet]
        [Route("{id:guid}")]
        public async Task<ActionResult<MemberDto>> GetMemberById(Guid id)
        {
            var member = _mapper.Map<MemberDto>(await _memberService.GetMemberById(id));
            return Ok(member);
        }
        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<MemberDto>> RegisterMember([FromBody] MemberDto memberDto)
        {
            var newMember = _mapper.Map<MemberDto>(await _memberService.CreateMember(_mapper.Map<Member>(memberDto)));
            return Ok(newMember);
        }
        [HttpPut]
        public async Task<ActionResult<MemberDto>> UpdateMemberById(Guid id, [FromBody] MemberDto memberDto)

        {
            return _mapper.Map<MemberDto>(await _memberService.UpdateMember(id, _mapper.Map<Member>(memberDto)));
        }
        [HttpDelete]
        public async Task<bool> DeleteMemberById(Guid id)
        {
            return await _memberService.DeleteMember(id);
        }
    }
}
