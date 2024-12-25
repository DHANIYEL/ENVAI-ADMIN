require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projects'); // Import the project routes
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set
const MONGO_URI = process.env.MONGO_URI;

// Basic route for health check

app.use(express.static(path.join(__dirname, "dist")));
    // Catch all other routes and return the index file
    app.get("*", function (req, res) {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running... mo' });
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process if the database connection fails
  }
};

// Start the server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
