using WebDigital.dto;

namespace WebDigital.Services.Interface
{
    public interface ITransactionService
    {
        Task<TransactionDetailDto> Checkout(int userId, CheckoutDto dto);

        Task<List<TransactionSummaryDto>> GetMyTransactions(int userId);

        Task<TransactionDetailDto> GetTransactionById(int userId, long transactionId);
    }
}