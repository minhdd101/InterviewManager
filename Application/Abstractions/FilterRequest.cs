namespace Application.Abstractions;

public abstract class FilterRequest
{
  public int Start { get; set; }
  protected const int Length = 20;
}
