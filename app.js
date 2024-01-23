const express = require('express');
const configureOpenTelemetry = require('./opentelemetry');

// Configure OpenTelemetry
const tracerProvider = configureOpenTelemetry();

// Create your Express app
const app = express();

// Your routes and middleware go here
// Middleware for /signup route to create a span
app.use('/signup', (req, res, next) => {
  const tracer = tracerProvider.getTracer('express-tracer');
  const span = tracer.startSpan('signup-endpoint');
  //console.log('Tracer Configuration:', tracerProvider.getConfig());

  // Add custom attributes or log additional information if needed
  span.setAttribute('user', 'user made');

  // Pass the span to the request object for use in the route handler
  req.span = span;

  // Log resource attributes
  console.log('Resource Attributes:', span.resource.attributes);

  // Continue with the request handling
  next();
});

// Signup route
app.post('/signup', (req, res) => {
  // Access the span from the request object
  const span = req.span;

  // Your signup logic here

  // End the span
  span.end();

  res.send('Signup successful!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
