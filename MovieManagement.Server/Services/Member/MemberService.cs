using MovieManagement.Server.Data;
using MovieManagement.Server.Repositories.IRepositories;
using MovieManagement.Server.Services.IServices;

namespace MovieManagement.Server.Services.Member
{
    public class MemberService : IMemberService
    {
        private readonly IMemberService _memberService;
        private readonly IUnitOfWork _unitOfWork;

        public MemberService(IUnitOfWork unitOfWork, IMemberService memberService)
        {
            _memberService = memberService;
            _unitOfWork = unitOfWork;
        }
        public bool MemberRegister(string accountName, string password)
        {
            
        }
    }
}
