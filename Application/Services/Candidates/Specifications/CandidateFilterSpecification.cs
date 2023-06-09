using Application.Abstractions;
using Domain.Aggregates;
using System.Linq.Expressions;

namespace Application.Services.Candidates.Specifications;

public class CandidateFilterSpecification : QuerySpecification<Candidate, CandidateResponse>
{
  private readonly CandidateFilterRequest _filter;

  public CandidateFilterSpecification(CandidateFilterRequest filter)
  {
    _filter = filter;
  }

  public override Expression<Func<Candidate, CandidateResponse>> Selector()
  {
    return e => new CandidateResponse
    {
      Name = e.Name,
      Birthday = e.Birthday,
      Qualification = e.Qualification,
      Attachment = e.Attachment,
      Phone = e.Phone.ToString(),
      Email = e.Email.ToString(),
      Gender = e.Gender
    };
  }

  public override Expression<Func<Candidate, bool>> ToExpression()
  {
    return e => (string.IsNullOrEmpty(_filter.Name) || e.Name.StartsWith(_filter.Name))
      && (string.IsNullOrEmpty(_filter.Email) || e.Email.Equals(new Domain.ValueObjects.EmailAddress() { Email = _filter.Email })
      && (!_filter.Gender.HasValue || e.Gender == _filter.Gender));
  }
}
