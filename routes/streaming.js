var express = require("express");
var router = express.Router();


const {
  startProducer,
  stopProducer,
  startConsumer,
  stopConsumer,
  receivedData,
} = require("../controllers/kafkaController");

const userController  = require('../controllers/userController'); 
const dataService = require('../services/dataService')

/* Kafka services*/
/* Kafka services */
router.get("/start-producer", async function (req, res, next) {
  console.log('Starting producer...' );
  // Start producer
  await startProducer(req, res);

   if (req.session.user) 
    {
        console.log('user Id');
        console.log(req.session.user.userId);
        const notification = await userController.addUserdNotifications (req.session.user.userId, 'Data streaming started ');
        console.log('added notfication');
        console.log(notification);
    }
  
  // Stop producer after some time (e.g., 10 seconds)
  setTimeout(async () => {
    await stopProducer();
    // Send a completion message after stopping the producer
    res.send('Producer completed...' );
  }, 50000);
});

router.get("/start-consumer", async function (req, res, next) {
  // Start consumer
  await startConsumer(req, res); 
  // Stop consumer after some time (e.g., 20 seconds)
  setTimeout(async () => {
    await stopConsumer(); 
    if (req.session.user) 
    {
        console.log('user Id');
        console.log(req.session.user.userId);
        const notification = await userController.addUserdNotifications (req.session.user.userId, 'Data collection finished. #messages = ' + receivedData.length );
        console.log('added notfication');
        console.log(notification);
        dataService.getAverageWQIStats(req, res);  
    }
    
    res.send('Consumer completed...' );
  }, 50000); 
});

/* GET home page. */
router.get("/", function (req, res, next) {

  res.render('streaming', { title: 'streaming', currentPage: 'Streaming'}); 

});

module.exports = router;
