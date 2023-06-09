using Application.Services.Recruitments;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class ApplicationConfiguration
{
  public static IServiceCollection ConfigureApplication(this IServiceCollection services)
  {
    services.AddScoped<IRecruitmentService, RecruitmentService>();

    return services;
  }
}
