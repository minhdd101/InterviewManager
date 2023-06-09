using System.Text.RegularExpressions;

namespace Domain.ValueObjects;

public record EmailAddress
{
  private string _email = null!;

  public required string Email
  { 
    set
    {
      if (!Regex.IsMatch(value, @"/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"))
        throw new ArgumentException($"{value} is not valid");

      _email = value;
    }
  }
  public override string ToString() => _email;
}