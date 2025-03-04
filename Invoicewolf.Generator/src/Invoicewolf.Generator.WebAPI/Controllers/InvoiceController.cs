using System.Globalization;
using Invoicewolf.Generator.Domain.Contracts.Models;
using InvoiceWolf.Generator.Domain.GenerateInvoice;
using Invoicewolf.Generator.Localization.Messages;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Localization;

namespace Invoicewolf.Generator.WebAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class InvoiceController : ControllerBase
{
    private readonly ILogger<InvoiceController> _logger;
    private readonly PdfGenerator _pdfGenerator;
    private readonly IStringLocalizer<InvoiceMessages> _stringLocalizer;

    public InvoiceController(ILogger<InvoiceController> logger, PdfGenerator pdfGenerator, IStringLocalizer<InvoiceMessages> stringLocalizer)
    {
        _logger = logger;
        _pdfGenerator = pdfGenerator;
        _stringLocalizer = stringLocalizer;
    }
    
    [HttpPost(Name = "CreateInvoice")]
    public IActionResult Create([FromBody] InvoiceDto invoiceContents)
    {
        var invoicePdf = _pdfGenerator.GeneratePdf(invoiceContents);

        return File(invoicePdf, "application/pdf", "invoice.pdf");
    }
}
