
// Import dependencies
import * as chai from 'chai';
import sinon from 'sinon';
import userController from '../controllers/userController.js';
import userService from '../services/userService.js';

import { expect } from 'chai';


before(async function () {
    // Resolve all promises and assign to respective variables
    const chaiPromise = import('chai');
    const sinonPromise = import('sinon');
    const userControllerPromise = import('../controllers/userController.js');
    const userServicePromise = import('../services/userService.js');

    const [chai, sinon, userController, userService] = await Promise.all([
        chaiPromise,
        sinonPromise,
        userControllerPromise,
        userServicePromise

    ]);

    this.chai = chai;
    this.sinon = sinon;
    this.userController = userController.default;
    this.userService = userService.default;

});


describe('User Controller - registerUser', function () {
    let req, res;

    beforeEach(function () {
        // Create a mock request and response object
        req = {
            body: {
                firstname: 'Hazal',
                lastname: 'Yildiz',
                username: 'hazalyildiz',
                password: 'password123'
            }
        };
        res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        };
    });

    it('should register a user successfully', async function () {
        // Stub the registerUser method of userService to return a mock user
        const userServiceStub = sinon.stub(userService, 'registerUser').resolves({
            userId: 'mockUserId',
            storedUsername: 'hazalyildiz',
            storedPassword: 'hashedPassword'
        });

        // Call the registerUser method of userController
        await userController.registerUser(req, res);

        // Assertions
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.send.calledOnce).to.be.true;

        // Ensure that the userService.registerUser method was called with the correct arguments
        sinon.assert.calledWithExactly(
            userServiceStub,
            'Hazal',
            'Yildiz',
            'hazalyildiz',
            'password123'
        );

        userServiceStub.restore(); // Restore the original method
    });

    it('should handle errors during user registration', async function () {
        // Stub the registerUser method of userService to throw an error
        const userServiceStub = sinon.stub(userService, 'registerUser').rejects(new Error('Registration failed'));

        // Call the registerUser method of userController
        await userController.registerUser(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.firstCall.args[0]).to.equal('Internal Server Error');

        userServiceStub.restore(); // Restore the original method
    });
});
