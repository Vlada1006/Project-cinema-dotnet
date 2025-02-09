using System.Transactions;

namespace Cinema_project_dotnet.BusinessLogic.Interfaces
{
    public interface ITransactionService
    {
        Task PayBooking(decimal amount);
    }
}
