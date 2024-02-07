const fs = require("fs");
const csv = require("csv-parser");
const math = require("mathjs");

const db = require("../db");
const userController = require('../controllers/userController');


const dataCount = process.env.dataCount;
const filePath = process.env.FILE_PATH;
const columnNamesString = process.env.COLUMN_NAMES;
const columnNames = columnNamesString.split(",");

const getColumnValues = () => {
  return new Promise((resolve, reject) => {
    const values = {};
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        columnNames.forEach((columnName) => {
          const value = parseFloat(row[columnName]);
          if (!isNaN(value)) {
            values[columnName] = values[columnName] || [];
            values[columnName].push(value);
          }
        });
      })
      .on("end", () => {
        resolve(values);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

function generateRandomNormal(mean, stdDev) {
  // Box-Muller transform to generate two independent standard normal variables
  const u1 = 1 - Math.random(); // (0, 1] -> (0, 1)
  const u2 = 1 - Math.random(); // (0, 1] -> (0, 1)

  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  // const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);

  // Scale and shift to get the desired mean and standard deviation
  const randomValue = mean + stdDev * z0;

  return randomValue;
}

// Function to generate random data based on a normal distribution for each column
const generateRandomData = async () => {
  // Get column values from the CSV file
  const columnValues = await getColumnValues(filePath, columnNames);
  const generatedData = [];
  for (let i = 0; i < dataCount; i++) {
    const dataEntry = [];

    Object.keys(columnValues).forEach((columnName) => {
      console.log(columnName);
      const values = columnValues[columnName];

      // Calculate mean and standard deviation for each column
      const mean = math.mean(values);
      const stdDev = math.std(values);

      console.log(
        `Column: ${columnName}, Mean: ${mean}, Standard Deviation: ${stdDev}`
      );

      // Generate a random number from a normal distribution
      const value = generateRandomNormal(mean, stdDev);
      dataEntry.push(value);
    });
    // console.log(value);value
    generatedData.push(dataEntry);
  }
  return generatedData;
};

const calculateWQIFromArray = (values) => {
  const parameterWeights = {
    ph: 0.2,
    Organic_carbon: 0.1,
    Turbidity: 0.1,
    Solids: 0.2,
    Trihalomethanes: 0.4,
  };

  const normalizedValues = {};
  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    // Specific normalization logic for each parameter
    let normalizedValue;
    if (i === 3) {
      // Solids parameter, special treatment
      normalizedValue = ((value - 5000) / 5000) * 100; // Adjust as needed
    } else {
      // For other parameters, use a generic linear scaling
      normalizedValue = ((value - (value - 2 * 5)) / (value + 2 * 5)) * 100; // Assuming a standard deviation of 5
    }

    const parameter = Object.keys(parameterWeights)[i];
    normalizedValues[parameter] = normalizedValue;
  }

  // Calculate WQI by summing the weighted normalized values
  let wqi = 0;
  for (const parameter in normalizedValues) {
    wqi += parameterWeights[parameter] * normalizedValues[parameter];
  }

  return wqi;
};

const getAllDataFromReadings = async () => {
  await db.connectDB(); // Connect to MongoDB

  try {
    // Retrieve data from the readings collection
    const data = await db.DataReading.find({}).sort({ "value.location.name": 1 });
    return data;
  } catch (error) {
    console.error("Error retrieving data from readings collection:", error);
    throw error;
  }
};

const getUniqueLocations = async () => {
  await db.connectDB(); // Connect to MongoDB
  try {
    // Fetch all data
    const allData = await db.DataReading.find({}, "value.location.name -_id"); // Fetch only the location names

    // Create a set to store unique location names
    const uniqueLocations = new Set();

    // Extract unique location names
    allData.forEach((data) => {
      if (data.value && data.value.location && data.value.location.name) {
        uniqueLocations.add(data.value.location.name);
      }
    });

    // Convert the set to an array and sort it
    return Array.from(uniqueLocations).sort();
  } catch (error) {
    console.error("Error retrieving unique locations:", error);
    throw error;
  }
};

// Controller function to get sorted data
const getSortedData = async (sortBy, sortOrder) => {
  try {
    // Use the sortBy and sortOrder parameters to customize your query
    const data = await db.DataReading.find({}).sort({ [sortBy]: sortOrder });
    console.log(sortBy);
    console.log(sortOrder);
    //console.log(data)
    return data;
  } catch (error) {
    console.error("Error retrieving sorted data:", error);
    throw error;
  }
};

// Function to calculate the average WQI for each location
const getAverageWQI = async (req, res) => {
  try {
    // Ensure connection to the database
    await db.connectDB(); // Connect to MongoDB
    // Group data by location and calculate average WQI
    const averageWQI = await db.DataReading.aggregate([
      {
        $group: {
          _id: "$value.location.name",
          averageWQI: { $avg: "$value.wqi" },
        },
      },
      {
        $sort: { averageWQI: 1 } // Sort by averageWQI in ascending order
      }
    ]); 
    console.log('averageWQI');
    return averageWQI;
  } catch (error) {
    console.error("Error calculating average WQI:", error);
    throw error;
  }
};

// Function to calculate the average WQI for each location
const getAverageWQIStats = async (req, res) => {
  try {
    // Ensure connection to the database
    await db.connectDB(); // Connect to MongoDB
    // Group data by location and calculate average WQI
    const averageWQI = await db.DataReading.aggregate([
      {
        $group: {
          _id: "$value.location.name",
          averageWQI: { $avg: "$value.wqi" },
        },
      },
      {
        $sort: { averageWQI: 1 } // Sort by averageWQI in ascending order
      }
    ]);
     // Find location with maximum average WQI
     const maxLocation = averageWQI.reduce((max, current) => current.averageWQI > max.averageWQI ? current : max, averageWQI[0]);
  
     // Find location with minimum average WQI
     const minLocation = averageWQI.reduce((min, current) => current.averageWQI < min.averageWQI ? current : min, averageWQI[0]);
   
     // Send notifications for max and min locations
     if (req.session.user) {
       const userId = req.session.user.userId;
       await userController.addUserdNotifications(userId, `Location with max average WQI: ${maxLocation._id}, Average WQI: ${maxLocation.averageWQI}`);
       await userController.addUserdNotifications(userId, `Location with min average WQI: ${minLocation._id}, Average WQI: ${minLocation.averageWQI}`);
     }
    return averageWQI;
  } catch (error) {
    console.error("Error calculating average WQI:", error);
    throw error;
  }
};
// Function to get data by location sorted by WQI in descending order
const getDataByLocation = async (locationName) => {
  await db.connectDB(); // Connect to MongoDB
  try {
    const data = await db.DataReading.find({ "value.location.name": locationName })
                                     .sort({ "value.wqi": -1 }); // Sort by WQI in descending order
    return data;
  } catch (error) {
    console.error("Error retrieving data by location:", error);
    throw error;
  }
};

// Function to get data by location and calculate average WQI per year, month, and day
const getDataByLocationAvgWQI = async (locationName) => {
  await db.connectDB(); // Connect to MongoDB
  
  try {
    const data = await db.DataReading.aggregate([
      {
        $match: {
          "value.location.name": locationName
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$key" }, // Extract year from key
            month: { $month: "$key" }, // Extract month from key
            day: { $dayOfMonth: "$key" } // Extract day from key
          },
          averageWQI: { $avg: "$value.wqi" } // Calculate average WQI for each year, month, and day
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } // Sort by year, month, and day in ascending order
      },
      {
        $project: {
          _id: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day"
            }
          },
          averageWQI: 1
        }
      }
    ]);
    
    return data;
  } catch (error) {
    console.error("Error retrieving data by location:", error);
    throw error;
  }
};
 
