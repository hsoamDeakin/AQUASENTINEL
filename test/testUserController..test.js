const chai = require('chai');
const expect  = require("chai").expect;
const chaiHttp = require('chai-http');
const app = require('../app'); // Replace '../your-app' with the correct path to your Express app
const db = require('../db'); // Replace '../your-db' with the correct path to your database module

chai.use(chaiHttp);

describe('User Controller', () => {
  // Before each test, connect to the database
  // beforeEach(async () => {
  //   await db.connectDB();
  // });

  // // After each test, disconnect from the database
  // afterEach(async () => {
  //   await db.disconnectDB();
  // });

  // Test loginUser route
  describe('POST /user/login', function() { // Use regular function instead of arrow function
    it('should return status 200 on successful login', async () => {
      this.timeout(5000); // Increase timeout to 5000 milliseconds
      const res = await chai.request(app)
        .post('/user/login') 
        .send({ username: 'admin', password: 'admin' });

      expect(res).to.have.status(200);
    });

    it('should return status 401 on failed login', async () => {
      const res = await chai.request(app)
        .post('/user/login')
        .send({ username: 'nonexistentuser', password: 'incorrectpassword' });

      expect(res).to.have.status(401);
    });
  });
});
