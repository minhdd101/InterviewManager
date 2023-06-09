using Domain.Aggregates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public class BookingConfiguration : AggregatorConfiguration<Booking>
{
  public override void Configure(EntityTypeBuilder<Booking> builder)
  {
    base.Configure(builder);

    builder.OwnsOne(e => e.Interview, sp =>
    {
      sp.WithOwner().HasForeignKey("BookingId");

      sp.ToTable("Interviews");

      sp.HasKey(e => e.Id);

      sp.Property(e => e.Id).ValueGeneratedOnAdd();

      sp.OwnsOne(e => e.Result, ai =>
      {
        ai.WithOwner().HasForeignKey("InterviewId");

        ai.ToTable("InterviewResults");

        ai.HasKey(e => e.Id);

        ai.Property(e => e.Id).ValueGeneratedOnAdd();
      });
    });
  }
}