// Function to get data by time range
const getDataByTimeRange = async (startDate, endDate) => {

  // Convert the start and end dates to date objects
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate); 

  await db.connectDB(); // Connect to MongoDB  
  try { 
    const data = await db.DataReading.find({
      key : { $gte: startDateObj, $lte: endDateObj },
    });    
    return data;
  } catch (error) {
    console.error("Error retrieving data by time range:", error);
    throw error;
  }
};

const mongoose = require('mongoose');

async function migrateData() {
  try {
    // Fetch all documents from the old collection
    const documents = await db.DataReading.find().lean();

    // Update each document's key field from string to date type
    const updatedDocuments = documents.map((doc) => {
      // Convert key string to Date
      const keyDate = new Date(doc.key);
      // Update the key field in the document
      return { ...doc, key: keyDate };
    });

    // Define the new model schema with the updated key field
    const NewModelSchema = new mongoose.Schema({
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

    // Create a new model using the updated schema
    const NewModel = mongoose.model('NewModel', NewModelSchema);

    // Insert the updated documents into the new collection
    await NewModel.insertMany(updatedDocuments);

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

 
module.exports = {
  generateRandomNormal,
  generateRandomData,
  calculateWQIFromArray,
  getColumnValues,
  getAllDataFromReadings,
  getUniqueLocations,
  getSortedData,
  getAverageWQI,
  getDataByLocation,
  getDataByTimeRange,
  migrateData,
  getDataByLocationAvgWQI,
  getAverageWQIStats
};
 