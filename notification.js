// notification-service.js

const express = require('express');
const configureOpenTelemetry = require('./opentelemetry');
const { context, trace } = require('@opentelemetry/api');

const tracerProvider = configureOpenTelemetry('payment-service');
const app = express();


// ... (Configure and define routes for the notification service)

// notification.js
const SendNotification = (parentSpan) => {
    const tracer = tracerProvider.getTracer('notification-tracer');
    const notificationSpan = tracer.startSpan('send-notification', { parent: parentSpan });

    try {
        // Your notification logic here

        // Simulate an intentional error
        throw new Error('Intentional error in SendNotification function');
    } catch (error) {
        // Log the error message
        console.error(error.message);

        // Add error information to the span
//        notificationSpan.setStatus({ code: OpenTelemetry.SpanStatusCode.ERROR, message: error.message });

        // Optionally, rethrow the error if needed
        // throw error;
    } finally {
        // End the notification span
        notificationSpan.end();
    }
};

const PORT = 4000; // Choose a different port for the notification service
app.listen(PORT, () => {
    console.log(`Notification Service is running on http://localhost:${PORT}`);
});
module.exports = { SendNotification };
