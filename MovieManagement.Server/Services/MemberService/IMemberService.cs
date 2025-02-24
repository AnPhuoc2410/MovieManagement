using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.MemberService
{
    public interface IMemberService
    {
        Task<IEnumerable<MemberPort.MemberResponseDTO>> GetAllMembersAsync();
        Task<MemberDto> GetMemberByIdAsync(Guid memberId);
        Task<MemberDto> CreateMemberAsync(MemberDto member);
        Task<MemberDto> UpdateMemberAsync(Guid memberId, MemberDto member);
        Task<bool> DeleteMemberAsync(Guid memberId);
    }
}
