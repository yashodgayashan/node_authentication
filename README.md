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
