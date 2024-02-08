var express = require('express');

var router = express.Router();
 
const dataController  = require('../controllers/dataController'); 

/* GET home page. */
router.get('/', async function(req, res, next) { 
  // Assuming getAlldDataReadings returns a Promise that resolves with the data
  const allDataReadings = await dataController.getAlldDataReadings();
  const allUniqueReadings = await dataController.getUniqueLocations();
  //console.log(allDataReadings)
  res.render('visulisation', { title: 'Index', currentPage: 'Home', message: 'Starting App...', receivedData:allDataReadings, uniqueLocations:allUniqueReadings, user:req.session.user}); 
}); 

router.get('/data-table', async function(req, res, next) { 
  // Assuming getAlldDataReadings returns a Promise that resolves with the data
  const allDataReadings = await dataController.getAlldDataReadings();
  //console.log(allDataReadings)
  res.render('visualisation_table', { title: 'Data Table', currentPage: 'Home', message: 'Starting App...', receivedData:allDataReadings, user:req.session.user}); 
}); 

router.get('/visulisation_wqi_line', async function(req, res, next) { 
  const allUniqueReadings = await dataController.getUniqueLocations(); 
  res.render('visulisation_wqi_line', { title: 'Line chart', currentPage: 'Line chart', message: 'Starting App...', uniqueLocations:allUniqueReadings, user:req.session.user}); 
}); 

router.get('/visualisation_wqi_bar', async function(req, res, next) { 
  // Assuming getAlldDataReadings returns a Promise that resolves with the data
  const allDataReadings = await dataController.getAlldDataReadings();
  //console.log(allDataReadings)
  res.render('visualisation_wqi_bar', { title: 'Data Table', currentPage: 'Home', message: 'Starting App...', receivedData:allDataReadings, user:req.session.user}); 
}); 



router.get('/chart', async function(req, res, next) { 
  // Assuming getAlldDataReadings returns a Promise that resolves with the data
  const allDataReadings = await dataController.getAlldDataReadings();
  //console.log(allDataReadings)
  res.render('visulisation', { title: 'Chart', currentPage: 'Home', message: 'Starting App...', receivedData:allDataReadings, user:req.session.user}); 
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
  //console.log('retrieving average WQI:'); 
  try {
    // Check if user is authenticated
    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }    
    const data = await dataController.getAverageWQI(req, res);     
    // Check if data is empty
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }
    // Data retrieval successful, return the data
    res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving average WQI:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Server-side route
router.get('/data-by-location', async function(req, res, next) {  

  res.json( await dataController.getDataByLocation(req, res));
});

router.get('/data-by-date-range', async function(req, res, next) {  
  res.json( await dataController.getDataByTimeRange(req, res));
});


router.get('/data-by-location-avg-wqi', async function(req, res, next) {  
  res.json( await dataController.getDataByLocationAvgWQI(req, res));
}); 


module.exports = router;
