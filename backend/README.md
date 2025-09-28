# CarbonCycle Backend API

A comprehensive carbon offset verification system that manages blue carbon ecosystem projects with verification workflows, blockchain integration, and certificate generation.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)

## Features

- **User Management**: Registration, login, profile management
- **Project Management**: Full lifecycle management for blue carbon projects
- **Verification Workflows**: Multi-stage verification (land approval → NGO → drones → admin approval)
- **Blockchain Integration**: IPFS storage via Pinata
- **Certificate Generation**: Dynamic PDF certificate generation
- **Drone & NGO Management**: Scheduling and appointment system
- **File Upload**: Cloudinary integration for images and documents

## Tech Stack

- **Node.js** / **Express.js**: Backend framework
- **MongoDB** / **Mongoose**: Database and ODM
- **JWT**: Authentication
- **Cloudinary**: File storage
- **Pinata**: IPFS integration
- **Puppeteer**: PDF generation
- **Axios**: HTTP requests

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` file
4. Start the server:
   ```bash
   npm run dev  # for development
   npm start    # for production
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3030
DB_USERNAME=your_mongo_username
DB_PASSWORD=your_mongo_password
DB_CLUSTER_URL=your_cluster_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_api_key
```

## API Endpoints

### User Management

#### Register a new user
```
POST /users/register
```
Request Body:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "enum(admin|buyer|seller)"
}
```

#### Login
```
POST /users/login
```
Request Body:
```json
{
  "email": "string",
  "password": "string"
}
```

#### Get user profile
```
GET /users/profile
```
Headers:
- Authorization: Bearer [token]

#### Update user profile
```
PUT /users/profile
```
Headers:
- Authorization: Bearer [token]
Request Body:
```json
{
  "name": "string",
  "profilePic": "string"
}
```

#### Update password
```
PUT /users/profile/password
```
Headers:
- Authorization: Bearer [token]
Request Body:
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

#### Renew token
```
POST /users/renew-token
```

### Project Management

#### Register a project
```
POST /projects/register
```
Headers:
- Authorization: Bearer [token]
Request Body:
```json
{
  "projectName": "string",
  "owner": "string",
  "email": "string",
  "location": "string",
  "contactNumber": "string",
  "type": "enum(wetlands|mangroves|seagrass meadows|kelp forests|salt marshes)",
  "siteDescription": "string",
  "landDocuments": "string",
  "projectImages": ["string"]
}
```

#### Get user projects
```
GET /projects/userprojects
```
Headers:
- Authorization: Bearer [token]

#### Update site verification
```
PATCH /projects/:projectId/site-verification
```
Headers:
- Authorization: Bearer [token]
Request Body:
```json
{
  "role": "string",
  "reportUrl": "string",
  "findings": "string"
}
```

#### Update verification status (Admin only)
```
PATCH /projects/:projectId/status
```
Headers:
- Authorization: Bearer [token]
Request Body:
```json
{
  "status": "string"
}
```

#### Update drone survey
```
PATCH /projects/:projectId/drone-survey
```
Headers:
- Authorization: Bearer [token]
Request Body:
```json
{
  "status": "string",
  "surveyUrl": "string",
  "analysis": "string"
}
```

#### Approve project and set carbon credits (Admin only)
```
POST /projects/:projectId/approve
```
Headers:
- Authorization: Bearer [token]
Request Body:
```json
{
  "carbonCredits": "number"
}
```

#### Upload project metadata to blockchain
```
POST /projects/upload-metadata
```
Headers:
- Authorization: Bearer [token]
Request Body:
```json
{
  "projectId": "string"
}
```

#### Retire project and generate certificate
```
POST /projects/retireproject
```
Request Body:
```json
{
  "projectId": "string",
  "externalId": "string",
  "projectName": "string",
  "quantityRetired": "number",
  "retiredByAddress": "string",
  "transactionHash": "string",
  "DocumentCID": "string",
  "retiredAt": "string"
}
```

### File Upload

#### Upload project images
```
POST /projects/upload-images
```
Headers:
- Authorization: Bearer [token]
Form Data:
- projectImages: [file]

#### Upload project document
```
POST /projects/upload-document
```
Headers:
- Authorization: Bearer [token]
Form Data:
- projectDocument: [PDF file]

### Drone Management

#### Create a drone
```
POST /drones
```
Headers:
- Authorization: Bearer [token]
Request Body:
```json
{
  "model_name": "string",
  "serving_location": "string"
}
```

#### Get all drones
```
GET /drones
```
Headers:
- Authorization: Bearer [token]

#### Get drone by ID
```
GET /drones/:id
```
Headers:
- Authorization: Bearer [token]

#### Update drone
```
PATCH /drones/:id
```
Headers:
- Authorization: Bearer [token]
Request Body:
```json
{
  "serving_location": "string"
}
```

### NGO Management

#### Create an NGO
```
POST /ngos
```
Headers:
- Authorization: Bearer [token]
Request Body:
```json
{
  "name": "string",
  "location": "string",
  "volunteer_count": "number"
}
```

#### Get all NGOs
```
GET /ngos
```
Headers:
- Authorization: Bearer [token]

#### Get NGO by ID
```
GET /ngos/:id
```
Headers:
- Authorization: Bearer [token]

#### Update NGO
```
PATCH /ngos/:id
```
Headers:
- Authorization: Bearer [token]
Request Body:
```json
{
  "location": "string",
  "volunteer_count": "number"
}
```

### Appointment Management

#### Create an appointment
```
POST /appointments
```
Headers:
- Authorization: Bearer [token]
Request Body:
```json
{
  "project": "string",
  "appointable_type": "enum(Drone|NGO)",
  "appointable": "string",
  "date_of_visit": "string"
}
```

#### Get drone appointments
```
GET /drones/:id/appointments
```
Headers:
- Authorization: Bearer [token]

#### Get NGO appointments
```
GET /ngos/:id/appointments
```
Headers:
- Authorization: Bearer [token]

#### Verify appointment
```
PATCH /appointments/:id/verify
```
Headers:
- Authorization: Bearer [token]
Request Body:
```json
{
  "remarks": "string",
  "picture_links": ["string"]
}
```

#### Delete appointment
```
DELETE /appointments/:id
```
Headers:
- Authorization: Bearer [token]

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are obtained through the `/users/login` or `/users/register` endpoints.

## Response Format

Successful responses follow this format:
```json
{
  "message": "Success message",
  "data": {} // Optional data field
}
```

## Error Handling

Error responses follow this format:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information" // Only in development
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `204`: No Content
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error