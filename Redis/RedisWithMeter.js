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




async function setKeyValue(key, value) {
  try {
    await client.set(key, value);
    console.log(`Key set: ${key}`);
    // Increment the key set counter with a label for success
    redisKeySetCounter.add(1, { operation: "set", status: "success" });
  } catch (error) {
    console.error(`Error setting key ${key}:`, error);
    // Increment the key set error counter with a label for the error
    redisKeySetErrorCounter.add(1, { operation: "set", status: "error" });
  }
}

async function getValueByKey(key) {
  try {
    const value = await client.get(key);
    console.log(`Value for ${key}:`, value);
    // Increment the value retrieval counter with a label for success
    redisValueRetrievalCounter.add(1, { operation: "get", status: "success" });
    return value;
  } catch (error) {
    console.error(`Error getting value for key ${key}:`, error);
    // Increment the value retrieval error counter with a label for the error
    redisValueRetrievalErrorCounter.add(1, { operation: "get", status: "error" });
  }
}

module.exports = { setKeyValue, getValueByKey };
