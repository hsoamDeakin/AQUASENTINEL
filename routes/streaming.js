var express = require("express");
var router = express.Router();

const {
  startProducer,
  stopProducer,
  startConsumer,
  stopConsumer,
  receivedData,
} = require("../controllers/kafkaController");

/* Kafka services*/
/* Kafka services */
router.get("/start-producer", async function (req, res, next) {
  console.log('Starting producer...' );
  // Start producer
  await startProducer();

  // Stop producer after some time (e.g., 10 seconds)
  setTimeout(async () => {
    await stopProducer();
    // Send a completion message after stopping the producer
    res.send('Producer completed...' );
  }, 100000);
});

router.get("/start-consumer", async function (req, res, next) {
  // Start consumer
  await startConsumer(); 
  // Stop consumer after some time (e.g., 20 seconds)
  setTimeout(async () => {
    await stopConsumer(); 

  }, 20000); 
});

/* GET home page. */
router.get("/", function (req, res, next) {});

module.exports = router;
