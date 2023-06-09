using Application.Abstractions;
using Domain.Aggregates;
using System.Linq.Expressions;

namespace Application.Services.Candidates.Specifications;

public class GetCandidateByIdSpecification : Specification<Candidate>
{
  private readonly int _id;

  public GetCandidateByIdSpecification(int id)
  {
    _id = id;
  }

  public override Expression<Func<Candidate, bool>> ToExpression() => e => e.Id == _id;
}