using System.ComponentModel.DataAnnotations;

namespace Invoicewolf.Generator.Domain.Contracts.Models;

public class CompanyDetailsDto : AddressDetailsDto
{
    [Required] public required string CompanyEmail { get; set; }
    [Required] public required string CompanyName { get; set; }
    public string? CompanyNumber { get; set; }
    public string? TaxNumber { get; set; }
}