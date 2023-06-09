using Domain.Entities;

namespace Domain.Aggregates;

public class Interview : Entity
{
    private Interview() { }

    public Interview(DateTime startTime, DateTime endTime,
      DateTime joinStartTime, DateTime joinEndtime,
      string note = "")
    {
        StartTime = startTime;
        EndTime = endTime;
        JoinStartTime = joinStartTime;
        JoinEndTime = joinEndtime;
        Note = note;
    }

    public string Note { get; private set; } = string.Empty;
    public DateTime StartTime { get; private set; }
    public DateTime EndTime { get; private set; }
    public DateTime JoinStartTime { get; private set; }
    public DateTime JoinEndTime { get; private set; }

    public Interview WithResult(InterviewResult result)
    {
        Result = result;
        return this;
    }

    public InterviewResult? Result { get; private set; }
}
