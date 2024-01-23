// app.js

const express = require('express');
const configureOpenTelemetry = require('./opentelemetry');

// Configure OpenTelemetry
const tracerProvider = configureOpenTelemetry();

// Create your Express app
const app = express();

// Your routes and middleware go here

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
