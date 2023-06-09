namespace Application.Services.Recruitments;

public class RecruitmentResponse
{
  public int Id { get; set; }
  public string Position { get; set; } = string.Empty;
  public string Name { get; set; } = string.Empty;
  public string Content { get; set; } = string.Empty;
  public string Benifit { get; set; } = string.Empty;
  public DateTime StartDate { get; set; }
  public DateTime EndDate { get; set; }
  public string SalaryMin { get; set; } = string.Empty;
  public string SalaryMax { get; set; } = string.Empty;
  public short ExpFrom { get; set; }
  public short ExpTo { get; set; }
  public int Number { get; set; }
  public int PositionId { get; set; }
  public int DepartmentId { get; set; }
}