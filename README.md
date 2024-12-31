# Student Management Application

## Prerequisites

### Download .NET Version 8
1. Visit the [.NET download page](https://dotnet.microsoft.com/download/dotnet/8.0).
2. Select the appropriate installer for your operating system and follow the installation instructions.

### Download PostgreSQL from EnterpriseDB
1. Go to the [EnterpriseDB PostgreSQL download page](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
2. Choose the version suitable for your operating system and follow the installation instructions.

### Download Node.js
1. Visit the [Node.js download page](https://nodejs.org/).
2. Download the installer for your operating system and follow the installation instructions.

## Setting Up the Database

1. After installing PostgreSQL, open the PostgreSQL command line or pgAdmin.
2. Create a new database named `studentsinfo` by executing the following SQL command:
   ```sql
   CREATE DATABASE studentsinfo;
   ```

## Running the Application

### Server Side
1. Navigate to the `ReactApp1/Server` directory in your terminal.
2. Run the following command to start the application:
   ```bash
   dotnet watch run
   ```
3. After approximately 4 seconds, a command section will appear with a URL. Control-click the URL to view the client side of the application.

### Client Side
1. Navigate to the `ReactApp1.client` directory in your terminal.
2. Run the following command to install the necessary dependencies:
   ```bash
   npm install
   ```
3. After the installation is complete, you can start the client application with:
   ```bash
   npm start
   ```

## Additional Information

- Ensure that your connection string in `appsettings.json` is correctly configured to connect to the `studentsinfo` database.
- The application uses Dapper for data access and ClosedXML for generating PDF files.
