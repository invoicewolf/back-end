using InvoiceWolf.Generator.Domain.GenerateInvoice;
using Invoicewolf.Generator.Localization.DependencyInjection;
using Invoicewolf.Generator.WebAPI.Controllers;

namespace Invoicewolf.Generator.WebAPI.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddGeneratorControllers(this IServiceCollection services)
    {
        services.AddTransient<PdfGenerator>();
        services.AddScoped<InvoiceController>();

        return services;
    }
}