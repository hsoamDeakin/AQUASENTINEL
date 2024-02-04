// Import dependencies
// Import dependencies
import * as chai from 'chai';
import sinon from 'sinon';
import * as dataControllerModule from '../controllers/dataController.js';
import * as kafkaControllerModule from '../controllers/kafkaController.js';
import * as dataServiceModule from '../services/dataService.js';
import * as dbModule from '../db.js';

import {
  startProducer,
  stopProducer,
  startConsumer,
  stopConsumer,
  receivedData
} from '../controllers/kafkaController.js';


before(async function () {

    const [chai, sinon, dataController, dataService, kafkaController] = await Promise.all([
            import('chai'),
            import('sinon'),
            import('../controllers/dataController.js'),
            import('../services/dataService.js'),
            import('../controllers/kafkaController.js'),
        ]);

    this.chai = chai;
    this.sinon = sinon;
    this.kafkaController = kafkaController.default;
    this.dataController = dataController.default;
    this.dataService = dataService.default;

});


describe('Data Controller Tests', function () {
    let sandbox;

    before(function () {
        // Create a Sinon sandbox for stubs and spies
        sandbox = sinon.createSandbox();
    });

    after(function () {
        // Restore the sandbox to clean up stubs and spies
        sandbox.restore();
    });

    describe('startProducer', function () {
        it('should connect to Kafka and generate data', async function () {
            // Stub dataController.generatedData method to avoid actual data generation
            const generateDataStub = sandbox.stub(dataControllerModule, 'generatedData').resolves(['mockedData']);

            // Stub Kafka producer methods
            const producerStub = sandbox.stub(kafkaControllerModule.producer, 'send').resolves();

            // Call the startProducer function
            await kafkaControllerModule.startProducer();

            // Assertions
            expect(generateDataStub.calledOnce).to.be.true;
            expect(producerStub.calledOnce).to.be.true;

            // Restore the original methods
            generateDataStub.restore();
        });

        it('should handle errors during Kafka connection or data generation', async function () {
            // Stub dataController.generatedData method to simulate an error
            const generateDataStub = sandbox.stub(dataControllerModule, 'generatedData').rejects(new Error('Data generation failed'));

            // Stub Kafka producer methods to simulate an error
            const producerStub = sandbox.stub(kafkaControllerModule.producer, 'send').rejects(new Error('Kafka connection failed'));

            // Call the startProducer function
            await kafkaControllerModule.startProducer();

            // Assertions
            expect(generateDataStub.calledOnce).to.be.true;
            expect(producerStub.calledOnce).to.be.true;

            // Restore the original methods
            generateDataStub.restore();
        });
    });

    // ... (other test blocks)
});