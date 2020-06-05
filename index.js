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
