using Application.Abstractions;
using System.Linq.Expressions;

namespace Application.Contracts;

public interface ISpecification<TEntity>
{
  bool IsSatisfiedBy(TEntity entity);
  Expression<Func<TEntity, bool>> ToExpression();
}