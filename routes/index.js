var express = require('express');
var router = express.Router();
 
const userController  = require('../controllers/userController'); 
const dataService = require('../services/dataService')


/* GET home page. */
router.get('/', async function(req, res, next) {    
    // const data = await dataService.getDataByTimeRange(startDate, endDate);  
    // Emit the notification event to all connected clients

     
     res.render('index', { title: 'Index', currentPage: 'Home', message: 'Starting App...', user:req.session.user}); 
}); 

router.get('/contact', async function(req, res, next) { 
    res.render('contact', { title: 'Contact', currentPage: 'Contact', user:req.session.user }); 
}); 

module.exports = router;
