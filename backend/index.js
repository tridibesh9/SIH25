import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // import dotenv to load environment variables
dotenv.config(); // load environment variables from .env file
import { connectToDatabase } from './db.js';

import userRoute from './Routes/userRoutes.js';
import projectRoute from './Routes/projectRoutes.js';

const app = express();

app.use(cors());

const PORT = process.env.PORT||3030;

app.use(cors()); // allow requests from frontend


connectToDatabase();

app.use(express.json());
app.use('/users', userRoute); // use the user route for user registration and login
app.use('/projects', projectRoute); // use the project route for project management



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});