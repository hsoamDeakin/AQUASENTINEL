// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/* GET registeration page. */
router.get('/register', userController.verifyUserSession, async function(req, res, next) { 
    //console.log(allDataReadings)
    res.render('register', { title: 'Register', currentPage: 'Register'}); 
  }); 

  // add user 
router.post('/register', userController.registerUser);

/* GET registeration page. */
router.get('/login', userController.verifyUserSession, async function(req, res, next) { 
    //console.log(allDataReadings)
    res.render('login', { title: 'Login', currentPage: 'Login'}); 
  }); 

router.post('/login', userController.loginUser);

// Route for logging out
router.get('/logout', (req, res) => {
  // Clear the user session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Redirect to the login page or any other appropriate page
      res.redirect('/user/login');
    }
  });
});


/* GET profile page. */
router.get('/profile', userController.verifyUserSession, async function(req, res, next) { 
  //console.log(allDataReadings)
  res.render('profile', { title: 'Profile', currentPage: 'Profile', user:req.session.user}); 
}); 

router.post('/updateUser', userController.updateUserData);
router.post('/deleteUser', userController.deleteUser);

module.exports = router;

