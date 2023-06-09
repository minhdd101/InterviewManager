using Application.Abstractions;
using Application.Contracts;
using Domain.Aggregates;
using Domain.Common;
using System.Linq.Expressions;

namespace Application.Services.Bookings.Specifications;

public sealed class GetBookingByIdSpecification : Specification<Booking>
{
  private readonly int _id;

  public GetBookingByIdSpecification(int id)
  {
    _id = id;
  }

  public override Expression<Func<Booking, bool>> ToExpression()
  {
    return e => e.Id == _id;
  }
}