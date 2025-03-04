using System.ComponentModel.DataAnnotations;

namespace Invoicewolf.Generator.Domain.Contracts.Models;

public abstract class BasePaymentDetailsDto
{
    [Required] public required string Iban { get; set; }
    [Required] public required string Currency { get; set; }
}