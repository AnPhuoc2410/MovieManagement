namespace MovieManagement.Server.Models.Enums
{
    public class UserEnum
    {

        enum UserType
        {
            Admin = 0,
            Manager = 1,
            Employee = 2,
            Customer = 3
        }

        enum UserStatus
        {
            Inactive = 0,
            Active = 1
        }

        enum UserGender
        {
            Male = 0,
            Female = 1
        }

    }

}
