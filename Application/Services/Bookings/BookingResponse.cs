using Application.Contracts;
using Domain.Enums;

namespace Application.Services.Bookings;

public class BookingResponse : IResponse
{
  public int Id { get; set; }
  public DateTime Date { get; set; }
  public string Note { get; set; } = string.Empty;
  public string? MeetingUrl { get; set; }
  public MeetingType MeetingType { get; set; }
  public int ReviewerId { get; set; }
  public int HrId { get; set; }
}