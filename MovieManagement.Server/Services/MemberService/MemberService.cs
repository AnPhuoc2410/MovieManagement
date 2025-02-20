using MovieManagement.Server.Data;
using MovieManagement.Server.Models.Entities;

namespace MovieManagement.Server.Services.MemberService
{
    public class MemberService : IMemberService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MemberService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Member>> GetAllMembersAsync()
        {
            return await _unitOfWork.MemberRepository.GetAllAsync();
        }
        public async Task<Member> GetMemberByIdAsync(Guid memberId)
        {
            return await _unitOfWork.MemberRepository.GetByIdAsync(memberId);
        }
        public async Task<Member> CreateMemberAsync(Member member)
        {
            var newMember = new Member
            {
                AccountName = member.AccountName,
                Avatar = member.Avatar,
                Address = member.Address,
                FullName = member.FullName,
                Email = member.Email,
                Password = member.Password,
                PhoneNumber = member.PhoneNumber,
                Gender = member.Gender,
                BirthDate = member.BirthDate,
                IDCard = member.IDCard,
                JoinDate = member.JoinDate,
                Point = (decimal)0,
                Status = 1
            };
            return await _unitOfWork.MemberRepository.CreateAsync(newMember);
        }
        public async Task<Member> UpdateMemberAsync(Guid memberId, Member member)
        {
            var updateMember = await _unitOfWork.MemberRepository.GetByIdAsync(memberId);
            if (updateMember == null) return null;

            updateMember.AccountName = member.AccountName;
            updateMember.Avatar = member.Avatar;
            updateMember.Address = member.Address;
            updateMember.FullName = member.FullName;
            updateMember.Email = member.Email;
            updateMember.Password = member.Password;
            updateMember.PhoneNumber = member.PhoneNumber;
            updateMember.Gender = member.Gender;
            updateMember.BirthDate = member.BirthDate;
            updateMember.IDCard = member.IDCard;
            updateMember.JoinDate = member.JoinDate;
            updateMember.Point = 0;
            updateMember.Status = 1;

            return await _unitOfWork.MemberRepository.UpdateAsync(updateMember);
        }
        public async Task<bool> DeleteMemberAsync(Guid memberId)
        {
            return await _unitOfWork.MemberRepository.DeleteAsync(memberId);
        }

    }
}
