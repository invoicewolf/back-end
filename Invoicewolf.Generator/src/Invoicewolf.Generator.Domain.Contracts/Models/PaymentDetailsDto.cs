using System.ComponentModel.DataAnnotations;

namespace Invoicewolf.Generator.Domain.Contracts.Models;

public class PaymentDetailsDto : BasePaymentDetailsDto
{
    [Required] public required DateTime InvoiceDate { get; set; }
    [Required] public required DateTime DueDate { get; set; }
    [Required] public required string InvoiceNumber { get; set; }
}