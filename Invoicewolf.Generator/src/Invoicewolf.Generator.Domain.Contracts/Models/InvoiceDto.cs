using System.ComponentModel.DataAnnotations;

namespace Invoicewolf.Generator.Domain.Contracts.Models;

public class InvoiceDto
{
    [Required] public required CompanyDetailsDto CompanyDetails { get; set; }
    [Required] public required AddresseeDetailsDto AddresseeDetails { get; set; }
    [Required] public required List<ProductDto> Products { get; set; }
    [Required] public required PriceDto Price { get; set; }
    [Required] public required PaymentDetailsDto PaymentDetails { get; set; }
    [Required] public required string Language { get; set; }
    public string? Font { get; set; }
}