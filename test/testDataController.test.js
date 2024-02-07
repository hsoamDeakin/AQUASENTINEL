const chai = require("chai");
const expect = require("chai").expect;
const chaiHttp = require("chai-http");
const app = require("../app"); 
const db = require("../db"); 
const userService = require('../services/userService');
const dataService = require('../services/dataService');
const dataController = require('../controllers/dataController');
const sinon = require('sinon');

chai.use(chaiHttp); 

describe('Data Controller getAverageWQI function', () => {
  it('should return an array of average WQI grouped by location in ascending order', async () => {
   
    const mockAggregateResult = [
      { _id: 'Location1', averageWQI: 30 },
      { _id: 'Location2', averageWQI: 35 },

    ];

    // Mock the behavior of db.DataReading.aggregate to return the mock result
    db.DataReading.aggregate = () => mockAggregateResult;

    // Call the function being tested
    const result = await dataService.getAverageWQI();

    // Assertions
    expect(result).to.be.an('array');
    expect(result).to.deep.equal(mockAggregateResult);
  });
});

describe('getUniqueLocations function', () => {
  it('should return an array of unique locations sorted alphabetically', async () => {
    // Mock data for testing
    const mockData = [
      { value: { location: { name: 'Location1' } } },
      { value: { location: { name: 'Location2' } } },
      { value: { location: { name: 'Location1' } } }, // Duplicate location
    ];

    // Mock the behavior of db.DataReading.find to return the mock data
    db.DataReading.find = () => mockData;

    // Call the function being tested
    const result = await dataService.getUniqueLocations();

    // Assertions
    expect(result).to.be.an('array');
    expect(result).to.deep.equal(['Location1', 'Location2']); // Expected unique locations sorted alphabetically
  });
});

describe('Data Service generateRandomData function', () => {
  it('should return an array of generated data', async () => {
    // Define mock generated data
    const mockGeneratedData = [
      {
        timestamp: '2024-01-15T16:37:33.010Z',
        location: 'Chinatown',
        coordinates: [-37.8121, 144.9666],
        reading1: 14.79,
        reading2: 4.96,
        reading3: 27940.44,
        reading4: 41.02,
        reading5: 6.81,
        reading6: 13.50
      }
    ];

    // Mock the behavior of dataService.generateRandomData to return the mock generated data
    sinon.stub(dataService, 'generateRandomData').resolves(mockGeneratedData);

    // Call the function being tested
    const result = await dataController.generatedData();

    // Assertions
    expect(result).to.be.an('array');
    expect(result).to.deep.equal(mockGeneratedData);
  });
});

describe('Data Controller getAlldDataReadings function', () => {
  it('should return an array of all data readings', async () => {
    // Define mock data readings
    const mockDataReadings = [
      {
        timestamp: '2024-01-15T16:37:33.010Z',
        location: 'Chinatown',
        coordinates: [-37.8121, 144.9666],
        reading1: 14.79,
        reading2: 4.96,
        reading3: 27940.44,
        reading4: 41.02,
        reading5: 6.81,
        reading6: 13.50
      }
    ];

    // Mock the behavior of dataService.getAllDataFromReadings to return the mock data readings
    sinon.stub(dataService, 'getAllDataFromReadings').resolves(mockDataReadings);

    // Call the function being tested
    const result = await dataController.getAlldDataReadings();

    // Assertions
    expect(result).to.be.an('array');
    expect(result).to.deep.equal(mockDataReadings);
  
  });
});

describe('Data Controller calculateWQI function', () => {
  it('should calculate WQI from values', () => {
    // Define mock values
    const mockValues = [
      {
        reading1: 14.79,
        reading2: 4.96,
        reading3: 27940.44,
        reading4: 41.02,
        reading5: 6.81,
        reading6: 13.50
      }
    ];

    // Mock the behavior of dataService.calculateWQIFromArray to return the calculated WQI
    sinon.stub(dataService, 'calculateWQIFromArray').returns(50); // Example WQI value

    // Call the function being tested
    const result = dataController.calculateWQI(mockValues);

    // Assertions
    expect(result).to.equal(50); // Example WQI value
  });
});

describe('Data Controller getUniqueLocations function', () => {
  it('should return unique locations', async () => {
    // Define mock response from dataService.getUniqueLocations
    const mockResponse = ['Location1', 'Location2', 'Location3']; // Example unique locations

    // Mock the behavior of dataService.getUniqueLocations to return the mock response
    sinon.stub(dataService, 'getUniqueLocations').resolves(mockResponse);

    // Call the function being tested
    const result = await dataController.getUniqueLocations();

    // Assertions
    expect(result).to.deep.equal(mockResponse);
  });
});
describe('getDataByLocation controller', () => {
  let req;
  let res;
  let getDataByLocationStub;

  beforeEach(() => {
      req = {
          query: {
              selectedLocation: 'TestLocation'
          }
      };
      res = {
          status: sinon.stub().returnsThis(),
          send: sinon.stub()
      };
      getDataByLocationStub = sinon.stub(dataService, 'getDataByLocation');
  });

  afterEach(() => {
      getDataByLocationStub.restore();
  });
  it('should handle errors properly', async () => {
    const errorMessage = 'Internal Server Error';
    getDataByLocationStub.withArgs(req.query.selectedLocation).throws(new Error(errorMessage));

    await dataController.getDataByLocation(req, res);

    sinon.assert.calledOnce(getDataByLocationStub);
    sinon.assert.calledWithExactly(getDataByLocationStub, req.query.selectedLocation);
    sinon.assert.calledWith(res.status, 500);
    sinon.assert.calledWith(res.send, errorMessage);
});
});

