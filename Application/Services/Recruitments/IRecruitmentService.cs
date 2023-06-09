using Application.Contracts;
using Domain.Aggregates;

namespace Application.Services.Recruitments;

public interface IRecruitmentService : IGenericService<Recruitment, RecruitmentResponse>
{
}
