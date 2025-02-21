using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.MemberService
{
    public interface IMemberService
    {
        Task<IEnumerable<MemberDto>> GetAllMembersAsync();
        Task<MemberDto> GetMemberByIdAsync(Guid memberId);
        Task<MemberDto> CreateMemberAsync(MemberDto memberDto);
        Task<MemberDto> UpdateMemberAsync(Guid memberId, MemberDto memberDto);
        Task<bool> DeleteMemberAsync(Guid memberId);
    }
}
