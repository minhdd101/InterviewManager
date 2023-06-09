using Application.Services.Recruitments;
using Application.Services.Recruitments.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace UI.Controllers;

public class RecruitmentController : Controller
{
  private readonly IRecruitmentService _services;

  public RecruitmentController(IRecruitmentService services)
  {
    _services = services;
  }

  public async Task<IActionResult> Index()
  {
    var filter = new RecruitmentFilter();
    var spec = new RecruitmentFilterSpecification(filter);

    var records = await _services.Query(spec);

    return View(records);
  }

  [HttpGet]
  [Route("{id:int}")]
  public async Task<IActionResult> Get([FromRoute] int id)
  {
    var specification = new GetRecruitmentByIdSpecification(id);

    var response = await _services.Get(specification);

    return View(response);
  }

  [HttpPost]
  public async Task<IActionResult> Post([FromBody] RecruitmentPayload payload)
  {
    var response = await _services.AddOrUpdate(payload);

    return View(response);
  }

  [HttpDelete]
  [Route("{id:int}")]
  public async Task<IActionResult> Delete([FromRoute] int id)
  {
    await _services.Delete(id);

    return RedirectToAction("Index");
  }
}
