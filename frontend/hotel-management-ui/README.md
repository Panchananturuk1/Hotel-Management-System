# Hotel Management UI

This is the frontend application for the Hotel Management System.

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Application Locally

```bash
npm start
```

The application will be available at `http://localhost:4200`.

## Production Deployment

### Building for Production

To build the application for production:

```bash
npm run build:prod
```

This will create a `dist/hotel-management-ui` directory with the production build.

### Deploying to AWS S3

The application can be deployed to AWS S3 using the provided script:

```bash
./deploy-aws.sh
```

Make sure you have AWS CLI installed and configured with appropriate credentials.

## Configuration

The application uses environment files for configuration:

- `src/environments/environment.ts` - Development environment
- `src/environments/environment.prod.ts` - Production environment

Update the `apiUrl` in these files to point to your backend API.

## Features

- Hotel management (listing, adding, editing, deleting)
- Room management (listing, adding, editing, deleting)
- Booking management
- User authentication

## Authentication

The application uses JWT for authentication. Login credentials are sent to the backend API, and the returned token is stored in localStorage.
