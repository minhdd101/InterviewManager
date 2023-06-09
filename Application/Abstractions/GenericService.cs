using Application.Contracts;
using Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace Application.Abstractions;

public abstract class GenericService<TEntity, TResponse>
  : IGenericService<TEntity, TResponse>
  where TEntity : Entity
{
  protected readonly IAppDbContext _context;
  protected readonly DbSet<TEntity> _table; 

  protected GenericService(IAppDbContext context)
  {
    _context = context;
    _table = _context.Table<TEntity>();
  }

  public virtual async Task<TResponse> AddOrUpdate(IPayload<TEntity> payload)
  {
    var entity = payload.ToEntity();

    _table.Update(entity);

    await _context.Commit();

    return ToResponse(entity);
  }

  public virtual async Task<int> Delete(int id)
  {
    var entity = await _table.FirstOrDefaultAsync(e => e.Id == id);

    if(entity == null)
      return -1;

    _table.Remove(entity);

    return await _context.Commit();
  }

  public virtual async Task<TResponse> Get(ISpecification<TEntity> specification)
  {
    var entity = await _table
      .FirstOrDefaultAsync(e => specification.IsSatisfiedBy(e));

    if (entity == null)
      throw new NullReferenceException();

    return ToResponse(entity);
  }

  public virtual async Task<IEnumerable<TResponse>> Query(QuerySpecification<TEntity, TResponse> specification)
  {
    return await _table
      .AsNoTracking()
      .Where(specification.ToExpression())
      .Select(specification.Selector())
      .ToListAsync();
  }

  protected abstract TResponse ToResponse(TEntity entity);
}