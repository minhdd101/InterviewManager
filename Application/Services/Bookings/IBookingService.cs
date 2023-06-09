using Application.Contracts;
using Domain.Aggregates;

namespace Application.Services.Bookings;

public interface IBookingService : IGenericService<Booking, BookingResponse>
{
}
