
// Load environment variables from .env file
require('dotenv').config();

const dataService = require('../services/dataService')


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
        const locations = await dataService.getUniqueLocations();
        return locations;
    } catch (error) {
        console.error('Error retrieving unique locations:', error);
        throw error;
    }
};

// Controller function to get data by location
const getDataByLocation = async (req, res) => {
    try {
        const locationName = req.query.selectedLocation; // Get 'location' query parameter from the request
        const data = await dataService.getDataByLocation(locationName);
        // console.log(locationName);
        // console.log(data);
        return data; // Respond with the filtered data
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Controller function to get data by time range
const getDataByTimeRange = async (req, res) => {
    try {
       
        const startDate = req.query.startDate; // Get 'startTime' query parameter from the request
        const endDate = req.query.endDate; // Get 'endTime' query parameter from the request
        const data = await dataService.getDataByTimeRange(startDate, endDate); 
        return data; // Respond with the filtered data
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Controller function to get data by time range
const getDataByLocationAvgWQI = async (req, res) => {
    try {
       
        const locationName = req.query.selectedLocation; // Get 'location' query parameter from the request
        const data = await dataService.getDataByLocationAvgWQI(locationName); 
        return data; // Respond with the filtered data
    } catch (error) {
        res.status(500).send(error.message);
    }
};
 

const getSortedData = async (sortBy, sortOrder) => { 
    const sortedDataArray = await dataService.getSortedData(sortBy,sortOrder);
    return sortedDataArray;
}  

const getAverageWQI = async (req, res) => { 
    const groupLocationByWQI = await dataService.getAverageWQI(req, res);   
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
    getDataByLocationAvgWQI

};
 