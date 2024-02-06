const chai = require("chai");
const expect = require("chai").expect;
const chaiHttp = require("chai-http");
const app = require("../app"); // Replace '../your-app' with the correct path to your Express app
const db = require("../db"); // Replace '../your-db' with the correct path to your database module
const userService = require('../services/userService');
const dataService = require('../services/dataService');

chai.use(chaiHttp); 

describe('Data Controller getAverageWQI function', () => {
  it('should return an array of average WQI grouped by location in ascending order', async () => {
    // Assuming db.DataReading.aggregate is a mock function that returns data for testing
    const mockAggregateResult = [
      { _id: 'Location1', averageWQI: 30 },
      { _id: 'Location2', averageWQI: 35 },
      // Add more mock data as needed
    ];

    // Mock the behavior of db.DataReading.aggregate to return the mock result
    db.DataReading.aggregate = () => mockAggregateResult;

    // Call the function being tested
    const result = await dataService.getAverageWQI();

    // Assertions
    expect(result).to.be.an('array');
    expect(result).to.deep.equal(mockAggregateResult);
    // Add more assertions as needed based on the expected behavior of the function
  });

  // Add more test cases as needed to cover different scenarios
});

describe('getUniqueLocations function', () => {
  it('should return an array of unique locations sorted alphabetically', async () => {
    // Mock data for testing
    const mockData = [
      { value: { location: { name: 'Location1' } } },
      { value: { location: { name: 'Location2' } } },
      { value: { location: { name: 'Location1' } } }, // Duplicate location
      // Add more mock data as needed
    ];

    // Mock the behavior of db.DataReading.find to return the mock data
    db.DataReading.find = () => mockData;

    // Call the function being tested
    const result = await dataService.getUniqueLocations();

    // Assertions
    expect(result).to.be.an('array');
    expect(result).to.deep.equal(['Location1', 'Location2']); // Expected unique locations sorted alphabetically
    // Add more assertions as needed based on the expected behavior of the function
  });

  // Add more test cases as needed to cover different scenarios
});


