// services/userService.js
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { connectDB } = require('../db'); // Import connectDB from db.js

async function hashPassword(inputPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(inputPassword, salt);
    return hashedPassword;
}

async function registerUser(inputFirstname, inputLastname, inputUsername, inputPassword) {
    await connectDB('userDB');

    try {
        const hashedPassword = await hashPassword(inputPassword);
        const userId = uuidv4();

        const userCollection = mongoose.connection.db.collection('Register');

        const result = await userCollection.insertOne({
            userId,
            storedFirstname: inputFirstname,
            storedLastname: inputLastname,
            storedUsername: inputUsername,
            storedPassword: hashedPassword
        });

        console.log('Document inserted:', result.insertedId);

        return { userId, storedUsername: inputUsername, storedPassword: hashedPassword };

    } catch (err) {
        console.error('Error inserting document:', err);
        throw new Error('Internal Server Error');
    }
}

async function loginUser(inputUsername, inputPassword) {
    await connectDB('userDB');

    try {

        const userCollection = mongoose.connection.db.collection('Register');
        const user = await userCollection.findOne({ storedUsername: inputUsername });

        if (!user) {
            console.log('User not found');
            throw new Error('User not found');
        }

        const storedHashedPassword = user.storedPassword;
        const isMatch = await bcrypt.compare(inputPassword, storedHashedPassword);

        if (isMatch) {
            console.log('Login successful');
            return { inputUsername, storedUsername: inputUsername, role: 'user' };
        } else {
            console.log('Login failed');
            throw new Error('Unauthorized');
        }

    } catch (error) {
        console.error('Error in login service:', error);
        throw new Error('Internal Server Error');
    }
}

async function getSpecificUser(userId) {
    await connectDB('userDB');
    try {
        const collection = mongoose.connection.db.collection('Register');
        return await collection.findOne({ userId });
    } finally {
        await mongoose.connection.close();
    }
}

async function updateUserData(userId, updateFirstname, updateLastname, updateUsername, updatePassword) {
    await connectDB('userDB');
    try {
        const collection = mongoose.connection.db.collection('Register');
        return await collection.updateOne(
            { userId },
            {
                $set: {
                    storedFirstname: updateFirstname,
                    storedLastname: updateLastname,
                    storedUsername: updateUsername,
                    storedPassword: updatePassword
                }
            }
        );
    } finally {
        await mongoose.connection.close();
    }
}

async function deleteUser(userId) {
    await connectDB('userDB');
    try {
        const collection = mongoose.connection.db.collection('Register');
        return await collection.deleteOne({ userId });
    } finally {
        await mongoose.connection.close();
    }
}

module.exports = { registerUser, loginUser, getSpecificUser, updateUserData, deleteUser };
