using System.ComponentModel.DataAnnotations;

namespace Invoicewolf.Generator.Domain.Contracts.Models;

public class AddresseeDetailsDto : AddressDetailsDto
{
    [Required] public required string CompanyName { get; set; }
    public string? Attention { get; set; }
    public string? Subject { get; set; }
}