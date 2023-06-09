using Application.Abstractions;
using Domain.Enums;

namespace Application.Services.Candidates;

public class CandidateFilterRequest : FilterRequest
{
  public string? Name { get; set; }
  public Gender? Gender { get; set; }
  public string? Email { get; set; }
}
