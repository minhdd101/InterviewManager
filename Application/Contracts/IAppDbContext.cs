using Domain.Aggregates;
using Microsoft.EntityFrameworkCore;

namespace Application.Contracts;

public interface IAppDbContext
{
  DbSet<Candidate> Candidates { get; }
  DbSet<Booking> Bookings { get; }
  DbSet<Recruitment> Recruitments { get; }
  DbSet<TEntity> Table<TEntity>() where TEntity : class;

  Task<int> Commit(CancellationToken token = default);
}
