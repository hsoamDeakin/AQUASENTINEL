
// Load environment variables from .env file
require('dotenv').config();

const dataService = require('../services/dataService')
const { DataReading } = require('../db');

const generatedData = async () => { 
    const generatedDataArray = await dataService.generateRandomData();
    return generatedDataArray;
}  

const getAlldDataReadings = async (req, res) => { 
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
        const uniqueLocations = await dataService.fetchUniqueLocations();
        res.json(uniqueLocations);
    } catch (error) {
        console.error('Error retrieving unique locations:', error);
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

// Controller function to get data by both time and location
const getDataByLocationAndTime = async (req, res) => {
    try {
        const location = req.query.location;
        const startTime = req.query.startTime;
        const endTime = req.query.endTime;
        const data = await dataService.getDataByLocationAndTime(location, startTime, endTime);
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getSortedData = async (sortBy, sortOrder) => { 
    const sortedDataArray = await dataService.getSortedData(sortBy,sortOrder);
    return sortedDataArray;
}  

const getAverageWQI = async () => { 
    const groupLocationByWQI = await dataService.getAverageWQI(); 
    return groupLocationByWQI;
}  
 

module.exports = {
    generatedData,
    calculateWQI,
    getAlldDataReadings,
    getSortedData,
    getUniqueLocations,
    getDataByLocation,
    getDataByTimeRange,
    getAverageWQI,
    getDataByLocationAndTime
};
