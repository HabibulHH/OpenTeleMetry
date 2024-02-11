// notification-service.js

const express = require('express');
const configureOpenTelemetry = require('./opentelemetry');
const { context, trace } = require('@opentelemetry/api');

const tracerProvider = configureOpenTelemetry('payment-service');
const app = express();


// ... (Configure and define routes for the notification service)

// notification.js
const SendNotification = async (parentSpan) => {
    const tracer = tracerProvider.getTracer('notification-tracer');
    const notificationSpan = tracer.startSpan('send-notification', { parent: parentSpan });

    await new Promise(resolve => setTimeout(resolve, 1000)); // 5000 ms delay
        // End the notification span
        //span.setAttribute('user_id', '4444');
        notificationSpan.end();
    
};

const PORT = 4000; // Choose a different port for the notification service
app.listen(PORT, () => {
    console.log(`Notification Service is running on http://localhost:${PORT}`);
});
module.exports = { SendNotification };
