using Domain.Entities;
using Domain.Exceptions;
using Domain.ValueObjects;

namespace Domain.Aggregates;

public class Recruitment : Aggregator
{
  private Recruitment() { }

  public Recruitment(string name, string content, string benifit, int positionId, int departmentId)
  {
    Name = name;
    Content = content;
    Benifit = benifit;
    PositionId = positionId;
    DepartmentId = departmentId;
  }

  public Recruitment WithSalaryRange(decimal salaryMin, decimal salaryMax)
  {
    SalaryMin = new Money { Value = salaryMin };
    SalaryMax = new Money { Value = salaryMax };
    return this;
  }

  public Recruitment WithExperienceRange(short min, short max)
  {
    ExpFrom = min;
    ExpTo = max;
    return this;
  }

  public Recruitment WithDeadline(DateTime from, DateTime to)
  {
    StartDate = from;
    EndDate = to;

    return this;
  }

  public string Name { get; private set; } = string.Empty;
  public string Content { get; private set; } = string.Empty;
  public string Benifit { get; private set; } = string.Empty;
  public DateTime StartDate { get; private set; }
  public DateTime EndDate { get; private set; }
  public Money SalaryMin { get; private set; } = null!;
  public Money SalaryMax { get; private set; } = null!;
  public short ExpFrom { get; private set;  }
  public short ExpTo { get; private set; }
  public int Number { get; private set; }
  public int PositionId { get; private set; }
  public int DepartmentId { get; private set; }
  
  public virtual Department? Department { get; private set; }
  public virtual Position? Position { get; private set; }

  public IList<Applicant> Applicants { get; private set; } = new List<Applicant>();

  public void AddApplicant(Applicant applicant)
  {
    var duplicateApplicant = Applicants.FirstOrDefault(e => e.CandidateId == applicant.CandidateId);

    if (duplicateApplicant != null)
      throw new DuplicatedApplicantException(applicant.CandidateId);

    Applicants.Add(applicant);
  }

  public void RemoveApplicant(int candidateId)
  {
    var applicant = Applicants.FirstOrDefault(e => e.CandidateId == candidateId);

    if (applicant == null)
      throw new ArgumentNullException($"not found applicant of candidate id: {candidateId}");

    if (!applicant.BookingId.HasValue)
      throw new InterviewHasBeenProcessingException(candidateId);

    applicant.Cancel();
  }
}