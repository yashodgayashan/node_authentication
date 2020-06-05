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

### Authentication

#### Import needed modules and add midlewares.

In first phase let's import needed modules and initialize middlewares and listen to a port and the port is in the `.env` file.

**index.js**

```js
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

```js
// Tempory datastore.
var users = [
  { userName: "yashod", password: "test", userType: "Admin" },
  { userName: "amal", password: "test", userType: "User" }
];
```

##### JWT token.

When generating a JWT token it is encrypted with a secret and it can be only decrypt with that secret hence no one can generate a JWT token and access the backend.
Token can be found in the `.env` file.

**.env**

```
ACCESS_TOKEN_SECRET=f901903726c3d0d52ac27a989a0c0744de3709a015e352ae171673928f142f7f9807c86488e0eb1f9c6923439bdb5c8305d1428b07eb26262761c70a22c9ad87
```

###### JWT is generated with the payload, secret and properties such as expire time.

```js
jwt.sign(payload, secret, { properties });
```

#### Login route.

Login route will accept the userName and the password as body parameters and check with the tempory database and if it is match with any
it will generate the jwt token with userName and userType and send it as the responce.

**index.js**

```js
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

#### Protected route.

Then let's make a route which only accepts requests with the jwt token with the given secret. It worked as a middleware and it take the request and get the token and validate the jwt token and if not it will output `401 unauthorized`. The middleware passes the userInformation as `req.user` to the forward.

**index.js**

```js
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

// Protected route.
app.get("/any", authenticateUser, (req, res) => {
  res.status(200).send("Any");
});
```

### Authorization

The authorization is simply done using checking the usertype of the user or else you can use passport. The `/admin` route can be only access by admins and `/user` route can be only access by users.

**index.js**

```js
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
```
