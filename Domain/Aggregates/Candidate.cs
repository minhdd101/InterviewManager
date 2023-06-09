using Domain.Enums;
using Domain.ValueObjects;

namespace Domain.Aggregates;

public class Candidate : Aggregator
{
  private Candidate() { }

  public Candidate(string name, string email, string phone, string address, Gender gender,
    DateTime birthday, string attachment = "", string qualification = "", string note = "")
  {
    Name = name;
    Email = new EmailAddress { Email = email };
    Phone = new PhoneNumber { Phone = phone };
    Address = address;
    Gender = gender;
    Birthday = birthday;
    Attachment = attachment;
    Qualification = qualification;
    Note = note;
  }

  public string Name { get; private set; } = string.Empty;
  public EmailAddress Email { get; private set; } = null!;
  public PhoneNumber Phone { get; private set; } = null!;
  public string Address { get; private set; } = string.Empty;
  public string Attachment { get; private set; } = string.Empty;
  public string Qualification { get; private set; } = string.Empty;
  public Gender Gender { get; private set; }
  public DateTime Birthday { get; private set; }
  public string Note { get; private set; } = string.Empty;
}