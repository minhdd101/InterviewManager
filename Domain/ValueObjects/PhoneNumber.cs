using System.Text.RegularExpressions;

namespace Domain.ValueObjects;

public record PhoneNumber
{
  private string _phoneNumber = null!;

  public required string Phone
  {
    set
    {
      if (!Regex.IsMatch(value, @"^[0-9]*$"))
        throw new ArgumentException($"{value} is not valid phone number");

      _phoneNumber = value;
    }
    get => _phoneNumber;
  }

  public override string ToString() => _phoneNumber;
}