// Load environment variables from .env file
require('dotenv').config();

const dataService = require('../services/dataService');

// Controller function to trigger data generation
const generatedData = async (req, res) => { 
    try {
        const generatedDataArray = await dataService.generateRandomData();
        res.json(generatedDataArray);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Controller function to retrieve all data readings
const getAllDataReadings = async (req, res, next) => { 
    try {
        const allDataArray = await dataService.getAllDataFromReadings();
        res.locals.receivedData = allDataArray;
        next(); // Pass control to the next middleware
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Controller function to calculate WQI from an array of values
const calculateWQI = (req, res) => { 
    try {
        const values = req.body.values; // Assuming 'values' is sent in the request body
        const wqiArray = dataService.calculateWQIFromArray(values);
        res.json(wqiArray);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

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

module.exports = {
    generatedData,
    calculateWQI,
    getAllDataReadings,
    getUniqueLocations, 
    getDataByLocation,
    getDataByTimeRange
};