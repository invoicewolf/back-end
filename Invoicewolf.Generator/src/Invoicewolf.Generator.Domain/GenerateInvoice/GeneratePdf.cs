using System.Globalization;
using Invoicewolf.Generator.Domain.Contracts.Models;
using Invoicewolf.Generator.Localization.Messages;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace InvoiceWolf.Generator.Domain.GenerateInvoice;

public class PdfGenerator
{
    private ILogger<PdfGenerator> _logger;
    private IStringLocalizer<InvoiceMessages> _stringLocalizer;

    public PdfGenerator(ILogger<PdfGenerator> logger, IStringLocalizer<InvoiceMessages> stringLocalizer)
    {
        _logger = logger;
        _stringLocalizer = stringLocalizer;
    }

    public byte[] GeneratePdf(InvoiceDto invoice)
    {
        _logger.LogInformation("Generating PDF started");

        var cultureInfo = CultureInfo.GetCultureInfo(invoice.Language);

        Thread.CurrentThread.CurrentCulture = cultureInfo;
        Thread.CurrentThread.CurrentUICulture = cultureInfo;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                _logger.LogDebug("Creating page started");

                String font;
                
                _logger.LogDebug("Selecting font started");

                switch (invoice.Font)
                {
                    case "TimesNewRoman":
                        font = Fonts.TimesNewRoman;
                        break;
                    default:
                        font = Fonts.Calibri;
                        break;
                }
                
                _logger.LogDebug("Selecting font finished. Result: {Result}", font);

                page.ContinuousSize(PageSizes.A4.Width);
                page.MinSize(PageSizes.A4);
                page.Margin(1, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily(font));

                _logger.LogDebug("Creating page finished");

                _logger.LogDebug("Creating page header started");

                page.Header().Padding(0.2f, Unit.Centimetre).Table(headerTable =>
                {
                    _logger.LogDebug("Creating header table definition started");

                    headerTable.ColumnsDefinition(headerTableColumns =>
                    {
                        headerTableColumns.RelativeColumn(50);
                        headerTableColumns.RelativeColumn(50);
                    });

                    _logger.LogDebug("Creating header table finished started");

                    headerTable.Cell().Column(addressDetailsColumn =>
                    {
                        addressDetailsColumn.Spacing(20);

                        _logger.LogDebug("Creating company details column started");

                        addressDetailsColumn.Item().Column(companyDetailsColumn =>
                        {
                            var companyDetails = invoice.CompanyDetails;

                            companyDetailsColumn.Item().Text(companyDetails.CompanyName);
                            companyDetailsColumn.Item().Text(
                                $"{companyDetails.StreetName} {companyDetails.HouseNumber}{companyDetails.Addition}");
                            companyDetailsColumn.Item().Text($"{companyDetails.ZipCode} {companyDetails.City}");
                            companyDetailsColumn.Item().Text(companyDetails.Country);
                            companyDetailsColumn.Item().ShowIf(companyDetails.CompanyNumber != null)
                                .Text($"{_stringLocalizer["CompanyNumber"]}: {companyDetails.CompanyNumber}");
                            companyDetailsColumn.Item().ShowIf(companyDetails.TaxNumber != null)
                                .Text($"{_stringLocalizer["TaxNumber"]}: {companyDetails.TaxNumber}");
                        });

                        _logger.LogDebug("Creating company details column finished");

                        _logger.LogDebug("Creating addressee details column started");

                        addressDetailsColumn.Item().Column(addresseeDetailsColumn =>
                        {
                            var addresseeDetails = invoice.AddresseeDetails;

                            addresseeDetailsColumn.Item().Text(addresseeDetails.CompanyName);
                            addresseeDetailsColumn.Item().ShowIf(addresseeDetails.Attention != null).Text(
                                $"${_stringLocalizer["Attention"]} {addresseeDetails.Attention}");
                            addresseeDetailsColumn.Item().ShowIf(addresseeDetails.Subject != null)
                                .Text($"${_stringLocalizer["Subject"]} {addresseeDetails.Subject}");
                            addresseeDetailsColumn.Item().Text(
                                $"{addresseeDetails.StreetName} {addresseeDetails.HouseNumber}{addresseeDetails.Addition}");
                            addresseeDetailsColumn.Item()
                                .Text($"{addresseeDetails.ZipCode} {addresseeDetails.City}");
                            addresseeDetailsColumn.Item().Text(addresseeDetails.Country);
                        });

                        _logger.LogDebug("Creating addressee details column finished");

                        _logger.LogDebug("Creating invoice details column started");

                        addressDetailsColumn.Item().Column(invoiceDetailsColumn =>
                        {
                            var paymentDetails = invoice.PaymentDetails;
                            var companyDetails = invoice.CompanyDetails;

                            invoiceDetailsColumn.Item().Text(
                                $"{companyDetails.City}, {paymentDetails.InvoiceDate.ToLongDateString()}");
                            invoiceDetailsColumn.Item().Text(
                                $"{_stringLocalizer["Regarding"]}: {_stringLocalizer["Invoice"]} #{paymentDetails.InvoiceNumber}");
                        });

                        _logger.LogDebug("Creating invoice details column finished");
                    });

                    _logger.LogDebug("Creating invoice logo started");

                    headerTable.Cell().Text(_stringLocalizer["Invoice"]).ExtraBold().FontSize(36).AlignRight();

                    _logger.LogDebug("Creating invoice logo finished");
                });

                _logger.LogDebug("Creating page header finished");

                _logger.LogDebug("Creating page content started");

                page.Content()
                    .PaddingVertical(1, Unit.Centimetre)
                    .Column(x =>
                    {
                        x.Spacing(20);

                        _logger.LogDebug("Creating products column started");

                        x.Item().Column(productsColumn =>
                        {
                            _logger.LogDebug("Getting currency started");

                            var currencyStrings = new Dictionary<string, string>
                            {
                                {
                                    "USD", "$"
                                },
                                {
                                    "EUR", "€"
                                },
                                {
                                    "GBP", "£"
                                }
                            };

                            if (!currencyStrings.ContainsKey(invoice.PaymentDetails.Currency))
                            {
                                throw new ArgumentException("Currency not found");
                            }
                            
                            var currency = currencyStrings[invoice.PaymentDetails.Currency];

                            _logger.LogDebug("Getting currency finished. Result: {Currency}", currency);

                            _logger.LogDebug("Creating products table started");

                            productsColumn.Item().Table(productsTable =>
                            {
                                var products = invoice.Products;

                                _logger.LogDebug("Creating products table definition started");

                                productsTable.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(24);
                                    columns.RelativeColumn(10);
                                    columns.RelativeColumn(12);
                                    columns.RelativeColumn(10);
                                    columns.RelativeColumn(10);
                                    columns.RelativeColumn(4);
                                    columns.RelativeColumn(15);
                                });

                                _logger.LogDebug("Creating products table definition finished");

                                _logger.LogDebug("Creating products table headers started");

                                productsTable.Cell().Element(TableHeader).Text(_stringLocalizer["Description"]).Bold();
                                productsTable.Cell().Element(TableHeader).Text(_stringLocalizer["Amount"]).Bold();
                                productsTable.Cell().Element(TableHeader)
                                    .Text($"{_stringLocalizer["Tariff"]} ({currency})").Bold();
                                productsTable.Cell().ColumnSpan(3).Element(TableHeader)
                                    .Text(_stringLocalizer["TaxRate"]).Bold();
                                productsTable.Cell().Element(TableHeader)
                                    .Text($"{_stringLocalizer["Cost"]} ({currency})").Bold();

                                _logger.LogDebug("Creating products table headers finished");

                                _logger.LogDebug("Adding products to products table started");

                                int productIndex = 1;

                                foreach (var product in products)
                                {
                                    _logger.LogDebug(
                                        "Adding product {ProductIndex} out of {AmountOfProducts} to products table started",
                                        productIndex, products.Count());

                                    if (productIndex % 2 != 0)
                                    {
                                        productsTable.Cell().Element(TableCellWithoutBorder).Text(product.Description);
                                        productsTable.Cell().Element(TableCellWithoutBorder).Text(product.Amount.ToString());
                                        productsTable.Cell().Element(TableCellWithoutBorder)
                                            .Text(ProcessCurrency(product.Tariff));
                                        productsTable.Cell().ColumnSpan(2).Element(TableCellWithoutBorder).Text($"{product.TaxRate}%");
                                        productsTable.Cell().Element(TableCellWithoutBorder).Text("").AlignCenter();
                                        productsTable.Cell().Element(TableCellWithoutBorder)
                                            .Text(ProcessCurrency(product.Cost))
                                            .AlignRight();
                                    }
                                    else
                                    {
                                        productsTable.Cell().Element(TableCellWithoutBorderAlternate).Text(product.Description);
                                        productsTable.Cell().Element(TableCellWithoutBorderAlternate).Text(product.Amount.ToString());
                                        productsTable.Cell().Element(TableCellWithoutBorderAlternate)
                                            .Text(ProcessCurrency(product.Tariff));
                                        productsTable.Cell().ColumnSpan(2).Element(TableCellWithoutBorderAlternate).Text($"{product.TaxRate}%");
                                        productsTable.Cell().Element(TableCellWithoutBorderAlternate).Text("").AlignCenter();
                                        productsTable.Cell().Element(TableCellWithoutBorderAlternate)
                                            .Text(ProcessCurrency(product.Cost))
                                            .AlignRight();
                                    }

                                    productIndex++;

                                    _logger.LogDebug(
                                        "Adding product {ProductIndex} out of {AmountOfProducts} to products table finished",
                                        productIndex, products.Count());
                                }

                                _logger.LogDebug("Adding products to products table finished");
                            });

                            _logger.LogDebug("Creating products table finished");

                            _logger.LogDebug("Adding price table started");

                            productsColumn.Item().Table(priceTable =>
                            {
                                _logger.LogDebug("Adding price table definition started");

                                priceTable.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(52);
                                    columns.RelativeColumn(16);
                                    columns.RelativeColumn(4);
                                    columns.RelativeColumn(12);
                                });

                                _logger.LogDebug("Adding price table definition finished");

                                _logger.LogDebug("Adding price table content started");

                                var price = invoice.Price;

                                priceTable.Cell();
                                priceTable.Cell().Element(TableCell).Text(_stringLocalizer["Subtotal"]).AlignRight();
                                priceTable.Cell().Element(TableCell).Text(currency).AlignCenter();
                                priceTable.Cell().Element(TableCell)
                                    .Text(ProcessCurrency(price.Subtotal)).AlignRight();

                                priceTable.Cell();
                                priceTable.Cell().Element(TableCellWithoutBorder).Text(_stringLocalizer["TaxAmount"])
                                    .AlignRight();
                                priceTable.Cell().Element(TableCellWithoutBorder).Text(currency).AlignCenter();
                                priceTable.Cell().Element(TableCellWithoutBorder)
                                    .Text(ProcessCurrency(price.TaxAmount)).AlignRight();

                                priceTable.Cell();
                                priceTable.Cell().Element(TableHeaderWithoutBorder).Text(_stringLocalizer["TotalIncludingTax"])
                                    .AlignRight().Bold();
                                priceTable.Cell().Element(TableHeaderWithoutBorder).Text(currency).AlignCenter().Bold();
                                priceTable.Cell().Element(TableHeaderWithoutBorder)
                                    .Text(ProcessCurrency(price.Total)).AlignRight().Bold();

                                _logger.LogDebug("Adding price table content finished");
                            });
                        });

                        _logger.LogDebug("Adding price table finished");
                    });

                _logger.LogDebug("Creating page content finished");

                _logger.LogDebug("Creating page footer started");

                page.Footer().AlignBottom().PaddingTop(3, Unit.Centimetre).Column(x =>
                {
                    x.Spacing(20);

                    _logger.LogDebug("Creating terms column started");

                    x.Item().Column(termsColumn =>
                    {
                        termsColumn.Item().Text(_stringLocalizer["TermsAndConditions"]).Bold();
                        termsColumn.Item().Text(_stringLocalizer["AllPricesExcludeVAT"]);
                        termsColumn.Item()
                            .Text(String.Format(_stringLocalizer["PaymentTerm"],
                                (invoice.PaymentDetails.DueDate - invoice.PaymentDetails.InvoiceDate)
                                .TotalDays, invoice.PaymentDetails.DueDate.ToLongDateString())
                            );
                    });

                    _logger.LogDebug("Creating terms column finished");

                    _logger.LogDebug("Creating payment info column started");

                    x.Item().Text(text =>
                    {
                        text.Span($"{_stringLocalizer["PaymentTo"]} ");
                        text.Span(invoice.PaymentDetails.Iban).Bold();
                    });

                    x.Item().Text(text =>
                    {
                        text.Span($"{_stringLocalizer["QuestionsOrRemarks"]} ");
                        text.Span(invoice.CompanyDetails.CompanyEmail).Bold();
                    });

                    _logger.LogDebug("Creating payment info column finished");
                });

                _logger.LogDebug("Creating page footer finished");
            });
        });

        _logger.LogInformation("Generating PDF finished");

        return document.GeneratePdf();
    }

    private static IContainer TableHeader(IContainer container)
    {
        return container
            .BorderBottom(1)
            .Background(Colors.Grey.Lighten2)
            .PaddingHorizontal(10)
            .MinHeight(17)
            .ShowOnce()
            .AlignMiddle();
    }
    
    private static IContainer TableHeaderWithoutBorder(IContainer container)
    {
        return container
            .Background(Colors.Grey.Lighten2)
            .PaddingHorizontal(10)
            .MinHeight(17)
            .ShowOnce()
            .AlignMiddle();
    }

    private static IContainer TableCell(IContainer container)
    {
        return container
            .BorderTop(1)
            .PaddingHorizontal(10)
            .MinHeight(20)
            .ShowOnce()
            .AlignMiddle();
    }

    private static IContainer TableCellWithoutBorder(IContainer container)
    {
        return container
            .PaddingHorizontal(10)
            .MinHeight(20)
            .ShowOnce()
            .AlignMiddle();
    }
    
    private static IContainer TableCellWithoutBorderAlternate(IContainer container)
    {
        return container
            .Background(Colors.Grey.Lighten4)
            .PaddingHorizontal(10)
            .MinHeight(20)
            .ShowOnce()
            .AlignMiddle();
    }

    private string ProcessCurrency(decimal currencyValue)
    {
        return currencyValue.ToString("C", CultureInfo.CurrentCulture)[1..];
    }
}