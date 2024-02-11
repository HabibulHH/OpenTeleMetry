const redis = require('redis');
const { MeterProvider } = require('@opentelemetry/sdk-metrics-base');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

// Create a PrometheusExporter instance
const promExporter = new PrometheusExporter({
  // Configuration options, if needed
  startServer: true,
}, () => {
  console.log('Prometheus exporter started on port 9464');
});

// Create a MeterProvider and add the PrometheusExporter as a MetricReader
const meterProvider = new MeterProvider();
meterProvider.addMetricReader(promExporter);

// Now, the rest of your setup, ensuring you use the meterProvider to obtain meters
const meter = meterProvider.getMeter('your-application-name');

// Your metric definitions and the rest of your code follow here...


// Define your counters using the meter
const redisKeySetCounter = meter.createCounter('redis_key_set_counter', {
  description: 'Counts the number of keys set in Redis',
});
const redisKeySetErrorCounter = meter.createCounter('redis_key_set_error_counter', {
  description: 'Counts the number of errors setting keys in Redis',
});
const redisValueRetrievalCounter = meter.createCounter('redis_value_retrieval_counter', {
  description: 'Counts the number of successful value retrievals from Redis',
});
const redisValueRetrievalErrorCounter = meter.createCounter('redis_value_retrieval_error_counter', {
  description: 'Counts the number of errors retrieving values from Redis',
});

// Connect to Redis server
const client = redis.createClient({
  url: 'redis://localhost:6379' // Default Redis URL
});
client.connect();

// Function to set a key-value pair in Redis with tracing and metrics
async function setKeyValue(key, value) {
  try {
    await client.set(key, value);
    console.log(`Key set: ${key}`);
    // Use the correct counter
    redisKeySetCounter.add(1); // Increment the key set counter
  } catch (error) {
    console.error(`Error setting key ${key}:`, error);
    // Use the correct error counter
    redisKeySetErrorCounter.add(1); // Increment the key set error counter
  }
}

// Function to get a value by key from Redis with tracing and metrics
async function getValueByKey(key) {
  try {
    const value = await client.get(key);
    console.log(`Value for ${key}:`, value);
    // Use the correct counter
    redisValueRetrievalCounter.add(1); // Increment the value retrieval counter
    return value;
  } catch (error) {
    console.error(`Error getting value for key ${key}:`, error);
    // Use the correct error counter
    redisValueRetrievalErrorCounter.add(1); // Increment the value retrieval error counter
  }
}

module.exports = { setKeyValue, getValueByKey };
