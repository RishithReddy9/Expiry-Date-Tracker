import React, { useLayoutEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Home from '../../Screens/Home/Home';
import { useNavigation, useRoute } from '@react-navigation/core';
import { SafeAreaView, View } from 'react-native';
import RecipeGenerator from '../../Screens/GenerateRecipe/GenerateRecipe';
import ProfileCard from '../../Screens/Profile/Profile';
import UploadPage from '../../Screens/RecipeCommunity/UploadPage';
import DonateNow from '../../Screens/Donate/DonateNow';
import KED from '../../Retailer/Screens/KED/KED';
import KEDBarcode from '../../Retailer/Screens/KED/KEDBarcode';
import ShelfLifePredictor from '../../Screens/ShelfLifePrediction/ShelfLifePrediction';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = route.params;

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
                    name="Home"
                    component={Home}
                    initialParams={{ user }}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="home" size={24} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Recipe Suggestions"
                    component={RecipeGenerator}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="restaurant" size={24} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Donation"
                    component={DonateNow}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="attach-money" size={24} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="KED"
                    component={KEDBarcode}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="qr-code-scanner" size={24} color="black" />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileCard}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="person" size={24} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="ShelfLife Prediction"
                    component={ShelfLifePredictor}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="online-prediction" size={24} color="black" />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
};

export default BottomTabNavigator;
