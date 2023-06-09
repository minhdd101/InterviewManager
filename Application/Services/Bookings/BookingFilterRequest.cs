using Application.Abstractions;
using Domain.Enums;

namespace Application.Services.Bookings;

public class BookingFilterRequest : FilterRequest
{
  public DateTime? Date { get; set; }
  public MeetingType MeetingType { get; set; }
}
