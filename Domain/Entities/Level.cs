namespace Domain.Entities;

public class Level : Entity
{
  private Level() { }

  public Level(string name)
  {
    Name = name;
  }

  public string Name { get; private set; } = string.Empty;
}