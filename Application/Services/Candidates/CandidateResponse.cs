using Application.Contracts;
using Domain.Enums;
using Domain.ValueObjects;

namespace Application.Services.Candidates;

public class CandidateResponse : IResponse
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
}