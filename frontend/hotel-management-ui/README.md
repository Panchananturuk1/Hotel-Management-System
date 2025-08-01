# Hotel Management System

A comprehensive hotel management application built with Angular frontend and Spring Boot backend. This system allows hotel administrators to manage hotels, rooms, and bookings through an intuitive user interface.

## Live Demo

Access the live application at: [http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com/hotels](http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com/hotels)

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

### S3 Bucket Configuration for URL Redirection

There are multiple ways to configure the S3 bucket to redirect the root URL (`http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com`) to the hotels page:

#### Method 1: Using S3 Routing Rules

1. Log in to the AWS Management Console and open the Amazon S3 console
2. Select your bucket (hotel-management-ui)
3. Go to the "Properties" tab
4. Scroll down to "Static website hosting" and click "Edit"
5. Ensure "Static website hosting" is enabled
6. Set "Index document" to `index.html`
7. In the "Redirection rules" section, add the following JSON configuration:

```json
{
  "RoutingRules": [
    {
      "Condition": {
        "KeyPrefixEquals": ""
      },
      "Redirect": {
        "ReplaceKeyWith": "hotels"
      }
    }
  ]
}
```

8. Click "Save changes"

#### Method 2: Using a Redirect HTML File

Alternatively, you can upload the provided `redirect.html` file to your S3 bucket and set it as the index document:

1. Upload the `redirect.html` file to the root of your S3 bucket
2. In the S3 console, go to the "Properties" tab
3. Under "Static website hosting", click "Edit"
4. Set "Index document" to `redirect.html`
5. Click "Save changes"

The `redirect.html` file contains HTML meta refresh and JavaScript redirects to automatically send users to the `/hotels` path.

#### Method 3: Using Object-Level Redirection

You can also create an empty object at the root level with a website redirect location:

1. In the S3 console, upload an empty file named `index.html` to your bucket
2. Select the file and click on "Properties"
3. Under "Metadata", add a new metadata entry with the key `x-amz-website-redirect-location` and the value `/hotels`
4. Click "Save"

For more detailed instructions, refer to the `S3-REDIRECTION-GUIDE.md` file in this repository.

#### Method 4: Using the Automated Deployment Script

This repository includes scripts to automate the S3 redirection setup in the `s3-redirect-deploy` directory:

1. For Windows users:
   - Navigate to the `s3-redirect-deploy` directory
   - Simply run the `deploy.bat` file

2. For Unix/Linux/Mac users:
   - Navigate to the `s3-redirect-deploy` directory
   - Make the script executable: `chmod +x deploy.sh`
   - Run the script: `./deploy.sh`

3. For manual execution:
   - Navigate to the `s3-redirect-deploy` directory
   - Run the following commands:
     ```bash
     npm install
     npm run deploy
     ```

The script will:
- Upload the redirect.html file as index.html to your S3 bucket
- Configure the website settings with the appropriate routing rules
- Set the necessary metadata for redirection

**Note:** You need to have AWS CLI installed and configured with appropriate credentials that have permission to modify the S3 bucket.

**Legacy Scripts:** The repository also contains older deployment scripts in the root directory (`deploy-s3-redirect.bat`, `deploy-s3-redirect.sh`, and `deploy-s3-redirect.js`), but it's recommended to use the organized scripts in the `s3-redirect-deploy` directory.

#### Testing the Redirection

To test if your S3 bucket redirection is working correctly:

1. Open the `test-redirect.html` file in your browser
2. Click the "Test Root URL Redirection" button
3. Verify that you are redirected to the `/hotels` path

Alternatively, you can manually test by visiting:
- Root URL: `http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com/`
- Expected redirect: `http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com/hotels`

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
