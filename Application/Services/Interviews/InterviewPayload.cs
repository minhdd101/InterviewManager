using Application.Contracts;
using Domain.Aggregates;

namespace Application.Services.Interviews;

public sealed class InterviewPayload : IPayload<Interview>
{
  public Interview ToEntity()
  {
    throw new NotImplementedException();
  }
}
