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
router.get("/kafka/start-producer", function (req, res, next) {
  // Start producer
  startProducer();
  // Stop producer after some time (e.g., 10 seconds)
  setTimeout(() => {
    stopProducer();
  }, 500000);
});

router.get("/kafka/start-consumer", function (req, res, next) {
  // Start consumer
  startConsumer(); 
  // Stop consumer after some time (e.g., 20 seconds)
  setTimeout(() => {
    stopConsumer();

    // Render the page after the consumer has stopped
    res.render("index", {
      title: "index",
      currentPage: "Home",
      receivedData: receivedData,
    }); 
  }, 20000); 
});

/* GET home page. */
router.get("/", function (req, res, next) {});

module.exports = router;
