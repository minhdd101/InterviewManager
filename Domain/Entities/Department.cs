using Domain.Aggregates;

namespace Domain.Entities;

public class Department : Entity
{
  private Department() { }

  public Department(string name, string location)
  {
    Name = name;
    Location = location;
  }

  public string Name { get; private set; } = string.Empty;
  public string Location { get; private set; } = string.Empty;

  public virtual ICollection<Recruitment>? Recruitments { get; private set; }


  public IList<InterviewTemplate> Templates { get; private set; } = new List<InterviewTemplate>();

  public void AddTemplate(string name, string description)
  {
    var template = new InterviewTemplate(name, description);

    Templates.Add(template);
  }

  public void RemoveTemplate(int id)
  {
    var template = Templates.FirstOrDefault(x => x.Id == id);

    if(template != null)
      Templates.Remove(template);
  }

  public void Update(Department department)
  {
    Name = department.Name;
    Location = department.Location;
  }
}
