const { NodeTracerProvider } = require('@opentelemetry/node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { BatchSpanProcessor } = require('@opentelemetry/tracing');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

function configureOpenTelemetry(serviceName) {
  // Create a tracer provider and register the Express instrumentation
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      // Add other resource attributes as needed
    }),
  });
  provider.register();

  // Configure and register Jaeger exporter
  const exporter = new JaegerExporter({
    serviceName: serviceName,
    agentHost: 'localhost', // Change this to your Jaeger host
    agentPort: 16686, // Change this to your Jaeger port
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
