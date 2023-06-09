namespace Domain.Common;

public abstract class Aggregator : Entity
{
  private readonly List<IDomainEvent> _events = new();

  public IReadOnlyCollection<IDomainEvent> Events => _events.AsReadOnly();

  public void AddEvent(IDomainEvent @event) => _events.Add(@event);

  public void Clear() => _events.Clear();
}
