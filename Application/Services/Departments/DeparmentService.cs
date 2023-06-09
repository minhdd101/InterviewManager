using Application.Abstractions;
using Application.Contracts;
using Domain.Entities;

namespace Application.Services.Departments;

public class DeparmentService
  : GenericService<Department, DepartmentResponse>
{
  public DeparmentService(IAppDbContext context) : base(context)
  {
  }

  protected override DepartmentResponse ToResponse(Department entity)
  {
    return new DepartmentResponse()
    {
      Name = entity.Name,
      Id = entity.Id,
      Location = entity.Location,
    };
  }
}
