var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* login. */
router.get('/login', async function(req, res, next) { 
  // Assuming getAlldDataReadings returns a Promise that resolves with the data
  res.render('login', { title: 'login', currentPage: 'Login'}); 
}); 

/* login. */
router.get('/register', async function(req, res, next) { 
  // Assuming getAlldDataReadings returns a Promise that resolves with the data
  res.render('register', { title: 'register', currentPage: 'register'}); 
}); 

module.exports = router;
