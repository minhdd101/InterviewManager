namespace Domain.Exceptions;

public sealed class InterviewHasBeenProcessingException : Exception
{
	public InterviewHasBeenProcessingException(int candidateId)
		:base($"interview of candidate has id: {candidateId} has been proceessing")
	{
	}
}