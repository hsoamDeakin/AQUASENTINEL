var express = require('express');
var router = express.Router();

const dataController = require('../controllers/dataController');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const data = await dataController.generatedData();
  console.log(data);
  res.render('index', { title: 'Index', currentPage: 'Home', data : JSON.stringify(data)});
})

module.exports = router;
