import React from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';

const Intro = () => {
    const Navigation = useNavigation();
    const scanneditem = [];
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../Intro.jpg')}
                    style={styles.logo}
                    resizeMode="cover"
                />
            </View>
            <Text style={styles.tagline}>
                Your Key to Fresher, Smarter Inventory
            </Text>
            <Text style={{ marginBottom: -30, marginTop: 30, fontSize: 35, fontWeight: 'bold', color: 'orange' }}>Welcome!</Text>
            <View style={styles.buttonsContainer}>
                <Image source={require('../../UserLogin.jpg')} style={styles.logo1} />
                <View style={styles.loginButtonContainer}>
                    <TouchableOpacity onPress={() => Navigation.navigate('Login')} ><Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Login</Text></TouchableOpacity>
                </View>
                <View style={styles.signUpButtonContainer}>
                    <TouchableOpacity onPress={() => Navigation.navigate('Login')} /><Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Sign Up</Text><TouchableOpacity />
                </View>
            </View>
            <View style={styles.retailersContainer}>
                <TouchableOpacity onPress={() => Navigation.navigate('LoginRetailer', { scanneditem: scanneditem })} color="#FF7F50" ><Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>For Retailers</Text></TouchableOpacity>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF', // Background color of the page
        paddingHorizontal: 20,
    },
    titleContainer: {
        marginTop: -100,
        marginBottom: -50
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#000080', // Cool blue color
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: -270
        // marginBottom: 30,
    },
    logo: {
        width: 300,
        height: 250,
    },
    logo1: {
        width: 150,
        height: 150,
        marginLeft: 50
    },
    tagline: {
        textAlign: 'center',
        marginTop: -60,
        fontSize: 18,
        color: '#800080', // Text color
        fontStyle: 'italic',
        // marginBottom: 20
    },
    buttonsContainer: {
        marginBottom: 20,
        width: '100%',
        paddingHorizontal: 50,
        marginTop: 80,
        borderRadius: 8,
        borderColor: '#ddd',
        elevation: 3,
        padding: 25,
        borderWidth: 1,
    },
    signUpButtonContainer: {
        marginTop: 10,
        backgroundColor: 'green',
        padding: 10,
        textAlign: 'center'
    },
    loginButtonContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'blue',
        textAlign: 'center',
    },
    retailersContainer: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#FF7F50',
        padding: 10,
        marginBottom: 40

    }
});

export default Intro;