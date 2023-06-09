using Application.Abstractions;
using Application.Contracts;
using Domain.Aggregates;

namespace Application.Services.Recruitments;

public sealed class RecruitmentService
  : GenericService<Recruitment, RecruitmentResponse>, IRecruitmentService
{
  public RecruitmentService(IAppDbContext context) : base(context)
  {
  }

  protected override RecruitmentResponse ToResponse(Recruitment entity)
  {
    return new()
    {
      Name = entity.Name,
      Benifit = entity.Benifit,
      Content = entity.Content,
      DepartmentId = entity.DepartmentId,
      PositionId = entity.PositionId,
      SalaryMax = entity.SalaryMax.ToString(),
      SalaryMin = entity.SalaryMin.ToString(),
      EndDate = entity.EndDate,
      StartDate = entity.StartDate,
      ExpFrom = entity.ExpFrom,
      ExpTo = entity.ExpTo,
      Number = entity.Number
    };
  }

  public Task<int> AddApplicant()
  {
    return Task.FromResult(0);
  }
}