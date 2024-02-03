// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/* GET registeration page. */
router.get('/register', async function(req, res, next) { 
    //console.log(allDataReadings)
    res.render('register', { title: 'Register', currentPage: 'Register', user: null}); 
  }); 

  // add user 
router.post('/register', userController.registerUser);

/* GET registeration page. */
router.get('/login', async function(req, res, next) { 
    //console.log(allDataReadings)
    res.render('login', { title: 'Login', currentPage: 'Login', user:null}); 
  }); 

router.post('/login', userController.loginUser);


router.get('/myprofile', userController.verifyToken, userController.requireLogin, userController.getMyProfile);
router.get('/specificUser', userController.getSpecificUser);
router.post('/updateData', userController.updateUserData);
router.post('/deleteUser', userController.deleteUser);

module.exports = router;

