namespace Domain.Entities;

public class InterviewResult : Entity
{
  private InterviewResult() { }

  public InterviewResult(string experience, string skill, string resolveProblem,
    string attridutes, string selfLearning, string desire,
    int salaryFrom, int salaryTo, string note = "")
  {
    Experience = experience;
    Skill = skill;
    ResolveProblem = resolveProblem;
    Attridutes = attridutes;
    SelflLearning = selfLearning;
    SalaryFrom = salaryFrom;
    SalaryTo = salaryTo;
    Note = note;
    Desire = desire;
  }

  public string Note { get; private set; } = string.Empty;
  public string Experience { get; private set; } = string.Empty;
  public string Skill { get; private set; } = string.Empty;
  public string ResolveProblem { get; private set; } = string.Empty;
  public string Attridutes { get; private set; } = string.Empty;
  public string SelflLearning { get; private set; } = string.Empty;
  public string Desire { get; private set; } = string.Empty;
  public int SalaryFrom { get; private set; }
  public int SalaryTo { get; private set; }
}