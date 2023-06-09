using System.Linq.Expressions;

namespace Application.Abstractions;

public  abstract class QuerySpecification<TEntity, TDestination>
  : Specification<TEntity>
{
  public abstract Expression<Func<TEntity, TDestination>> Selector();
}