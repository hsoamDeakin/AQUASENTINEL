const ip = require('ip')
const { Kafka, CompressionTypes, logLevel } = require('kafkajs')
const { connectDB, DataReading } = require('../db');
const dataService = require('../services/dataService')
const dataController = require('../controllers/dataController');


const host = process.env.HOST_IP || ip.address()

const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: [`${host}:9092`],
  clientId: 'data-producer',
})

const topic = 'data-readings'
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'data-group' });

const startProducer = async () => {
  await producer.connect();
  setInterval(sendMessage, 3000);
};

const stopProducer = async () => {
  await producer.disconnect();
};

const sendMessage = async () => {
  try { 
    const generatedDataArray = await dataController.generatedData();
    // Send multiple messages to the Kafka topic
    const results = await Promise.all(
      generatedDataArray.map(async (generatedData) => { 
              const messagePayload = { 
                data: {
                  ph: generatedData[0],
                  Organic_carbon: generatedData[1],
                  Turbidity: generatedData[2],
                  Solids: generatedData[3],
                  Trihalomethanes: generatedData[4],
                }, 
              };      
              const timestamp = new Date().toISOString();      
              // Prepare message for Kafka with timestamp as the key
              const message = {
                key: timestamp,
                value: JSON.stringify(messagePayload)              
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

const startConsumer = async () => {
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

    },
  });
};


const stopConsumer = async () => {
  await consumer.disconnect(); 
}

module.exports = {
  startProducer,
  stopProducer,
  startConsumer,
  stopConsumer,
  receivedData
};

 