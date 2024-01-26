var express = require('express');

var router = express.Router();
 
const dataController  = require('../controllers/dataController'); 

/* GET home page. */
router.get('/', async function(req, res, next) { 
  // Assuming getAlldDataReadings returns a Promise that resolves with the data
  const allDataReadings = await dataController.getAlldDataReadings();
  const allUniqueReadings = await dataController.getUniqueLocations();
  //console.log(allDataReadings)
  res.render('visulisation', { title: 'Index', currentPage: 'Home', message: 'Starting App...', receivedData:allDataReadings, uniqueLocations:allUniqueReadings}); 
}); 

router.get('/data-table', async function(req, res, next) { 
  // Assuming getAlldDataReadings returns a Promise that resolves with the data
  const allDataReadings = await dataController.getAlldDataReadings();
  //console.log(allDataReadings)
  res.render('visualisation_table', { title: 'Data Table', currentPage: 'Home', message: 'Starting App...', receivedData:allDataReadings}); 
}); 

router.get('/visualisation_test_d3', async function(req, res, next) { 
  // Assuming getAlldDataReadings returns a Promise that resolves with the data
  const allDataReadings = await dataController.getAlldDataReadings();
  //console.log(allDataReadings)
  res.render('visualisation_test_d3', { title: 'Data Table', currentPage: 'Home', message: 'Starting App...', receivedData:allDataReadings}); 
}); 


router.get('/chart', async function(req, res, next) { 
  // Assuming getAlldDataReadings returns a Promise that resolves with the data
  const allDataReadings = await dataController.getAlldDataReadings();
  //console.log(allDataReadings)
  res.render('visulisation', { title: 'Chart', currentPage: 'Home', message: 'Starting App...', receivedData:allDataReadings}); 
}); 
// Server-side route
router.get('/sort-data', async function(req, res, next) {

  const sortBy = req.query.sortColumn || 'key'; // Default to sorting by 'key'
  const sortOrder = req.query.sortDirection || 'asc'; // Default to ascending order

  // Call a function to retrieve data from the database with sorting
  const sortedData = await dataController.getSortedData(sortBy, sortOrder);

  res.json(sortedData);
});

// Server-side route
router.get('/data-by-location-avg', async function(req, res, next) {  
  res.json( await dataController.getAverageWQI());
});

module.exports = router;
