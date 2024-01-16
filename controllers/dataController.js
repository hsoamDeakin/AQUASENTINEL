// add database controller functions 


// Load environment variables from .env file
require('dotenv').config();

const dataService = require('../services/dataService')

// test data generation 
const generatedData = async () => { 
    const generatedDataArray = await dataService.generateRandomData();
    return generatedDataArray;
}  

const calculateWQI =  (values) => { 
    const generatedDataArray = dataService.calculateWQIFromArray(values);
    return generatedDataArray;
}   

module.exports = {
    generatedData,
    calculateWQI
};
