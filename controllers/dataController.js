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

const calculateWQI =  (values) => { 
    const generatedDataArray = dataService.calculateWQIFromArray(values);
    return generatedDataArray;
}

// Controller function to get data by location
const getDataByLocation = async (req, res) => {
    try {
        const locationName = req.query.location; // Get 'location' query parameter from the request
        const data = await dataService.getDataByLocation(locationName);
        res.json(data); // Respond with the filtered data
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    generatedData,
    calculateWQI,
    getAlldDataReadings,
    getDataByLocation
};
