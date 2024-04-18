import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import CardLayout from './CardLayout';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationComponent from '../../Components/Notifications/NotificationComponent';


const Inventory = ({ items, navigation }) => {

    return (
        <View>
            <NotificationComponent />
            <View style={styles.container}>
                {items && items.map(item => (
                    <CardLayout key={item._id} items={item} />
                ))}
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fabStyle: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default Inventory;
