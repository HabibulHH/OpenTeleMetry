// opentelemetry.js

const { NodeTracerProvider } = require('@opentelemetry/node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { BatchSpanProcessor } = require('@opentelemetry/tracing');

function configureOpenTelemetry() {
  // Create a tracer provider and register the Express instrumentation
  const provider = new NodeTracerProvider();
  provider.register();

  // Configure and register Jaeger exporter
  const exporter = new JaegerExporter({
    serviceName: 'your-express-app',
    agentHost: 'localhost', // Change this to your Jaeger host
    agentPort: 6831, // Change this to your Jaeger port
  });

  // Use BatchSpanProcessor
  const spanProcessor = new BatchSpanProcessor(exporter);
  provider.addSpanProcessor(spanProcessor);

  // Register the Express instrumentation
  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [new ExpressInstrumentation()],
  });

  return provider;
}

module.exports = configureOpenTelemetry;