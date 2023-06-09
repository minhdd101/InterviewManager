using Application.Contracts;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class InfrastructureConfiguration
{
  public static IServiceCollection ConfigureInfrastructure(this IServiceCollection services, IConfiguration configuration)
  {
    services.AddDbContext<InterviewDbContext>(options =>
    {
      options.UseSqlServer(configuration.GetConnectionString("InterviewManager"),
        x => x.MigrationsAssembly(typeof(InfrastructureConfiguration).Assembly.FullName));
    });

    services.AddScoped<IAppDbContext, InterviewDbContext>();

    return services;  
  }
}
