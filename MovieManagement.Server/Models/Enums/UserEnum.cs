namespace MovieManagement.Server.Models.Enums
{
    public class UserEnum
    {

        public enum Role
        {
            Member = 0,
            Employee = 1,
            Admin = 2
        }

        public enum UserStatus
        {
            Inactive = 0,
            Active = 1
        }

        public enum UserGender
        {
            Male = 0,
            Female = 1
        }

    }

}
