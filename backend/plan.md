Objective: You are to extend an existing backend system by adding a complete drone and NGO verification scheduling feature. The system uses a MongoDB database. You will create the necessary models, schemas, and RESTful API endpoints as specified below.

Phase 1: Define MongoDB Schemas
You will define four distinct schemas for four collections: drones, ngos, projects (updated), and appointments. Implement these using Mongoose or a similar Object Data Modeler (ODM).

1.1. drones Collection Schema

Purpose: Stores information about individual drones.

JavaScript

// File: models/Drone.js
{
  model_name: { type: String, required: true },
  serving_location: { type: String, required: true },
}, { timestamps: true });
1.2. ngos Collection Schema

Purpose: Stores information about NGOs.

JavaScript

// File: models/Ngo.js
{
  name: { type: String, required: true },
  location: { type: String, required: true },
  volunteer_count: { type: Number, required: true, min: 0 },
}, { timestamps: true });
1.3. Update projects Collection Schema

Purpose: Add verification status fields to the existing project model.

JavaScript

// File: models/Project.js
// Add these fields to your existing Project schema
{
  // ... all existing project fields
  drone_verification_status: {
    type: String,
    enum: ['pending', 'verified'],
    default: 'pending'
  },
  ngo_verification_status: {
    type: String,
    enum: ['pending', 'verified'],
    default: 'pending'
  }
}
1.4. appointments Collection Schema (Unified & Polymorphic)

Purpose: Stores all appointment records, linking a Project to either a Drone or an NGO. This is the core of the new system.

JavaScript

// File: models/Appointment.js
{
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  appointable: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'appointable_type'
  },
  appointable_type: {
    type: String,
    required: true,
    enum: ['Drone', 'NGO']
  },
  date_of_visit: { type: Date, required: true },
  picture_links: { type: [String], default: [] },
  status: {
    type: String,
    enum: ['pending', 'visited', 'verified'],
    default: 'pending'
  },
  remarks: { type: String },
  checklist_data: { type: Object } // For flexible NGO checklist data
}, { timestamps: true });
Phase 2: Implement API Endpoints
You will create all the following API endpoints. Ensure every endpoint is protected by authentication middleware and includes robust error handling and input validation.

Module: Drone Management
POST /drones

Description: Create a new drone.

Request Body: { "model_name": "...", "serving_location": "..." }

Logic: Create and save a new document in the drones collection.

Response: 201 Created with the new drone document.

GET /drones

Description: Retrieve all drones.

Logic: Find all documents in the drones collection.

Response: 200 OK with an array of drone documents.

GET /drones/:id

Description: Get details of a single drone.

Logic: Find a drone by its _id. Handle the case where the ID is not found.

Response: 200 OK with the drone document or 404 Not Found.

PATCH /drones/:id

Description: Update a drone's details.

Request Body: { "serving_location": "..." } (or any other updatable field).

Logic: Find the drone by _id and update its fields.

Response: 200 OK with the updated drone document.

Module: NGO Management
POST /ngos

Description: Create a new NGO.

Request Body: { "name": "...", "location": "...", "volunteer_count": ... }

Logic: Create and save a new document in the ngos collection.

Response: 201 Created with the new NGO document.

GET /ngos

Description: Retrieve all NGOs.

Logic: Find all documents in the ngos collection.

Response: 200 OK with an array of NGO documents.

GET /ngos/:id

Description: Get details of a single NGO.

Logic: Find an NGO by its _id. Handle not found cases.

Response: 200 OK with the NGO document or 404 Not Found.

PATCH /ngos/:id

Description: Update an NGO's details.

Request Body: { "location": "...", "volunteer_count": ... }

Logic: Find the NGO by _id and update its fields.

Response: 200 OK with the updated NGO document.

Module: Appointment Management
POST /appointments

Description: Schedule an appointment for a project with either a drone or an NGO.

Request Body: { "project": "...", "appointable_type": "Drone|NGO", "appointable": "...", "date_of_visit": "..." }

Logic: Create a new document in the appointments collection using the provided IDs and type. Validate that all referenced documents exist.

Response: 201 Created with the new appointment document.

GET /drones/:id/appointments

Description: Get all appointments for a specific drone.

Logic: Query the appointments collection where appointable_type: "Drone" and appointable matches the :id from the URL. Populate the project field to include project details.

Response: 200 OK with an array of appointment documents.

GET /ngos/:id/appointments

Description: Get all appointments for a specific NGO.

Logic: Query the appointments collection where appointable_type: "NGO" and appointable matches the :id from the URL. Populate the project field.

Response: 200 OK with an array of appointment documents.

PATCH /appointments/:id/verify

Description: Verify a completed appointment.

Request Body: { "remarks": "...", "picture_links": ["...", "..."] }

Logic:

Find the appointment by its _id. If not found, return 404.

Update its status to 'verified' and save the remarks/pictures.

Check the appointment's appointable_type.

If it is 'Drone', find the associated Project (using the project ID) and update its drone_verification_status to 'verified'.

If it is 'NGO', find the associated Project and update its ngo_verification_status to 'verified'.

Response: 200 OK with the updated appointment document.

DELETE /appointments/:id

Description: Delete/cancel an appointment.

Logic: Find the appointment by its _id and remove it from the database.

Response: 204 No Content.