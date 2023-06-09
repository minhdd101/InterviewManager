using Application.Abstractions;

namespace Application.Services.Recruitments;

public sealed class RecruitmentFilter : FilterRequest
{
  public string? Name { get; set; }
  public string? Position { get; set; }
}
