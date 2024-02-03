var express = require('express');

var router = express.Router();
 
const userController  = require('../controllers/userController'); 

/* GET home page. */
router.get('/', async function(req, res, next) { 
  //console.log(allDataReadings)
  //console.log(req.user);
  res.render('index', { title: 'Index', currentPage: 'Home', message: 'Starting App...', user:req.user}); 
}); 

router.get('/contact', async function(req, res, next) { 
    res.render('contact', { title: 'Contact', currentPage: 'Contact'}); 
}); 

module.exports = router;
