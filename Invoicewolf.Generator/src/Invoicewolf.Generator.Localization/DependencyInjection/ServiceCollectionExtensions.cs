using Microsoft.Extensions.DependencyInjection;

namespace Invoicewolf.Generator.Localization.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInvoiceLocalizer(this IServiceCollection services)
    {
        services.AddLocalization(options =>
        {
            options.ResourcesPath = "Resources";
        });

        return services;
    }
}