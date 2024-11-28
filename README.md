# Exchange Rate Application

This repository contains three main components of the Exchange Rate Application:
1. **Server App**: Backend server that handles API requests and database interactions.
2. **Exchange Admin App**: Admin interface for managing exchange rates, locations, and currencies.
3. **Exchange Client App**: Client interface for viewing the nearest and best exchange rates.

## Technologies Used

- **Server App**:
  - Node.js
  - Express.js
  - MySQL
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
  - OpenStreetMap for map integration

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
   - Update the database configuration in `server/config/db.js`.

4. **Run the server**:
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

## API Endpoints

## Features

### Exchange Admin App

- Manage exchange rates, locations, and currencies.
- View and update rates.
- Insert new rates.
- Delete rates.
- Data visualization using Google Charts.

### Exchange Client App

- View nearest exchange rates based on location.
- View best exchange rates.
- Map integration using OpenStreetMap.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
```
