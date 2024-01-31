var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('wqi_chart', { title: 'WQI Chart' }); // Render the new EJS view for the chart
});

module.exports = router;