describe('getDataByTimeRange controller', () => {
  let req;
  let res;
  let getDataByTimeRangeStub;

  beforeEach(() => {
      req = {
          query: {
              startDate: '2024-01-01', // Example start date
              endDate: '2024-01-31' // Example end date
          }
      };
      res = {
          status: sinon.stub().returnsThis(),
          send: sinon.stub()
      };
      getDataByTimeRangeStub = sinon.stub(dataService, 'getDataByTimeRange');
  });

  afterEach(() => {
      getDataByTimeRangeStub.restore();
  });

  it('should handle errors properly', async () => {
      const errorMessage = 'Internal Server Error';
      getDataByTimeRangeStub.withArgs(req.query.startDate, req.query.endDate).throws(new Error(errorMessage));

      await dataController.getDataByTimeRange(req, res);

      sinon.assert.calledOnce(getDataByTimeRangeStub);
      sinon.assert.calledWithExactly(getDataByTimeRangeStub, req.query.startDate, req.query.endDate);
      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.send, errorMessage);
  });
});

describe('getDataByLocationAvgWQI function', () => {
  let dbConnectStub;

  beforeEach(() => {
    // Stubbing db.connectDB to prevent actual database connection
    dbConnectStub = sinon.stub(db, 'connectDB').resolves();
  });

  afterEach(() => {
    // Restoring the original method after each test
    dbConnectStub.restore();
  });

  it('should return data with average WQI for each year, month, and day', async () => {
    // Mock data to be returned from the database
    const locationName = 'Test Location';
    const mockData = [
      { _id: new Date('2023-01-01'), averageWQI: 50 },
      { _id: new Date('2023-01-02'), averageWQI: 60 },
      // Add more mock data as needed
    ];
    // Stubbing db.DataReading.aggregate to return mock data
    const aggregateStub = sinon.stub(db.DataReading, 'aggregate').resolves(mockData);

    // Call the function
    const result = await dataController.getDataByLocationAvgWQI({ query: { selectedLocation: locationName } }, {});

    // Assert the result
    expect(result).to.deep.equal(mockData);

    // Restore the stub
    aggregateStub.restore();
  });

  it('should handle errors gracefully and send a 500 status response', async () => {
    // Stubbing db.connectDB to throw an error
    dbConnectStub.rejects(new Error('DB connection failed'));

    // Mock req and res objects
    const req = { query: { selectedLocation: 'Test Location' } };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub()
    };

    // Call the function
    await dataController.getDataByLocationAvgWQI(req, res);

    // Assert that res.status and res.send were called with the appropriate arguments
    sinon.assert.calledWithExactly(res.status, 500);
    sinon.assert.calledWithExactly(res.send, 'DB connection failed');
  });
});

describe('Data Controller - getSortedData', function () {
  
  it('should get sorted data successfully', async function () {
      // Stub the getSortedData method of dataService to return mock data
      const dataServiceStub = sinon.stub(dataService, 'getSortedData').resolves(['mockData']);

      // Call the getSortedData function
      const result = await dataController.getSortedData('columnName', 'asc');

      // Assertions
      expect(result).to.deep.equal(['mockData']);

      sinon.assert.calledWithExactly(
          dataServiceStub,
          'columnName',
          'asc'
      );

      // Restore the original method
      dataServiceStub.restore();
  });

  it('should handle errors during data retrieval', async function () {
      // Stub the getSortedData method of dataService to throw an error
      const errorMessage = 'Data retrieval failed';
      const dataServiceStub = sinon.stub(dataService, 'getSortedData').rejects(new Error(errorMessage));
  
      // Call the getSortedData function
      try {
          const result = await getSortedData('columnName', 'asc');
          console.log('Result:', result);
      } catch (error) {
          console.error('Error:', error.message); 
      }
      // Restore the original method
      dataServiceStub.restore();
  });
});

describe('getAverageWQI function', () => {
  let dbConnectStub;
  beforeEach(() => {
    // Stubbing db.connectDB to prevent actual database connection
    dbConnectStub = sinon.stub(db, 'connectDB').resolves();
  });

  afterEach(() => {
    // Restoring the original method after each test
    dbConnectStub.restore();
  });

  it('should return average WQI for each location', async () => {
    // Mock data to be returned from the database
    const mockData = [
      { _id: 'Location1', averageWQI: 50 },
      { _id: 'Location2', averageWQI: 60 },
    ];
    // Stubbing db.DataReading.aggregate to return mock data
    const aggregateStub = sinon.stub(db.DataReading, 'aggregate').resolves(mockData);

    // Call the function
    const result = await dataController.getAverageWQI({}, {});

    // Assert the result
    expect(result).to.deep.equal(mockData);

    // Restore the stub
    aggregateStub.restore();
  });

  it('should throw an error if database connection fails', async () => {
    // Stubbing db.connectDB to throw an error
    dbConnectStub.rejects(new Error('DB connection failed'));

    // Call the function and expect it to throw an error
    try {
      await dataController.getAverageWQI({}, {});
      // If the above line doesn't throw an error, fail the test
      throw new Error('Expected function to throw, but it did not.');
    } catch (error) {
      // Assert that the error message matches the expected message
      expect(error.message).to.equal('DB connection failed');
    }
  });
});
