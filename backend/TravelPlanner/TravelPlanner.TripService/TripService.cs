using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Microsoft.ServiceFabric.Data;
using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System;
using System.Collections.Generic;
using System.Fabric;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TravelPlanner.Common.Authentication;
using TravelPlanner.Common.Middleware;
using TravelPlanner.TripService.Data;
using TravelPlanner.TripService.Repositories;
using TravelPlanner.TripService.Services;

namespace TravelPlanner.TripService
{
    /// <summary>
    /// The FabricRuntime creates an instance of this class for each service type instance.
    /// </summary>
    internal sealed class TripService : StatelessService
    {
        public TripService(StatelessServiceContext context)
            : base(context)
        { }

        /// <summary>
        /// Optional override to create listeners (like tcp, http) for this service instance.
        /// </summary>
        /// <returns>The collection of listeners.</returns>
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return new ServiceInstanceListener[]
            {
                new ServiceInstanceListener(serviceContext =>
                    new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
                    {
                        ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting Kestrel on {url}");

                        var builder = WebApplication.CreateBuilder();

                        builder.Services.AddDbContext<TripsDbContext>(options =>
                            options.UseSqlServer(builder.Configuration.GetConnectionString("TripsDatabase")));

                        builder.Services.AddSingleton<StatelessServiceContext>(serviceContext);
                        builder.WebHost
                                    .UseKestrel()
                                    .UseContentRoot(Directory.GetCurrentDirectory())
                                    .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                                    .UseUrls(url);
                        builder.Services.AddControllers();
                        builder.Services.AddEndpointsApiExplorer();
                        builder.Services.AddSwaggerGen(options =>
                        {
                            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                            {
                                Name = "Authorization",
                                Type = SecuritySchemeType.ApiKey,
                                Scheme = "Bearer",
                                BearerFormat = "JWT",
                                In = ParameterLocation.Header,
                                Description = "Unesi token u formatu: Bearer {token}"
                            });

                            options.AddSecurityRequirement(new OpenApiSecurityRequirement
                            {
                                {
                                    new OpenApiSecurityScheme
                                    {
                                        Reference = new OpenApiReference
                                        {
                                            Type = ReferenceType.SecurityScheme,
                                            Id = "Bearer"
                                        }
                                    },
                                    Array.Empty<string>()
                                }
                            });
                        });

                        builder.Services.AddCors(options =>
                        {
                            options.AddPolicy("AllowFrontend", policy =>
                            {
                                policy.WithOrigins(
                                        "http://localhost:5173",
                                        "http://localhost:51577")
                                      .AllowAnyHeader()
                                      .AllowAnyMethod();
                            });
                        });

                        builder.Services.AddHttpClient<IExpenseClient, ExpenseClient>(client =>
                        {
                            client.BaseAddress = new Uri("http://localhost:8865");
                        });

                        builder.Services.AddJwtAuthentication(builder.Configuration);
                        builder.Services.AddAutoMapper(typeof(TravelPlanner.TripService.Mapping.MappingProfile).Assembly);
                        builder.Services.AddScoped<ITripRepository, TripRepository>();
                        builder.Services.AddScoped<ITripManagementService, TripManagementService>();
                        builder.Services.AddScoped<IDestinationRepository, DestinationRepository>();
                        builder.Services.AddScoped<IDestinationService, DestinationService>();
                        builder.Services.AddScoped<IActivityRepository, ActivityRepository>();
                        builder.Services.AddScoped<IActivityService, ActivityService>();
                        builder.Services.AddScoped<IChecklistRepository, ChecklistRepository>();
                        builder.Services.AddScoped<IChecklistService, ChecklistService>();
                        builder.Services.AddScoped<ISharingClient, SharingClient>();
                        var app = builder.Build();

                        app.UseExceptionMiddleware();
                        app.UseCors("AllowFrontend");
                        app.UseSwagger();
                        app.UseSwaggerUI();
                        app.UseAuthentication();
                        app.UseAuthorization();
                        app.MapControllers();

                        return app;

                    }))
            };
        }
    }
}
