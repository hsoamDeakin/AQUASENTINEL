const fs = require('fs');
const csv = require('csv-parser');
const math = require('mathjs');

const { connectDB, DataReading } = require('../db'); 

const dataCount = process.env.dataCount; 
const filePath = process.env.FILE_PATH;
const columnNamesString = process.env.COLUMN_NAMES;
const columnNames = columnNamesString.split(',');

const getColumnValues = () => {
  return new Promise((resolve, reject) => {
    const values = {};
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        columnNames.forEach((columnName) => {
          const value = parseFloat(row[columnName]);
          if (!isNaN(value)) {
            values[columnName] = values[columnName] || [];
            values[columnName].push(value);
          }
        });
      })
      .on('end', () => {
        resolve(values);
      })
      .on('error', (error) => {
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

    console.log(`Column: ${columnName}, Mean: ${mean}, Standard Deviation: ${stdDev}`);

    // Generate a random number from a normal distribution
        const value = generateRandomNormal( mean, stdDev );
        dataEntry.push(value);
    });
    // console.log(value);value
    generatedData.push(dataEntry);
  }
  return generatedData; 
};
const calculateWQIFromArray = (values) => {
  const parameterWeights = {
    'ph': 0.2,
    'Organic_carbon': 0.2,
    'Turbidity': 0.2,
    'Solids': 0.2,
    'Trihalomethanes': 0.2,
  };

  const normalizedValues = {};
  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    // Specific normalization logic for each parameter
    // You may need to adjust this based on the characteristics of your data
    let normalizedValue;
    if (i === 3) {
      // Solids parameter, special treatment
      normalizedValue = (value - 5000) / 5000 * 100;  // Adjust as needed
    } else {
      // For other parameters, use a generic linear scaling
      normalizedValue = (value - (value - 2 * 5)) / (value + 2 * 5) * 100;  // Assuming a standard deviation of 5
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

// Function to get unique locations for dropdown
const getUniqueLocations = async () => {
  await connectDB();
  try {
    const locations = await DataReading.distinct('value.location.name');
    return locations;
  } catch (error) {
    console.error('Error retrieving unique locations:', error);
    throw error;
  }
};

const getAllDataFromReadings = async () => {
 await connectDB(); // Connect to MongoDB

  try {
    // Retrieve data from the readings collection
    const data = await DataReading.find({}).sort({ 'value.location.name': 1 });
    return data;
  } catch (error) {
    console.error('Error retrieving data from readings collection:', error);
    throw error;
  }
}; 

// Function to get data by location
const getDataByLocation = async (locationName) => {
  await connectDB();
  try {
    const data = await DataReading.find({ 'value.location.name': locationName });
    return data;
  } catch (error) {
    console.error('Error retrieving data by location:', error);
    throw error;
  }
};

// Function to get data by time range
const getDataByTimeRange = async (startTime, endTime) => {
  await connectDB();
  try {
    const data = await DataReading.find({
      'value.timestamp': { $gte: new Date(startTime), $lte: new Date(endTime) }
    });
    return data;
  } catch (error) {
    console.error('Error retrieving data by time range:', error);
    throw error;
  }
};

// Function to get aggregated data for line chart
const getAggregatedDataForChart = async (locationName, parameter, startTime, endTime) => {
  await connectDB();
  try {
    const data = await DataReading.aggregate([
      { $match: { 'value.location.name': locationName, 'value.timestamp': { $gte: new Date(startTime), $lte: new Date(endTime) } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$value.timestamp" } }, avgValue: { $avg: `$value.data.${parameter}` } } },
      { $sort: { '_id': 1 } }
    ]);
    return data;
  } catch (error) {
    console.error('Error retrieving aggregated data for chart:', error);
    throw error;
  }
};


module.exports = {
  generateRandomData,
  calculateWQIFromArray,
  getAllDataFromReadings,
  getDataByLocation,
  getDataByTimeRange,
  getUniqueLocations,
};
