using Invoicewolf.Generator.Localization.DependencyInjection;
using Invoicewolf.Generator.WebAPI.DependencyInjection;
using QuestPDF;
using QuestPDF.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGeneratorControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMvc();

builder.Services.AddHealthChecks();

builder.Services.AddInvoiceLocalizer();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

Settings.License = LicenseType.Community;

app.UseHealthChecks("/health");

app.UseRequestLocalization(options =>
{
    var supportedCultures = new[] { "en-US", "en-GB", "nl-NL" };
    var localizationOptions = new RequestLocalizationOptions()
        .SetDefaultCulture("en-US")
        .AddSupportedCultures(supportedCultures)
        .AddSupportedUICultures(supportedCultures);

    app.UseRequestLocalization(localizationOptions);
});

app.MapControllers();

app.Run();
