using Application.Abstractions;
using Application.Contracts;
using Application.Helpers;
using Domain.Entities;

namespace Application.Services.Positions;

public class PositionService : GenericService<Position, Option>
{
  public PositionService(IAppDbContext context) : base(context)
  {
  }

  protected override Option ToResponse(Position entity)
  {
    return new Option
    {
      Name = entity.Name,
      Id = entity.Id
    };
  }
}