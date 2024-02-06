const ip = require("ip");
const { Kafka, CompressionTypes, logLevel } = require("kafkajs");

const dataController = require("../controllers/dataController");
const userController  = require('../controllers/userController');  

const { connectDB, DataReading } = require('../db');


const host = process.env.HOST_IP || ip.address();

const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: [`${host}:9092`],
  clientId: "data-producer",
});

const topic = "data-readings";
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "data-group" });

const startProducer = async (req, res) => {
  await producer.connect();
  await generateData();
};

const stopProducer = async () => {
  await producer.disconnect();
};

const melbourneLocations = [
  { name: "Melbourne Central", lat: -37.8099, lon: 144.9631 },
  { name: "Flinders Street Station", lat: -37.8183, lon: 144.9671 },
  { name: "Royal Botanic Gardens", lat: -37.8304, lon: 144.9796 },
  { name: "Fitzroy Gardens", lat: -37.811, lon: 144.9795 },
  { name: "St Kilda Beach", lat: -37.867, lon: 144.9721 },
  { name: "Queen Victoria Market", lat: -37.8076, lon: 144.9568 },
  { name: "National Gallery of Victoria", lat: -37.8226, lon: 144.9685 },
  { name: "State Library of Victoria", lat: -37.8105, lon: 144.9646 },
  { name: "Docklands", lat: -37.8183, lon: 144.9444 },
  { name: "Chinatown", lat: -37.8121, lon: 144.9666 },
];

const generateData = async () => {
  try {
    const generatedDataArray = await dataController.generatedData();
    // Send multiple messages to the Kafka topic
    const results = await Promise.all(
      generatedDataArray.map(async (generatedData) => {
        const randomLocation =
          melbourneLocations[
            Math.floor(Math.random() * melbourneLocations.length)
          ];
        // Calculate WQI for each set of generated data
        const wqi = dataController.calculateWQI(generatedData);

        // Combine the generated data with the random location
        const messagePayload = {
          location: randomLocation,
          data: {
            ph: generatedData[0],
            Organic_carbon: generatedData[1],
            Turbidity: generatedData[2],
            Solids: generatedData[3],
            Trihalomethanes: generatedData[4],
          },
          wqi: wqi
        };      
        const timestamp = new Date().toISOString();
        // Prepare message for Kafka with timestamp as the key
        const message = {
          key: timestamp,
          value: JSON.stringify(messagePayload),
        };

        // Send the message to the Kafka topic
        return producer.send({
          topic,
          compression: CompressionTypes.GZIP,
          messages: [message],
        });
      })
    );
    //console.log(results);
  } catch (e) {
    console.error(`[example/producer] ${e.message}`, e);
  }
};

const receivedData = []; // Array to store received messages

const startConsumer = async (req, res) => {
  await connectDB(); // Connect to MongoDB

  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const receivedMessage = {
        key: message.key.toString(),
        value: JSON.parse(message.value.toString()), // Assuming the value is a JSON string
      }; 
      
      // Save the received message to the MongoDB collection
      await DataReading.create(receivedMessage);

      // Store the received message
      receivedData.push(receivedMessage);
    },}); 
};

const stopConsumer = async () => {
  await consumer.disconnect();
};

module.exports = {
  startProducer,
  stopProducer,
  startConsumer,
  stopConsumer,
  receivedData,
};
