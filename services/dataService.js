const fs = require('fs');
const csv = require('csv-parser');
const math = require('mathjs');

// const filePath = './dataset/water_potability.csv';
// const columnNames=['ph', 'Organic_carbon', 'Turbidity','Solids','Trihalomethanes']
//const columnNames = process.env.columnNames;  
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

module.exports = {  
  generateRandomData,  
};

 