import React, { useLayoutEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Home from '../../Screens/Home/Home';
import { useNavigation } from '@react-navigation/core';
import { SafeAreaView, View } from 'react-native';
import RecipeGenerator from '../../Screens/GenerateRecipe/GenerateRecipe';
import ProfileCard from '../../Screens/Profile/Profile';
import RecipeCommunity from '../../Screens/RecipeCommunity/RecipeCommunity';
import UploadPage from '../../Screens/RecipeCommunity/UploadPage';
import DonateNow from '../../Screens/Donate/DonateNow';
// import RecipeSuggestionsPage from './RecipeSuggestionsPage';
// import ProfilePage from './ProfilePage';
// import RecipeSharingCommunityPage from './RecipeSharingCommunityPage';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const navigation = useNavigation();

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
                    name="RecipeCommunity"
                    component={UploadPage}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="group" size={24} color={color} />
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
            </Tab.Navigator>
        </View>
    );
};

export default BottomTabNavigator;
