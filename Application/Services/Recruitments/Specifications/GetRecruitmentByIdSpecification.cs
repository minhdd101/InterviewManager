using Application.Abstractions;
using Domain.Aggregates;
using System.Linq.Expressions;

namespace Application.Services.Recruitments.Specifications;

public class GetRecruitmentByIdSpecification : Specification<Recruitment>
{
    private readonly int _id;

    public GetRecruitmentByIdSpecification(int id)
    {
        _id = id;
    }

    public override Expression<Func<Recruitment, bool>> ToExpression()
    {
        return e => e.Id == _id;
    }
}