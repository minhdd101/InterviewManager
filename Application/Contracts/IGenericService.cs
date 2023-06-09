using Application.Abstractions;

namespace Application.Contracts;

public interface IGenericService<TEntity, TResponse>
{
  Task<TResponse> Get(ISpecification<TEntity> specification);
  Task<IEnumerable<TResponse>> Query(QuerySpecification<TEntity, TResponse> specification);
  Task<TResponse> AddOrUpdate(IPayload<TEntity> payload);
  Task<int> Delete(int id);
}
