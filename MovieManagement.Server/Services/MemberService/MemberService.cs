using MovieManagement.Server.Data;
using MovieManagement.Server.Models.DTOs;
using MovieManagement.Server.Models.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Drawing;
using System.Net;
using System.Reflection;
using AutoMapper;

namespace MovieManagement.Server.Services.MemberService
{
    public class MemberService : IMemberService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public MemberService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<IEnumerable<MemberDto>> GetAllMembersAsync()
        {
            return _mapper.Map<List<MemberDto>>(await _unitOfWork.MemberRepository.GetAllAsync());
        }
        public async Task<MemberDto> GetMemberByIdAsync(Guid memberId)
        {
            return _mapper.Map<MemberDto>(await _unitOfWork.MemberRepository.GetByIdAsync(memberId));
        }
        public async Task<MemberDto> CreateMemberAsync(Member member)
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
            return _mapper.Map<MemberDto>(await _unitOfWork.MemberRepository.CreateAsync(newMember));
        }
        public async Task<MemberDto> UpdateMemberAsync(Guid memberId, Member member)
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

            return _mapper.Map<MemberDto>(await _unitOfWork.MemberRepository.UpdateAsync(updateMember));
        }
        public async Task<bool> DeleteMemberAsync(Guid memberId)
        {
            return await _unitOfWork.MemberRepository.DeleteAsync(memberId);
        }

    }
}
