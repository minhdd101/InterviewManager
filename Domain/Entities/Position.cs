using Domain.Aggregates;

namespace Domain.Entities;

public class Position : Entity
{
  private Position() { }

  public Position(string name)
  {
    Name = name;
  }

  public string Name { get; private set; } = string.Empty;
  public virtual ICollection<Recruitment>? Recruitments { get; private set; }

  public void Update(string name) => Name = name;
}

