// notification-service.js

const express = require('express');
const configureOpenTelemetry = require('./opentelemetry');
const { context, trace } = require('@opentelemetry/api');

const tracerProvider = configureOpenTelemetry();
const app = express();


// ... (Configure and define routes for the notification service)

// notification.js

const SendNotification = (parentSpan) => {
    const tracer = tracerProvider.getTracer('notification-tracer');
    const notificationSpan = tracer.startSpan('send-notification', { parent: parentSpan });
   // notificationSpan.setAttribute('sendNotification.color', 'red');
    // Your notification logic here

    // End the notification span
    notificationSpan.end();
};

const PORT = 4000; // Choose a different port for the notification service
app.listen(PORT, () => {
    console.log(`Notification Service is running on http://localhost:${PORT}`);
});
module.exports = { SendNotification };
