import React, { useLayoutEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/core';
import { SafeAreaView, View } from 'react-native';
import RetailerHome from '../../Screens/Home/Home'
import Billing from '../../Screens/Billing/Billing';
import BarcodeGeneratorApp from '../../Screens/BarcodeGeneration/BarcodeGeneration';
import GeneratorHome from '../../Screens/BarcodeGeneration/GeneratorHome';
import Analytics from '../../Screens/Analytics/Analytics';
import { Ionicons } from '@expo/vector-icons';
import ShelfLifePredictor from '../../../Screens/ShelfLifePrediction/ShelfLifePrediction';

const Tab = createBottomTabNavigator();

const TabNavRetailer = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { scanneditem } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);
    return (
        <View style={{ flex: 1, paddingTop: 0, paddingBottom: 0, height: 100 }}>
            <Tab.Navigator
                tabBarOptions={{
                    activeTintColor: 'blue',
                    inactiveTintColor: 'gray',
                }}
            >
                <Tab.Screen
                    name="Inventory"
                    component={RetailerHome}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="home" size={24} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Billing"
                    component={Billing}
                    initialParams={{ scanneditem }}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="payment" size={24} color="black" />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Generate"
                    component={GeneratorHome}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="barcode-scan" size={24} color="black" />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Analytics"
                    component={Analytics}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="analytics-sharp" size={24} color="black" />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
};

export default TabNavRetailer;
