import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/core';

const LoginRetailer = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
    const Navigation = useNavigation();
    const scanneditem = [];
    return (
        <View style={styles.container}>
            <View style={styles.authContainer}>
                <Image source={require('../../../RetailerLogin.jpg')} style={styles.logo} />
                <Text style={styles.title}>Sign In</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                />
                <View style={styles.buttonContainer}>
                    <Button title="Sign In" onPress={() => Navigation.navigate('BottomTabRetailer', { scanneditem: scanneditem })} color="#3498db" />
                </View>
            </View>
        </View>
    );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    authContainer: {
        width: width * 0.8,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 4,
    },
    buttonContainer: {
        marginBottom: 16,
        borderRadius: 4,
        overflow: 'hidden', // Ensures the button's background color doesn't leak outside its bounds
    },
    logo: {
        height: 270,
        width: 250,
        alignSelf: 'center', // Center the image within its container
        marginBottom: 16, // Add some space below the logo
    }
});

export default LoginRetailer;