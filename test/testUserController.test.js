const chai = require('chai');
const expect  = require("chai").expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const db = require('../db'); 
const userController = require('../controllers/userController');
chai.use(chaiHttp);
const sinon = require('sinon');
const jwt = require('jsonwebtoken'); // Import jwt module
const userService = require("../services/userService");

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
  
  /*describe('POST /user/login', function() { // Use regular function instead of arrow function
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
  */
});
describe('User Controller', function() {
  describe('verifyToken', function() {
    it('should return 401 Unauthorized if token is missing', async function() {
      // Mock request and response objects
      const req = { headers: {}, session: { sessionSecret: 'secret' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const next = sinon.stub();

      // Call the middleware function
      await userController.verifyToken(req, res, next);

      // Assertions
      expect(res.status.calledOnceWith(401)).to.be.true;
      expect(res.json.calledOnceWith({ message: 'Unauthorized' })).to.be.true;
      expect(next.called).to.be.false;

      // Restore stubs
      sinon.restore();
    });
  });
});

describe('User Controller', function() {
  describe('requireLogin', function() {
    it('should redirect to login page if user is not logged in', function() {
      // Mock request and response objects
      const req = { session: {} };
      const res = { redirect: sinon.stub() };
      const next = sinon.stub();

      // Call the middleware function
      userController.requireLogin(req, res, next);

      // Assertions
      expect(res.redirect.calledOnceWith('/user/login')).to.be.true;
      expect(next.called).to.be.false;
    });

    it('should proceed to next middleware if user is logged in', function() {
      // Mock request and response objects
      const req = { session: { userId: 'sampleUserId' } };
      const res = {};
      const next = sinon.stub();

      // Call the middleware function
      userController.requireLogin(req, res, next);

      // Assertions
      expect(next.calledOnce).to.be.true;
    });
  });
});

describe('getMyProfile', function() {
  it('should redirect to profile if user session is present', function() {
    // Mock request and response objects
    const req = { session: { sessionSecret: 'secret' } };
    const res = { redirect: sinon.stub() };

    // Call the function
    userController.getMyProfile(req, res);

    // Assertions
    expect(res.redirect.calledOnceWith('/user/profile')).to.be.true;
  });

  it('should return 401 Unauthorized if user session is not present', function() {
    // Mock request and response objects
    const req = { session: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    // Call the function
    userController.getMyProfile(req, res);

    // Assertions
    expect(res.status.calledOnceWith(401)).to.be.true;
    expect(res.json.calledOnceWith({ message: 'Unauthorized' })).to.be.true;
  });
});

describe('User Controller', function() {
  describe('loginUser', function() {
    it('should login user and redirect to homepage if credentials are valid', async function() {
      // Mock request and response objects
      const req = { body: { username: 'sampleUsername', password: 'samplePassword' }, session: {} };
      const res = { status: sinon.stub().returnsThis(), redirect: sinon.stub() };

      // Stub userService.loginUser to return sample user
      const sampleUser = { _id: 'sampleUserId', firstname: 'John', lastname: 'Doe' };
      sinon.stub(userService, 'loginUser').resolves(sampleUser);

      // Call the function
      await userController.loginUser(req, res);

      // Assertions
      expect(req.session.user_id).to.equal('sampleUserId');
      expect(req.session.user).to.deep.equal(sampleUser);
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.redirect.calledOnceWith('/')).to.be.true;

      // Restore stub
      sinon.restore();
    });

    it('should send login failure response if credentials are invalid', async function() {
      // Mock request and response objects
      const req = { body: { username: 'invalidUsername', password: 'invalidPassword' }, session: {} };
      const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };

      // Stub userService.loginUser to throw error
      sinon.stub(userService, 'loginUser').throws(new Error('Invalid credentials'));

      // Call the function
      await userController.loginUser(req, res);

      // Assertions
      expect(res.status.calledOnceWith(401)).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith('<h1>LOGIN FAILED</h1><h3>The <i>username</i> or <i>password</i> provided doesn\'t match our records.</h3>')).to.be.true;

      // Restore stub
      sinon.restore();
    });
  });
});

