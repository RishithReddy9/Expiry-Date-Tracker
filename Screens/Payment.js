import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

const PaymentScreen = () => {
    const { confirmPayment } = useStripe();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const { paymentIntent, error } = await confirmPayment('client_secret', {
                type: 'Card',
                billingDetails: {
                    email: 'customer@example.com',
                },
            });

            if (error) {
                Alert.alert('Payment failed', error.message);
            } else {
                Alert.alert('Payment successful', `Payment ID: ${paymentIntent.id}`);
            }
        } catch (error) {
            console.log('Error processing payment:', error);
            Alert.alert('Error', 'An error occurred while processing your payment.');
        }
        setLoading(false);
    };

    return (
        <View>
            <CardField
                postalCodeEnabled={true}
                placeholder={{
                    number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',
                }}
                style={{
                    width: '100%',
                    height: 50,
                    marginVertical: 30,
                }}
            />
            <Button title="Pay" onPress={handlePayment} disabled={loading} />
        </View>
    );
};

export default PaymentScreen;
