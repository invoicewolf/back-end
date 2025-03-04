using System.ComponentModel.DataAnnotations;

namespace Invoicewolf.Generator.Domain.Contracts.Models;

public abstract class AddressDetailsDto
{
    [Required] public required string StreetName { get; set; }
    [Required] public required string HouseNumber { get; set; }
    public string? Addition { get; set; }
    [Required] public required string ZipCode { get; set; }
    [Required] public required string City { get; set; }
    [Required] public required string Country { get; set; }
}