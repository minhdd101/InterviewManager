using System.Globalization;

namespace Domain.ValueObjects;

public record Money
{
  private decimal _value;

  public decimal Value
  {
    get => _value;
    set
    {
      if(_value < decimal.Zero)
        throw new ArgumentException($"value cannot be smaller than zero");

      _value = value;
    }
  }

  public override string ToString() => _value.ToString("#,###", CultureInfo.GetCultureInfo("vi-VN"));
}