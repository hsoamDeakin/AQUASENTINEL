// add database controller functions 

  

// Load environment variables from .env file
require('dotenv').config();

const dataService = require('../services/dataService')

const generatedData = async () => { 
    const generatedDataArray = await dataService.generateRandomData();
    return generatedDataArray;
}  

const getAlldDataReadings = async () => { 
    const allDataArray = await dataService.getAllDataFromReadings();
    return allDataArray;
}  

const hggcalculateWQI =  (values) => { 
    const generatedDataArray = dataService.calculateWQIFromArray(values);
    return generatedDataArray;
}   

module.exports = {
    generatedData,
    calculateWQI,
    getAlldDataReadings
};
