using System.ComponentModel.DataAnnotations;

namespace Invoicewolf.Generator.Domain.Contracts.Models;

public class ProductDto
{
    [Required] public required string Description { get; set; }
    [Required] public required int Amount { get; set; }
    [Required] public required decimal Tariff { get; set; }
    [Required] public required int TaxRate { get; set; }
    [Required] public required decimal Cost { get; set; }
}