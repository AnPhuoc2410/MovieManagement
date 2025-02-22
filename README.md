# Movie Management System
![Movie Management System](https://res.cloudinary.com/dwqyqsqmq/image/upload/v1740222771/dbtlvkwequ3gdqyhtp1d.png)  
[Live Demo](https://eigaa.vercel.app/)
## Overview
The **Movie Management System** is a web-based application designed to facilitate the management of movie theaters, including scheduling, ticket booking, and user management. The project consists of a **React (Vite + TypeScript)** frontend and an **ASP.NET Core** backend.

## Features
### User Features
- User Management
- Browse and search movies
- View movie details and showtimes
- Book tickets
- View Promotions

### Admin Features
- Manage movies (add, update, delete)
- Manage showtimes and theaters
- Manage ticket bookings
- Manage promotions
- Member and Employees management
- View analytics and reports

## Technologies Used
### Frontend (React + Vite + TypeScript)
- React 18
- Vite for fast build and development
- TypeScript for type safety
- React Router for navigation
- Axios for API calls
- TailwindCSS / Material UI for styling

### Backend (ASP.NET Core)
- ASP.NET Core 8.0
- Entity Framework Core for database access
- SQL Server as the database
- Identity for authentication and authorization
- Swagger for API documentation

## Installation Guide
### Prerequisites
- Node.js (v16 or later) and npm
- .NET SDK (8.0)
- SQL Server (LocalDB or full version)

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/movie-management.git
   cd movie-management/backend
   ```
2. Install dependencies:
   ```sh
   dotnet restore
   ```
3. Set up the database:
   ```sh
   dotnet ef database update
   ```
4. Run the API:
   ```sh
   dotnet run
   ```
   The backend should be running at `https://localhost:7119`

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:7119/api
   ```
4. Run the frontend:
   ```sh
   npm run dev
   ```
   The frontend should be running at `http://localhost:3000`

## API Endpoints
The backend provides the following API endpoints:
- `GET /api/movies` - Retrieve all movies
- `GET /api/movies/{id}` - Retrieve movie details
- `POST /api/movies` - Add a new movie (Admin only)
- `PUT /api/movies/{id}` - Update a movie (Admin only)
- `DELETE /api/movies/{id}` - Delete a movie (Admin only)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/tickets` - Book a ticket

For full API documentation, access `https://localhost:7119/swagger`

## Deployment
### Backend Deployment
- Deploy the ASP.NET Core API to **Azure App Services**, **AWS**, or **on-premises IIS**.
- Configure **SQL Server** connection string in `appsettings.json`.

### Frontend Deployment
- Build the frontend using:
  ```sh
  npm run build
  ```
- Deploy using **Vercel**.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Our Contributors ✨

<a href="https://github.com/AnPhuoc2410/MovieManagement/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=AnPhuoc2410/MovieManagement" />
</a>

