# Authentication and Authorization with Node.

## Introduction

This is a tutorial for authentication and authorization with node. Simple authentication is developed for this tutorial.

## Modules used

- body-parser
- cors
- dotenv
- express
- jsonwebtoken
- nodemon

## Setup

- First run `npm install` to install node modules.
- Then run `nodemon index.js` to run the project.

## Code explanation.

#### Import needed modules and add midlewares.

In first phase let's import needed modules and initialize middlewares and listen to a port and the port is in the `.env` file.

**index.js**

```
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
```

**.env**

```
PORT=5000
```

#### Added datastore.

For this tutorial I have used a tempory data array and you can use any data store such as file, database.

**index.js**

```
// Tempory datastore.
var users = [
  { userName: "yashod", password: "test", userType: "Admin" },
  { userName: "amal", password: "test", userType: "User" }
];
```

#### Login route.

Login route will accept the userName and the password as body parameters and check with the tempory database and if it is match with any
it will generate the jwt token with userName and userType and send it as the responce.

**index.js**

```
// To generate JWT token with 24h expire time.
generateJwtToken = value => {
  const payload = { name: value.userName, role: value.userType };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h"
  });
  return { accessToken: accessToken };
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
```
