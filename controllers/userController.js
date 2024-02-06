// controllers/userController.js
const userService = require("../services/userService");


const path = require("path");
const db = require("../db");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Middleware to verify the token and attach user details to the request object
async function verifyUserSession(req, res, next) {
  try {
    // Connect to the 'userDB' database
    if (req.session.user_id) {
      const user = await getUserByID(req.session.user_id);
      console.log(req.session.user_id);
      console.log("logged user");
      // Attach the user information to the request object
      req.session.user = user;
      console.log(user);
      next();
    } else res.render("login", { title: "Login", currentPage: "Login" });
  } catch (error) {
    console.error("Error in verifyToken middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Middleware to verify the token and attach user details to the request object
async function verifyToken(req, res, next) {
  try {
    // Verify the token using the session secret

    const token = req.headers["authorization"];
    console.log(token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Connect to the 'userDB' database
    await connectDB();
    // Retrieve user details from the database
    const decoded = jwt.verify(token, req.session.sessionSecret);

    const user = await db.User.findOne({
      username: decoded.username,
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Attach the user information to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in verifyToken middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const requireLogin = (req, res, next) => {
  if (req.session.userId) {
    // User is logged in, proceed to the next middleware
    next();
  } else {
    // User is not logged in, redirect to the login page
    res.redirect("/user/login");
  }
};
async function getMyProfile(req, res) {
  if (req.session && req.session.sessionSecret) {
    res.redirect("/user/profile");
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;
  try {
    const user = await userService.loginUser(username, password);
    // Combine first and last names into a single property
    const fullName = `${user.firstname} ${user.lastname}`;
    // Create an object of props to send in the response
    const responseObj = {
      fullName: fullName,
      username: user.username,
      role: user.role,
    };
    // set the session.
    req.session.user_id = user._id;
    // const sessionSecret = req.session.sessionSecret;
    // // Create and sign JWT token
    // const token = jwt.sign({ userId: user._id }, sessionSecret, {
    //   expiresIn: "1h",
    // });
    console.log("Login successful");
    req.session.user = user;
    console.log(req.session.user);
    // Send notifications for max and min locations
    if (req.session.user) {
      const userId = req.session.user.userId;
      await addUserdNotifications(userId, `Logged to system.`);
    }
    res.redirect("/");
  } catch (error) {
    console.error("Error in login route:", error);
    res
      .status(401)
      .send(
        "<h1>LOGIN FAILED</h1><h3>The <i>username</i> or <i>password</i> provided doesn't match our records.</h3>"
      );
  }
}

//CRUD

const getUserByID = async function (userID) {
  const user = await userService.getSpecificUser(userID);
  return user;
};
async function registerUser(req, res) {
  const userInfo = req.body;
  console.log(userInfo);
  try {
    const insertedUser = await userService.registerUser(
      userInfo.firstname,
      userInfo.lastname,
      userInfo.username,
      userInfo.password,
      userInfo.role
    );

    console.log("Registration successful.");
    // Combine first and last names into a single property
    const fullName = `${insertedUser.firstname} ${insertedUser.lastname}`;
    console.log("Your name is:", fullName);
    console.log("Your user id is:", insertedUser.userId);

    // Create an object of props to send in the response
    const responseObj = {
      fullName: fullName,
      username: insertedUser.username,
      role: insertedUser.role,
    };

    req.session.user_id = insertedUser._id;
    console.log("Login successful");
    req.session.user = insertedUser;
    res.redirect("/");

    // res.status(200).send({firstname: insertedUser.firstname, lastname: insertedUser.lastname,
    //                       username: insertedUser.username, role: insertedUser.role,});
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function getSpecificUser(req, res) {
  const userId = req.query.userId;

  try {
    const user = await userService.getSpecificUser(userId);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Display user data
    const userData = `
            <h1>User Data</h1>
            <p>User ID: ${user.userId}</p>
            <p>First Name: ${user.storedFirstname}</p>
            <p>Last Name: ${user.storedLastname}</p>
            <p>Username: ${user.storedUsername}</p>
        `;

    res.status(200).send(userData);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function updateUserData(req, res) {
  try {
    const updatedUserData = req.body;
    const userId = req.session.user_id; // Assuming userId is stored in session
    // Find the user by userId
    await db.connectDB();
    const user = await db.User.findById(userId);
    console.log("saving...");
    console.log(updatedUserData);
    // Conditionally construct the update object
    if (updatedUserData.password) {
      // Include password field only if it's not empty
      const hashedPassword = await userService.hashPassword(
        updatedUserData.password
      );
      user.password = hashedPassword;
    }
    // Include other fields for update
    if (updatedUserData.firstname) {
      user.firstname = updatedUserData.firstname;
    }
    if (updatedUserData.lastname) {
      user.lastname = updatedUserData.lastname;
    }

    // Save the updated user
    await user.save();

    // Update req.session.user with the updated data
    req.session.user = user;
    if (req.session.user) {
      const userId = req.session.user.userId;
      await addUserdNotifications(userId, `Profile updated.`);
    }

    // Redirect to some other route after updating the user data
    res.redirect("/user/profile");
  } catch (error) {
    // Handle error
    console.error("Error updating user data:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteUser(req, res) {
  try {
    const updatedUserData = req.body;
    const userId = req.session.user_id; // Assuming userId is stored in session
    // Find the user by userId
    await db.connectDB();
    const user = await db.User.findById(userId);
    // Include other fields for update
    if (updatedUserData.username && updatedUserData.username == user.username) {
      // Remove the user document
      // Redirect to some other route after updating the user data
      await db.User.deleteOne({ _id: userId });
      res.redirect("/user/logout");
    } else res.redirect("/user/profile");
  } catch (error) {
    // Handle error
    console.error("Error updating user data:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Function to get unread notifications for a user
const addUserdNotifications = async (userId, message) => {
  try {
    const notification = await userService.addNotification (userId, message);
    return notification; // Respond with the filtered data
  } catch (error) {
    console.log(error);
    //res.status(500).send(error.message);
  }
};

// Function to get unread notifications for a user
const getUnreadNotifications = async (req, res) => {
  try {
    if(req.session.user) {
      console.log(req.session.user)
      const userId = req.session.user.userId;
      const data = await userService.getUnreadNotifications(userId);
      return data; // Respond with the filtered data
    }
    else
      return [];
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const setUnreadNotifications = async (req, res) => {
  try {
    if(req.session.user) { 
      await userService.setUnreadNotifications(req.session.user.userId, req, res); 
    } 
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = {
  verifyToken,
  requireLogin,
  registerUser,
  loginUser,
  getMyProfile,
  getSpecificUser,
  updateUserData,
  deleteUser,
  getUserByID,
  verifyUserSession,
  getUnreadNotifications,
  addUserdNotifications,
  setUnreadNotifications
};
