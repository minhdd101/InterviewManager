namespace Domain.Entities;

public class InterviewTemplate : Entity
{
  private InterviewTemplate() { }

  public InterviewTemplate(string name, string description = "")
  {
    Name = name;
    Description = description;
  }

  public string Name { get; private set; } = string.Empty;
  public string? Description { get; private set; } = string.Empty;
}
