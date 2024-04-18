import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { getItems } from '../../sanity';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function NotificationComponent() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        scheduleExpiryNotifications();

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const scheduleExpiryNotifications = async () => {
        const items = await getItems();
        if (!items) return;

        await Notifications.cancelAllScheduledNotificationsAsync();

        const currentDate = new Date();
        const expiryThreshold = new Date();
        expiryThreshold.setDate(expiryThreshold.getDate() + 7);

        // Schedule a notification for each item
        for (const item of items) {
            const expiryDate = new Date(item.date);
            const timeDifference = expiryDate.getTime() - currentDate.getTime();

            if (timeDifference <= 0) {
                Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Expiry Reminder',
                        body: `Your ${item.name} has expired. Check details!`,
                    },
                    trigger: { seconds: 7 },
                });
            }

            else if (timeDifference <= 7 * 24 * 60 * 60 * 1000) {
                Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Expiry Reminder',
                        body: `Your ${item.name} will expire soon. Check details!`,
                    },
                    trigger: { seconds: 7 },
                });
            } else {
                const reminderDate = new Date();
                reminderDate.setDate(reminderDate.getDate());

                Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Don\'t forget!',
                        body: `Hey there! Don't forget to use your ${item.name} early to enjoy its freshness!`,
                    },
                    // trigger: { date: reminderDate.getTime() }, // Schedule reminder for the specified date
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
            {/* <Text>Your expo push token: {expoPushToken}</Text> */}
            {/* Remove the button to trigger scheduling manually */}
        </View>
    );
}

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        token = (await Notifications.getExpoPushTokenAsync({ projectId: 'fde425ae-f58a-4f25-a2d4-39cd683aa584' })).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}
