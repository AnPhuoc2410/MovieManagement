using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.MemberService
{
    public interface IMemberService
    {
        Task<IEnumerable<MemberDto>> GetAllMembersAsync();
        Task<MemberDto> GetMemberByIdAsync(Guid memberId);
        Task<MemberDto> CreateMemberAsync(Member member);
        Task<MemberDto> UpdateMemberAsync(Guid memberId, Member member);
        Task<bool> DeleteMemberAsync(Guid memberId);
    }
}
