const express = require('express');
const { setKeyValue, getValueByKey } = require('./Redis/RedisWithMeter');

const configureOpenTelemetry = require('./opentelemetry');
//const { SendNotification } = require('./notification');
// Configure OpenTelemetry
//const tracerProvider = configureOpenTelemetry();
const tracerProvider = configureOpenTelemetry('order-service');


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
const Validate = async (req, parentSpan) => {
  const tracer = tracerProvider.getTracer('express-tracer');
  const childSpan = tracer.startSpan('validation', { parent: parentSpan });

  // Introduce a delay in the validation process
  await new Promise(resolve => setTimeout(resolve, 3000)); // 5000 ms delay

  // Your validation logic here

  // End the child span
  childSpan.end();
};



const SaveToDB = async (req, parentSpan) => {
  const tracer = tracerProvider.getTracer('express-tracer');
  const childSpan = tracer.startSpan('save to db', { parent: parentSpan });

  // Introduce a delay in the validation process
  await new Promise(resolve => setTimeout(resolve, 3500)); // 5000 ms delay

  // Your validation logic here

  // End the child span
  childSpan.end();
};

app.post('/signup', async (req, res) => {
  // Access the parent span from the request object
  const parentSpan = trace.getSpan(context.active());

  Validate(req, parentSpan);

  const userInfo = { name: "John Doe", email: "john.doe@example.com" };

  // Save user info to Redis
  try{

    await setKeyValue('user_info', JSON.stringify(userInfo), parentSpan);
  }catch(e){
    console.log(e);
  }

  // Set a color tag for the validation span
  // Add an event to the span with a color tag for validation
  // Add a tag to the `span for validation
  parentSpan.setAttribute('validation.tag', 'validation');
  SaveToDB(req, parentSpan);
  //SendNotification(parentSpan);
  // End the parent span
  parentSpan.end();
  const traceId = parentSpan.spanContext().traceId;
  res.send(traceId,200);
});
 



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
