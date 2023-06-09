using Application.Abstractions;
using Application.Contracts;
using Domain.Aggregates;

namespace Application.Services.Bookings;

public class BookingService
  : GenericService<Booking, BookingResponse>, IBookingService
{
  public BookingService(IAppDbContext context) : base(context)
  {
  }

  protected override BookingResponse ToResponse(Booking entity)
  {
    return new()
    {
      MeetingType = entity.MeetingType,
      Note = entity.Note,
      MeetingUrl = entity.MeetingUrl,
      Date = entity.Date,
      Id = entity.Id
    };
  }
}
