using System.Linq.Expressions;

namespace Cinema_project_dotnet.BusinessLogic.Interfaces
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task<IEnumerable<TEntity>> GetAllAsync(Func<IQueryable<TEntity>, IQueryable<TEntity>> includeFunc);
        Task<TEntity> GetByIdAsync(int id);
        Task<TEntity> GetByIdAsync(int id, Func<IQueryable<TEntity>, IQueryable<TEntity>> includeFunc);
        Task AddAsync(TEntity entity);
        Task UpdateAsync(TEntity entity);
        Task DeleteAsync(int id);
        Task DeleteAsync(TEntity entity);
        Task<IEnumerable<TEntity>> GetByConditionAsync(Expression<Func<TEntity, bool>> predicate);
    }
}
