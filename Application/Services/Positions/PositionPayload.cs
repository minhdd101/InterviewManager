using Application.Contracts;
using Domain.Entities;

namespace Application.Services.Positions;

public class PositionPayload : IPayload<Position>
{
  public string Name { get; set; } = string.Empty;

  public Position ToEntity()
  {
    return new(Name);
  }
}
