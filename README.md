# Hotel Management System

A comprehensive hotel management application built with Angular frontend and Spring Boot backend. This system allows hotel administrators to manage hotels, rooms, and bookings through an intuitive user interface.

## Live Demo

Access the live application at: [http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com](http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com)

## Project Overview

### Frontend (Angular)

The frontend is built with Angular 16 and provides a responsive user interface for managing hotel operations.

#### Key Features

- **Hotel Management**: Add, edit, view, and delete hotels
- **Room Management**: Manage different room types and their availability
- **Booking System**: Create and manage room bookings
- **Admin Dashboard**: Administrative interface for system management

#### Components

- **Hotel List**: Display and manage hotels
- **Room List**: View and manage rooms for each hotel
- **Booking Form**: Create and manage bookings
- **Admin Panel**: Administrative controls and settings

### Backend (Spring Boot)

The backend API is built with Spring Boot and provides RESTful endpoints for the frontend to consume.

#### API Endpoints

- **Hotels API**: `http://52.66.135.123:8080/api/hotels`
- **Rooms API**: `http://52.66.135.123:8080/api/rooms`
- **Bookings API**: `http://52.66.135.123:8080/api/bookings`

## Technology Stack

### Frontend

- **Framework**: Angular 16.2.12
- **UI Components**: Bootstrap 5.3.2, ng-bootstrap 15.1.2
- **HTTP Client**: Angular HttpClient
- **State Management**: RxJS Observables

### Backend

- **Framework**: Spring Boot
- **Database**: MySQL/PostgreSQL
- **API**: RESTful services
- **Deployment**: AWS EC2

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm (v6+)
- Angular CLI (v16.2.0)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/hotel-management-system.git
   ```

2. Navigate to the frontend directory
   ```bash
   cd hotel-management-ui
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Start the development server
   ```bash
   ng serve
   ```

5. Navigate to `http://localhost:4200/`

## Development

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Deployment

The application is deployed on AWS:

- **Frontend**: Amazon S3 static website hosting
- **Backend**: Amazon EC2 instance

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── admin/
│   │   ├── booking-form/
│   │   ├── hotel-form/
│   │   ├── hotel-list/
│   │   └── room-list/
│   ├── models/
│   │   ├── hotel.ts
│   │   └── room.ts
│   ├── services/
│   │   ├── hotel.service.ts
│   │   └── room.service.ts
│   └── app.module.ts
└── environments/
    └── environment.ts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
