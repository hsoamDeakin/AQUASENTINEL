// db.js

const mongoose = require('mongoose');
require('dotenv').config();

// Specify the database name  
const dbName = process.env.DB_NAME; // Specify the desired database name

const dataReadingSchema = new mongoose.Schema({
  key: Date,
  value: {
    location: {
      name: String,
      lat: Number,
      lon: Number,
    },
    data: {
      ph: Number,
      Organic_carbon: Number,
      Turbidity: Number,
      Solids: Number,
      Trihalomethanes: Number,
    },
    wqi: Number,
  },
});

const dataCollectionName = 'newmodels'; // Specify the desired collection name
const DataReading = mongoose.model('DataReading', dataReadingSchema, dataCollectionName);

// Define schema for users
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "Admin" } // New property with default value

});

const userCollectionName = 'users'; // Specify the desired collection name for users
// Create model for user collection
const User = mongoose.model('User', userSchema, userCollectionName);

const connectDB = async () => {
  try {
    const dbURI = process.env.DB_URI;
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      dbName: dbName,
    });

    console.log(`Connected to MongoDB - Database: ${dbName}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = { connectDB, DataReading, User };