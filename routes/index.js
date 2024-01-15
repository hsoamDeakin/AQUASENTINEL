var express = require('express');

var router = express.Router();
// otherFile.js
const dataController  = require('../controllers/dataController'); 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index', currentPage: 'Home', receivedData:dataController.receivedData}) 

});

module.exports = router;
