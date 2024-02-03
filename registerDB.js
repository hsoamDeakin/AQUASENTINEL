const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // Import the UUID library
const { MongoClient, ObjectId } = require('mongodb'); 
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Connection URI
const uri = 'mongodb://127.0.0.1:27017';

// Create a new MongoClient
const client = new MongoClient(uri, { useUnifiedTopology: true });

app.use(express.static(__dirname + '/public'));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hash the password function (defined outside the route handler)
async function hashPassword(inputPassword) {
    // Hash a password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(inputPassword, salt);
    return hashedPassword;
}

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}


async function startApp() {
    try {
        await connectToMongoDB();
        app.listen(3000, function () {
            console.log(`Web server running at port 3000!`);
            console.log("Type Ctrl+C to shut down the web server");
        });
    } catch (err) {
        console.error('Error starting the application:', err);
    }
}

startApp();

        app.post('/registration', async (req, res) => {
            const inputFirstname = req.body.firstname;
            const inputLastname = req.body.lastname;
            const inputUsername = req.body.username;
            const inputPassword = req.body.password;

            console.log('Received registration request:', req.body); // Log the received data

            // Validate the inputs
            if (!inputFirstname || !inputUsername || !inputLastname || !inputPassword) {
                return res.status(400).send("All fields are required.");
            }

            try{
                const hashedPassword = await hashPassword(inputPassword); // Wait for password hashing

                // Generate a unique user ID using UUID
                const userId = uuidv4();

                // Use the MongoDB client to insert data into your collection
                const database = client.db('userDB');
                const collection = database.collection('Register');
         
                    const result = await collection.insertOne({
                        userId: userId, // Include the generated user ID
                        storedFirstname: inputFirstname,
                        storedLastname: inputLastname,
                        storedUsername: inputUsername,
                        storedPassword: hashedPassword  // Store the hashed password
                    });

                    console.log('Document inserted:', result.insertedId);
                    let message = `<div class="container">
                    <div class="text-center">
                        <h1>REGISTRATION CONFIRMATION</h1>
                        <h3> Hi ${inputFirstname} ${inputLastname}, you successfully registered to our webpage! </h3>
                        <h3>Here's your unique User ID: ${userId}<h3>
                    </div>
                </div>`;
                console.log('Registration successful.');
                console.log('Your user name is:', storedUsername);
                console.log('Your user id is:', userId);
                console.log('Your hashed password is:', storedPassword);

                res.status(200).send(message);

                } catch (err) {
                    console.error('Error inserting document:', err);
                    res.status(500).send('Internal Server Error');
                }

            });

  // Middleware to set a unique session secret for each user
  const setSessionSecret = (req, res, next) => {
  // Generate a random 32-byte (256-bit) hex string as the session secret key
  const sessionSecret = crypto.randomBytes(32).toString('hex');
  
  // Set the generated session secret key in the user's session
  req.session.sessionSecret = sessionSecret;

  // Ensure that req.sessionOptions is initialized
  req.sessionOptions = req.sessionOptions || {};
  
  // Set the session secret for express-session middleware
  req.sessionOptions.secret = sessionSecret;
  
  // Continue to the next middleware
  next();
  };

  app.use(session({
    secret: '62254e08f1826f0a4fe93be2bb4f1ce7a4809c69bfa525bc74ea6e1294ecc96d', 
    resave: true,
    saveUninitialized: true
    }));

  // Use the setSessionSecret middleware for specific routes
  app.use(['/login','/myprofile'], setSessionSecret);

  // Login route
  app.post('/login', async (req, res) => {
    console.log('Received login request:', req.body);
    const inputUsername = req.body.username;
    const inputPassword = req.body.password;

    console.log('Username:', inputUsername);
    console.log('Password:', inputPassword);

  try {
    const collection = client.db('userDB').collection('Register');
    const user = await collection.findOne({ storedUsername: inputUsername });

    if (!user) {
      console.log('User not found');
      return res.status(401).send("<h1>LOGIN FAILED</h1><h3>The <i>username</i> or <i>password</i> provided doesn't match our records.</h3>");
    }

    const storedHashedPassword = user.storedPassword;
    console.log('Stored Hashed Password:', storedHashedPassword);

    const isMatch = await bcrypt.compare(inputPassword, storedHashedPassword);
    console.log('Password Comparison Result:', isMatch);

    if (isMatch) {
      console.log('Login successful');

      if (req.session && req.session.sessionSecret) {
        const user = { inputUsername, role: 'user' };
        const sessionSecret = req.session.sessionSecret;

        // Sign the JWT using the session secret
        const token = jwt.sign(user, sessionSecret, { expiresIn: '1h' });

            const profileFilePath = path.join(__dirname, 'public', 'myprofile.html');
            res.sendFile(profileFilePath);

      console.log("Your token:", token);
      
  } else {
    console.log('Session secret not found');
    res.status(401).json({ message: 'Unauthorized' });
  }

    } else {
      console.log('Login failed');
      res.status(401).send("<h1>LOGIN FAILED</h1> <p>The <i>username</i> or <i>password</i> provided doesn't match our records.</p>");
    }
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Middleware to verify the token and attach user details to the request object
async function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token using the session secret
    const decoded = jwt.verify(token, req.session.sessionSecret);

    // Retrieve user details from the database
    const user = await user.findOne({ username: decoded.inputUsername });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Attach the user information to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

const requireLogin = (req, res, next) => {
  if (req.session.userId) {
  // User is logged in, proceed to the next middleware
  next();
  } else {
  // User is not logged in, redirect to the login page
  res.redirect('/login.html');
  }
  };

// Combined middleware for the protected route and user authentication check
const protectProfileRoute = [verifyToken, requireLogin];

// Protected route 
app.get('/myprofile', protectProfileRoute, (req, res) => {
  if (req.session && req.session.sessionSecret) {
    const profileFilePath = path.join(__dirname, 'public', 'myprofile.html');
    const user = req.user;
      res.sendFile(profileFilePath);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.get('/specificUser', async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
      return res.status(400).send("User ID is required.");
  }

  try {
      const collection = client.db('userDB').collection('Register');
      const user = await collection.findOne({ userId: userId });

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
});

  app.post('/updateData', async (req, res) => {
    console.log('POST //updateData route accessed');
    console.log('req.body:', req.body);
        const { userId, updateFirstname, updateLastname, updateUsername, updatePassword } = req.body;
      
        try {
            console.log('Updating user with userId:', userId);
            const collection = client.db('userDB').collection('Register');
            // Find the user based on the provided user ID and update the data
          const result = await collection.updateOne(
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
          console.log('MongoDB update result:', result);
        if (result.modifiedCount > 0) {
          res.status(200).send('Data updated successfully');
        } else {
          res.status(404).send('User not found');
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Error updating data');
      }
    });

app.post('/deleteUser', async (req, res) => {
    const userId = req.body.userId;

    try {
        const collection = client.db('userDB').collection('Register');
        const result = await collection.deleteOne({ userId });

        if (result.deletedCount === 0) {
            console.log('User not found');
            return res.status(404).send("User not found");
        }

        res.status(200).send("User deleted successfully");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal Server Error");
    }
});

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}
