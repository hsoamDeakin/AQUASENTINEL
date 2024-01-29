// Import dependencies
const chai = require('chai');
const sinon = require('sinon');
const dataController = require('../../controllers/dataController');
const dataService = require('../../services/dataService');

const expect = chai.expect;

before(async function () {
    // Resolve all promises and assign to respective variables
    const chai = await chaiPromise;
    expect = chai.expect;
    sinon = await sinonPromise;
    dataController = (await dataControllerPromise).default;
    dataService = (await dataServicePromise).default;
  });

// Mock data array
const mockDataArray = [
    {
        timestamp: "2024-01-15T16:37:33.010Z",
        location: "Chinatown",
        coordinates: [-37.8121, 144.9666],
        reading1: 14.79,
        reading2: 4.96,
        reading3: 27940.44,
        reading4: 41.02,
        reading5: 6.81,
        reading6: 13.50
    }
];

// Test suite for dataController
describe('generatedData', function() {
    let stub;

    beforeEach(function() {
        stub = sinon.stub(dataService, 'generateRandomData');
    });

    afterEach(function() {
        stub.restore();
    });

    it('should generate random data', async function() {
        const expectedData = [/* Mock generated data array */];
        stub.resolves(expectedData);

        const result = await dataController.generatedData();
        expect(result).to.deep.equal(expectedData);
    });
});


// Test suite for dataController

describe('generatedData', function() {
    let stub;

    beforeEach(function() {
        stub = sinon.stub(dataService, 'generateRandomData');
    });

    afterEach(function() {
        stub.restore();
    });

    it('should generate random data', async function() {
        stub.resolves([mockData]);
        const result = await dataController.generatedData();
        expect(result).to.deep.equal([mockData]);
    });
});

describe('getAlldDataReadings', function() {
    let stub;

    beforeEach(function() {
        stub = sinon.stub(dataService, 'getAllDataFromReadings');
    });

    afterEach(function() {
        stub.restore();
    });

    it('should retrieve all data readings', async function() {
        stub.resolves([mockData]);
        const result = await dataController.getAlldDataReadings();
        expect(result).to.deep.equal([mockData]);
    });
});

describe('calculateWQI', function() {
    let stub;

    beforeEach(function() {
        stub = sinon.stub(dataService, 'calculateWQIFromArray');
    });

    afterEach(function() {
        stub.restore();
    });

    it('should calculate WQI from values', function() {
        const values = mockData.readings;
        const expectedWQI = 50; // Example WQI value
        stub.returns(expectedWQI);

        const result = dataController.calculateWQI(values);
        expect(result).to.equal(expectedWQI);
    });
});

describe('getUniqueLocations', function() {
    let stub;

    beforeEach(function() {
        stub = sinon.stub(dataService, 'getUniqueLocations');
    });

    afterEach(function() {
        stub.restore();
    });

    it('should return unique locations', async function() {
        const mockResponse = ['Chinatown'];
        stub.resolves(mockResponse);

        const result = await dataController.getUniqueLocations();
        expect(result).to.deep.equal(mockResponse);
    });
});
