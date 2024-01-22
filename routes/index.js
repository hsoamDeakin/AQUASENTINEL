var express = require('express');

var router = express.Router();
 
const dataController  = require('../controllers/dataController'); 

/* GET home page. */
router.get('/', async function(req, res, next) { 
  // Assuming getAlldDataReadings returns a Promise that resolves with the data
  const allDataReadings = await dataController.getAlldDataReadings();
  console.log(allDataReadings)
  res.render('index', { title: 'Index', currentPage: 'Home', message: 'Starting App...', receivedData:allDataReadings}); 
}); 

module.exports = router;
