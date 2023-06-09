using Domain.Aggregates;
using Infrastructure.Database.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public class RecruitmentConfiguration : AggregatorConfiguration<Recruitment>
{
  public override void Configure(EntityTypeBuilder<Recruitment> builder)
  {
    base.Configure(builder);

    builder.Property(e => e.Name)
      .HasColumnType("nvarchar(500)")
      .HasMaxLength(500);

    builder.Property(e => e.Content)
      .HasColumnType("nvarchar(1000)")
      .HasMaxLength(500);

    builder.Property(e => e.Benifit)
      .HasColumnType("nvarchar(1000)")
      .HasMaxLength(500);

    builder.Property(e => e.SalaryMin)
      .HasConversion<MoneyConverter>();

    builder.Property(e => e.SalaryMax)
      .HasConversion<MoneyConverter>();

    builder.HasOne(e => e.Department)
      .WithMany(e => e.Recruitments)
      .HasForeignKey(e => e.DepartmentId);

    builder.HasOne(e => e.Position)
      .WithMany(e => e.Recruitments)
      .HasForeignKey(e => e.PositionId);

    builder.OwnsMany(e => e.Applicants, sp =>
    {
      sp.ToTable("Applicants");

      sp.HasKey(e => e.Id);
    });
  }
}