describe('User Controller', function() {
  describe('getUserByID', function() {
    it('should return a user when a valid userID is provided', async function() {
      // Stub userService.getSpecificUser to return a sample user
      const sampleUser = { _id: 'sampleUserId', username: 'sampleUsername' };
      sinon.stub(userService, 'getSpecificUser').resolves(sampleUser);

      // Call the function
      const result = await userController.getUserByID('sampleUserId');

      // Assertions
      expect(result).to.deep.equal(sampleUser);

      // Restore stub
      sinon.restore();
    });

    it('should return null when an invalid userID is provided', async function() {
      // Stub userService.getSpecificUser to return null
      sinon.stub(userService, 'getSpecificUser').resolves(null);

      // Call the function
      const result = await userController.getUserByID('invalidUserId');

      // Assertions
      expect(result).to.be.null;

      // Restore stub
      sinon.restore();
    });
  });
});

describe('User Controller', function() {
  describe('registerUser', function() {
    it('should register a user and redirect to homepage on successful registration', async function() {
      // Mock request and response objects
      const req = {
        body: {
          firstname: 'John',
          lastname: 'Doe',
          username: 'johndoe',
          password: 'password123',
          role: 'user'
        },
        session: {}
      };
      const res = { redirect: sinon.stub() };

      // Stub userService.registerUser to return a sample inserted user
      const sampleUser = { _id: 'sampleUserId', firstname: 'John', lastname: 'Doe', username: 'johndoe', role: 'user' };
      sinon.stub(userService, 'registerUser').resolves(sampleUser);

      // Call the function
      await userController.registerUser(req, res);

      // Assertions
      expect(req.session.user_id).to.equal('sampleUserId');
      expect(req.session.user).to.deep.equal(sampleUser);
      expect(res.redirect.calledOnceWith('/')).to.be.true;

      // Restore stub
      sinon.restore();
    });

    it('should send 500 Internal Server Error on registration failure', async function() {
      // Mock request and response objects
      const req = { body: {}, session: {} };
      const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };

      // Stub userService.registerUser to throw an error
      sinon.stub(userService, 'registerUser').throws(new Error('Registration failed'));

      // Call the function
      await userController.registerUser(req, res);

      // Assertions
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.send.calledOnceWith('Internal Server Error')).to.be.true;

      // Restore stub
      sinon.restore();
    });
  });
});

describe('User Controller', function() {
  describe('getSpecificUser', function() {
    it('should return user data if user exists', async function() {
      // Mock request and response objects
      const req = { query: { userId: 'sampleUserId' } };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };

      // Stub userService.getSpecificUser to return a sample user
      const sampleUser = {
        userId: 'sampleUserId',
        storedFirstname: 'John',
        storedLastname: 'Doe',
        storedUsername: 'johndoe'
      };
      sinon.stub(userService, 'getSpecificUser').resolves(sampleUser);

      // Call the function
      await userController.getSpecificUser(req, res);

      // Assertions
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.send.calledOnceWith(`
            <h1>User Data</h1>
            <p>User ID: ${sampleUser.userId}</p>
            <p>First Name: ${sampleUser.storedFirstname}</p>
            <p>Last Name: ${sampleUser.storedLastname}</p>
            <p>Username: ${sampleUser.storedUsername}</p>
        `)).to.be.true;

      // Restore stub
      sinon.restore();
    });

    it('should return "User not found." if user does not exist', async function() {
      // Mock request and response objects
      const req = { query: { userId: 'nonExistentUserId' } };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };

      // Stub userService.getSpecificUser to return null
      sinon.stub(userService, 'getSpecificUser').resolves(null);

      // Call the function
      await userController.getSpecificUser(req, res);

      // Assertions
      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.send.calledOnceWith('User not found.')).to.be.true;

      // Restore stub
      sinon.restore();
    });

    it('should send 500 Internal Server Error if an error occurs', async function() {
      // Mock request and response objects
      const req = { query: { userId: 'sampleUserId' } };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub()
      };

      // Stub userService.getSpecificUser to throw an error
      sinon.stub(userService, 'getSpecificUser').throws(new Error('Internal Server Error'));

      // Call the function
      await userController.getSpecificUser(req, res);

      // Assertions
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.send.calledOnceWith('Internal Server Error')).to.be.true;

      // Restore stub
      sinon.restore();
    });
  });
});

