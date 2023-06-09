using Application.Contracts;
using Domain.Aggregates;

namespace Application.Services.Recruitments;

public class RecruitmentPayload : IPayload<Recruitment>
{
    public int Id { get; set; }
    public string Name { get; private set; } = string.Empty;
    public string Content { get; private set; } = string.Empty;
    public string Benifit { get; private set; } = string.Empty;
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public decimal SalaryMin { get; private set; }
    public decimal SalaryMax { get; private set; }
    public short ExpFrom { get; private set; }
    public short ExpTo { get; private set; }
    public int Number { get; private set; }
    public int PositionId { get; private set; }
    public int DepartmentId { get; private set; }

    public Recruitment ToEntity()
    {
        return new Recruitment(Name, Content, Benifit, PositionId, DepartmentId)
          .WithDeadline(StartDate, EndDate)
          .WithExperienceRange(ExpFrom, ExpTo)
          .WithSalaryRange(SalaryMin, SalaryMax);
    }
}
