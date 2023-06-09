using Domain.Enums;

namespace Domain.Entities;

public class SkillTag : Entity
{
  private SkillTag() { }

  public SkillTag(string name, SkillTagType skillTagType)
  {
    Name = name;
    Type = skillTagType;
  }

  public string Name { get; private set; } = string.Empty;
  public SkillTagType Type { get; private set; }

  public SkillTag Update(SkillTag skillTag)
  {
    Name = skillTag.Name;
    Type = skillTag.Type;

    return this;
  }

  public static SkillTag Create(string name, SkillTagType skillTagType)
  {
    return new SkillTag
    {
      Name = name,
      Type = skillTagType
    };
  }
}