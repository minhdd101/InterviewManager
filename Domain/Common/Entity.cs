using Domain.Enums;

namespace Domain.Common;

public abstract class Entity
{
  public int Id { get; private set; }
  public Status Status { get; set; }
  
  public string CreatedBy { get; set; } = string.Empty;
  public DateTime CreatedOn { get; set; }
  public DateTime? UpdatedOn { get; set; }
  public string? UpdatedBy { get; set; }

  public virtual void UpdateStatus(Status status) => Status = status;
}
