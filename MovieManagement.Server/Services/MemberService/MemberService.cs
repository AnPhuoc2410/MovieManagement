using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Drawing;
using System.Net;
using System.Reflection;

namespace MovieManagement.Server.Services.MemberService
{
    public class MemberService : IMemberService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MemberService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<Member> CreateMember(MemberDto memberDto)
        {
            var newMember = new Member
            {
                AccountName = memberDto.AccountName,
                Avatar = memberDto.Avatar,
                Address = memberDto.Address,
                FullName = memberDto.FullName,
                Email = memberDto.Email,
                Password = memberDto.Password,
                PhoneNumber = memberDto.PhoneNumber,
                Gender = memberDto.Gender,
                BirthDate = (DateTime)memberDto.BirthDate,
                IDCard = memberDto.IDCard,
                JoinDate = memberDto.JoinDate,
                Point = (decimal)0,
                Status = 1
            };
            return await _unitOfWork.MemberRepository.CreateAsync(newMember);
        }

        public async Task<bool> DeleteMember(Guid id)
        {
            return await _unitOfWork.MemberRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Member>> GetAllMembers()
        {
            return await _unitOfWork.MemberRepository.GetAllAsync();
        }

        public async Task<Member> GetMemberById(Guid id)
        {
            return await _unitOfWork.MemberRepository.GetByIdAsync(id);
        }

        public async Task<Member> UpdateMember(Guid id, MemberDto memberDto)
        {
            var existingMember = await _unitOfWork.MemberRepository.GetByIdAsync(id);
            if (existingMember == null) return null;

            existingMember.AccountName = memberDto.AccountName;
            existingMember.Avatar = memberDto.Avatar;
            existingMember.Address = memberDto.Address;
            existingMember.FullName = memberDto.FullName;
            existingMember.Email = memberDto.Email;
            existingMember.Password = memberDto.Password;
            existingMember.PhoneNumber = memberDto.PhoneNumber;
            existingMember.Gender = memberDto.Gender;
            existingMember.BirthDate = (DateTime)memberDto.BirthDate;
            existingMember.IDCard = memberDto.IDCard;
            existingMember.JoinDate = memberDto.JoinDate;
            existingMember.Point = 0;
            existingMember.Status = 1;

            return await _unitOfWork.MemberRepository.UpdateAsync(existingMember);
        }
    }
}
