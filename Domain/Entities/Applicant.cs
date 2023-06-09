using Domain.Enums;

namespace Domain.Entities;

public class Applicant : Entity
{
  public int CandidateId { get; private set; }

  public int? BookingId { get; private set; } = null;

  public void Cancel() => UpdateStatus(Status.Unavailable);
}
