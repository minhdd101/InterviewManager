using Application.Contracts;
using Domain.Aggregates;
using Domain.Enums;

namespace Application.Services.Bookings;

public class BookingPayload : IPayload<Booking>
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Note { get; set; } = string.Empty;
    public string MeetingUrl { get; set; } = string.Empty;
    public MeetingType MeetingType { get; set; }
    public int ReviewerId { get; set; }
    public int HrId { get; set; }

    public Booking ToEntity()
    {
        return new Booking(Date, Note, MeetingUrl, MeetingType)
          .WithMeetingPeople(ReviewerId, HrId);
    }
}
