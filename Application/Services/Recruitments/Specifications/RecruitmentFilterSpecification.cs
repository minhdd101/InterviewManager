using Application.Abstractions;
using Domain.Aggregates;
using System.Linq.Expressions;

namespace Application.Services.Recruitments.Specifications;

public class RecruitmentFilterSpecification : QuerySpecification<Recruitment, RecruitmentResponse>
{
    private readonly RecruitmentFilter _filter;

    public RecruitmentFilterSpecification(RecruitmentFilter filter)
    {
        _filter = filter;
    }

  public override Expression<Func<Recruitment, RecruitmentResponse>> Selector()
  {
    return e => new RecruitmentResponse
    {
      Name = e.Name,
      StartDate = e.StartDate,
      EndDate = e.EndDate,
      SalaryMin = e.SalaryMin.ToString(),
      SalaryMax = e.SalaryMax.ToString(),
      ExpFrom = e.ExpFrom,
      ExpTo = e.ExpTo,
      Number = e.Number,
      Position = e.Position!.Name
    };
  }

    public override Expression<Func<Recruitment, bool>> ToExpression()
    {
      return e => (string.IsNullOrEmpty(_filter.Name) || e.Name.StartsWith(_filter.Name))
        && (string.IsNullOrEmpty(_filter.Position) || e.Position!.Name.StartsWith(_filter.Position));
    }
}
