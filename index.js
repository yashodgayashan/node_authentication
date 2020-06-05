// Import libraries.
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Configure dotenv for read environment variables.
dotenv.config();

// Set variables.
const port = process.env.PORT || 8080;

// Init the express application.
const app = express();

// Setup middlewares.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Set the app to listen on the port.
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

// Tempory datastore.
var users = [
  { userName: "yashod", password: "test", userType: "Admin" },
  { userName: "amal", password: "test", userType: "User" }
];

// To generate JWT token with 24h expire time.
generateJwtToken = value => {
  const payload = { name: value.userName, role: value.userType };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h"
  });
  return { accessToken: accessToken };
};

// Authenticate the Token.
authenticateUser = (req, res, next) => {
  const autheHeader = req.headers["authorization"];
  const token = autheHeader && autheHeader.split(" ")[1];
  if (token == null) return res.status(401).send();

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send();
    }
    req.user = user;
    next();
  });
};

// Routes.
app.post("/login", (req, res) => {
  // Check the body is valid.
  if (req.body.userName == undefined) {
    res.status(406).send("Not acceptable");
  } else if (req.body.password == undefined) {
    res.status(406).send("Not acceptable");
  } else {
    // Store the body parameters.
    var userName = req.body.userName;
    var password = req.body.password;
    users.forEach(value => {
      if (value.userName == userName) {
        if (value.password == password) {
          res.status(200).send(generateJwtToken(value));
        } else {
          res.status(401).send();
        }
      }
    });
    res.status(401).send();
  }
});
// Protected route.
app.get("/any", authenticateUser, (req, res) => {
  res.status(200).send("Any");
});
// Route only for admins.
app.get("/admin", authenticateUser, (req, res) => {
  if (req.user.role == "Admin") {
    res.status(200).send("Admin");
  } else {
    res.status(403).send();
  }
});
// Route only for user
app.get("/user", authenticateUser, (req, res) => {
  if (req.user.role == "User") {
    res.status(200).send("User");
  } else {
    res.status(403).send();
  }
});
