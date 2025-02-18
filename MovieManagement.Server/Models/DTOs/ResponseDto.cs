namespace MovieManagement.Server.Models.DTOs
{
    public class ResponseDto
    {

        public bool IsSucceeded { get; set; }

        public string StatusMessage { get; set; }

        public int StatusCode { get; internal set; }

        public string Message { get; set; }

        public object Data { get; set; }


        

        public ResponseDto() 
        {

            IsSucceeded = true;
            StatusMessage = "Success";
            StatusCode = StatusCodes.Status200OK;

        }





    }
}
