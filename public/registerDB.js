const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 15;
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'userDB';

let db;

async function connectDB() {
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit the process if unable to connect to MongoDB
  }
}

(async () => {
  await connectToMongoDB();

app.use(express.static('public_html'));
app.use(express.urlencoded({ extended: false }));

app.post('/registration', function (req, res) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const password = req.body.password;

  console.log("Just received POST data for registration endpoint!");

  // Validate the inputs
  if (!firstname || !lastname || !username || !password) {
    return res.status(400).send("All fields are required.");
  }

  // Hash the password
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      // Handle hashing error
      console.error(err);
      return res.status(500).send("Server error");
    }

    // Insert data into the MongoDB collection
    const collection = db.collection('Register');
    collection.insertOne({
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: hash
    }, function (err) {
      if (err) {
        // Handle database insertion error
        console.error(err);
        return res.status(500).send("Server error");
      }

      // Data inserted successfully
      console.log(`User ${username} registered successfully.`);

      let message = `<div class="container">
        <div class="text-center">
          <h1>REGISTRATION CONFIRMATION</h1>
          <h3> Hi ${firstname} ${lastname}, you successfully registered to our webpage! </h3>
        </div>
        </div>`;

      res.status(200).send(message);
    });
  });
});

app.post('/loginInfo', function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  const collection = db.collection('Register');
  collection.findOne({ username: username }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }

    if (!user) {
      return res.status(401).send("<h1>LOGIN FAILED</h1><h3>The <i>username</i> or <i>password</i> provided doesn't match our records.</h3>");
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).send("Server error");
      }

      if (result) {
        // Passwords match, user is authenticated
        let message = `<div class="container">
          <div class="text-center">
            <h1>LOGIN SUCCESSFUL</h1>
            <h3>Welcome, ${username}!</h3>
        </div>
        </div>`;

        res.status(200).send(message);
      } else {
        res.status(401).send("<h1>LOGIN FAILED</h1> <p>The <i>username</i> or <i>password</i> provided doesn't match our records.</p>");
      }
    });
  });
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

app.listen(3000, function () {
  console.log(`Web server running at port 3000!`);
  console.log("Type Ctrl+C to shut down the web server");
});

})(); 