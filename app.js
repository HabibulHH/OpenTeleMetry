const express = require('express');
const configureOpenTelemetry = require('./opentelemetry');

// Configure OpenTelemetry
const tracerProvider = configureOpenTelemetry();

// Create your Express app
const app = express();
const { context, trace } = require('@opentelemetry/api');

app.use('/signup', (req, res, next) => {
  const tracer = tracerProvider.getTracer('express-tracer');
  const span = tracer.startSpan('signup-endpoint');

  // Add custom attributes or log additional information if needed
  span.setAttribute('user', 'user made');

  // Pass the span to the request object for use in the route handler
  context.with(trace.setSpan(context.active(), span), () => {
    next();
  });
});
const Validate = (req, parentSpan) => {
  const tracer = tracerProvider.getTracer('express-tracer');
  const childSpan = tracer.startSpan('validation', { parent: parentSpan });

  // Your validation logic here
  // End the child span
  childSpan.end();
};


const SaveToDB = (req, parentSpan) => {
  const tracer = tracerProvider.getTracer('express-tracer');
  const childSpan = tracer.startSpan('Saved TOo DB', { parent: parentSpan });

  // Your validation logic here
  // End the child span
  childSpan.end();
};

app.post('/signup', (req, res) => {
  // Access the parent span from the request object
  const parentSpan = trace.getSpan(context.active());

  // Your signup logic here

  // Call the validation function with the parent span
  Validate(req, parentSpan);
  SaveToDB(req, parentSpan);
  // End the parent span
  parentSpan.end();

  res.send('Signup successful!');
});




// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
