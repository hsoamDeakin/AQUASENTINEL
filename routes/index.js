var express = require('express');

var router = express.Router();
 
const userController  = require('../controllers/userController'); 
const dataService = require('../services/dataService')


/* GET home page. */
router.get('/', async function(req, res, next) {   
    console.log(req.session.user) 
    // if (req.session.user) 
    // {
    //     console.log('user Id');
    //     console.log(req.session.user.userId);
    //     const notification = await userController.addUserdNotifications (req.session.user.userId, 'new mesage');
    //     console.log('added notfication');
    //     console.log(notification);
    // }

    // const startDate = '2024-01-1
    // const endDate = '2024-01-17'

    // const data = await dataService.getDataByTimeRange(startDate, endDate);  
     res.render('index', { title: 'Index', currentPage: 'Home', message: 'Starting App...', user:req.session.user}); 
}); 

router.get('/contact', async function(req, res, next) { 
    res.render('contact', { title: 'Contact', currentPage: 'Contact', user:req.session.user }); 
}); 

module.exports = router;
