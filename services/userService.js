// services/userService.js
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");

/**
 * Hashes the given password using bcrypt.
 * @param {string} inputPassword - The input password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
async function hashPassword(inputPassword) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(inputPassword, salt);
  return hashedPassword;
}

/**
 * Registers a new user with the provided details.
 * @param {string} inputFirstname - The first name of the user.
 * @param {string} inputLastname - The last name of the user.
 * @param {string} inputUsername - The username of the user.
 * @param {string} inputPassword - The password of the user.
 * @param {string} role - The role of the user (e.g., "Admin", "User").
 * @returns {Promise<{ userId: string }>} A promise that resolves to an object containing the userId of the registered user.
 * @throws {Error} Throws an error if an error occurs during registration.
 */ 

async function registerUser(
  inputFirstname,
  inputLastname,
  inputUsername,
  inputPassword,
  role
) {
  await db.connectDB();
  try {
    const hashedPassword = await hashPassword(inputPassword);
    const userId = uuidv4();
    // Save the received message to the MongoDB collection
    const result = await db.User.create({
      userId: userId,
      firstname: inputFirstname,
      lastname: inputLastname,
      username: inputUsername,
      password: hashedPassword,
      role: role,
    });
    return result;
  } catch (err) {
    console.error("Error inserting document:", err);
    throw new Error("Internal Server Error");
  }
}

/**
 * Authenticates a user with the provided username and password.
 * @param {string} inputUsername - The username of the user.
 * @param {string} inputPassword - The password of the user.
 * @returns {Promise<{ username: string, role: string }>} A promise that resolves to an object containing the username and role of the authenticated user.
 * @throws {Error} Throws an error if authentication fails or an error occurs during the process.
 */

async function loginUser(inputUsername, inputPassword) {
  await db.connectDB();
  try {
    // Find user by username
    const user = await db.User.findOne({ username: inputUsername });
    if (!user) {
      throw new Error("User not found");
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(inputPassword, user.password);

    if (isMatch) {
      return user;
    } else {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    console.error("Error in login service:", error);
    throw new Error("Internal Server Error");
  }
}

/**
 * Retrieves a user with the specified userId.
 * @param {string} userId - The userId of the user to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the user object if found, or null if not found.
 * @throws {Error} Throws an error if an error occurs during retrieval.
 */

async function getSpecificUser(userId) {
  await db.connectDB();
  try {
    const user = await db.User.findById(userId);
    return user;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw new Error("Internal Server Error");
  }
}

/**
 * Updates the details of a user with the specified userId.
 * @param {string} userId - The userId of the user to update.
 * @param {string} inputFirstname - The updated first name of the user.
 * @param {string} inputLastname - The updated last name of the user.
 * @param {string} inputUsername - The updated username of the user.
 * @param {string} inputPassword - The updated password of the user.
 * @param {string} role - The updated role of the user.
 * @returns {Promise<Object>} A promise that resolves to the updated user object.
 * @throws {Error} Throws an error if the user is not found or an error occurs during update.
 */

async function updateUserData(
  userId,
  inputFirstname,
  inputLastname,
  inputUsername,
  inputPassword,
  role
) {
  await db.connectDB();

  try {
    const hashedPassword = await hashPassword(inputPassword);
    const updatedUser = await db.User.findOneAndUpdate(
      { userId: userId }, // Search criteria
      {
        $set: {
          firstname: inputFirstname,
          lastname: inputLastname,
          username: inputUsername,
          password: hashedPassword,
          role: role,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    //("User updated successfully:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Internal Server Error");
  }
}

/**
 * Deletes a user with the specified userId.
 * @param {string} userId - The userId of the user to delete.
 * @returns {Promise<Object>} A promise that resolves to the deleted user object.
 * @throws {Error} Throws an error if the user is not found or an error occurs during deletion.
 */

async function deleteUser(userId) {
  await db.connectDB();
  try {
    const deletedUser = await db.User.findOneAndDelete({ userId: userId });

    if (!deletedUser) {
      throw new Error("User not found");
    }
    //console.log("User deleted successfully:", deletedUser);
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Internal Server Error");
  }
}

// Function to add a notification for a user
const addNotification = async (userId, message) => {
  try { 

    // Create a new notification object
    const notification = new db.Notification({
      userId: userId, // ID of the user for whom the notification is intended
      message: message // Notification message
    });

    // Save the notification to the database
    await notification.save(); 
    //console.log('Notification added successfully:', notification);
    return notification; // Return the newly created notification object
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
};
 

const getUnreadNotifications = async (userId) => {
  try {
    // Find unread notifications for the specified user and sort by timestamp in descending order
    let unreadNotifications = await db.Notification.find({
      userId: userId,
      readStatus: false // Filter by unread notifications
    }).sort({ timestamp: -1 }); 

    return unreadNotifications; // Return the array of unread notifications
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
};

const setUnreadNotifications = async (userId, req, res) => {
  try {
   
    // Mark all unread notifications as read
    await db.Notification.updateMany(
      { userId: userId, readStatus: false }, // Filter by unread notifications
      { $set: { readStatus: true } } // Set readStatus to true
    ); 
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
};



module.exports = {
  registerUser,
  loginUser,
  getSpecificUser,
  updateUserData,
  deleteUser,
  hashPassword,
  addNotification,
  getUnreadNotifications,
  setUnreadNotifications
};
