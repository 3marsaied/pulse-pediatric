const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS
const initializeCounters = require('./initializeCounters');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3001;

// Enable CORS
app.use(cors()); // This will allow all origins. You can customize it if needed.

app.use(express.json());

const mongoURI = process.env.MONGOURI;

mongoose.connect(mongoURI, { 
    serverSelectionTimeoutMS: 5000,  // Timeout after 5 seconds instead of 30 seconds
    socketTimeoutMS: 45000           // Keep the socket open for 45 seconds
})
.then(() => {
    console.log('MongoDB connected...');
    initializeCounters();  // Initialize counters after connecting to MongoDB
})
.catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Load routers
const userRouter = require('./routes/user');
const loginRouter = require('./routes/auth');

// Use routers
app.use('', userRouter);
app.use('', loginRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
