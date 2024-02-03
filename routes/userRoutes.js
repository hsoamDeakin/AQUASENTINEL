// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/registration', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/myprofile', userController.verifyToken, userController.requireLogin, userController.getMyProfile);
router.get('/specificUser', userController.getSpecificUser);
router.post('/updateData', userController.updateUserData);
router.post('/deleteUser', userController.deleteUser);

module.exports = router;

