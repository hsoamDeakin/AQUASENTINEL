
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
 

// Controller function to get unique locations for dropdown
const getUniqueLocations = async (req, res) => {
    try {
        const locations = await dataService.getUniqueLocations();
        res.json(locations);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

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

// Controller function to get data by time range
const getDataByTimeRange = async (req, res) => {
    try {
        const startTime = req.query.startTime; // Get 'startTime' query parameter from the request
        const endTime = req.query.endTime; // Get 'endTime' query parameter from the request
        const data = await dataService.getDataByTimeRange(startTime, endTime);
        res.json(data); // Respond with the filtered data
    } catch (error) {
        res.status(500).send(error.message);
    }
};


const getSortedData = async (sortBy, sortOrder) => { 
    const sortedDataArray = await dataService.getSortedData(sortBy,sortOrder);
    return sortedDataArray;
}  
module.exports = {
    generatedData,
    calculateWQI,
    getAlldDataReadings,
    getSortedData
};
