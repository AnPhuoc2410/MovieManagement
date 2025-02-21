using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.MemberService
{
    public interface IMemberService
    {
        Task<IEnumerable<Member>> GetAllMembers();
        Task<Member> GetMemberById(Guid memberId);
        Task<Member> CreateMember(Member memberDto);
        Task<Member> UpdateMember(Guid memberId, Member memberDto);
        Task<bool> DeleteMember(Guid memberId);
    }
}
