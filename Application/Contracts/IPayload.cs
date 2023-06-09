namespace Application.Contracts;

public interface IPayload<TEntity>
{
  TEntity ToEntity();
}

public interface IResponse
{
}