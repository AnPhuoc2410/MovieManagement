namespace MovieManagement.Server.Models.Enums
{
    public class SeatEnum
    {

        public enum SeatStatus
        {
            Available = 0,
            Selected = 1,
            Reserved = 2,
            Booked = 3
        }

        public enum SeatType
        {
            Normal = 0,
            VIP = 1,
        }


    }
}
