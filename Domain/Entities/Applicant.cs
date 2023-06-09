using Domain.Enums;

namespace Domain.Entities;

public class Applicant : Entity
{
  private Applicant()
  {
  }

  public Applicant(int candidateId)
  {
    CandidateId = candidateId;
  }

  public int CandidateId { get; private set; }

  public int? BookingId { get; private set; } = null;

  public void Cancel() => UpdateStatus(Status.Unavailable);
}
