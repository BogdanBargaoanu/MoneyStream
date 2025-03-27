<div align="center" class="text-center">
<img src="https://raw.githubusercontent.com/BogdanBargaoanu/ExchangeMonitor/refs/heads/main/exchange-client/src/Components/Assets/logo.png" style="width: 100px;">
<h1>MoneyStream</h1>
<p><em>Streamlining your finances, empowering your future.</em></p>

<img alt="last-commit" src="https://img.shields.io/github/last-commit/BogdanBargaoanu/MoneyStream?style=flat&logo=git&logoColor=white&color=0080ff">
<img alt="repo-top-language" src="https://img.shields.io/github/languages/top/BogdanBargaoanu/MoneyStream?style=flat&color=0080ff">
<img alt="repo-language-count" src="https://img.shields.io/github/languages/count/BogdanBargaoanu/MoneyStream?style=flat&color=0080ff">

<p><em>Built with the tools and technologies:</em></p>
<img alt="React" src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black">
<img alt="Bootstrap" src="https://img.shields.io/badge/Bootstrap-7952B3.svg?style=flat&logo=Bootstrap&logoColor=white">
<img alt="React Bootstrap" src="https://img.shields.io/badge/React%20Bootstrap-41E0FD.svg?style=flat&logo=React-Bootstrap&logoColor=black">
<img alt="React Router" src="https://img.shields.io/badge/React%20Router-CA4245.svg?style=flat&logo=React-Router&logoColor=white">
<img alt="Axios" src="https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white">
<img alt="React Table" src="https://img.shields.io/badge/React%20Table-FF4154.svg?style=flat&logo=React-Table&logoColor=white">
<img alt="Google Charts" src="https://img.shields.io/badge/Google%20Charts-4285F4.svg?style=flat&logo=Google-Chrome&logoColor=white">
<img alt="Express" src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white">
<img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933.svg?style=flat&logo=Node.js&logoColor=white">
<img alt="MySQL" src="https://img.shields.io/badge/MySQL-4479A1.svg?style=flat&logo=MySQL&logoColor=white">
<img alt="JWT" src="https://img.shields.io/badge/JWT-000000.svg?style=flat&logo=JSON-Web-Tokens&logoColor=white">
<img alt="Swagger" src="https://img.shields.io/badge/Swagger-85EA2D.svg?style=flat&logo=Swagger&logoColor=black">
<img alt="Nodemailer" src="https://img.shields.io/badge/Nodemailer-00F88E.svg?style=flat&logo=Mail.Ru&logoColor=white">
<img alt="CORS" src="https://img.shields.io/badge/CORS-6478FF.svg?style=flat&logo=Cross-Origin-Resource-Sharing&logoColor=white">
<img alt="dotenv" src="https://img.shields.io/badge/dotenv-ECD53F.svg?style=flat&logo=dotenv&logoColor=black">
<br>
<br>
<br>

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
<br>
<br>

**MoneyStream** is a comprehensive platform designed to provide users with real-time exchange rates, manage exchange rate data, and visualize currency trends. It includes a robust backend server, an admin interface for managing data, and a client interface for end-users to view the best or nearest exchange rates.

</div>
<br>
<br>




## Highlights
 - Featured in **Internet of Things Student Challange 2025**
 - Featured in **InnovationLabs 2025**

## Documentation 

For a comprehensive documentation of this project, including system architecture, implementation details, please refer to the attached PDF document.
> Note: The documentation is provided in Romanian.

[Link to PDF](https://github.com/BogdanBargaoanu/exchange/blob/main/documentation/exchange_platform_documentation.pdf)

## Summary

This repository contains three main components of the Exchange Rate Application:
1. **Server App**: Backend server that handles API requests and database interactions.
2. **Exchange Admin App**: Admin interface for managing exchange rates, locations, and currencies.
3. **Exchange Client App**: Client interface for viewing the nearest and best exchange rates.

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
     
   > SMTP & MySQL
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
   REACT_APP_API_URL=your_IPV4_url
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
