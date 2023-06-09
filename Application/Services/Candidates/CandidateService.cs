using Application.Abstractions;
using Application.Contracts;
using Domain.Aggregates;

namespace Application.Services.Candidates;

public class CandidateService
  : GenericService<Candidate, CandidateResponse>
{
  public CandidateService(IAppDbContext context) : base(context)
  {
  }

  protected override CandidateResponse ToResponse(Candidate entity)
  {
    return new()
    {
      Name = entity.Name,
      Birthday = entity.Birthday,
      Gender = entity.Gender,
      Note = entity.Note,
      Qualification = entity.Qualification,
      Address = entity.Address,
      Phone = entity.Phone.ToString(),
      Email = entity.Phone.ToString(),
      Attachment = entity.Attachment,
    };
  }
}
