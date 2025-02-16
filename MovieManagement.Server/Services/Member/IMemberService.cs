using Microsoft.AspNetCore.Mvc;

namespace MovieManagement.Server.Services.IServices
{
    public interface IMemberService
    {
        bool MemberRegister([FromBody] Member registerFrom);
    }
}
