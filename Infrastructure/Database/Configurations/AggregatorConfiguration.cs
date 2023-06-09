using Domain.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public abstract class AggregatorConfiguration<TAggregator> : EntityConfiguration<TAggregator>
  where TAggregator : Aggregator
{
    public override void Configure(EntityTypeBuilder<TAggregator> builder)
    {
        base.Configure(builder);

        builder.Ignore(e => e.Events);
    }
}