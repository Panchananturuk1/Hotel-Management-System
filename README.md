# Hotel Management System

A comprehensive Hotel Management System built with Java Spring Boot backend and Angular frontend. This application provides a complete solution for managing hotel operations including room bookings, guest management, and staff administration.

## Features

- **Room Management**: Add, update, and manage hotel rooms with different categories and pricing
- **Booking System**: Handle room reservations and check-ins/check-outs
- **Guest Management**: Maintain guest records and history
- **Staff Management**: Administer staff accounts and roles
- **Billing**: Generate invoices and process payments
- **Reports**: View occupancy rates, revenue reports, and other analytics

## Tech Stack

### Backend
- Java 11+
- Spring Boot 2.7.x
- Spring Data JPA
- Hibernate
- Maven
- MySQL/PostgreSQL

### Frontend
- Angular 13+
- TypeScript
- Angular Material
- RxJS
- HTML5/CSS3

## Prerequisites

- Java Development Kit (JDK) 11 or higher
- Node.js (v14.x or higher)
- Angular CLI (v13.x or higher)
- Maven 3.6.3 or higher
- MySQL 8.0 or PostgreSQL 13 or higher
- Git

## Getting Started

### Backend Setup

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd hotel-management-system/backend
   ```

2. Configure the database:
   - Create a MySQL/PostgreSQL database named `hotel_management`
   - Update `application.properties` with your database credentials

3. Build and run the application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   The backend will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```
   The frontend will be available at `http://localhost:4200`

## Project Structure

```
hotel-management-system/
├── backend/               # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/hotel/...
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
└── frontend/              # Angular application
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   ├── services/
    │   │   ├── models/
    │   │   └── ...
    │   ├── assets/
    │   └── environments/
    └── package.json
```

## API Documentation

API documentation is available at `http://localhost:8080/swagger-ui.html` when the backend is running.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- Spring Boot Team
- Angular Team
- All contributors who have helped improve this project
