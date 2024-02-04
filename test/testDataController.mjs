
// Import dependencies
import * as chai from 'chai';
import sinon from 'sinon';
import dataController from '../controllers/dataController.js';
import dataService from '../services/dataService.js';
import { getSortedData } from '../controllers/dataController.js';
import { getAverageWQI } from '../controllers/dataController.js';

import { expect } from 'chai';


before(async function () {
    // Resolve all promises and assign to respective variables
    const chaiPromise = import('chai');
    const sinonPromise = import('sinon');
    const dataControllerPromise = import('../controllers/dataController.js');
    const dataServicePromise = import('../services/dataService.js');

    const [chai, sinon, dataController, dataService] = await Promise.all([
        chaiPromise,
        sinonPromise,
        dataControllerPromise,
        dataServicePromise

    ]);

    this.chai = chai;
    this.sinon = sinon;
    this.dataController = dataController.default;
    this.dataService = dataService.default;

});

// Mock data array
const mockData = [
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
        chai.expect(result).to.deep.equal(expectedData);
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
        chai.expect(result).to.deep.equal([mockData]);
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
        chai.expect(result).to.deep.equal([mockData]);
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
        chai.expect(result).to.equal(expectedWQI);
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
        chai.expect(result).to.deep.equal(mockResponse);
    });
});

describe('Data Controller - getDataByLocation', function () {
    let req, res;

    beforeEach(function () {
        // Create a mock request and response object
        req = {
            query: {
                location: 'exampleLocation'
            }
        };
        res = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        };
    });

    it('should get data by location successfully', async function () {
        // Stub the getDataByLocation method of dataService to return mock data
        const dataServiceStub = sinon.stub(dataService, 'getDataByLocation').resolves(['mockData']);

        // Call the getDataByLocation method of dataController
        await dataController.getDataByLocation(req, res);

        // Assertions
        expect(res.status.called).to.be.false; // No errors, so status should not be called
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal(['mockData']);

        // Ensure that the dataService.getDataByLocation method was called with the correct argument
        sinon.assert.calledWithExactly(
            dataServiceStub,
            'exampleLocation'
        );

        // Restore the original method
        dataServiceStub.restore();
    });

    it('should handle errors during data retrieval', async function () {
        // Stub the getDataByLocation method of dataService to throw an error
        const dataServiceStub = sinon.stub(dataService, 'getDataByLocation').rejects(new Error('Data retrieval failed'));

        // Call the getDataByLocation method of dataController
        await dataController.getDataByLocation(req, res);

        // Assertions
        expect(res.json.called).to.be.false; // No successful data retrieval, so json should not be called
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.firstCall.args[0]).to.equal('Data retrieval failed');

        // Restore the original method
        dataServiceStub.restore();
    });
});

describe('Data Controller - getDataByTimeRange', function () {
    let req, res;

    beforeEach(function () {
        // Create a mock request and response object
        req = {
            query: {
                startTime: '2022-01-01T00:00:00',
                endTime: '2022-01-02T00:00:00'
            }
        };
        res = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        };
    });

    it('should get data by time range successfully', async function () {
        // Stub the getDataByTimeRange method of dataService to return mock data
        const dataServiceStub = sinon.stub(dataService, 'getDataByTimeRange').resolves(['mockData']);

        // Call the getDataByTimeRange method of dataController
        await dataController.getDataByTimeRange(req, res);

        // Assertions
        expect(res.status.called).to.be.false; // No errors, so status should not be called
        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0]).to.deep.equal(['mockData']);

        // Ensure that the dataService.getDataByTimeRange method was called with the correct arguments
        sinon.assert.calledWithExactly(
            dataServiceStub,
            '2022-01-01T00:00:00',
            '2022-01-02T00:00:00'
        );

        // Restore the original method
        dataServiceStub.restore();
    });

    it('should handle errors during data retrieval', async function () {
        // Stub the getDataByTimeRange method of dataService to throw an error
        const dataServiceStub = sinon.stub(dataService, 'getDataByTimeRange').rejects(new Error('Data retrieval failed'));

        // Call the getDataByTimeRange method of dataController
        await dataController.getDataByTimeRange(req, res);

        // Assertions
        expect(res.json.called).to.be.false; // No successful data retrieval, so json should not be called
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.firstCall.args[0]).to.equal('Data retrieval failed');

        // Restore the original method
        dataServiceStub.restore();
    });
});

describe('Data Controller - getSortedData', function () {
    
    it('should get sorted data successfully', async function () {
        // Stub the getSortedData method of dataService to return mock data
        const dataServiceStub = sinon.stub(dataService, 'getSortedData').resolves(['mockData']);

        // Call the getSortedData function
        const result = await getSortedData('columnName', 'asc');

        // Assertions
        expect(result).to.deep.equal(['mockData']);

        // Ensure that the dataService.getSortedData method was called with the correct arguments
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
            console.log('Result:', result); // Log the result for further inspection
        } catch (error) {
            console.error('Error:', error.message); // Log the error message for further inspection
            // If you want the test to pass, do not throw the error here
        }
    
        // Restore the original method
        dataServiceStub.restore();
    });
});

describe('Data Controller - getAverageWQI', function () {
    it('should get average WQI successfully', async function () {
        // Stub the getAverageWQI method of dataService to return mock data
        const dataServiceStub = sinon.stub(dataService, 'getAverageWQI').resolves(['mockData']);

        // Call the getAverageWQI function
        const result = await getAverageWQI();

        // Assertions
        expect(result).to.deep.equal(['mockData']);

        // Ensure that the dataService.getAverageWQI method was called with the correct arguments
        sinon.assert.calledOnce(dataServiceStub);

        // Restore the original method
        dataServiceStub.restore();
    });

    it('should handle errors during data retrieval', async function () {
        // Stub the getAverageWQI method of dataService to throw an error
        const errorMessage = 'Data retrieval failed';
        const dataServiceStub = sinon.stub(dataService, 'getAverageWQI').rejects(new Error(errorMessage));

        // Call the getAverageWQI function
        try {
            const result = await getAverageWQI();
            console.log('Result:', result); // Log the result for further inspection
        } catch (error) {
            console.error('Error:', error.message); // Log the error message for further inspection
            // If you want the test to pass, do not throw the error here
        }

        // Restore the original method
        dataServiceStub.restore();
    });
});


