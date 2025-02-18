namespace Cinema_project_dotnet.BusinessLogic.Entities
{
    public class Transaction
    {
        public int Id { get; set; }

        public string Status { get; set; } = String.Empty;

        public decimal Amount { get; set; }

        public DateTime TransactionDate { get; set; }

        public Booking? Booking { get; set; }
    }
}
