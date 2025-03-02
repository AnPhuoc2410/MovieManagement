//using AutoMapper;
//using MovieManagement.Server.Data;
//using MovieManagement.Server.Models.DTOs;
//using MovieManagement.Server.Models.Entities;

//namespace MovieManagement.Server.Services.MemberService
//{
//    public class MemberService : IMemberService
//    {
//        private readonly IUnitOfWork _unitOfWork;
//        private readonly IMapper _mapper;

//        public MemberService(IUnitOfWork unitOfWork, IMapper mapper)
//        {
//            _unitOfWork = unitOfWork;
//            _mapper = mapper;
//        }

//        public async Task<IEnumerable<MemberPort.MemberResponseDTO>> GetAllMembersAsync()
//        {
//            return _mapper.Map<List<MemberPort.MemberResponseDTO>>(await _unitOfWork.MemberRepository.GetAllAsync());
//        }

//        public async Task<MemberDto> GetMemberByIdAsync(Guid memberId)
//        {
//            return _mapper.Map<MemberDto>(await _unitOfWork.MemberRepository.GetByIdAsync(memberId));
//        }

//        public async Task<MemberDto> CreateMemberAsync(MemberDto memberDto)
//        {
//            var newMember = new Member
//            {
//                AccountName = memberDto.AccountName,
//                Avatar = memberDto.Avatar,
//                Address = memberDto.Address,
//                FullName = memberDto.FullName,
//                Email = memberDto.Email,
//                Password = memberDto.Password,
//                PhoneNumber = memberDto.PhoneNumber,
//                Gender = memberDto.Gender,
//                BirthDate = (DateTime)memberDto.BirthDate,
//                IDCard = memberDto.IDCard,
//                JoinDate = memberDto.JoinDate,
//                Point = 0,
//                Status = 1
//            };

//            return _mapper.Map<MemberDto>(await _unitOfWork.MemberRepository.CreateAsync(newMember));
//        }


//        public async Task<MemberDto> UpdateMemberAsync(Guid memberId, MemberDto memberDto)
//        {
//            var updateMember = await _unitOfWork.MemberRepository.GetByIdAsync(memberId);
//            if (updateMember == null) return null;

//            updateMember.AccountName = memberDto.AccountName;
//            updateMember.Avatar = memberDto.Avatar;
//            updateMember.Address = memberDto.Address;
//            updateMember.FullName = memberDto.FullName;
//            updateMember.Email = memberDto.Email;
//            updateMember.Password = memberDto.Password;
//            updateMember.PhoneNumber = memberDto.PhoneNumber;
//            updateMember.Gender = memberDto.Gender;
//            updateMember.BirthDate = (DateTime)memberDto.BirthDate;
//            updateMember.IDCard = memberDto.IDCard;
//            updateMember.JoinDate = memberDto.JoinDate;
//            updateMember.Point = 0;
//            updateMember.Status = 1;


//            return _mapper.Map<MemberDto>(await _unitOfWork.MemberRepository.UpdateAsync(updateMember));

//        }


//        public async Task<bool> DeleteMemberAsync(Guid memberId)
//        {
//            return await _unitOfWork.MemberRepository.DeleteComposeAsync(memberId);
//        }

//    }
//}
