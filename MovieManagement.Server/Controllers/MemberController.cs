//using Microsoft.AspNetCore.Mvc;
//using MovieManagement.Server.Models.DTOs;
//using MovieManagement.Server.Services.MemberService;
//using MovieManagement.Server.Services;
//using NuGet.Protocol.Plugins;

//namespace MovieManagement.Server.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class MemberController : Controller
//    {
//        private readonly IMemberService _memberService;

//        public MemberController(IMemberService memberService)
//        {
//            _memberService = memberService;
//        }
//        [HttpGet]
//        [Route("all")]
//        [ProducesResponseType(typeof(ApiResponseServices<MemberDto>), StatusCodes.Status200OK)]
//        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status400BadRequest)]
//        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status404NotFound)]
//        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
//        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status401Unauthorized)]
//        [ProducesResponseType(typeof(ApiResponseServices<object>), StatusCodes.Status500InternalServerError)]
//        public async Task<ActionResult> GetAllMembers()
//        {
//            var members = await _memberService.GetAllMembersAsync();
//            return Ok(members);
//        }
//        [HttpGet]
//        [Route("{id:guid}")]
//        public async Task<ActionResult<MemberDto>> GetMemberById(Guid id)
//        {
//            var member = await _memberService.GetMemberByIdAsync(id);
//            return member;
//        }
//        [HttpPost]
//        public async Task<ActionResult<MemberDto>> CreateMember([FromBody] MemberDto memberDto)
//        {
//            var @new = await _memberService.CreateMemberAsync(memberDto);
//            return @new;
//        }
//        [HttpPut]
//        public async Task<ActionResult<MemberDto>> UpdateMemberById(Guid id, [FromBody] MemberDto memberDto)
//        {
//            var updated = await _memberService.UpdateMemberAsync(id, memberDto);
//            return updated;
//        }
//        [HttpDelete]
//        public async Task<bool> DeleteMemberById(Guid id)
//        {
//            return await _memberService.DeleteMemberAsync(id);
//        }
//    }
//}
