using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.MemberService
{
    public interface IMemberService
    {
        Task<IEnumerable<Member>> GetAllMembersAsync();
        Task<Member> GetMemberByIdAsync(Guid memberId);
        Task<Member> CreateMemberAsync(MemberDto memberDto);
        Task<Member> UpdateMemberAsync(Guid memberId, MemberDto memberDto);
        Task<bool> DeleteMemberAsync(Guid memberId);
    }
}
