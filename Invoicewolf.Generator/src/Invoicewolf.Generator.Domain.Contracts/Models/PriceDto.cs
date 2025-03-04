using System.ComponentModel.DataAnnotations;

namespace Invoicewolf.Generator.Domain.Contracts.Models;

public class PriceDto
{
    [Required] public required decimal Subtotal { get; set; }
    [Required] public required decimal TaxAmount { get; set; }
    [Required] public required decimal Total { get; set; }
}