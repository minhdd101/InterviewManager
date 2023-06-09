using Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Database.Converters;

public class MoneyConverter : ValueConverter<Money, decimal>
{
	public MoneyConverter()
		:base(e => e.Value, e => new Money { Value = e})
	{
	}
}