// db.js

const mongoose = require('mongoose');
require('dotenv').config();

const dataReadingSchema = new mongoose.Schema({
  key: String,
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
// Specify the database name and collection name
const dbName = 'AQUASENTINEL'; // Specify the desired database name
const collectionName = 'readings'; // Specify the desired collection name

const DataReading = mongoose.model('DataReading', dataReadingSchema, collectionName);

const connectDB = async () => {
  try {
    const dbURI = process.env.DB_URI;

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      dbName: dbName,
    });

    console.log(`Connected to MongoDB - Database: ${dbName}, Collection: ${collectionName}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = { connectDB, DataReading };