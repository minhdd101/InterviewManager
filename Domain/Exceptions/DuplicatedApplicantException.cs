namespace Domain.Exceptions;

public sealed class DuplicatedApplicantException : Exception
{
  public DuplicatedApplicantException(int candidateId)
    : base($"candidate with id: {candidateId} has been applied")
  {
  }
}