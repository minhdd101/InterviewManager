using Application.Contracts;
using System.Linq.Expressions;

namespace Application.Abstractions;

public abstract class Specification<TEntity>
  : ISpecification<TEntity>
{
  public bool IsSatisfiedBy(TEntity entity)
  {
    return ToExpression().Compile().Invoke(entity);
  }

  public abstract Expression<Func<TEntity, bool>> ToExpression();
}
