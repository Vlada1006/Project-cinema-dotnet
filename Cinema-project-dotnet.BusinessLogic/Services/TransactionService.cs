using Cinema_project_dotnet.BusinessLogic.Entities;
using Cinema_project_dotnet.BusinessLogic.Interfaces;

namespace Cinema_project_dotnet.BusinessLogic.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly IGenericRepository<Transaction> _transactionRepo;
        
        public TransactionService(IGenericRepository<Transaction> transactionRepo)
        {
            _transactionRepo = transactionRepo;
        }

        public async Task<int> PayBooking(decimal amount)
        {
            var transaction = new Transaction{
                Status = "Success",
                Amount = amount,
                TransactionDate = DateTime.UtcNow
            };

            await _transactionRepo.AddAsync(transaction);

            return transaction.Id;
        }
    }
}
