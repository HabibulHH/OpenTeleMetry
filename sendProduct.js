const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/tracing');
const { SpanStatusCode } = require('@opentelemetry/api');

// Initialize a tracer provider
const tracerProvider = new NodeTracerProvider();

// Register the tracer provider with the OpenTelemetry API
tracerProvider.register();

// Configure a simple span processor with a console span exporter (for demonstration purposes)
tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

// Your SendNotification function
const SendNotification = (parentSpan) => {
    const tracer = tracerProvider.getTracer('notification-tracer');
    const notificationSpan = tracer.startSpan('send-notification', { parent: parentSpan });

    try {
        // Your notification logic here

        // Simulate an intentional error
        throw new Error('Intentional error in SendNotification function');
    } catch (error) {
        // Log the error message

        // Add error information to the span
        notificationSpan.setStatus({ code: SpanStatusCode.ERROR, message: error.message });

        // Optionally, rethrow the error if needed
        // throw error;
    } finally {
        // End the notification span
        notificationSpan.end();
    }
};

// Example usage
SendNotification();  // You may pass a parent span as an argument if needed
