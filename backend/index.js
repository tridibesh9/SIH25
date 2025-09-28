import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // import dotenv to load environment variables
dotenv.config(); // load environment variables from .env file
import { connectToDatabase } from './db.js';

import userRoute from './Routes/userRoutes.js';
import projectRoute from './Routes/projectRoutes.js';
import droneRoute from './Routes/droneRoutes.js';
import ngoRoute from './Routes/ngoRoutes.js';
import appointmentRoute from './Routes/appointmentRoutes.js';

const app = express();

// Custom logging middleware to log all requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  
  // Log request body for POST/PUT/PATCH requests (but hide sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const logBody = { ...req.body };
    // Hide sensitive fields
    if (logBody.password) logBody.password = '***hidden***';
    if (logBody.currentPassword) logBody.currentPassword = '***hidden***';
    if (logBody.newPassword) logBody.newPassword = '***hidden***';
    console.log(`[${timestamp}] Request Body:`, JSON.stringify(logBody, null, 2));
  }

  // Log query parameters
  if (Object.keys(req.query).length > 0) {
    console.log(`[${timestamp}] Query Params:`, req.query);
  }

  // Log response when it finishes
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`[${timestamp}] Response Status: ${res.statusCode}`);
    originalSend.call(res, data);
  };

  next();
});

app.use(cors());

const PORT = process.env.PORT||3030;

app.use(cors()); // allow requests from frontend


connectToDatabase();

app.use(express.json());
app.use('/users', userRoute); // use the user route for user registration and login
app.use('/projects', projectRoute); // use the project route for project management
app.use('/drones', droneRoute); // use the drone route for drone management
app.use('/ngos', ngoRoute); // use the ngo route for ngo management
app.use('/appointments', appointmentRoute); // use the appointment route for appointment management

// Error handling middleware
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR:`, err.message);
  console.error(`[${timestamp}] Stack:`, err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});