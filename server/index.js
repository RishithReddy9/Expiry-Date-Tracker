import express from 'express';
import stripe from 'stripe';

const app = express();
const PORT = process.env.PORT || 3000;

const stripeSecretKey = 'sk_test_51P8RjISCk8bIERptzP15PdyPoPa85br2MIesFeHvYARO5ey9NdNkdL4ySWgBiD4argqfEPsGEHuP6uLRSGYrd1wE00UWjR3sKd';
const stripeWebhookSecret = 'whsec_V54QYp23xvOxMs5kUzSH4qlLFTEdYvjh';
const stripeInstance = stripe(stripeSecretKey);

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to create a PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency } = req.body;

        // Create a PaymentIntent
        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: amount * 100, // Amount should be in cents
            currency: currency,
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating PaymentIntent:', error);
        res.status(500).json({ error: 'Failed to create PaymentIntent' });
    }
});

// Endpoint to handle webhook events from Stripe (optional)
app.post('/webhook', async (req, res) => {
    let event;

    try {
        event = req.body;

        // Verify the event signature
        const signature = req.headers['stripe-signature'];
        event = stripeInstance.webhooks.constructEvent(req.body, signature, stripeWebhookSecret);

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                // Handle successful payment
                break;
            case 'payment_intent.payment_failed':
                const paymentFailedIntent = event.data.object;
                // Handle failed payment
                break;
            // Add more event types as needed
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook event:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