describe('User Controller', function() {
  describe('deleteUser', function() {
    it('should delete user and redirect to logout route if username matches logged-in user', async function() {
      // Mock request and response objects
      const req = {
        body: {
          username: 'sampleUsername'
        },
        session: { user_id: 'sampleUserId' }
      };
      const res = { redirect: sinon.stub() };

      // Stub db.User.findById to return a sample user
      const sampleUser = {
        _id: 'sampleUserId',
        username: 'sampleUsername'
      };
      sinon.stub(db.User, 'findById').resolves(sampleUser);

      // Stub db.User.deleteOne to resolve successfully
      sinon.stub(db.User, 'deleteOne').resolves();

      // Call the function
      await userController.deleteUser(req, res);

      // Assertions
      expect(res.redirect.calledOnceWith('/user/logout')).to.be.true;

      // Restore stubs
      sinon.restore();
    });

    it('should redirect to user profile if username does not match logged-in user', async function() {
      // Mock request and response objects
      const req = {
        body: {
          username: 'anotherUsername'
        },
        session: { user_id: 'sampleUserId' }
      };
      const res = { redirect: sinon.stub() };

      // Stub db.User.findById to return a sample user
      const sampleUser = {
        _id: 'sampleUserId',
        username: 'sampleUsername'
      };
      sinon.stub(db.User, 'findById').resolves(sampleUser);

      // Call the function
      await userController.deleteUser(req, res);

      // Assertions
      expect(res.redirect.calledOnceWith('/user/profile')).to.be.true;

      // Restore stubs
      sinon.restore();
    });
  });
});

describe('User Controller', function() {
  describe('addUserdNotifications', function() {
    it('should add a notification for the user and return the notification object', async function() {
      // Mock userId and message
      const userId = 'sampleUserId';
      const message = 'This is a sample notification message';

      // Stub userService.addNotification to resolve with a sample notification
      const sampleNotification = { id: 'sampleNotificationId', message: message, userId: userId };
      sinon.stub(userService, 'addNotification').resolves(sampleNotification);

      // Call the function
      const result = await userController.addUserdNotifications(userId, message);

      // Assertions
      expect(result).to.deep.equal(sampleNotification);
      expect(userService.addNotification.calledOnceWith(userId, message)).to.be.true;

      // Restore stub
      sinon.restore();
    });
  });
});

describe('User Controller', function() {
  describe('getUnreadNotifications', function() {
    it('should retrieve unread notifications for the user and return the data', async function() {
      // Mock session user ID
      const userId = 'sampleUserId';

      // Stub userService.getUnreadNotifications to resolve with sample unread notifications
      const sampleNotifications = [
        { id: 'notificationId1', message: 'Notification 1', userId: userId, read: false },
        { id: 'notificationId2', message: 'Notification 2', userId: userId, read: false }
      ];
      sinon.stub(userService, 'getUnreadNotifications').withArgs(userId).resolves(sampleNotifications);

      // Mock request and response objects
      const req = { session: { user: { userId: userId } } };
      const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };

      // Call the function
      const result = await userController.getUnreadNotifications(req, res);

      // Assertions
      expect(result).to.deep.equal(sampleNotifications);
      expect(res.status.called).to.be.false; // Ensure status method is not called on response object

      // Restore stub
      sinon.restore();
    });

    it('should return an empty array if session user is not defined', async function() {
      // Mock request and response objects
      const req = { session: {} };
      const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };

      // Call the function
      const result = await userController.getUnreadNotifications(req, res);

      // Assertions
      expect(result).to.deep.equal([]);
      expect(res.status.called).to.be.false; // Ensure status method is not called on response object

      // Restore stub
      sinon.restore();
    });
  });
});

describe('User Controller', function() {
  describe('setUnreadNotifications', function() {
    it('should call userService.setUnreadNotifications with session user ID, request, and response objects', async function() {
      // Mock session user ID
      const userId = 'sampleUserId';

      // Mock request and response objects
      const req = { session: { user: { userId: userId } } };
      const res = {};

      // Stub userService.setUnreadNotifications
      const setUnreadNotificationsStub = sinon.stub(userService, 'setUnreadNotifications');

      // Call the function
      await userController.setUnreadNotifications(req, res);

      // Assertions
      expect(setUnreadNotificationsStub.calledOnceWith(userId, req, res)).to.be.true;

      // Restore stub
      sinon.restore();
    });
  });
});



