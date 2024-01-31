const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const dataService = require('../services/dataService');

// Endpoint to trigger synthetic data generation
router.get('/generate-data', dataController.generatedData);

// Endpoint to retrieve all data readings
router.get('/all-data-readings', dataController.getAlldDataReadings);

// Endpoint to get data by time range and location
router.get('/data-by-time-range-and-location', async (req, res) => {
    try {
      const { startTime, endTime, location } = req.query;
      const data = await dataService.getDataByTimeRangeAndLocation({ startTime, endTime, location });
      res.json(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });  

// Endpoint to get unique locations for dropdowns in the frontend
router.get('/locations', dataController.getUniqueLocations);

// // Endpoint to get data by a specific location
// router.get('/data-by-location', dataController.getDataByLocation);

// // Endpoint to get data within a specific time range
// router.get('/data-by-time-range', dataController.getDataByTimeRange);

// // Endpoint to get data within a specific time range
// router.get('/data-by-location-avg', dataController.getAverageWQI);



module.exports = router;
