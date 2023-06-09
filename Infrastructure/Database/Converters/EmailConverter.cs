using Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Database.Converters;

public class EmailConverter : ValueConverter<EmailAddress, string>
{
	public EmailConverter()
		:base(e => e.ToString(), e => new EmailAddress { Email = e})
	{
	}
}