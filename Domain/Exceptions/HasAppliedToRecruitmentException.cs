namespace Domain.Exceptions;

public sealed class HasAppliedToRecruitmentException : Exception
{
  public HasAppliedToRecruitmentException()
  {
  }

  public HasAppliedToRecruitmentException(string message)
		: base(message)
	{
	}
}
