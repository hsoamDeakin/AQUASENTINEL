const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Endpoint to trigger synthetic data generation
router.get('/generate-data', dataController.generatedData);

// Endpoint to retrieve all data readings
router.get('/all-data-readings', dataController.getAlldDataReadings);

// Endpoint to get unique locations for dropdowns in the frontend
router.get('/locations', dataController.getUniqueLocations);

// Endpoint to get data by a specific location
router.get('/data-by-location', dataController.getDataByLocation);

// Endpoint to get data within a specific time range
router.get('/data-by-time-range', dataController.getDataByTimeRange);

// Endpoint to get data within a specific time range
router.get('/data-by-location-avg', dataController.getAverageWQI);


module.exports = router;
