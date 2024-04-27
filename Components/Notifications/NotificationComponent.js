import { useState, useEffect, useRef } from 'react';
import { View, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { getItemsWithUID } from '../../sanity';
import * as Speech from 'expo-speech';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function NotificationComponent({ uid }) {
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        scheduleExpiryNotifications();
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log(notification);
            const { title, body } = notification.request.content; // Extract title and body from notification
            const message = `${title}. ${body}`; // Combine title and body
            speakNotification(message); // Call speakNotification function
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });



        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const speakNotification = (message) => {
        console.log('Speaking notification:', message);
        Speech.speak(message); // Speak the notification message
    };

    const scheduleExpiryNotifications = async () => {
        const items = await getItemsWithUID(uid);
        console.log(items);
        if (!items) return;

        await Notifications.cancelAllScheduledNotificationsAsync();

        const currentDate = new Date();
        const expiryThreshold = new Date();
        expiryThreshold.setDate(expiryThreshold.getDate() + 7);

        for (const item of items) {
            const expiryDate = new Date(item.date);
            const timeDifference = expiryDate.getTime() - currentDate.getTime();

            if (timeDifference <= 0) {
                // Schedule notification for expired item
                Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Expiry Reminder',
                        body: `Your ${item.name} has expired. Check details!`,
                    },
                    trigger: { seconds: 7 },
                });
            } else if (timeDifference <= 7 * 24 * 60 * 60 * 1000) {
                // Schedule notification for expiring soon
                Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Expiry Reminder',
                        body: `Your ${item.name} will expire soon. Check details!`,
                    },
                    trigger: { seconds: 7 },
                });
            } else {
                // Schedule reminder for fresh item
                Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Don\'t forget!',
                        body: `Hey there! Don't forget to use your ${item.name} early to enjoy its freshness!`,
                    },
                    trigger: { seconds: 2 },
                });
            }
        }
    };

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-around',
            }}>
        </View>
    );
}
