using Application.Contracts;
using Domain.Aggregates;
using Domain.Enums;

namespace Application.Services.Candidates;

public class CandidatePayload : IPayload<Candidate>
{
  public string Name { get; set; } = string.Empty;
  public string Email { get; set; } = null!;
  public string Phone { get; set; } = null!;
  public string Address { get; set; } = string.Empty;
  public string Attachment { get; set; } = string.Empty;
  public string Qualification { get; set; } = string.Empty;
  public Gender Gender { get; set; }
  public DateTime Birthday { get; set; }
  public string Note { get; set; } = string.Empty;

  public Candidate ToEntity()
  {
    return new Candidate(
      Name, Email,
      Phone, Address,
      Gender, Birthday,
      Attachment, Qualification,
      Note);
  }
}
