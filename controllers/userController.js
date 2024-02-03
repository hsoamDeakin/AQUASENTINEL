// controllers/userController.js
const userService = require("../services/userService");
const path = require("path");
const db = require("../db");
const jwt = require("jsonwebtoken");
const axios = require("axios");

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
    console.log(user);
    // Combine first and last names into a single property
    const fullName = `${user.firstname} ${user.lastname}`;
    // Create an object of props to send in the response
    const responseObj = {
      fullName: fullName,
      username: user.username,
      role: user.role,
    };

    const sessionSecret = req.session.sessionSecret;
    // Create and sign JWT token
    const token = jwt.sign({ userId: user._id }, sessionSecret, {
      expiresIn: "1h",
    });
    console.log("Login successful");
    console.log("Your token:", token); 
    res.redirect('/'); 
      
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
    let message = `<div class="container">
              <div class="text-center">
                  <h1>REGISTRATION CONFIRMATION</h1>
                  <h3> Hi ${insertedUser.firstname} ${insertedUser.lastname}, you successfully registered to our webpage! </h3>
                  <h3>Here's your unique User ID: ${insertedUser.userId}<h3>
              </div>
          </div>`;

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

    res.render("index", {
      title: "Index",
      currentPage: "Home",
      message: "Starting App...",
      user: responseObj,
    });
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
  console.log("POST //updateData route accessed");
  console.log("req.body:", req.body);

  const {
    userId,
    updateFirstname,
    updateLastname,
    updateUsername,
    updatePassword,
  } = req.body;

  try {
    console.log("Updating user with userId:", userId);
    const result = await userService.updateUserData(
      userId,
      updateFirstname,
      updateLastname,
      updateUsername,
      updatePassword
    );

    console.log("MongoDB update result:", result);
    if (result.modifiedCount > 0) {
      res.status(200).send("Data updated successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating data");
  }
}

async function deleteUser(req, res) {
  const userId = req.body.userId;

  try {
    const result = await userService.deleteUser(userId);

    if (result.deletedCount === 0) {
      console.log("User not found");
      return res.status(404).send("User not found");
    }

    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
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
};
