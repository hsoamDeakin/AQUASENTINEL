const chai = require("chai");
const expect = require("chai").expect;
const chaiHttp = require("chai-http");
const app = require("../app"); // Replace '../your-app' with the correct path to your Express app
const db = require("../db"); // Replace '../your-db' with the correct path to your database module
const userService = require('../services/userService');
const dataService = require('../services/dataService');
const dataController = require('../controllers/dataController');
const sinon = require('sinon');
const fs = require('fs');
const math = require('mathjs');
const userController = require('../controllers/userController');

chai.use(chaiHttp); 

// describe('DataService', function() {
//     describe('migrateData', function() {
//       it('should migrate data from string key to date key', async function() {
//         // Sample documents with string key fields
//         const sampleDocuments = [
//           { _id: '1', key: '2023-01-01T00:00:00.000Z', value: 10 },
//           { _id: '2', key: '2023-01-02T00:00:00.000Z', value: 20 }
//         ];
  
//         // Mocking the DataReading model's find method
//         const mockFind = sinon.stub(db.DataReading, 'find').resolves(sampleDocuments);
  
//         // Call the function to be tested
//         await dataService.migrateData();
  
//         // Check if DataReading.find was called
//         expect(mockFind.calledOnce).to.be.true;
  
//         // Check if the key fields are converted to Date type
//         expect(sampleDocuments[0].key).to.be.a('string');
//         expect(sampleDocuments[1].key).to.be.a('string');
  
//         // Restore the mocked method
//         mockFind.restore();
//       });
//     });
//   });

  describe('DataService', function() {
    describe('calculateWQIFromArray', function() {
  
      it('should handle edge cases for parameter normalization', function() {
        // Test with values at the extremes
        const values = [0, 0, 0, 0, 0]; // All parameters at minimum value
  
        // Call the function to be tested
        const calculatedWQI = dataService.calculateWQIFromArray(values);
  
        // Check if calculated WQI is within expected range (depends on normalization and weights)
        expect(calculatedWQI).to.be.within(0, 100);
      });
  
      it('should handle negative values for parameters', function() {
        // Test with some negative values
        const values = [6.5, 3.0, -5, 4500, 30]; // pH, Organic_carbon, Turbidity, Solids, Trihalomethanes
  
        // Call the function to be tested
        const calculatedWQI = dataService.calculateWQIFromArray(values);
  
        // Check if calculated WQI is within expected range (depends on normalization and weights)
        expect(calculatedWQI).to.be.within(0, 100);
      });
    });
  });

  describe('DataService', function() {
    describe('getAverageWQIStats', function() {
      it('should calculate average WQI for each location and send notifications for max and min locations', async function() {
        // Sample aggregated data
        const sampleAggregatedData = [
          { _id: 'Location A', averageWQI: 50 },
          { _id: 'Location B', averageWQI: 60 },
          { _id: 'Location C', averageWQI: 70 }
        ];
  
        // Stub database connection and aggregate method
        const mockConnectDB = sinon.stub(db, 'connectDB').resolves();
        const mockAggregate = sinon.stub(db.DataReading, 'aggregate').resolves(sampleAggregatedData);
  
        // Stub req.session.user
        const req = { session: { user: { userId: 'sampleUserId' } } };
  
        // Stub userController.addUserdNotifications
        const mockAddUserNotifications = sinon.stub(userController, 'addUserdNotifications').resolves();
  
        // Call the function to be tested
        const result = await dataService.getAverageWQIStats(req);
  
        // Check if database connection is called
        expect(mockConnectDB.calledOnce).to.be.true;
  
        // Check if aggregate query is correct
        expect(mockAggregate.calledOnce).to.be.true;
        // Ensure that aggregation pipeline matches the expected pipeline
        const expectedPipeline = [
          { $group: { _id: '$value.location.name', averageWQI: { $avg: '$value.wqi' } } },
          { $sort: { averageWQI: 1 } }
        ];
        expect(mockAggregate.firstCall.args[0]).to.deep.equal(expectedPipeline);
  
        // Check if user notifications are sent for max and min locations
        expect(mockAddUserNotifications.calledTwice).to.be.true;
        expect(mockAddUserNotifications.firstCall.args).to.deep.equal(['sampleUserId', `Location with max average WQI: Location C, Average WQI: 70`]);
        expect(mockAddUserNotifications.secondCall.args).to.deep.equal(['sampleUserId', `Location with min average WQI: Location A, Average WQI: 50`]);
  
        // Check if result matches the sample data
        expect(result).to.deep.equal(sampleAggregatedData);
  
        // Restore the stubbed methods
        mockConnectDB.restore();
        mockAggregate.restore();
        mockAddUserNotifications.restore();
      });
    });
  });