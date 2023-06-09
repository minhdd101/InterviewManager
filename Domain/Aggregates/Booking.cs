using Domain.Entities;
using Domain.Enums;

namespace Domain.Aggregates;

public class Booking : Aggregator
{
    private Booking() { }

    public Booking(DateTime date, string note = "", string meetingUrl = "", MeetingType meetingType = MeetingType.Offline)
    {
        Date = date;
        Note = note;
        MeetingUrl = meetingUrl;
        MeetingType = meetingType;
    }

    public Booking WithMeetingPeople(int reviewerId, int hrId)
    {
        ReviewerId = reviewerId;
        HrId = hrId;
        return this;
    }

    public void Update(Booking booking)
    {
        Date = booking.Date;
        Note = booking.Note;
        MeetingType = booking.MeetingType;
        MeetingUrl = booking.MeetingUrl;
    }

    public DateTime Date { get; private set; }
    public string Note { get; private set; } = string.Empty;
    public string? MeetingUrl { get; private set; }
    public MeetingType MeetingType { get; private set; }
    public int ReviewerId { get; private set; }
    public int HrId { get; private set; }

    public Interview? Interview { get; private set; }

    public void Cancel() => UpdateStatus(Status.Unavailable);
}
