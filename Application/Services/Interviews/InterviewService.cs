using Application.Abstractions;
using Application.Contracts;
using Domain.Aggregates;

namespace Application.Services.Interviews;

public sealed class InterviewService
  : GenericService<Interview, InterviewResponse>
{
  public InterviewService(IAppDbContext context)
    : base(context)
  {
  }

  protected override InterviewResponse ToResponse(Interview entity)
  {
    return new InterviewResponse
    {

    };
  }
}
