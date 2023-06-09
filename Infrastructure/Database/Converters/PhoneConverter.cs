using Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Database.Converters;

public class PhoneConverter : ValueConverter<PhoneNumber, string>
{
	public PhoneConverter()
		:base(e => e.Phone, e => new PhoneNumber { Phone = e})
	{
	}
}