import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import authRouter from './routes/authRoutes.js'
import dataRouter from './routes/dataRoutes.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT ;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());
app.use('/auth' , authRouter);
app.use('/data' , dataRouter);


import mongoose from 'mongoose';
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));


// Basic route
app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
