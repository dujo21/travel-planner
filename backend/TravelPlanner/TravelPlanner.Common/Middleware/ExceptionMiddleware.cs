using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using TravelPlanner.Common.Exceptions;

namespace TravelPlanner.Common.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                context.Response.ContentType = "application/json";

                var response = new ErrorResponse();

                switch (ex)
                {
                    case NotFoundException:
                        response.StatusCode = (int)HttpStatusCode.NotFound;
                        response.Message = ex.Message;
                        break;

                    case ConflictException:
                        response.StatusCode = (int)HttpStatusCode.Conflict;
                        response.Message = ex.Message;
                        break;

                    case BadRequestException:
                        response.StatusCode = (int)HttpStatusCode.BadRequest;
                        response.Message = ex.Message;
                        break;

                    case UnauthorizedException:
                        response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        response.Message = ex.Message;
                        break;

                    default:
                        _logger.LogError(ex, "Neocekivana greska: {Message}", ex.Message);
                        response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        response.Message = "Došlo je do greške na serveru. Pokušajte ponovo.";
                        break;
                }

                context.Response.StatusCode = response.StatusCode;

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
            }
        }
    }

    public static class ExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseExceptionMiddleware(this IApplicationBuilder app)
        {
            return app.UseMiddleware<ExceptionMiddleware>();
        }
    }
}