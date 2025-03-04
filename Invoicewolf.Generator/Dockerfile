# Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory in the container
WORKDIR /src

# Copy all other project files
COPY ../ .

# Restore dependencies for all projects
RUN dotnet restore "src/Invoicewolf.Generator.Application/Invoicewolf.Generator.Application.csproj"

# Publish the app to the /app folder in the container
RUN dotnet publish "src/Invoicewolf.Generator.Application/Invoicewolf.Generator.Application.csproj"-c Release -o /app

# Use the official .NET runtime image to run the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

# Set the working directory in the container
WORKDIR /app

# Copy the published files from the build image to the runtime image
COPY --from=build /app .

# Define the entry point to run the application
ENTRYPOINT ["dotnet", "Invoicewolf.Generator.Application.dll"]
