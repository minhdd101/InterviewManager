using Application.Contracts;
using Domain.Entities;

namespace Application.Services.Departments;

public class DepartmentPayload : IPayload<Department>
{
  public string Name { get; set; } = string.Empty;
  public string Location { get; set; } = string.Empty;

  public Department ToEntity()
  {
    return new(Name, Location);
  }
}
