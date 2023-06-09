using Domain.Aggregates;
using Infrastructure.Database.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public class CandidateConfiguration : AggregatorConfiguration<Candidate>
{
  public override void Configure(EntityTypeBuilder<Candidate> builder)
  {
    base.Configure(builder);

    builder.Property(e => e.Name)
      .HasColumnType("nvarchar(500)")
      .HasMaxLength(500);

    builder.Property(e => e.Email)
      .HasColumnType("nvarchar(500)")
      .HasConversion<EmailConverter>();

    builder.Property(e => e.Phone)
      .HasColumnType("nvarchar(500)")
      .HasConversion<PhoneConverter>();

    builder.Property(e => e.Address)
      .HasColumnType("nvarchar(500)")
      .HasMaxLength(500);
  }
}