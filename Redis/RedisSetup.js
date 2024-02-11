// redisClient.js
const redis = require('redis');

// Connect to Redis server
const client = redis.createClient({
  url: 'redis://localhost:6379' // Default Redis URL
});
client.connect();

// Function // Import necessary OpenTelemetry objects
const { trace } = require('@opentelemetry/api');

// Assuming you have a tracer named 'example-tracer' initialized elsewhere in your application
const tracer = trace.getTracer('express-tracer');

// Function to set a key-value pair in Redis with tracing and forced delay
async function setKeyValue(key, value) {
  const span = tracer.startSpan('setKeyValue');
  try {
    // Introducing a forced delay
    await new Promise(resolve => setTimeout(resolve, 4000)); // 5000 ms delay
    await client.set(key, value);
    console.log(`Key set: ${key}`);
    span.addEvent('Key set successfully');
  } catch (error) {
    console.error(`Error setting key ${key}:`, error);
    span.recordException(error);
    span.setStatus({ code: trace.SpanStatusCode.ERROR, message: error.message });
  } finally {
    span.end();
  }
}

// async function setKeyValue(key, value) {
//   const span = tracer.startSpan('setKeyValue');
//   span.setAttribute('user_id', '4444');
//   try {
//     // Introducing a forced delay
//     await new Promise(resolve => setTimeout(resolve, 4000)); // 4000 ms delay

//     // Forcefully throw an error to simulate a failure scenario
//     throw new Error('Forced error for tracing');

//     // The following line will not be executed due to the error
//     // await client.set(key, value);
//     // console.log(`Key set: ${key}`);
//     // span.addEvent('Key set successfully');
//   } catch (error) {
//     console.error(`Error setting key ${key}:`, error);
//     span.recordException(error);
//     span.setStatus({ code: trace.SpanStatusCode.ERROR, message: error.message });
    
//     // You may want to add an event to the span to note the forced error
//     span.addEvent('Forced error occurred');
//   } finally {
//     span.end();
//   }
// }

// Function to get a value by key from Redis with tracing
async function getValueByKey(key) {
  const span = tracer.startSpan('getValueByKey');
  try {
    const value = await client.get(key);
    console.log(`Value for ${key}:`, value);
    span.addEvent('Value retrieved successfully');
    return value;
  } catch (error) {
    console.error(`Error getting value for key ${key}:`, error);
    span.recordException(error);
    span.setStatus({ code: trace.SpanStatusCode.ERROR, message: error.message });
  } finally {
    span.end();
  }
}

module.exports = { setKeyValue, getValueByKey };
