# <img src="https://raw.githubusercontent.com/BogdanBargaoanu/ExchangeMonitor/refs/heads/main/exchange-client/src/Components/Assets/logo.png" style="width: 100px;">MoneyStream

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

**MoneyStream** is a comprehensive platform designed to provide users with real-time exchange rates, manage exchange rate data, and visualize currency trends. It includes a robust backend server, an admin interface for managing data, and a client interface for end-users to view the best and nearest exchange rates.

## Documentation 

For a comprehensive documentation of this project, including system architecture, implementation details, please refer to the attached PDF document.
> Note: The documentation is provided in Romanian.

[Link to PDF](https://github.com/BogdanBargaoanu/exchange/blob/main/documentation/exchange_platform_documentation.pdf)

## Summary

This repository contains three main components of the Exchange Rate Application:
1. **Server App**: Backend server that handles API requests and database interactions.
2. **Exchange Admin App**: Admin interface for managing exchange rates, locations, and currencies.
3. **Exchange Client App**: Client interface for viewing the nearest and best exchange rates.

## Technologies Used

- **Server App**:
  - Node.js
  - Express.js
  - MySQL
  - SMTP
  - Swagger (OpenAPI) for API documentation

- **Exchange Admin App**:
  - React.js
  - Axios for API requests
  - React Table for data tables
  - Bootstrap for styling
  - React Google Charts for data visualization

- **Exchange Client App**:
  - React.js
  - Axios for API requests
  - React Router for navigation
  - React Icons for icons
  - React Google Charts for data visualization

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- MySQL database setup

### Server App

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
   - Create a MySQL database and import the provided schema.
   - Update the database configuration in `server/app.js`.

4. **Environmental variables**:
   - Create a `.env` file in the `server` directory.
   - Enter your SMTP credentials.
   - Enter the MySQL credentials.
   <br></br>
     
   > MySQL
   ```ini
    SMTP_USER=your_email
    SMTP_PASS=your_password
    SECRET_KEY=your_secret_key
    MYSQL_HOST=your_host(localhost if locally)
    MYSQL_USER=your_user(root if default)
    MYSQL_PASS=your_mysql_pass
   ```   
   - Create a `.env` file in the `exchange-admin` and `exchange-admin` directory.
   - Enter the API URL.
   <br></br>
   > Admin App & Client App
   ```ini
   REACT_APP_API_URL=your_ivp4_url
   ```

5. **Run the server**:
   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

### Exchange Admin App

1. **Navigate to the exchange-admin directory**:
   ```bash
   cd exchange-admin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the admin app**:
   ```bash
   npm start
   ```

   The admin app will start on `http://localhost:3001`.

### Exchange Client App

1. **Navigate to the exchange-client directory**:
   ```bash
   cd exchange-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the client app**:
   ```bash
   npm start
   ```

   The client app will start on `http://localhost:3002`.


### Server App
 - API Security with JWT.
 - SMTP implementation.
 > The server uses JSON Web Tokens (JWT) to secure the API endpoints.
 - Data Encryption
 > User passwords are hashed using MD5 before being stored in the database to ensure security.

### Exchange Admin App

- Login Functionality.
> The admin app includes a login page where administrators must authenticate using their credentials.
>
> JWT tokens are used to manage sessions securely.
- Manage exchange rates, locations, and currencies.
- View and update rates.
- Insert new rates.
- Delete rates.
- Data visualization using Google Charts.

### Exchange Client App

- View nearest exchange rates based on location.
- View best exchange rates.
- Map integration with Google Maps.
- Reactive design.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

---
