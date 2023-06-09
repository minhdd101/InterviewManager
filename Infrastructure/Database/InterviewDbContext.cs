using Application.Contracts;
using Domain.Aggregates;
using Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Database;

public class InterviewDbContext : DbContext, IAppDbContext
{
	public InterviewDbContext(DbContextOptions<InterviewDbContext> options)
		: base(options)
	{
	}

  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);

    builder.ApplyConfigurationsFromAssembly(typeof(InterviewDbContext).Assembly);
  }

  public Task<int> Commit(CancellationToken token = default)
  {
    foreach(var entry in ChangeTracker.Entries<Entity>())
    {
      var entity = entry.Entity;

      if(entry.State == EntityState.Added)
      {
        entity.CreatedOn = DateTime.UtcNow;
        entity.CreatedBy = "sys"; //temp
      }
      else if (entry.State == EntityState.Modified)
      {
        entity.UpdatedOn = DateTime.UtcNow;
        entity.UpdatedBy = "sys"; //temp
      }
      else if(entry.State == EntityState.Deleted)
      {
        entity.UpdateStatus(Domain.Enums.Status.Unavailable);
        entity.UpdatedOn = DateTime.UtcNow;
        entity.UpdatedBy = "sys"; //temp
      }
    }

    return base.SaveChangesAsync(token);
  }

  public DbSet<TEntity> Table<TEntity>() where TEntity : class => Set<TEntity>();

  public virtual DbSet<Recruitment> Recruitments => Set<Recruitment>();
  public virtual DbSet<Candidate> Candidates => Set<Candidate>();
  public virtual DbSet<Booking> Bookings => Set<Booking>();
}
