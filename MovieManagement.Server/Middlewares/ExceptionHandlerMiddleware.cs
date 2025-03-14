using MovieManagement.Server.Data.MetaDatas;
using MovieManagement.Server.Exceptions;

namespace ClaimRequest.API.Middlewares
{
    // class for gerenic exception for the UI handling
    public class ExceptionHandlerMiddleware
    {
        // Fields
        private readonly ILogger<ExceptionHandlerMiddleware> _logger; // for logging
        private readonly RequestDelegate _next; // for the next middleware
        private readonly IHostEnvironment _env; // for

        //constructor
        public ExceptionHandlerMiddleware(
            RequestDelegate next,
            ILogger<ExceptionHandlerMiddleware> logger,
            IHostEnvironment environment)
        {
            _next = next;
            _logger = logger;
            _env = environment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                var errorId = Guid.NewGuid().ToString();
                LogError(errorId, context, exception);
                await HandleExceptionAsync(context, errorId, exception);
            }
        }

        private void LogError(string errorId, HttpContext context, Exception exception)
        {
            var error = new
            {
                ErrorId = errorId,
                Timestamp = DateTime.UtcNow,
                RequestPath = context.Request.Path,
                RequestMethod = context.Request.Method,
                ExceptionType = exception.GetType().Name,
                ExceptionMessage = exception.Message,
                StackTrace = exception.StackTrace,
                InnerException = exception.InnerException?.Message,
                User = context.User?.Identity?.Name ?? "Anonymous",
                AdditionalInfo = GetAdditionalInfo(exception)
            };

            var logLevel = exception switch
            {
                BusinessException => LogLevel.Warning,
                ValidationException => LogLevel.Warning,
                NotFoundException => LogLevel.Information,
                _ => LogLevel.Error
            };

            _logger.Log(logLevel, exception,
                "Error ID: {ErrorId} - Path: {Path} - Method: {Method} - {@error}",
                errorId,
                context.Request.Path,
                context.Request.Method,
                error);
        }

        private object GetAdditionalInfo(Exception exception)
        {
            return exception switch
            {
                ValidationException valEx => new
                {
                    ValidationDetails = valEx.Message
                },
                BusinessException busEx => new
                {
                    BusinessRule = busEx.Message
                },
                NotFoundException notFoundEx => new
                {
                    Entity = notFoundEx.Message
                },
                BadRequestException badRequestEx => new
                {
                    BadRequest = badRequestEx.Message
                },
                _ => new { }
            };
        }

        private async Task HandleExceptionAsync(HttpContext context, string errorId, Exception exception)
        {
            var (statusCode, message, reason) = exception switch
            {
                ValidationException validationEx =>
                    (StatusCodes.Status400BadRequest, "Validation Error", validationEx.Message),

                NotFoundException notFoundEx =>
                    (StatusCodes.Status404NotFound, "Resource Not Found", notFoundEx.Message),

                BusinessException businessEx =>
                    (StatusCodes.Status400BadRequest, "Business Rule Violation", businessEx.Message),

                BadRequestException badRequestEx =>
                    (StatusCodes.Status400BadRequest, "Bad Request", badRequestEx.Message),

                UnauthorizedAccessException =>
                    (StatusCodes.Status401Unauthorized, "Unauthorized Access", "Unauthorized access"),

                InvalidOperationException =>
                    (StatusCodes.Status400BadRequest, "Invalid Operation", exception.Message),

                _ => (StatusCodes.Status500InternalServerError,
                    "Internal Server Error",
                    _env.IsDevelopment() ? exception.Message : "An unexpected error occurred")
            };

            var errorResponse = ApiResponseBuilder.BuildErrorResponse(
                data: new
                {
                    ErrorId = errorId,
                    Timestamp = DateTime.UtcNow,
                    Details = GetAdditionalInfo(exception)
                },
                statusCode: statusCode,
                message: message,
                reason: reason
            );

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            await context.Response.WriteAsJsonAsync(errorResponse);
        }
    }
}

